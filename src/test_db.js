/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function run() {
  console.log("Checking categories and items in DB...");
  try {
    const categories = await db.menuCategory.findMany();
    console.log("Categories in DB:", categories);
    const items = await db.menuItem.findMany();
    console.log("Items in DB count:", items.length);
  } catch (err) {
    console.error("DB query failed:", err);
  } finally {
    await db.$disconnect();
  }
}

run();
