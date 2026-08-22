import { db } from "./src/db";
import { products, stores } from "./src/db/schema";
import { eq } from "drizzle-orm";
async function main() {
  const all = await db.select().from(products).leftJoin(stores, eq(products.storeId, stores.id));
  for (const { products: p } of all) {
    console.log("== " + p.name + " ==");
    (p.images ?? []).forEach((img, i) => console.log("  " + i + ": " + img));
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
