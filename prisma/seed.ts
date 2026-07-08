import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data to avoid duplicates in order of dependency
  await prisma.setting.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.kitchenOrder.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.loyaltyPoint.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 2. Seed Roles
  const adminRole = await prisma.role.create({ data: { name: "ADMIN" } });
  const staffRole = await prisma.role.create({ data: { name: "STAFF" } });
  const customerRole = await prisma.role.create({ data: { name: "CUSTOMER" } });

  console.log("Roles seeded.");

  // 3. Seed Users
  const adminPasswordHash = bcrypt.hashSync("adminpassword", 10);
  const staffPasswordHash = bcrypt.hashSync("staffpassword", 10);
  const customerPasswordHash = bcrypt.hashSync("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@cozybeans.com",
      password: adminPasswordHash,
      roleId: adminRole.id,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: "Jane Staff",
      email: "staff@cozybeans.com",
      password: staffPasswordHash,
      roleId: staffRole.id,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@gmail.com",
      password: customerPasswordHash,
      roleId: customerRole.id,
      loyaltyPoints: 120,
    },
  });

  console.log(`Users seeded: ${adminUser.email}, ${staffUser.email}, ${customerUser.email}`);

  // 4. Seed Employees
  const employee = await prisma.employee.create({
    data: {
      userId: staffUser.id,
      position: "Senior Barista",
      salary: 3200.00,
      hireDate: new Date("2025-01-15T09:00:00Z"),
    },
  });

  console.log("Employees seeded.");

  // 5. Seed Attendance
  await prisma.attendance.create({
    data: {
      employeeId: employee.id,
      date: "2026-07-08",
      checkIn: new Date("2026-07-08T08:00:00Z"),
      checkOut: new Date("2026-07-08T16:00:00Z"),
      status: "PRESENT",
    },
  });

  console.log("Attendance seeded.");

  // 6. Seed Branches
  await prisma.branch.create({
    data: {
      name: "Downtown Cafe",
      address: "123 Aroma Lane, Coffee District, CA 90210",
      phone: "+1 (555) 789-COZY",
    },
  });

  await prisma.branch.create({
    data: {
      name: "Westside Bistro",
      address: "456 Crema Blvd, Bean City, CA 90025",
      phone: "+1 (555) 123-BEAN",
    },
  });

  console.log("Branches seeded.");

  // 7. Seed Tables
  const table1 = await prisma.table.create({ data: { number: "T1", capacity: 2, status: "AVAILABLE" } });
  await prisma.table.create({ data: { number: "T2", capacity: 4, status: "AVAILABLE" } });
  await prisma.table.create({ data: { number: "T3", capacity: 4, status: "AVAILABLE" } });
  await prisma.table.create({ data: { number: "T4", capacity: 6, status: "AVAILABLE" } });

  console.log("Tables seeded.");

  // 8. Seed Menu Categories
  const coffeeCat = await prisma.menuCategory.create({ data: { name: "Coffee", slug: "coffee" } });
  const beverageCat = await prisma.menuCategory.create({ data: { name: "Beverages", slug: "beverages" } });
  const snackCat = await prisma.menuCategory.create({ data: { name: "Snacks", slug: "snacks" } });
  const dessertCat = await prisma.menuCategory.create({ data: { name: "Desserts", slug: "desserts" } });
  const breakfastCat = await prisma.menuCategory.create({ data: { name: "Breakfast", slug: "breakfast" } });

  console.log("Menu Categories seeded.");

  // 9. Seed Menu Items
  const item1 = await prisma.menuItem.create({
    data: {
      name: "Classic Espresso",
      description: "Rich, intense, and aromatic double shot of our house espresso blend.",
      price: 3.50,
      image: "https://images.unsplash.com/photo-1510707577719-0d7fe22c7d9c?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
  });

  const item2 = await prisma.menuItem.create({
    data: {
      name: "Creamy Cappuccino",
      description: "Equal parts espresso, steamed milk, and thick foam, dusted with cocoa.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
  });

  const item3 = await prisma.menuItem.create({
    data: {
      name: "Avocado Sourdough Toast",
      description: "Freshly mashed avocado on toasted sourdough, topped with cherry tomatoes, feta, and seeds.",
      price: 8.50,
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: snackCat.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Fudge Chocolate Brownie",
      description: "Decadent, rich chocolate brownie served warm with chocolate chips inside.",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: dessertCat.id,
    },
  });

  console.log("Menu Items seeded.");

  // 10. Seed Coupons
  await prisma.coupon.create({
    data: { code: "COZY10", discountType: "PERCENTAGE", discountValue: 10, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "WELCOME20", discountType: "PERCENTAGE", discountValue: 20, isActive: true },
  });
  await prisma.coupon.create({
    data: { code: "COFFEEFREE", discountType: "FIXED", discountValue: 5.0, isActive: true },
  });

  console.log("Coupons seeded.");

  // 11. Seed Settings
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

  console.log("Settings seeded.");

  // 12. Seed Reviews
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      name: "John Doe",
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

  console.log("Reviews seeded.");

  // 13. Seed Reservations
  await prisma.reservation.create({
    data: {
      userId: customerUser.id,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+1 (555) 555-5555",
      date: "2026-07-10",
      time: "18:00",
      guests: 2,
      status: "APPROVED",
      tableId: table1.id,
    },
  });

  console.log("Reservations seeded.");

  // 14. Seed Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "Aroma Distributor",
      contactName: "Marc Green",
      email: "marc@aroma.com",
      phone: "+1 (555) 444-3322",
      address: "88 Bean Warehouse, Seattle, WA 98101",
    },
  });

  console.log("Suppliers seeded.");

  // 15. Seed Inventory
  const inventory1 = await prisma.inventory.create({
    data: {
      itemName: "Espresso Blend Beans",
      quantity: 50.0,
      unit: "kg",
      reorderLevel: 10.0,
      supplierId: supplier1.id,
    },
  });

  const inventory2 = await prisma.inventory.create({
    data: {
      itemName: "Whole Milk",
      quantity: 120.0,
      unit: "liters",
      reorderLevel: 20.0,
      supplierId: supplier1.id,
    },
  });

  console.log("Inventory seeded.");

  // 16. Seed Inventory Transactions
  await prisma.inventoryTransaction.create({
    data: {
      inventoryId: inventory1.id,
      type: "STOCK_IN",
      quantity: 50.0,
      reason: "Initial warehouse load",
      userId: adminUser.id,
    },
  });

  await prisma.inventoryTransaction.create({
    data: {
      inventoryId: inventory2.id,
      type: "STOCK_IN",
      quantity: 120.0,
      reason: "Initial dairy delivery",
      userId: adminUser.id,
    },
  });

  console.log("Inventory Transactions seeded.");

  // 17. Seed Offers
  await prisma.offer.create({
    data: {
      title: "Summer Coffee Splash",
      description: "Get 20% off on all cold beverages this weekend!",
      discountValue: 20.0,
      startDate: new Date("2026-07-01T00:00:00Z"),
      endDate: new Date("2026-07-31T23:59:59Z"),
      isActive: true,
    },
  });

  console.log("Offers seeded.");

  // 18. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: customerUser.id,
      title: "Welcome to Cozy Beans!",
      message: "Thanks for registering. Explore our menu and earn loyalty points on every purchase!",
      isRead: false,
    },
  });

  console.log("Notifications seeded.");

  // 19. Seed Orders, Order Items, Payments, Kitchen Orders, and Loyalty Point Transactions (Normalized!)
  const sampleItems = [
    { productId: item2.id, name: item2.name, price: item2.price, quantity: 2, image: item2.image },
    { productId: item3.id, name: item3.name, price: item3.price, quantity: 1, image: item3.image },
  ];

  const orderTotal = (item2.price * 2) + item3.price; // 4.5 * 2 + 8.5 = 17.5

  const order = await prisma.order.create({
    data: {
      userId: customerUser.id,
      items: JSON.stringify(sampleItems),
      total: orderTotal,
      discount: 0,
      paymentStatus: "PAID",
      status: "PREPARING",
      address: "123 Main St, Apt 4B, San Francisco, CA 94103",
      phone: "+1 (555) 555-5555",
    },
  });

  // Seed Order Items
  for (const item of sampleItems) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      },
    });
  }

  // Seed Payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: orderTotal,
      method: "CARD",
      status: "COMPLETED",
      transactionId: "TXN-SEED-001",
    },
  });

  // Seed Kitchen Order
  await prisma.kitchenOrder.create({
    data: {
      orderId: order.id,
      status: "PREPARING",
    },
  });

  // Seed Loyalty Point transaction log
  const points = Math.floor(orderTotal);
  await prisma.loyaltyPoint.create({
    data: {
      userId: customerUser.id,
      points,
      type: "EARNED",
      reason: `Earned from Order #${order.id.slice(0, 8)}`,
    },
  });

  console.log("Normalized Orders and supporting records seeded.");

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
