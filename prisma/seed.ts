import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data to avoid key duplicates
  await prisma.attendanceLog.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.loyaltyMember.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users (Admin & Customer)
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
  const productsData = [
    {
      name: "Classic Espresso",
      description: "Rich, intense, and aromatic double shot of our house espresso blend.",
      price: 129.00,
      image: "https://images.unsplash.com/photo-1510707577719-0d7fe22c7d9c?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Creamy Cappuccino",
      description: "Equal parts espresso, steamed milk, and thick foam, dusted with cocoa.",
      price: 179.00,
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Vanilla Bean Latte",
      description: "Smooth espresso combined with steamed milk and a hint of organic vanilla.",
      price: 219.00,
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Caramel Macchiato",
      description: "Freshly steamed milk with vanilla-flavored syrup, marked with espresso and caramel.",
      price: 229.00,
      image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: coffeeCat.id,
    },
    {
      name: "Matcha Latte",
      description: "Pure Japanese matcha green tea whisked with creamy steamed milk.",
      price: 249.00,
      image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600",
      rating: 4.6,
      availability: true,
      isVeg: true,
      categoryId: beverageCat.id,
    },
    {
      name: "Iced Peach Sweet Tea",
      description: "Refreshing cold brewed black tea with ripe peach syrup and fresh mint.",
      price: 149.00,
      image: "https://images.unsplash.com/photo-1499638472904-151614c82e6a?auto=format&fit=crop&q=80&w=600",
      rating: 4.5,
      availability: true,
      isVeg: true,
      categoryId: beverageCat.id,
    },
    {
      name: "Avocado Sourdough Toast",
      description: "Freshly mashed avocado on toasted sourdough, topped with cherry tomatoes, feta, and seeds.",
      price: 279.00,
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: snackCat.id,
    },
    {
      name: "Buttery Butter Croissant",
      description: "Flaky, multi-layered French pastry baked fresh daily with pure butter.",
      price: 149.00,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
      rating: 4.6,
      availability: true,
      isVeg: true,
      categoryId: snackCat.id,
    },
    {
      name: "Classic Club Sandwich",
      description: "Triple-decker sandwich with turkey breast, crispy bacon, lettuce, tomato, and mayo.",
      price: 289.00,
      image: "https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: false,
      categoryId: snackCat.id,
    },
    {
      name: "Fudge Chocolate Brownie",
      description: "Decadent, rich chocolate brownie served warm with chocolate chips inside.",
      price: 179.00,
      image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600",
      rating: 4.9,
      availability: true,
      isVeg: true,
      categoryId: dessertCat.id,
    },
    {
      name: "New York Cheesecake",
      description: "Classic smooth and creamy cheesecake with a graham cracker crust and raspberry drizzle.",
      price: 249.00,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: true,
      categoryId: dessertCat.id,
    },
    {
      name: "Blueberry Pancake Stack",
      description: "Three fluffy pancakes loaded with fresh blueberries, served with butter and maple syrup.",
      price: 269.00,
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80&w=600",
      rating: 4.7,
      availability: true,
      isVeg: true,
      categoryId: breakfastCat.id,
    },
    {
      name: "Cozy Breakfast Combo",
      description: "Two eggs your way, crispy bacon, breakfast sausage, hash browns, and sourdough toast.",
      price: 319.00,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      availability: true,
      isVeg: false,
      categoryId: breakfastCat.id,
    },
  ];

  const products: any[] = [];
  for (const item of productsData) {
    const p = await prisma.product.create({ data: item });
    products.push(p);
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

  console.log("Reviews seeded!");

  // 8. Create Loyalty Members
  const loyaltyMembers = [
    { name: "John Doe", email: "john@gmail.com", points: 120 },
    { name: "Jane Smith", email: "jane.smith@yahoo.com", points: 340 },
    { name: "Robert Johnson", email: "robert.j@outlook.com", points: 75 },
    { name: "Emily Davis", email: "emily.davis@gmail.com", points: 890 },
    { name: "Michael Wilson", email: "mwilson@gmail.com", points: 215 },
  ];

  for (const lm of loyaltyMembers) {
    await prisma.loyaltyMember.create({ data: lm });
  }
  console.log("Loyalty members seeded!");

  // 9. Create Staff members
  const staffMembers = [
    { name: "Alice Cooper", email: "alice@cozybeans.com", role: "BARISTA" },
    { name: "Bob Marley", email: "bob@cozybeans.com", role: "CHEF" },
    { name: "Charlie Chaplin", email: "charlie@cozybeans.com", role: "SERVER" },
    { name: "Diana Ross", email: "diana@cozybeans.com", role: "MANAGER" },
  ];

  const staffList: any[] = [];
  for (const sm of staffMembers) {
    const s = await prisma.staff.create({ data: sm });
    staffListList: staffList.push(s);
  }
  console.log("Staff members seeded!");

  // 10. Create Attendance Logs for the past 5 days (excluding today)
  const today = new Date();
  for (let i = 1; i <= 5; i++) {
    const logDate = new Date();
    logDate.setDate(today.getDate() - i);
    const dateStr = logDate.toISOString().split("T")[0]; // YYYY-MM-DD

    for (const staff of staffList) {
      // Different hours based on role
      let inHour = 8;
      let outHour = 16;
      if (staff.role === "BARISTA") { inHour = 7; outHour = 15; }
      else if (staff.role === "SERVER") { inHour = 10; outHour = 18; }
      else if (staff.role === "MANAGER") { inHour = 7; outHour = 17; }

      const login = new Date(logDate);
      login.setHours(inHour, Math.floor(Math.random() * 15), 0, 0);

      const logout = new Date(logDate);
      logout.setHours(outHour, Math.floor(Math.random() * 15), 0, 0);

      await prisma.attendanceLog.create({
        data: {
          staffId: staff.id,
          date: dateStr,
          loginTime: login,
          logoutTime: logout,
        },
      });
    }
  }

  // Today's active attendance logs (logged in, not logged out yet for some)
  const todayStr = today.toISOString().split("T")[0];
  for (const staff of staffList) {
    let inHour = 8;
    if (staff.role === "BARISTA") inHour = 7;
    else if (staff.role === "SERVER") inHour = 10;
    else if (staff.role === "MANAGER") inHour = 7;

    const login = new Date();
    login.setHours(inHour, Math.floor(Math.random() * 10), 0, 0);

    // BARISTA and CHEF logged out, SERVER and MANAGER still logged in
    const shouldLogout = staff.role === "BARISTA" || staff.role === "CHEF";
    let logoutTime = null;
    if (shouldLogout) {
      logoutTime = new Date();
      logoutTime.setHours(inHour + 8, Math.floor(Math.random() * 20), 0, 0);
    }

    await prisma.attendanceLog.create({
      data: {
        staffId: staff.id,
        date: todayStr,
        loginTime: login,
        logoutTime,
      },
    });
  }
  console.log("Attendance logs seeded!");

  // 11. Create Reservations (Table and Event bookings)
  const reservationsData = [
    // Table bookings
    {
      name: "Arthur Pendragon",
      email: "arthur@camelot.com",
      phone: "+1 (555) 001-1234",
      date: todayStr,
      time: "18:30",
      guests: 4,
      status: "APPROVED",
      type: "TABLE",
      note: "Window seat if possible, celebrating an anniversary.",
    },
    {
      name: "Ginevra Weasley",
      email: "ginny@hogwarts.edu",
      phone: "+1 (555) 002-5678",
      date: todayStr,
      time: "19:00",
      guests: 2,
      status: "PENDING",
      type: "TABLE",
      note: "Gluten-free menu options wanted.",
    },
    {
      name: "Tony Stark",
      email: "tony@starkindustries.com",
      phone: "+1 (555) 999-3000",
      date: todayStr,
      time: "12:00",
      guests: 6,
      status: "PENDING",
      type: "TABLE",
      note: "Need space for security detail.",
    },
    // Future bookings
    {
      name: "Bruce Banner",
      email: "hulk@avengers.org",
      phone: "+1 (555) 123-4567",
      date: new Date(today.getTime() + 86400000).toISOString().split("T")[0], // Tomorrow
      time: "17:30",
      guests: 1,
      status: "APPROVED",
      type: "TABLE",
      note: "Quiet table, low light.",
    },
    // Event bookings
    {
      name: "Peter Parker",
      email: "peter.parker@dailybugle.com",
      phone: "+1 (555) 444-5555",
      date: new Date(today.getTime() + 86400000 * 2).toISOString().split("T")[0], // In 2 days
      time: "15:00",
      guests: 15,
      status: "PENDING",
      type: "EVENT",
      note: "Birthday party celebration. Bringing a cake.",
    },
    {
      name: "Clark Kent",
      email: "clark.kent@dailyplanet.com",
      phone: "+1 (555) 777-8888",
      date: new Date(today.getTime() + 86400000 * 5).toISOString().split("T")[0], // In 5 days
      time: "10:00",
      guests: 25,
      status: "APPROVED",
      type: "EVENT",
      note: "Press team breakfast workshop.",
    },
  ];

  for (const resv of reservationsData) {
    await prisma.reservation.create({ data: resv });
  }
  console.log("Reservations (Tables/Events) seeded!");

  // 12. Create Orders for the last 7 days (to populate sales trend line chart)
  // Let's create orders with random items from our products
  const getRandItems = (count: number) => {
    const orderItems: any[] = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const prod = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      orderItems.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: qty,
        image: prod.image,
      });
      total += prod.price * qty;
    }
    return { itemsJson: JSON.stringify(orderItems), total };
  };

  // Past 7 days sales
  for (let i = 6; i >= 0; i--) {
    const orderDate = new Date();
    orderDate.setDate(today.getDate() - i);
    const dateStr = orderDate.toISOString().split("T")[0];

    // Determine number of orders for this day (Today gets more orders)
    const ordersCount = i === 0 ? 18 : Math.floor(Math.random() * 8) + 6;

    for (let j = 0; j < ordersCount; j++) {
      const source = Math.random() > 0.4 ? "WEBSITE" : "WALK_IN";
      const { itemsJson, total } = getRandItems(Math.floor(Math.random() * 3) + 1);

      // Distribute orders across the day
      const orderTime = new Date(orderDate);
      orderTime.setHours(7 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

      // Today's orders have varying statuses, older ones are DELIVERED
      let status = "DELIVERED";
      if (i === 0) {
        const roll = Math.random();
        if (roll < 0.2) status = "PENDING";
        else if (roll < 0.4) status = "PREPARING";
        else if (roll < 0.6) status = "READY";
        else if (roll < 0.95) status = "DELIVERED";
        else status = "CANCELLED";
      }

      await prisma.order.create({
        data: {
          items: itemsJson,
          total,
          discount: 0,
          paymentStatus: status === "CANCELLED" ? "FAILED" : "PAID",
          status,
          source,
          address: source === "WEBSITE" ? `${Math.floor(Math.random()*900)+100} Cozy St` : "Walk-in Customer",
          phone: source === "WEBSITE" ? `+1 (555) 019-${Math.floor(Math.random()*9000)+1000}` : "N/A",
          createdAt: orderTime,
          updatedAt: orderTime,
        },
      });
    }
  }

  console.log("Sales orders for 7-day trend seeded!");
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
