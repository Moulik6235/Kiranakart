import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const productsToSeed = [
  // Vegetables
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: ["/images/potato_image_1.png", "/images/potato_image_2.png", "/images/potato_image_3.png", "/images/potato_image_4.png"],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["/images/tomato_image.png"],
    description: [
      "Juicy and ripe",
      "Rich in Vitamin C",
      "Perfect for salads and sauces",
      "Farm fresh quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Carrot 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["/images/carrot_image.png"],
    description: [
      "Sweet and crunchy",
      "Good for eyesight",
      "Ideal for juices and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["/images/spinach_image_1.png"],
    description: [
      "Rich in iron",
      "High in vitamins",
      "Perfect for soups and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Onion 500g",
    category: "Vegetables",
    price: 22,
    offerPrice: 19,
    image: ["/images/onion_image_1.png"],
    description: [
      "Fresh and pungent",
      "Perfect for cooking",
      "A kitchen staple",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Fruits
  {
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["/images/apple_image.png"],
    description: [
      "Crisp and juicy",
      "Rich in fiber",
      "Boosts immunity",
      "Perfect for snacking and desserts",
      "Organic and farm fresh",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["/images/orange_image.png"],
    description: [
      "Juicy and sweet",
      "Rich in Vitamin C",
      "Perfect for juices and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["/images/banana_image_1.png"],
    description: [
      "Sweet and ripe",
      "High in potassium",
      "Great for smoothies and snacking",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Mango 1 kg",
    category: "Fruits",

    price: 150,
    offerPrice: 140,
    image: ["/images/mango_image_1.png"],
    description: [
      "Sweet and flavorful",
      "Perfect for smoothies and desserts",
      "Rich in Vitamin A",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["/images/grapes_image_1.png"],
    description: [
      "Fresh and juicy",
      "Rich in antioxidants",
      "Perfect for snacking and fruit salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Dairy
  {
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["/images/amul_milk_image.png"],
    description: [
      "Pure and fresh",
      "Rich in calcium",
      "Ideal for tea, coffee, and desserts",
      "Trusted brand quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["/images/paneer_image.png"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["/images/eggs_image.png"],
    description: [
      "Farm fresh",
      "Rich in protein",
      "Ideal for breakfast and baking",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["/images/paneer_image_2.png"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    image: ["/images/cheese_image.png"],
    description: [
      "Creamy and delicious",
      "Perfect for pizzas and sandwiches",
      "Rich in calcium",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Drinks
  {
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["/images/coca_cola_image.png"],
    description: [
      "Refreshing and fizzy",
      "Perfect for parties and gatherings",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    image: ["/images/pepsi_image.png"],
    description: [
      "Chilled and refreshing",
      "Perfect for celebrations",
      "Best served cold",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    image: ["/images/sprite_image_1.png"],
    description: [
      "Refreshing citrus taste",
      "Perfect for hot days",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Fanta 1.5L",
    category: "Drinks",
    price: 77,
    offerPrice: 72,
    image: ["/images/fanta_image_1.png"],
    description: [
      "Sweet and fizzy",
      "Great for parties and gatherings",
      "Best served cold",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "7 Up 1.5L",
    category: "Drinks",
    price: 76,
    offerPrice: 71,
    image: ["/images/seven_up_image_1.png"],
    description: [
      "Refreshing lemon-lime flavor",
      "Perfect for refreshing",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Grains
  {
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["/images/basmati_rice_image.png"],
    description: [
      "Long grain and aromatic",
      "Perfect for biryani and pulao",
      "Premium quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Wheat Flour 5kg",
    category: "Grains",
    price: 250,
    offerPrice: 230,
    image: ["/images/wheat_flour_image.png"],
    description: [
      "High-quality whole wheat",
      "Soft and fluffy rotis",
      "Rich in nutrients",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Organic Quinoa 500g",
    category: "Grains",
    price: 450,
    offerPrice: 420,
    image: ["/images/quinoa_image.png"],
    description: [
      "High in protein and fiber",
      "Gluten-free",
      "Rich in vitamins and minerals",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Brown Rice 1kg",
    category: "Grains",
    price: 120,
    offerPrice: 110,
    image: ["/images/brown_rice_image.png"],
    description: [
      "Whole grain and nutritious",
      "Helps in weight management",
      "Good source of magnesium",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Barley 1kg",
    category: "Grains",
    price: 150,
    offerPrice: 140,
    image: ["/images/barley_image.png"],
    description: [
      "Rich in fiber",
      "Helps improve digestion",
      "Low in fat and cholesterol",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Bakery
  {
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["/images/brown_bread_image.png"],
    description: [
      "Soft and healthy",
      "Made from whole wheat",
      "Ideal for breakfast and sandwiches",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Butter Croissant 100g",
    category: "Bakery",
    price: 50,
    offerPrice: 45,
    image: ["/images/butter_croissant_image.png"],
    description: [
      "Flaky and buttery",
      "Freshly baked",
      "Perfect for breakfast or snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Chocolate Cake 500g",
    category: "Bakery",
    price: 350,
    offerPrice: 325,
    image: ["/images/chocolate_cake_image.png"],
    description: [
      "Rich and moist",
      "Made with premium cocoa",
      "Ideal for celebrations and parties",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Whole Bread 400g",
    category: "Bakery",
    price: 45,
    offerPrice: 40,
    image: ["/images/whole_wheat_bread_image.png"],
    description: [
      "Healthy and nutritious",
      "Made with whole wheat flour",
      "Ideal for sandwiches and toast",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Vanilla Muffins 6 pcs",
    category: "Bakery",
    price: 100,
    offerPrice: 90,
    image: ["/images/vanilla_muffins_image.png"],
    description: [
      "Soft and fluffy",
      "Perfect for a quick snack",
      "Made with real vanilla",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Instant
  {
    name: "Maggi Noodles 280g",
    category: "Instant",

    price: 55,
    offerPrice: 50,
    image: ["/images/maggi_image.png"],
    description: [
      "Instant and easy to cook",
      "Delicious taste",
      "Popular among kids and adults",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Top Ramen 270g",
    category: "Instant",
    price: 45,
    offerPrice: 40,
    image: ["/images/top_ramen_image.png"],
    description: [
      "Quick and easy to prepare",
      "Spicy and flavorful",
      "Loved by college students and families",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Knorr Cup Soup 70g",
    category: "Instant",
    price: 35,
    offerPrice: 30,
    image: ["/images/knorr_soup_image.png"],
    description: [
      "Convenient for on-the-go",
      "Healthy and nutritious",
      "Variety of flavors",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Yippee Noodles 260g",
    category: "Instant",
    price: 50,
    offerPrice: 45,
    image: ["/images/yippee_image.png"],
    description: [
      "Non-fried noodles for healthier choice",
      "Tasty and filling",
      "Convenient for busy schedules",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Oats Noodles 72g",
    category: "Instant",
    price: 40,
    offerPrice: 35,
    image: ["/images/maggi_oats_image.png"],
    description: [
      "Healthy alternative with oats",
      "Good for digestion",
      "Perfect for breakfast or snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    name: "Premium Hass Avocados",
    category: "Fruits",
    price: 300,
    offerPrice: 180,
    image: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCiQIU9D-SSdAwExHd_qdaN3gyarlRt9M1TO93T-b4LaH7U4k0_Y2SsIEa9x3gIFiRDc-FAgoqRIVvFdgHNm_LvM8vsOxDvMIMVR6nU8Vae-gh2mdBB-ZgAVBcvKWKidVJ4MSF0-KeKwzcjgVzss_CjGVIIfaAGZV_RlSbFdeCThboKUBpDg450PSZ7SB4RDNP6guwPiJqBf89aKqyr6IObwjwCfgrwwkofzS9OYpuj5jDCuL9BFDXdfl5uJQPfAP-RPovCqC6afHc"],
    description: [
      "Rich, creamy texture",
      "Loaded with healthy fats and fiber",
      "Perfect for guacamole, salads, and toast",
      "Imported premium quality"
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
    isDeal: true,
    dealBadge: "Save 40%",
    dealDescription: "2 Pieces • Imported"
  },
  {
    name: "Mixed Berry Bliss Pack",
    category: "Fruits",
    price: 498,
    offerPrice: 249,
    image: ["https://lh3.googleusercontent.com/aida-public/AB6AXuAA8l3qve8rubghdSumEEETE7EVvRcX_YlxdRMprjpzt9y7ZNGKeGrr8v9rP-OLOpoVNhlMn-ddDUY476JGfSlQf6Yn9GFeTQ5W8jg87xOfo2xciVQ9Su7WBDW3b_IbWyTaas1eh7FmOAX2-sJ25YL2_7ZSgtCiYvbLFF6g5bEaUV4yUGbDn-lthLSdQgs9JSQXBqEgGAKUjwKbsmzO-wRx4TgUdd3IvFSPzlnkcQbYsum-PwTV8zBNhg9LorMpMMMSWxYybfSDcJQ"],
    description: [
      "Handpicked fresh berries",
      "Perfect mix of sweet and tart flavors",
      "Loaded with powerful antioxidants",
      "Great for breakfast, smoothies, and snacking"
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
    isDeal: true,
    dealBadge: "Buy 1 Get 1",
    dealDescription: "250g • Farm Picked"
  },
];

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Database Connected successfully.");

        console.log("Clearing existing products...");
        await Product.deleteMany({});
        
        console.log("Seeding " + productsToSeed.length + " products from assets...");
        const seededProducts = await Product.insertMany(productsToSeed);
        console.log("Successfully seeded " + seededProducts.length + " products from assets!");
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
