import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data to avoid key duplicates
  await prisma.setting.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const adminPasswordHash = bcrypt.hashSync("adminpassword", 10);
  const customerPasswordHash = bcrypt.hashSync("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@cozybeans.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@gmail.com",
      password: customerPasswordHash,
      role: "CUSTOMER",
      loyaltyPoints: 120,
    },
  });

  console.log(`Users created: ${admin.email} (Admin), ${customer.email} (Customer)`);

  // 3. Create Categories
  const coffeeCat = await prisma.category.create({
    data: { name: "Coffee", slug: "coffee" },
  });
  const beverageCat = await prisma.category.create({
    data: { name: "Beverages", slug: "beverages" },
  });
  const snackCat = await prisma.category.create({
    data: { name: "Snacks", slug: "snacks" },
  });
  const dessertCat = await prisma.category.create({
    data: { name: "Desserts", slug: "desserts" },
  });
  const breakfastCat = await prisma.category.create({
    data: { name: "Breakfast", slug: "breakfast" },
  });

  console.log("Categories created successfully!");

  // 4. Create Products
  const products = [
    // Coffee
    {
      name: "Classic Espresso",
      description: "Rich, intense, and aromatic double shot of our house espresso blend.",
      price: 3.50,
      image: "https://images.unsplash.com/photo-1510707577719-0d7fe22c7d9c?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Creamy Cappuccino",
      description: "Equal parts espresso, steamed milk, and thick foam, dusted with cocoa.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Vanilla Bean Latte",
      description: "Smooth espresso combined with steamed milk and a hint of organic vanilla.",
      price: 4.95,
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Caramel Macchiato",
      description: "Freshly steamed milk with vanilla-flavored syrup, marked with espresso and caramel.",
      price: 5.25,
      image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    // Beverages
    {
      name: "Matcha Latte",
      description: "Pure Japanese matcha green tea whisked with creamy steamed milk.",
      price: 5.50,
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600",
      rating: 4.6,
      availability: true,
      isVeg: true,
      categoryId: beverageCat.id,
    },
    {
      name: "Iced Peach Sweet Tea",
      description: "Refreshing cold brewed black tea with ripe peach syrup and fresh mint.",
      price: 4.25,
      image: "https://images.unsplash.com/photo-1499638472904-151614c82e6a?auto=format&fit=crop&q=80&w=600",
      rating: 4.5,
      availability: true,
      isVeg: true,
      categoryId: beverageCat.id,
    },
    // Snacks
    {
      name: "Avocado Sourdough Toast",
      description: "Freshly mashed avocado on toasted sourdough, topped with cherry tomatoes, feta, and seeds.",
      price: 8.50,
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: snackCat.id,
    },
    {
      name: "Buttery Butter Croissant",
      description: "Flaky, multi-layered French pastry baked fresh daily with pure butter.",
      price: 3.75,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
      rating: 4.6,
      availability: true,
      isVeg: true,
      categoryId: snackCat.id,
    },
    {
      name: "Classic Club Sandwich",
      description: "Triple-decker sandwich with turkey breast, crispy bacon, lettuce, tomato, and mayo.",
      price: 9.95,
      image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: false,
      categoryId: snackCat.id,
    },
    // Desserts
    {
      name: "Fudge Chocolate Brownie",
      description: "Decadent, rich chocolate brownie served warm with chocolate chips inside.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: dessertCat.id,
    },
    {
      name: "New York Cheesecake",
      description: "Classic smooth and creamy cheesecake with a graham cracker crust and raspberry drizzle.",
      price: 6.50,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: dessertCat.id,
    },
    // Breakfast
    {
      name: "Blueberry Pancake Stack",
      description: "Three fluffy pancakes loaded with fresh blueberries, served with butter and maple syrup.",
      price: 8.90,
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: true,
      categoryId: breakfastCat.id,
    },
    {
      name: "Cozy Breakfast Combo",
      description: "Two eggs your way, crispy bacon, breakfast sausage, hash browns, and sourdough toast.",
      price: 11.95,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: false,
      categoryId: breakfastCat.id,
    },
  ];

  for (const item of products) {
    await prisma.product.create({ data: item });
  }
  console.log("Menu items seeded successfully!");

  // 5. Create Coupons
  await prisma.coupon.create({
    data: { code: "COZY10", discountType: "PERCENTAGE", discountValue: 10, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "WELCOME20", discountType: "PERCENTAGE", discountValue: 20, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "COFFEEFREE", discountType: "FIXED", discountValue: 5.0, isActive: true },
  });
  console.log("Coupons created successfully!");

  // 6. Create Default Settings
  const defaultSettings = [
    { id: "hero_title", value: "Escape into a Cozy Corner of Coffee & Comfort" },
    { id: "hero_tagline", value: "Where every cup tells a story, and every moment feels like home." },
    { id: "opening_hours", value: "Mon - Fri: 7:00 AM - 8:00 PM | Sat - Sun: 8:00 AM - 9:00 PM" },
    { id: "cafe_address", value: "123 Aroma Lane, Coffee District, CA 90210" },
    { id: "cafe_phone", value: "+1 (555) 789-COZY" },
    { id: "cafe_email", value: "hello@cozybeans.com" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.create({ data: setting });
  }
  console.log("Landing page configurations seeded successfully!");

  // 7. Seed sample Reviews
  await prisma.review.create({
    data: {
      name: "Sarah Miller",
      rating: 5,
      comment: "The Vanilla Bean Latte here is out of this world! Cozy Beans has become my daily study spot.",
      status: "APPROVED",
    },
  });
  await prisma.review.create({
    data: {
      name: "David Chen",
      rating: 5,
      comment: "Avocado toast was incredibly fresh. The staff is warm and the ambient music makes it very cozy.",
      status: "APPROVED",
    },
  });
  await prisma.review.create({
    data: {
      name: "Emma Watson",
      rating: 4,
      comment: "Great spot for breakfast. Very family friendly, though it gets quite busy on Saturday mornings!",
      status: "APPROVED",
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
