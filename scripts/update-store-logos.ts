import { db } from "../src/db";
import { stores } from "../src/db/schema";
import { eq } from "drizzle-orm";

const LOGOS: Record<string, string> = {
  techhub: "/stores/techhub.jpg",
  stylenest: "/stores/stylenest.jpg",
  homecraft: "/stores/homecraft.jpg",
  fitgear: "/stores/fitgear.jpg",
  greenleaf: "/stores/greenleaf.jpg",
  booknook: "/stores/booknook.jpg",
};

async function main() {
  const all = await db.select().from(stores);
  for (const store of all) {
    const logo = LOGOS[store.slug];
    if (!logo) continue;
    await db.update(stores).set({ logo }).where(eq(stores.id, store.id));
    console.log(`updated ${store.name} (${store.slug}) -> ${logo}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});