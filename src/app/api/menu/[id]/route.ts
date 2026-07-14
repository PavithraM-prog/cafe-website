import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { logger, logError } from "@/lib/logger";

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
  const { id } = await params;
  logger.info({ method: "PUT", url: `/api/menu/${id}` }, `PUT /api/menu/${id} - Request received`);
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, image, rating, availability, isVeg, categoryId } = body;

    // Verify product exists
    const existingProduct = await db.menuItem.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await db.menuItem.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        image: image !== undefined ? image : existingProduct.image,
        rating: rating !== undefined ? parseFloat(rating) : existingProduct.rating,
        availability: availability !== undefined ? availability : existingProduct.availability,
        isVeg: isVeg !== undefined ? isVeg : existingProduct.isVeg,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
      },
    });

    logger.info({ method: "PUT", url: `/api/menu/${id}` }, `PUT /api/menu/${id} - Request completed successfully`);
    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    logError(error, { method: "PUT", url: `/api/menu/${id}` });
    return NextResponse.json({ error: "Server error during product update" }, { status: 500 });
  }
}

// DELETE /api/menu/[id] - Delete a product (Admin Only)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  logger.info({ method: "DELETE", url: `/api/menu/${id}` }, `DELETE /api/menu/${id} - Request received`);
  try {
    const adminUser = await checkAdminAuth();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

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

    logger.info({ method: "DELETE", url: `/api/menu/${id}` }, `DELETE /api/menu/${id} - Request completed successfully`);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    logError(error, { method: "DELETE", url: `/api/menu/${id}` });
    return NextResponse.json({ error: "Server error during product deletion" }, { status: 500 });
  }
}
