import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI not found in environment variables.");
    process.exit(1);
}

const productsToSeed = [
    // === Vegetables ===
    {
        name: "Fresh Vine Tomatoes 500g",
        description: [
            "Sweet, juicy, and vine-ripened",
            "Handpicked daily from organic local farms",
            "Rich in Lycopene, Vitamin C, and antioxidants",
            "Perfect for salads, sauces, and gourmet cooking"
        ],
        price: 49,
        offerPrice: 39,
        image: ["https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Organic Orange Carrots 500g",
        description: [
            "Crisp, sweet, and locally harvested",
            "Grown without artificial fertilizers or pesticides",
            "Exceptional source of Beta-carotene and fiber",
            "Great for snacking, juicing, or healthy soups"
        ],
        price: 35,
        offerPrice: 29,
        image: ["https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Fresh Organic Baby Spinach 250g",
        description: [
            "Pre-washed, tender baby spinach leaves",
            "Loaded with iron, folate, and essential vitamins",
            "Grown sustainably on hydro-farms",
            "Ideal for green smoothies, healthy stir-fry, or fresh salads"
        ],
        price: 45,
        offerPrice: 35,
        image: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Fresh Green Broccoli 1pc",
        description: [
            "Firm, vibrant green heads of premium broccoli",
            "Rich in dietary fiber and essential plant nutrients",
            "Excellent source of Vitamin K and Vitamin C",
            "Perfect for steaming, roasting, or healthy stir-fries"
        ],
        price: 80,
        offerPrice: 65,
        image: ["https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },

    // === Fruits ===
    {
        name: "Royal Gala Apples 1kg",
        description: [
            "Crisp, sweet, and incredibly refreshing",
            "Premium grade imported apples",
            "High in dietary fiber and natural energy boosts",
            "Perfect addition to lunchboxes or afternoon snacks"
        ],
        price: 180,
        offerPrice: 159,
        image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Premium Ripe Bananas 1kg",
        description: [
            "Naturally sweet and perfectly ripened yellow bananas",
            "Excellent quick source of potassium and vitamin B6",
            "Provides instant healthy sustained energy",
            "Perfect for smoothies, cereal toppings, or quick snacks"
        ],
        price: 70,
        offerPrice: 59,
        image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Sweet Farm Strawberries 250g",
        description: [
            "Fresh, bright red, and intensely sweet strawberries",
            "Handpicked at optimal ripeness for unmatched flavor",
            "Packed with high levels of Vitamin C and minerals",
            "Stunning for desserts, fruit bowls, or dipping in chocolate"
        ],
        price: 150,
        offerPrice: 129,
        image: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },
    {
        name: "Fresh Organic Blueberries 125g",
        description: [
            "Plump, sweet, and bursting with fresh juice",
            "Rich in powerful antioxidants and cognitive support benefits",
            "100% pesticide-free organic farming practices",
            "Delicious in oats, pancakes, yogurt, or eaten fresh"
        ],
        price: 220,
        offerPrice: 189,
        image: ["https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true
    },

    // === Drinks ===
    {
        name: "Pure Premium Orange Juice 1L",
        description: [
            "100% natural, freshly squeezed orange juice",
            "No added sugar, colors, or preservatives",
            "Bursting with daily recommended dose of Vitamin C",
            "Tastes best chilled for a refreshing breakfast companion"
        ],
        price: 120,
        offerPrice: 99,
        image: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80"],
        category: "Cold Drinks & Juices",
        inStock: true
    },
    {
        name: "Coca-Cola Original Taste 1.5L",
        description: [
            "The classic, refreshing, and crisp fizzy soda drink",
            "Perfect companion for food, parties, and family dinners",
            "Best experienced ice-cold for ultimate carbonation refreshment",
            "Familiar taste loved all over the world"
        ],
        price: 90,
        offerPrice: 75,
        image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80"],
        category: "Cold Drinks & Juices",
        inStock: true
    },
    {
        name: "Organic Green Iced Tea 500ml",
        description: [
            "Brewed from premium organic green tea leaves",
            "Lightly sweetened with natural honey and real lemon juice",
            "Rich in active antioxidants and health benefits",
            "Low-calorie alternative to standard sugary sodas"
        ],
        price: 75,
        offerPrice: 65,
        image: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80"],
        category: "Cold Drinks & Juices",
        inStock: true
    },
    {
        name: "Lime Infused Sparkling Water 500ml",
        description: [
            "Crisp carbonated water with a subtle hint of real key lime",
            "Zero calories, zero sugars, and zero sweeteners",
            "Clean and fizzy taste that keeps you refreshed all day",
            "Sourced from deep natural pristine springs"
        ],
        price: 50,
        offerPrice: 42,
        image: ["https://images.unsplash.com/photo-1626263597114-11883b27670a?w=600&auto=format&fit=crop&q=80"],
        category: "Cold Drinks & Juices",
        inStock: true
    },

    // === Instant ===
    {
        name: "Premium Instant Shin Cup Ramen 120g",
        description: [
            "Hot, spicy, and deeply savory instant cup noodles",
            "Comes with gourmet broth seasoning and real vegetable flakes",
            "Convenient quick lunch or late-night study snack",
            "Ready to eat in exactly 3 minutes with hot water"
        ],
        price: 110,
        offerPrice: 95,
        image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80"],
        category: "Breakfast & Instant Food",
        inStock: true
    },
    {
        name: "Gourmet Creamy Tomato Soup 400g",
        description: [
            "Warm, thick, and satisfying tomato soup",
            "Crafted with organic tomatoes and a dash of sweet cream",
            "No artificial colors, flavorings, or chemical thickeners",
            "Serve hot with garlic croutons or grilled cheese sandwiches"
        ],
        price: 90,
        offerPrice: 75,
        image: ["https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=600&auto=format&fit=crop&q=80"],
        category: "Breakfast & Instant Food",
        inStock: true
    },
    {
        name: "Instant Three-Cheese Pasta Meal 150g",
        description: [
            "Gourmet pasta elbows coated in rich cheddar, parmesan & blue cheese",
            "Instant preparation - just add hot water and stir",
            "Creamy, warm, and highly comforting comfort food",
            "Loved by children and busy students alike"
        ],
        price: 85,
        offerPrice: 69,
        image: ["https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&auto=format&fit=crop&q=80"],
        category: "Breakfast & Instant Food",
        inStock: true
    },
    {
        name: "Instant Maple Organic Oats Cup 75g",
        description: [
            "Whole grain rolled oats infused with natural rich maple syrup",
            "Good source of dietary fiber, protein, and heart health beta-glucan",
            "Just pour hot water, cover for 2 minutes, and enjoy breakfast",
            "Comes in an eco-friendly recyclable paper cup"
        ],
        price: 60,
        offerPrice: 49,
        image: ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80"],
        category: "Breakfast & Instant Food",
        inStock: true
    },

    // === Dairy ===
    {
        name: "Whole Grass-Fed Organic Milk 1L",
        description: [
            "Pure, pasteurized whole milk from grass-fed dairy herds",
            "Rich in dietary calcium, Vitamin D, and active proteins",
            "Super creamy texture with an authentic farm fresh taste",
            "Perfect for drinking, baking, or cereal toppings"
        ],
        price: 75,
        offerPrice: 65,
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"],
        category: "Dairy, Bread & Eggs",
        inStock: true
    },
    {
        name: "Pure Salted Creamery Butter 250g",
        description: [
            "Rich, golden butter churned from premium farm fresh cream",
            "Perfect touch of saltiness for toasts and baking spreads",
            "Enhances the taste of any recipe, sauce, or sauteed dish",
            "Comes in a high-grade foil wrapper to preserve freshness"
        ],
        price: 110,
        offerPrice: 95,
        image: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80"],
        category: "Dairy, Bread & Eggs",
        inStock: true
    },
    {
        name: "Creamy Greek Yogurt Plain 500g",
        description: [
            "Thick, velvety, and strained authentic Greek yogurt",
            "Packed with gut-healthy live probiotics and double the protein",
            "No added sugar, gelatin, or chemical preservatives",
            "Stunning with mixed honey, fresh berries, or granola"
        ],
        price: 140,
        offerPrice: 119,
        image: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80"],
        category: "Dairy, Bread & Eggs",
        inStock: true
    },
    {
        name: "Gourmet Sharp Cheddar Cheese 200g",
        description: [
            "Aged cheddar with a rich, bold, and slightly sharp flavor profile",
            "Perfect for slicing, cheese boards, or melting in pasta dishes",
            "100% natural milk ingredients with zero artificial fillers",
            "Vacuum packed to lock in authentic gourmet mature flavor"
        ],
        price: 199,
        offerPrice: 175,
        image: ["https://images.unsplash.com/photo-1618067330799-a472c73f7171?w=600&auto=format&fit=crop&q=80"],
        category: "Dairy, Bread & Eggs",
        inStock: true
    },
    {
        name: "Organic Farm Eggs 12-Pack",
        description: [
            "Free-range, organic brown eggs sourced from local cooperative farms",
            "Thick shells and beautiful bright golden yolks",
            "Packed with high-quality protein, choline, and vitamins",
            "Essential ingredient for baking, scrambles, and breakfast meals"
        ],
        price: 120,
        offerPrice: 99,
        image: ["https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80"],
        category: "Dairy, Bread & Eggs",
        inStock: true
    },

    // === Bakery ===
    {
        name: "Fresh Baked Sourdough Bread 500g",
        description: [
            "Classic artisanal sourdough with a signature bubbly interior",
            "Perfectly crisp golden crust with a subtle signature tang",
            "Baked fresh daily using a slow-fermented wild starter culture",
            "Magnificent for gourmet toasts, sandwiches, and soup dipping"
        ],
        price: 90,
        offerPrice: 75,
        image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"],
        category: "Bakery & Biscuits",
        inStock: true
    },
    {
        name: "Golden Butter Croissants 4-Pack",
        description: [
            "Authentic French-style croissants with hundreds of flaky layers",
            "Baked using 100% pure premium grass-fed butter",
            "Light, airy, and beautifully golden on the outside",
            "Warm in the oven for a few minutes for a bakery-fresh experience"
        ],
        price: 160,
        offerPrice: 139,
        image: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80"],
        category: "Bakery & Biscuits",
        inStock: true
    },
    {
        name: "Double Chocolate Chip Muffins 4-Pack",
        description: [
            "Incredibly moist and rich bakery-style chocolate muffins",
            "Loaded with premium Belgian semi-sweet chocolate chips",
            "Baked fresh with zero high-fructose corn syrups",
            "The ultimate sweet treat to pair with hot morning coffee"
        ],
        price: 130,
        offerPrice: 109,
        image: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80"],
        category: "Bakery & Biscuits",
        inStock: true
    },
    {
        name: "Fresh Glazed Cinnamon Rolls 2-Pack",
        description: [
            "Soft, sweet rolls packed with premium sweet cinnamon sugar fillings",
            "Generously topped with a smooth, velvety vanilla cream cheese glaze",
            "Freshly baked by hand in our in-house bakery",
            "Pairs magnificently with tea or hot cocoa"
        ],
        price: 95,
        offerPrice: 79,
        image: ["https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&auto=format&fit=crop&q=80"],
        category: "Bakery & Biscuits",
        inStock: true
    },

    // === Grains ===
    {
        name: "Premium Long-Grain Basmati Rice 5kg",
        description: [
            "Aged, extra-long slender grains of royal basmati rice",
            "Fascinating natural sweet aroma when cooked",
            "Non-sticky grains that swell up beautifully",
            "Perfect staple for biryani, pulao, and everyday meals"
        ],
        price: 650,
        offerPrice: 580,
        image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80"],
        category: "Atta, Rice & Dal",
        inStock: true
    },
    {
        name: "Whole Grain Rolled Oats 1kg",
        description: [
            "100% natural, whole-grain rolled oats",
            "Rich source of heart-healthy soluble beta-glucan fiber",
            "Provides slow-release complex carbs to keep you full longer",
            "Superb for hot oatmeal breakfasts, baking cookies, or protein shakes"
        ],
        price: 250,
        offerPrice: 199,
        image: ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80"],
        category: "Atta, Rice & Dal",
        inStock: true
    },
    {
        name: "Red Split Organic Lentils 1kg",
        description: [
            "Premium quality organic split red lentils (Masoor Dal)",
            "Rich source of plant-based proteins, iron, and fiber",
            "Cooks quickly without requiring extensive soaking times",
            "Fabulous choice for healthy dals, creamy soups, and stews"
        ],
        price: 140,
        offerPrice: 119,
        image: ["https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=600&auto=format&fit=crop&q=80"],
        category: "Atta, Rice & Dal",
    },
    {
        name: "Premium Hass Avocados 2pcs",
        description: [
            "Rich, creamy texture with high organic oil content",
            "Loaded with healthy fats, dietary fiber, and potassium",
            "Perfect for making fresh guacamole, spreading on toast, or slicing in salads",
            "Imported premium grade Hass variety"
        ],
        price: 299,
        offerPrice: 199,
        image: ["https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true,
        isDeal: true,
        dealBadge: "Save 33%",
        dealDescription: "Rich, creamy imported Hass avocados."
    },
    {
        name: "Alphonso Mangoes 1kg",
        description: [
            "Incredibly sweet, rich, and fragrant Alphonso mangoes",
            "Handpicked carefully from organic Devgad farms",
            "Perfect for pure mango milkshakes, desserts, or fresh slicing",
            "The undisputed King of Fruits"
        ],
        price: 250,
        offerPrice: 179,
        image: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80"],
        category: "Fruits & Vegetables",
        inStock: true,
        isDeal: true,
        dealBadge: "Bestseller Deal",
        dealDescription: "Sweet, fragrant organic Devgad Alphonso."
    }
];

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Database Connected successfully.");

        console.log("Clearing existing products...");
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        console.log(`Seeding ${productsToSeed.length} new premium products...`);
        const seededProducts = await Product.insertMany(productsToSeed);
        console.log(`Successfully seeded ${seededProducts.length} products across all 7 categories!`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
