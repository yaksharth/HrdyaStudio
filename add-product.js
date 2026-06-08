import fs from 'fs';
import path from 'path';
import readline from 'readline';

const PRODUCTS_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear();
  console.log("==========================================");
  console.log("   HRDYA Studio - Product Creator Tool    ");
  console.log("==========================================\n");

  try {
    // 1. Read existing products
    let products = [];
    if (fs.existsSync(PRODUCTS_FILE)) {
      const fileData = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      products = JSON.parse(fileData);
    } else {
      console.error(`❌ Could not find products file at: ${PRODUCTS_FILE}`);
      process.exit(1);
    }

    // 2. Gather product information
    const name = await askQuestion("1. Product Name: ");
    if (!name.trim()) {
      console.log("❌ Product name cannot be empty.");
      rl.close();
      return;
    }

    console.log("\nAvailable Categories: Bracelets, Rings, Necklaces, Jewellery Sets, Earrings");
    const categoryInput = await askQuestion("2. Category: ");
    const categoryMap = {
      bracelets: 'Bracelets',
      rings: 'Rings',
      necklaces: 'Necklaces',
      sets: 'Jewellery Sets',
      'jewellery sets': 'Jewellery Sets',
      earrings: 'Earrings'
    };
    const category = categoryMap[categoryInput.toLowerCase().trim()] || categoryInput.trim();

    const material = await askQuestion("\n3. Material description (e.g. Gold-toned stainless steel): ");
    
    console.log("\nOccasions: Daily Wear, Party, College, Gifting, Date Night");
    const occasion = await askQuestion("4. Occasion: ") || "Daily Wear";

    const priceInput = await askQuestion("\n5. Selling Price in ₹ (number only, e.g. 280): ");
    const price = parseFloat(priceInput) || 0;

    const mrpInput = await askQuestion("6. MRP in ₹ (original crossed-out price, e.g. 399): ");
    const mrp = parseFloat(mrpInput) || price;

    const imageFilename = await askQuestion("\n7. Primary Image Filename (placed in public folder, e.g. my-new-ring-1.png): ");
    const images = imageFilename ? [`/${imageFilename.trim().replace(/^\//, '')}`] : ["/placeholder.png"];

    console.log("\nBadges: New Drop, Bestseller, Trending, or leave blank");
    const badge = await askQuestion("8. Badge: ") || "";

    const ratingInput = await askQuestion("\n9. Mock Rating (1 to 5, e.g. 4.8): ");
    const rating = parseFloat(ratingInput) || 4.8;

    const reviewsInput = await askQuestion("10. Mock Review Count (e.g. 15): ");
    const reviewCount = parseInt(reviewsInput) || 12;

    const description = await askQuestion("\n11. Product Description: ");
    const careInstructions = await askQuestion("12. Care Instructions (or press Enter for default): ") 
      || "Keep away from water, perfume, and sweat. Wipe with a soft dry cloth after use. Store in the pouch provided.";

    const sizeInput = await askQuestion("\n13. Sizes (comma separated, e.g. Adjustable or 6,7,8, or press Enter for none): ");
    const sizes = sizeInput ? sizeInput.split(',').map(s => s.trim()) : null;

    // 3. Generate a unique ID based on first letter of category
    const catPrefix = category.charAt(0).toLowerCase();
    const existingIdsOfPrefix = products
      .filter(p => p.id.startsWith(catPrefix))
      .map(p => parseInt(p.id.substring(1)))
      .filter(num => !isNaN(num));
    
    let nextNum = 1;
    if (existingIdsOfPrefix.length > 0) {
      nextNum = Math.max(...existingIdsOfPrefix) + 1;
    }
    const id = `${catPrefix}${nextNum}`;

    // 4. Construct product object
    const newProduct = {
      id,
      name: name.trim(),
      category,
      material: material.trim(),
      occasion: occasion.trim(),
      price,
      mrp,
      images,
      badge: badge.trim(),
      rating,
      reviewCount,
      description: description.trim(),
      careInstructions: careInstructions.trim(),
      ...(sizes && { sizes })
    };

    // 5. Append and Save
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');

    console.log("\n==========================================");
    console.log(`🎉 SUCCESS: Product "${name}" added successfully!`);
    console.log(`🆔 Generated ID: ${id}`);
    console.log(`📁 Saved to products.json`);
    console.log("⚠️  Reminder: Please place the image file in the public/ folder.");
    console.log("==========================================\n");

  } catch (error) {
    console.error("❌ An error occurred:", error);
  } finally {
    rl.close();
  }
}

main();
