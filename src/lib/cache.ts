import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getCachedSettings = unstable_cache(
  async () => {
    const settingsList = await db.setting.findMany({
      select: {
        id: true,
        value: true,
      },
    });
    return settingsList.reduce((acc: Record<string, string>, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {});
  },
  ["settings_list"],
  { tags: ["settings"] }
);

export const getCachedMenu = unstable_cache(
  async () => {
    const categories = await db.menuCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });

    const products = await db.menuItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        rating: true,
        availability: true,
        isVeg: true,
        categoryId: true,
        availablePieces: true,
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return { categories, products };
  },
  ["menu_catalog"],
  { tags: ["menu"] }
);

export const getCachedApprovedReviews = unstable_cache(
  async () => {
    return db.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });
  },
  ["approved_reviews_list"],
  { tags: ["reviews"] }
);
