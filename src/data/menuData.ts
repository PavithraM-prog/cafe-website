export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  availability: boolean;
  isVeg: boolean;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
}

export const menuCategories: MenuCategory[] = [
  { id: "cat-1", name: "Coffee", slug: "coffee" },
  { id: "cat-2", name: "Tea", slug: "tea" },
  { id: "cat-3", name: "Pizza", slug: "pizza" },
  { id: "cat-4", name: "Burger", slug: "burger" },
  { id: "cat-5", name: "Pasta", slug: "pasta" },
  { id: "cat-6", name: "Sandwiches", slug: "sandwiches" },
  { id: "cat-7", name: "Desserts", slug: "desserts" },
  { id: "cat-8", name: "Cold Drinks", slug: "cold-drinks" },
];

export const menuItems: MenuItem[] = [
  // ── Coffee ──
  {
    id: "menu-1",
    name: "Classic Espresso",
    description: "A bold and rich shot of pure espresso brewed from single-origin Arabica beans.",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    availability: true,
    isVeg: true,
    category: "coffee",
  },
  {
    id: "menu-2",
    name: "Caramel Latte",
    description: "Smooth steamed milk with espresso and sweet caramel drizzle topped with foam art.",
    price: 5.25,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    availability: true,
    isVeg: true,
    category: "coffee",
  },
  {
    id: "menu-3",
    name: "Mocha Delight",
    description: "A heavenly blend of chocolate, espresso, and steamed milk topped with whipped cream.",
    price: 5.75,
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    availability: true,
    isVeg: true,
    category: "coffee",
  },

  // ── Tea ──
  {
    id: "menu-4",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea simmered with cardamom, ginger, and cinnamon.",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    availability: true,
    isVeg: true,
    category: "tea",
  },
  {
    id: "menu-5",
    name: "Green Tea",
    description: "Refreshing organic green tea rich in antioxidants, served with a hint of lemon.",
    price: 2.75,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=600",
    rating: 4.4,
    availability: true,
    isVeg: true,
    category: "tea",
  },
  {
    id: "menu-6",
    name: "Earl Grey Classic",
    description: "Fragrant black tea with natural bergamot oil. A timeless British afternoon favourite.",
    price: 3.25,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    availability: true,
    isVeg: true,
    category: "tea",
  },

  // ── Pizza ──
  {
    id: "menu-7",
    name: "Margherita Pizza",
    description: "Classic thin-crust pizza with fresh mozzarella, tomato sauce, and basil leaves.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    availability: true,
    isVeg: true,
    category: "pizza",
  },
  {
    id: "menu-8",
    name: "Pepperoni Feast",
    description: "Loaded with generous layers of spicy pepperoni, melted cheese, and Italian herbs.",
    price: 13.50,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    availability: true,
    isVeg: false,
    category: "pizza",
  },
  {
    id: "menu-9",
    name: "BBQ Chicken Pizza",
    description: "Smoky barbecue sauce, grilled chicken, red onions, and cilantro on a crispy crust.",
    price: 14.25,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    availability: true,
    isVeg: false,
    category: "pizza",
  },

  // ── Burger ──
  {
    id: "menu-10",
    name: "Classic Beef Burger",
    description: "Juicy grilled beef patty with lettuce, tomato, pickles, and our signature sauce.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    availability: true,
    isVeg: false,
    category: "burger",
  },
  {
    id: "menu-11",
    name: "Veggie Burger",
    description: "Crispy plant-based patty with avocado, fresh veggies, and tangy chipotle mayo.",
    price: 8.75,
    image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc07a?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    availability: true,
    isVeg: true,
    category: "burger",
  },
  {
    id: "menu-12",
    name: "Spicy Chicken Burger",
    description: "Crispy fried chicken breast with jalapeños, coleslaw, and spicy buffalo sauce.",
    price: 10.50,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    availability: true,
    isVeg: false,
    category: "burger",
  },

  // ── Pasta ──
  {
    id: "menu-13",
    name: "Spaghetti Bolognese",
    description: "Al dente spaghetti with slow-cooked beef ragù, parmesan shavings, and fresh basil.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    availability: true,
    isVeg: false,
    category: "pasta",
  },
  {
    id: "menu-14",
    name: "Penne Alfredo",
    description: "Creamy garlic alfredo sauce tossed with penne and freshly cracked black pepper.",
    price: 11.50,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    availability: true,
    isVeg: true,
    category: "pasta",
  },
  {
    id: "menu-15",
    name: "Pesto Fusilli",
    description: "Fresh basil pesto with sun-dried tomatoes, pine nuts, and parmesan over fusilli.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    availability: true,
    isVeg: true,
    category: "pasta",
  },

  // ── Sandwiches ──
  {
    id: "menu-16",
    name: "Club Sandwich",
    description: "Triple-decker with grilled chicken, bacon, egg, lettuce, tomato, and mayo.",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    availability: true,
    isVeg: false,
    category: "sandwiches",
  },
  {
    id: "menu-17",
    name: "Grilled Veggie Panini",
    description: "Roasted peppers, zucchini, mozzarella, and pesto pressed in artisan ciabatta.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=600",
    rating: 4.4,
    availability: true,
    isVeg: true,
    category: "sandwiches",
  },
  {
    id: "menu-18",
    name: "Smoked Salmon Bagel",
    description: "Toasted bagel with smoked salmon, cream cheese, capers, and red onion rings.",
    price: 9.25,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    availability: false,
    isVeg: false,
    category: "sandwiches",
  },

  // ── Desserts ──
  {
    id: "menu-19",
    name: "Tiramisu",
    description: "Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.",
    price: 7.50,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=600",
    rating: 4.9,
    availability: true,
    isVeg: true,
    category: "desserts",
  },
  {
    id: "menu-20",
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake with a gooey centre, served with vanilla ice cream.",
    price: 8.25,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    availability: true,
    isVeg: true,
    category: "desserts",
  },
  {
    id: "menu-21",
    name: "New York Cheesecake",
    description: "Rich and creamy baked cheesecake with a buttery graham cracker crust and berry compote.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
    rating: 4.7,
    availability: true,
    isVeg: true,
    category: "desserts",
  },

  // ── Cold Drinks ──
  {
    id: "menu-22",
    name: "Iced Americano",
    description: "Double shot espresso over ice with chilled water. Clean, bold, and refreshing.",
    price: 4.25,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&q=80&w=600",
    rating: 4.6,
    availability: true,
    isVeg: true,
    category: "cold-drinks",
  },
  {
    id: "menu-23",
    name: "Mango Smoothie",
    description: "Tropical fresh mango blended with yogurt, honey, and a splash of orange juice.",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=600",
    rating: 4.8,
    availability: true,
    isVeg: true,
    category: "cold-drinks",
  },
  {
    id: "menu-24",
    name: "Fresh Lemonade",
    description: "Hand-squeezed lemon juice with mint, a touch of honey, and sparkling water.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&q=80&w=600",
    rating: 4.5,
    availability: true,
    isVeg: true,
    category: "cold-drinks",
  },
];
