/* eslint-disable */
const jwt = require("jsonwebtoken");

async function run() {
  console.log("Measuring real API response times via vanilla Node script...");

  // 1. GET menu to get a category ID
  const getMenuRes = await fetch("http://localhost:3001/api/menu");
  const getMenuData = await getMenuRes.json();
  if (!getMenuData.categories || getMenuData.categories.length === 0) {
    console.error("No categories found in database.");
    return;
  }
  const categoryId = getMenuData.categories[0].id;
  console.log(`Using Category ID: ${categoryId}`);

  // 2. Sign a mock admin token
  const JWT_SECRET = process.env.JWT_SECRET || "cozy_beans_super_secret_fallback_key";
  const token = jwt.sign({
    id: "admin-id-123",
    email: "admin@cozybeans.com",
    role: "ADMIN",
  }, JWT_SECRET, { expiresIn: "7d" });

  const headers = {
    "Content-Type": "application/json",
    "Cookie": `token=${token}`,
  };

  // 3. Measure POST /api/menu
  const postPayload = {
    name: "Test Latency Brew",
    description: "Measuring latency...",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
    rating: 5.0,
    availability: true,
    isVeg: true,
    categoryId,
  };

  const startPost = performance.now();
  const postRes = await fetch("http://localhost:3001/api/menu", {
    method: "POST",
    headers,
    body: JSON.stringify(postPayload),
  });
  const endPost = performance.now();
  const postResult = await postRes.json();
  const postDuration = endPost - startPost;
  console.log(`POST /api/menu response status: ${postRes.status}`);
  console.log(`POST /api/menu duration: ${postDuration.toFixed(2)} ms`);

  if (!postRes.ok) {
    console.error("POST failed:", postResult);
    return;
  }

  const newProductId = postResult.product.id;

  // 4. Measure PUT /api/menu/[id]
  const putPayload = {
    name: "Test Latency Brew (Updated)",
    price: 4.49,
  };

  const startPut = performance.now();
  const putRes = await fetch(`http://localhost:3001/api/menu/${newProductId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(putPayload),
  });
  const endPut = performance.now();
  const putDuration = endPut - startPut;
  console.log(`PUT /api/menu/${newProductId} response status: ${putRes.status}`);
  console.log(`PUT /api/menu/${newProductId} duration: ${putDuration.toFixed(2)} ms`);

  // 5. Measure GET /api/menu
  const startGet = performance.now();
  const getRes = await fetch("http://localhost:3001/api/menu", {
    method: "GET",
  });
  const endGet = performance.now();
  const getDuration = endGet - startGet;
  console.log(`GET /api/menu response status: ${getRes.status}`);
  console.log(`GET /api/menu duration: ${getDuration.toFixed(2)} ms`);

  // 6. Cleanup (delete the test product)
  const deleteRes = await fetch(`http://localhost:3001/api/menu/${newProductId}`, {
    method: "DELETE",
    headers,
  });
  console.log(`DELETE /api/menu/${newProductId} response status: ${deleteRes.status}`);
}

run().catch(console.error);
