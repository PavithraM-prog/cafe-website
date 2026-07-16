import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "STAFF")) return null;
  return decoded;
}

// PUT /api/menu/[id] - Update a product (Admin Only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, image, rating, availability, isVeg, categoryId, availablePieces } = body;

    // Verify product exists
    const existingProduct = await db.menuItem.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const pieces = availablePieces !== undefined ? parseInt(availablePieces) : undefined;
    let finalAvailability = availability;
    let finalPieces = pieces;

    // Sync stock and availability
    if (pieces !== undefined) {
      if (pieces <= 0) {
        finalAvailability = false;
        finalPieces = 0;
      } else if (availability === undefined && !existingProduct.availability) {
        finalAvailability = true;
      }
    }

    if (availability !== undefined) {
      if (!availability) {
        finalPieces = 0;
      } else if (availability && (pieces !== undefined ? pieces <= 0 : existingProduct.availablePieces <= 0)) {
        finalPieces = 10;
      }
    }

    const updatedProduct = await db.menuItem.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        image: image !== undefined ? image : existingProduct.image,
        rating: rating !== undefined ? parseFloat(rating) : existingProduct.rating,
        availability: finalAvailability !== undefined ? finalAvailability : existingProduct.availability,
        isVeg: isVeg !== undefined ? isVeg : existingProduct.isVeg,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
        availablePieces: finalPieces !== undefined ? finalPieces : existingProduct.availablePieces,
      },
    });

    revalidateTag("menu");

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Server error during product update" }, { status: 500 });
  }
}

// DELETE /api/menu/[id] - Delete a product (Admin Only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { id } = await params;

    // Verify product exists
    const existingProduct = await db.menuItem.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.menuItem.delete({
      where: { id },
    });

    revalidateTag("menu");

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Server error during product deletion" }, { status: 500 });
  }
}
