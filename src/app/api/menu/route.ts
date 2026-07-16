import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { getCachedMenu } from "@/lib/cache";
import { revalidateTag } from "next/cache";

// Helper to verify if requester is ADMIN or STAFF
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "STAFF")) return null;
  return decoded;
}

// GET /api/menu - Get all products and categories, optionally filtered
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");

    // Fetch from cache
    const { categories, products: allProducts } = await getCachedMenu();

    let products = allProducts;

    // Filter by category slug
    if (categorySlug && categorySlug !== "all") {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (cat) {
        products = products.filter((p) => p.categoryId === cat.id);
      } else {
        products = [];
      }
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ categories, products });
  } catch (error) {
    logger.error("Error fetching menu", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

// POST /api/menu - Create a new product (Admin Only)
export async function POST(request: Request) {
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { name, description, price, image, rating, availability, isVeg, categoryId, availablePieces } =
      await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const pieces = availablePieces !== undefined ? parseInt(availablePieces) : 10;
    const isAvailable = availability !== undefined ? availability : (pieces > 0);

    const newProduct = await db.menuItem.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        image: image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
        rating: rating ? parseFloat(rating) : 5.0,
        availability: isAvailable,
        isVeg: isVeg !== undefined ? isVeg : true,
        categoryId,
        availablePieces: pieces,
      },
      include: {
        category: true,
      },
    });

    revalidateTag("menu");

    return NextResponse.json({ message: "Product created successfully", product: newProduct }, { status: 201 });
  } catch (error) {
    logger.error("Error creating product", error);
    return NextResponse.json({ error: "Server error during product creation" }, { status: 500 });
  }
}
