import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, '../client/src/assets/greencart_assets/assets.js');
let code = fs.readFileSync(assetsPath, 'utf8');

// Extract dummyProducts array
const match = code.match(/export const dummyProducts = (\[[\s\S]*?\]);/);
if (!match) {
    console.error("Could not find dummyProducts in assets.js");
    process.exit(1);
}

let arrayStr = match[1];

// Replace unquoted variable names with quoted strings for the public images folder
arrayStr = arrayStr.replace(/([a-zA-Z0-9_]+_image(_[0-9]+)?)/g, '"/images/$1.png"');

// Strip the hardcoded `_id` fields because they are not valid MongoDB ObjectIds
arrayStr = arrayStr.replace(/\s*_id:\s*['"][^'"]+['"],/g, '');

// Fix the image array with URL if it's already a string URL (like the Unsplash ones)
// The regex might have messed up existing strings if they didn't match, but our regex only targets unquoted words.
// Actually, variables won't have quotes around them, so replacing them is fine.

const finalScript = `import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const productsToSeed = ${arrayStr};

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
`;

fs.writeFileSync(path.join(__dirname, 'seed_assets.js'), finalScript);
console.log("Created seed_assets.js successfully.");
