import { db } from "../src/db";
import { users, stores, categories, products, orders, subOrders, reviews } from "../src/db/schema";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD = "password123";

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (reverse dependency order)
  console.log("Cleaning existing data...");
  await db.delete(subOrders);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(stores);
  await db.delete(categories);
  await db.delete(users);

  // Categories
  console.log("Creating categories...");
  const [electronics, fashion, home, health, sports, books] = await db
    .insert(categories)
    .values([
      { name: "Electronics", slug: "electronics" },
      { name: "Fashion & Apparel", slug: "fashion" },
      { name: "Home & Living", slug: "home-living" },
      { name: "Health & Beauty", slug: "health-beauty" },
      { name: "Sports & Outdoors", slug: "sports" },
      { name: "Books & Stationery", slug: "books" },
    ])
    .returning();

  // Users
  console.log("Creating users...");
  const [vendor1, vendor2, vendor3, vendor4, vendor5, vendor6, customer, sarahMitchell, danielReyes, emilyChen, marcusJohnson, avaThompson, liamOConnor, priyaPatel, noraWilliams, owenDavis, zoeMartinez] = await db
    .insert(users)
    .values([
      { name: "Admin User", email: "admin@example.com", password: await hash(DEMO_PASSWORD), role: "admin" },
      { name: "Tech Hub", email: "vendor1@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "Style Nest", email: "vendor2@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "Home Craft", email: "vendor3@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "FitGear", email: "vendor4@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "GreenLeaf", email: "vendor5@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "BookNook", email: "vendor6@example.com", password: await hash(DEMO_PASSWORD), role: "vendor" },
      { name: "Demo Customer", email: "customer@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Sarah Mitchell", email: "sarah.mitchell@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Daniel Reyes", email: "daniel.reyes@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Emily Chen", email: "emily.chen@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Marcus Johnson", email: "marcus.johnson@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Ava Thompson", email: "ava.thompson@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Liam O'Connor", email: "liam.oconnor@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Priya Patel", email: "priya.patel@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Nora Williams", email: "nora.williams@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Owen Davis", email: "owen.davis@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
      { name: "Zoe Martinez", email: "zoe.martinez@example.com", password: await hash(DEMO_PASSWORD), role: "customer" },
    ])
    .returning();

  // Stores
  console.log("Creating stores...");
  const [techHub, styleNest, homeCraft, fitGear, greenLeaf, bookNook] = await db
    .insert(stores)
    .values([
      {
        name: "TechHub",
        slug: "techhub",
        description:
          "TechHub is your destination for the latest gadgets and electronics. From wireless audio and mechanical keyboards to everyday smart accessories, we hand-pick premium tech that earns its place in your life. Every product is tested by our team, backed by a 30-day return policy, and ships with full manufacturer warranty.",
        logo: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=200&h=200&fit=crop",
        userId: vendor1.id,
        createdAt: new Date("2022-03-14T09:30:00.000Z"),
      },
      {
        name: "StyleNest",
        slug: "stylenest",
        description:
          "StyleNest brings you trendy fashion and accessories for every occasion. We blend classic staples with seasonal must-haves, curated by stylists who obsess over fit, fabric, and finish. Whether you're dressing for the office or a weekend out, StyleNest makes effortless style an easy choice — with free returns on every order.",
        logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop",
        userId: vendor2.id,
        createdAt: new Date("2023-07-02T14:00:00.000Z"),
      },
      {
        name: "HomeCraft",
        slug: "homecraft",
        description:
          "HomeCraft specializes in beautiful, handcrafted home decor and essentials. Each piece is made by skilled artisans using natural materials, so your space feels warm, personal, and one of a kind. From ceramic planters to soy wax candles, we bring craftsmanship into every corner of your home.",
        logo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop",
        userId: vendor3.id,
        createdAt: new Date("2021-11-20T08:15:00.000Z"),
      },
      {
        name: "FitGear",
        slug: "fitgear",
        description:
          "FitGear is your go-to shop for premium sports gear and activewear. We stock performance apparel, training equipment, and hydration essentials trusted by athletes and weekend warriors alike. Train harder, recover smarter, and look the part — all backed by our quality guarantee and fast shipping.",
        logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop",
        userId: vendor4.id,
        createdAt: new Date("2024-01-09T11:45:00.000Z"),
      },
      {
        name: "GreenLeaf",
        slug: "greenleaf",
        description:
          "GreenLeaf is an eco-friendly marketplace for sustainable living. Every product we carry is plant-based, compostable, or responsibly sourced — from bamboo toothbrushes to beeswax wraps. Choosing GreenLeaf means reducing plastic waste without compromising on quality, one swap at a time.",
        logo: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&h=200&fit=crop",
        userId: vendor5.id,
        createdAt: new Date("2020-05-18T16:20:00.000Z"),
      },
      {
        name: "BookNook",
        slug: "booknook",
        description:
          "BookNook curates books and stationery for curious minds. We bring you thoughtfully chosen reads, notebooks, and writing tools designed to inspire your next great idea. Whether you're a devoted reader or a budding writer, BookNook is the cozy corner of the internet for everything on paper.",
        logo: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop",
        userId: vendor6.id,
        createdAt: new Date("2025-04-25T10:05:00.000Z"),
      },
    ])
    .returning();

  // Products
  console.log("Creating products...");
  const productData = [
    // TechHub
    {
      name: "Wireless Bluetooth Headphones",
      description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.|Active Noise Cancellation blocks ambient sound|30-hour battery life for all-day listening|Premium memory foam ear cushions|Built-in microphone for hands-free calls|v:color:Midnight Black,Pearl White,Forest Green",
      price: 4999,
      tags: ["Best Seller", "New", "Wireless"],
      stock: 15,
      storeId: techHub.id,
      categoryId: electronics.id,
      images: ["/products/193-wireless-bluetooth-headphones.jpg", "/products/193-wireless-bluetooth-headphones-1.jpg", "/products/193-wireless-bluetooth-headphones-2.jpg"],
    },
    {
      name: "Mechanical Keyboard RGB",
      description: "Tactile switches with per-key RGB lighting and hot-swappable switches.|Hot-swappable switches — customize your feel|Per-key RGB lighting with customizable profiles|Tactile mechanical feedback for responsive typing|Includes keycap puller and switch remover|v:switch:Cherry MX Blue,Cherry MX Red,Cherry MX Brown|v:layout:Full-size,TKL,60%",
      price: 5999,
      tags: ["Popular", "Gaming", "RGB"],
      stock: 20,
      storeId: techHub.id,
      categoryId: electronics.id,
      images: ["/products/194-mechanical-keyboard-rgb.jpg", "/products/194-mechanical-keyboard-rgb-1.jpg", "/products/194-mechanical-keyboard-rgb-2.jpg"],
    },
    {
      name: "USB-C Hub 7-in-1",
      description: "Expand your laptop with HDMI, USB-A, SD card reader, and 100W pass-through charging.|HDMI 4K output at 60Hz|USB-A and USB-C data ports|SD and microSD card reader|100W pass-through charging",
      price: 3999,
      tags: ["Essentials", "USB-C"],
      stock: 30,
      storeId: techHub.id,
      categoryId: electronics.id,
      images: ["/products/195-usb-c-hub.jpg", "/products/195-usb-c-hub-1.jpg", "/products/195-usb-c-hub-2.jpg"],
    },
    {
      name: "Smart Watch Series 5",
      description: "Fitness tracking, heart rate monitor, and 7-day battery in a sleek aluminum case.|Continuous heart rate and SpO2 monitoring|7-day battery life with typical use|water resistant|Built-in GPS and sleep tracking",
      price: 9999,
      tags: ["Featured", "Fitness", "New"],
      stock: 10,
      storeId: techHub.id,
      categoryId: electronics.id,
      images: ["/products/196-smart-watch.jpg", "/products/196-smart-watch-1.jpg", "/products/196-smart-watch-2.jpg"],
    },
    // StyleNest
    {
      name: "Minimalist Canvas Tote Bag",
      description: "Durable cotton canvas tote with reinforced handles and inner pocket.|Premium 100% cotton canvas construction|Reinforced handles rated for heavy loads|Inner zip pocket for valuables|Machine washable and eco-friendly|v:color:Natural,Black,Navy",
      price: 1499,
      tags: ["Eco", "Daily Use"],
      stock: 50,
      storeId: styleNest.id,
      categoryId: fashion.id,
      images: ["/products/197-canvas-tote-bag.jpg", "/products/197-canvas-tote-bag-1.jpg", "/products/197-canvas-tote-bag-2.jpg"],
    },
    {
      name: "Classic Denim Jacket",
      description: "Timeless blue denim jacket with button front and adjustable waist tabs.|Classic button-front closure|Adjustable waist tabs for custom fit|Chest pockets with button flaps|Pre-washed for softness from day one",
      price: 4499,
      tags: ["Classic", "Best Seller"],
      stock: 12,
      storeId: styleNest.id,
      categoryId: fashion.id,
      images: ["/products/198-denim-jacket.jpg", "/products/198-denim-jacket-1.jpg", "/products/198-denim-jacket-2.jpg"],
    },
    {
      name: "Urban Running Sneakers",
      description: "Lightweight knit upper with responsive cushioning for daily runs.|Breathable knit upper for all-day comfort|Responsive foam midsole for energy return|Padded collar and tongue for ankle support|Durable rubber outsole with multi-directional traction|v:size:7,8,9,10,11,12|v:color:White,Black,Gray",
      price: 5999,
      tags: ["Athletic", "New"],
      stock: 18,
      storeId: styleNest.id,
      categoryId: sports.id,
      images: ["/products/199-urban-running-sneakers.jpg", "/products/199-urban-running-sneakers-1.jpg", "/products/199-urban-running-sneakers-2.jpg"],
    },
    {
      name: "Leather Bifold Wallet",
      description: "Genuine leather wallet with RFID blocking and 8 card slots.|RFID-blocking technology protects your cards|8 card slots and 2 hidden bill compartments|Genuine full-grain leather that ages beautifully|Slim profile fits easily in any pocket",
      price: 1999,
      tags: ["Premium", "Gift"],
      stock: 25,
      storeId: styleNest.id,
      categoryId: fashion.id,
      images: ["/products/200-leather-bifold-wallet.jpg", "/products/200-leather-bifold-wallet-1.jpg", "/products/200-leather-bifold-wallet-2.jpg"],
    },
    // HomeCraft
    {
      name: "Ceramic Plant Pot Set",
      description: "Set of 3 hand-painted ceramic pots in earthy tones with drainage holes.|Set of 3 different sizes for varied plants|Hand-painted ceramic with unique glaze finish|Drainage holes to prevent overwatering|Silicone feet protect your surfaces",
      price: 3999,
      tags: ["Handmade", "Home"],
      stock: 40,
      storeId: homeCraft.id,
      categoryId: home.id,
      images: ["/products/201-ceramic-plant-pot-set.jpg", "/products/201-ceramic-plant-pot-set-1.jpg", "/products/201-ceramic-plant-pot-set-2.jpg"],
    },
    {
      name: "Bamboo Desk Organizer",
      description: "Eco-friendly bamboo organizer with compartments for pens, phone, and notes.|Sustainable bamboo construction|Dedicated slots for pens, phone, and sticky notes|Built-in drawer for small accessories|Non-slip base keeps it firmly in place",
      price: 2499,
      tags: ["Eco", "Office"],
      stock: 22,
      storeId: homeCraft.id,
      categoryId: home.id,
      images: ["/products/202-bamboo-desk-organizer.jpg", "/products/202-bamboo-desk-organizer-1.jpg", "/products/202-bamboo-desk-organizer-2.jpg"],
    },
    {
      name: "Scented Soy Candle",
      description: "Natural soy wax candle with essential oils. 40-hour burn time.|Hand-poured 100% natural soy wax|Infused with premium essential oils|40-hour burn time per candle|Cotton wick for clean, even burn",
      price: 1299,
      tags: ["Handmade", "Relaxing"],
      stock: 35,
      storeId: homeCraft.id,
      categoryId: home.id,
      images: ["/products/203-soy-candle.jpg", "/products/203-soy-candle-1.jpg", "/products/203-soy-candle-2.jpg"],
    },
    {
      name: "Woven Throw Blanket",
      description: "Soft cotton-blend throw blanket in neutral tones. Perfect for sofas.|Premium cotton-blend weave|Generous 50x60 size for full coverage|Neutral tones complement any decor|Machine washable for easy care",
      price: 2999,
      tags: ["Cozy", "Home"],
      stock: 16,
      storeId: homeCraft.id,
      categoryId: home.id,
      images: ["/products/204-woven-throw-blanket.jpg", "/products/204-woven-throw-blanket-1.jpg", "/products/204-woven-throw-blanket-2.jpg"],
    },
    // FitGear
    {
      name: "Performance Running Shoes",
      description: "Lightweight knit upper with responsive cushioning for daily runs.|Breathable knit upper for all-day comfort|Responsive foam midsole for energy return|Padded collar and tongue for ankle support|Durable rubber outsole with multi-directional traction",
      price: 7999,
      tags: ["Athletic", "Popular"],
      stock: 20,
      storeId: fitGear.id,
      categoryId: sports.id,
      images: ["/products/205-performance-running-shoes.jpg", "/products/205-performance-running-shoes-1.jpg", "/products/205-performance-running-shoes-2.jpg"],
    },
    {
      name: "Premium Yoga Mat",
      description: "Extra-thick non-slip mat with alignment lines for yoga and pilates.|6mm thickness for joint comfort|Non-slip surface on both sides|Alignment lines for proper form|Carrying strap included",
      price: 2999,
      tags: ["Essentials", "Fitness"],
      stock: 30,
      storeId: fitGear.id,
      categoryId: sports.id,
      images: ["/products/206-yoga-mat.jpg", "/products/206-yoga-mat-1.jpg", "/products/206-yoga-mat-2.jpg"],
    },
    {
      name: "Insulated Water Bottle",
      description: "Double-wall stainless steel. Keeps drinks cold 24h or hot 12h.|Double-wall vacuum insulation|Keeps drinks cold for 24 hours or hot for 12 hours|BPA-free stainless steel construction|Fits most standard cup holders",
      price: 1999,
      tags: ["Eco", "Daily Use"],
      stock: 50,
      storeId: fitGear.id,
      categoryId: sports.id,
      images: ["/products/207-insulated-water-bottle.jpg", "/products/207-insulated-water-bottle-1.jpg", "/products/207-insulated-water-bottle-2.jpg"],
    },
    {
      name: "Adjustable Dumbbell Set",
      description: "Space-saving design. Adjusts from 5 to 52.5 lbs with a simple twist.|Replaces 15 sets of dumbbells with one compact design|Quick-change dial from 5-52.5 lbs|Smooth weight transition mid-set|Includes storage tray",
      price: 14999,
      tags: ["Pro", "Fitness"],
      stock: 8,
      storeId: fitGear.id,
      categoryId: sports.id,
      images: ["/products/208-adjustable-dumbbells.jpg", "/products/208-adjustable-dumbbells-1.jpg", "/products/208-adjustable-dumbbells-2.jpg"],
    },
    // GreenLeaf
    {
      name: "Organic Bamboo Toothbrush Set",
      description: "Set of 4 biodegradable bamboo toothbrushes with soft bristles.|100% biodegradable bamboo handle|BPA-free soft bristles|Set of 4 for the whole family|Compostable packaging included",
      price: 799,
      tags: ["Eco", "Family"],
      stock: 60,
      storeId: greenLeaf.id,
      categoryId: health.id,
      images: ["/products/209-bamboo-toothbrush-set.jpg", "/products/209-bamboo-toothbrush-set-1.jpg", "/products/209-bamboo-toothbrush-set-2.jpg"],
    },
    {
      name: "Reusable Beeswax Food Wraps",
      description: "Set of 3 eco-friendly food wraps. Replaces plastic wrap for storing food.|Set of 3 assorted sizes|Made from organic cotton and beeswax|Reusable for up to one year|Naturally antibacterial and breathable",
      price: 1299,
      tags: ["Eco", "Zero Waste"],
      stock: 40,
      storeId: greenLeaf.id,
      categoryId: home.id,
      images: ["/products/210-beeswax-food-wraps.jpg", "/products/210-beeswax-food-wraps-1.jpg", "/products/210-beeswax-food-wraps-2.jpg"],
    },
    {
      name: "Natural Lip Balm Trio",
      description: "Handmade with beeswax and essential oils. Three flavors in a gift set.|Handmade with natural beeswax|Three flavors: peppermint, citrus, lavender|Moisturizes and protects dry lips|Plastic-free packaging",
      price: 799,
      tags: ["Gift", "Natural"],
      stock: 80,
      storeId: greenLeaf.id,
      categoryId: health.id,
      images: ["/products/211-lip-balm-trio.jpg", "/products/211-lip-balm-trio-1.jpg", "/products/211-lip-balm-trio-2.jpg"],
    },
    {
      name: "Compostable Phone Case",
      description: "Plant-based compostable phone case with drop protection.|Made from plant-based compostable materials|Drop protection up to 6 feet|Slim design with raised bezel|Compostable at end of life",
      price: 1599,
      tags: ["Eco", "New"],
      stock: 25,
      storeId: greenLeaf.id,
      categoryId: electronics.id,
      images: ["/products/212-compostable-phone-case.jpg", "/products/212-compostable-phone-case-1.jpg", "/products/212-compostable-phone-case-2.jpg"],
    },
    // BookNook
    {
      name: "Hardcover Notebook Set",
      description: "Set of 3 linen-bound notebooks with dot grid, lined, and blank pages.|Set of 3 — dot grid, lined, and blank|Linen-bound hardcover with lay-flat binding|Ribbon bookmark included|Acid-free 120gsm paper",
      price: 1499,
      tags: ["Stationery", "Gift"],
      stock: 35,
      storeId: bookNook.id,
      categoryId: books.id,
      images: ["/products/213-notebook-set.jpg", "/products/213-notebook-set-1.jpg", "/products/213-notebook-set-2.jpg"],
    },
    {
      name: "Classic Fountain Pen",
      description: "Brass fountain pen with fine nib. Includes ink cartridges and converter.|Brass body with premium lacquer finish|Fine stainless steel nib|Includes 6 ink cartridges and converter|Comfortable ergonomic grip section",
      price: 1999,
      tags: ["Premium", "Classic"],
      stock: 20,
      storeId: bookNook.id,
      categoryId: books.id,
      images: ["/products/214-classic-fountain-pen.jpg", "/products/214-classic-fountain-pen-1.jpg", "/products/214-classic-fountain-pen-2.jpg"],
    },
    {
      name: "Weekly Planner 2026",
      description: "Undated weekly planner with durable cover, ribbon bookmark, and goal tracker.|Undated so you can start anytime|Weekly and monthly spreads included|Built-in goal tracker and habit tracker|Durable hardcover with elastic closure",
      price: 999,
      tags: ["Stationery", "Essentials"],
      stock: 45,
      storeId: bookNook.id,
      categoryId: books.id,
      images: ["/products/215-weekly-planner.jpg", "/products/215-weekly-planner-1.jpg", "/products/215-weekly-planner-2.jpg"],
    },
    {
      name: "Reading Journal",
      description: "Track your reading journey with prompts, ratings, and space for 50 books.|Space for 50 books with detailed logs|Prompts for notes, quotes, and ratings|Reading challenge tracker included|Durable flexi-cover with bookmark ribbon",
      price: 1299,
      tags: ["Stationery", "Bookish"],
      stock: 30,
      storeId: bookNook.id,
      categoryId: books.id,
      images: ["/products/216-reading-journal.jpg", "/products/216-reading-journal-1.jpg", "/products/216-reading-journal-2.jpg"],
    },
  ];

  const insertedProducts = await db.insert(products).values(productData).returning();

  // Reviews (demo ratings across products for ratings UI)
  console.log("Creating reviews...");
  const demoCustomers = [
    { id: customer.id, name: "Demo Customer" },
    { id: sarahMitchell.id, name: "Sarah Mitchell" },
    { id: danielReyes.id, name: "Daniel Reyes" },
    { id: emilyChen.id, name: "Emily Chen" },
    { id: marcusJohnson.id, name: "Marcus Johnson" },
    { id: avaThompson.id, name: "Ava Thompson" },
    { id: liamOConnor.id, name: "Liam O'Connor" },
    { id: priyaPatel.id, name: "Priya Patel" },
    { id: noraWilliams.id, name: "Nora Williams" },
    { id: owenDavis.id, name: "Owen Davis" },
    { id: zoeMartinez.id, name: "Zoe Martinez" },
  ];
  const reviewComments = [
    "Absolutely love it — high quality and exactly as described.",
    "Fast delivery and beautiful packaging. Will buy again.",
    "Great value for the price. Highly recommend.",
    "Solid build and works perfectly. Very satisfied.",
    "Exactly what I needed. Exceeded my expectations.",
    "Good quality overall, would recommend to a friend.",
    "Took a couple of days to arrive but worth the wait. Very happy.",
    "Works as advertised. Five stars from me.",
    "The quality really impressed me for the price point.",
    "Second purchase from this store and it didn't disappoint.",
    "Comfortable, well-made, and exactly as pictured.",
    "Can't recommend this enough. Excellent customer service too.",
    "Happy with the purchase, though shipping could be faster.",
    "Great product, fits perfectly and looks even better in person.",
    "Beautiful item, exactly as shown in the photos.",
    "Shipping was quick and everything arrived well packaged.",
    "Decent quality for the price. No complaints here.",
    "Really glad I ordered this — it's become a daily essential.",
    "Exactly matches the description. Very satisfied overall.",
    "Sturdy and well crafted. Definitely worth the money.",
    "Would have liked more color options, but the product itself is excellent.",
    "My third order from this brand. Consistent quality every time.",
    "Took a little while to arrive but the quality makes up for it.",
    "Great communication from the seller and a smooth transaction.",
    "Superb quality, exceeded what I expected at this price.",
    "Works perfectly and setup was a breeze.",
    "Honestly great value. Better than similar items I've bought elsewhere.",
    "Very happy with this purchase. Would buy again.",
    "Nice product, minor flaw in the finish but nothing serious.",
    "As described and arrived on time. Recommended.",
  ];
  // Deterministic PRNG so seeding is reproducible
  let _seed = 42;
  const rnd = () => {
    _seed = (_seed * 1664525 + 1013904223) >>> 0;
    return _seed / 4294967296;
  };
  // Realistic per-product review counts (2-24), weighted toward popular items
  const counts = insertedProducts.map(() => {
    const roll = rnd();
    if (roll < 0.12) return 2 + Math.floor(rnd() * 2); // 2-3
    if (roll < 0.35) return 4 + Math.floor(rnd() * 4); // 4-7
    if (roll < 0.6) return 8 + Math.floor(rnd() * 6); // 8-13
    if (roll < 0.82) return 14 + Math.floor(rnd() * 7); // 14-20
    return 21 + Math.floor(rnd() * 4); // 21-24
  });
  // Weighted rating distribution: mostly 4-5, a few lower
  const pickRating = () => {
    const roll = rnd();
    if (roll < 0.62) return 5;
    if (roll < 0.88) return 4;
    if (roll < 0.96) return 3;
    if (roll < 0.99) return 2;
    return 1;
  };
  const pickComment = (rating: number) => {
    if (rating <= 2) {
      const negatives = [
        "Quality is okay but not what I expected. A bit disappointed.",
        "One minor issue after a few weeks of use. Otherwise fine.",
        "Average at best. Would probably look elsewhere next time.",
        "Shipping took longer than expected and the packaging was damaged.",
      ];
      return negatives[Math.floor(rnd() * negatives.length)];
    }
    if (rating === 3) {
      const middles = [
        "Good product overall, though not perfect.",
        "Solid and functional, but nothing particularly special.",
        "It does the job well enough. Happy enough with it.",
        "Decent, but I expected a bit more for the price.",
      ];
      return middles[Math.floor(rnd() * middles.length)];
    }
    return reviewComments[Math.floor(rnd() * reviewComments.length)];
  };
  const reviewRows: {
    productId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: Date;
  }[] = [];
  insertedProducts.forEach((p, idx) => {
    const count = counts[idx];
    for (let r = 0; r < count; r++) {
      const rating = pickRating();
      reviewRows.push({
        productId: p.id,
        userId: demoCustomers[Math.floor(rnd() * demoCustomers.length)].id,
        rating,
        comment: pickComment(rating),
        // spread reviews across the past ~18 months
        createdAt: new Date(
          Date.now() - Math.floor(rnd() * 540) * 24 * 60 * 60 * 1000
        ),
      });
    }
  });
  await db.insert(reviews).values(reviewRows);

  // Orders (cross-vendor purchases to showcase smart checkout)
  console.log("Creating orders...");
  const COMMISSION_RATE = 0.1; // 10% platform commission

  const orderData = [
    // Order 1: Headphones (TechHub) + Tote Bag (StyleNest)
    {
      items: [
        { product: insertedProducts[0], store: techHub },
        { product: insertedProducts[4], store: styleNest },
      ],
    },
    // Order 2: Keyboard (TechHub) + Candle (HomeCraft) + Sneakers (StyleNest)
    {
      items: [
        { product: insertedProducts[1], store: techHub },
        { product: insertedProducts[10], store: homeCraft },
        { product: insertedProducts[6], store: styleNest },
      ],
    },
    // Order 3: Desk Organizer (HomeCraft) + Wallet (StyleNest)
    {
      items: [
        { product: insertedProducts[9], store: homeCraft },
        { product: insertedProducts[7], store: styleNest },
      ],
    },
  ];

  for (const o of orderData) {
    const totalAmount = o.items.reduce((sum, item) => sum + item.product.price, 0);

    const [order] = await db
      .insert(orders)
      .values({
        userId: customer.id,
        totalAmount,
        status: "completed",
      })
      .returning();

    // Group items by store for sub-orders
    const storeGroups = new Map<number, typeof o.items>();
    for (const item of o.items) {
      if (!storeGroups.has(item.store.id)) {
        storeGroups.set(item.store.id, []);
      }
      storeGroups.get(item.store.id)!.push(item);
    }

    for (const [, items] of storeGroups) {
      const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);
      const commission = Math.round(subtotal * COMMISSION_RATE);
      const vendorPayout = subtotal - commission;

      await db.insert(subOrders).values({
        orderId: order.id,
        storeId: items[0].store.id,
        subtotal,
        commission,
        vendorPayout,
        status: "paid",
      });
    }
  }

  console.log("Seeding complete!");
  console.log(`
Demo accounts created:
  Admin:    admin@example.com / ${DEMO_PASSWORD}
  Vendor 1: vendor1@example.com / ${DEMO_PASSWORD}
  Vendor 2: vendor2@example.com / ${DEMO_PASSWORD}
  Vendor 3: vendor3@example.com / ${DEMO_PASSWORD}
  Vendor 4: vendor4@example.com / ${DEMO_PASSWORD}
  Vendor 5: vendor5@example.com / ${DEMO_PASSWORD}
  Vendor 6: vendor6@example.com / ${DEMO_PASSWORD}
  Customer: customer@example.com / ${DEMO_PASSWORD}
  `);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
