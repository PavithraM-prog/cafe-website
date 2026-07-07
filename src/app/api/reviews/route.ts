import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/reviews - Get reviews (Approved only for customer/public, or all for admin)
export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    
    // Admin/Staff sees all reviews for moderation
    if (user && (user.role === "ADMIN" || user.role === "STAFF")) {
      const reviews = await db.review.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ reviews });
    }

    // Public/Customer sees approved reviews
    const reviews = await db.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 6, // Show top 6 reviews
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST /api/reviews - Submit a review (Pending admin moderation)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const { name, rating, comment } = await request.json();

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const newReview = await db.review.create({
      data: {
        userId: user.id,
        name,
        rating: parseInt(rating),
        comment,
        status: "PENDING", // Moderation required
      },
    });

    return NextResponse.json({
      message: "Review submitted! It will appear after admin approval.",
      review: newReview,
    }, { status: 201 });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json({ error: "Server error during review submission" }, { status: 500 });
  }
}

// PUT /api/reviews - Moderate review status (Admin only)
export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id, status } = await request.json(); // status: APPROVED, HIDDEN, PENDING

    if (!id || !status) {
      return NextResponse.json({ error: "Missing review ID or status" }, { status: 400 });
    }

    const updatedReview = await db.review.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: `Review is now ${status}`, review: updatedReview });
  } catch (error) {
    console.error("Error moderating review:", error);
    return NextResponse.json({ error: "Server error during moderation" }, { status: 500 });
  }
}
