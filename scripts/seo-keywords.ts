import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const KEYWORD_DIR = join(process.cwd(), "seo-keywords");
const OUT_DIR = join(process.cwd(), "seo-keywords");
const OUT_FILE = join(OUT_DIR, "compiled.json");

type Intent = "transactional" | "commercial" | "informational" | "navigational";

interface Keyword {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: Intent;
  source: string;
}

const TRANSACTIONAL = ["buy", "order", "purchase", "price", "cost", "cheap", "deal", "discount", "shop", "coupon"];
const NAVIGATIONAL = ["vellora", "login", "track order", "store", "vendor"];
const COMMERCIAL = ["best", "top", "review", "vs", "compare", "rating", "warranty", "shipping", "return"];
const INFORMATIONAL = ["how", "what", "why", "guide", "tips", "tutorial", "difference", "benefit", "material"];

function detectIntent(keyword: string): Intent {
  const k = keyword.toLowerCase();
  if (TRANSACTIONAL.some((t) => k.includes(t))) return "transactional";
  if (NAVIGATIONAL.some((t) => k.includes(t))) return "navigational";
  if (COMMERCIAL.some((t) => k.includes(t))) return "commercial";
  if (INFORMATIONAL.some((t) => k.includes(t))) return "informational";
  return "transactional";
}

function parseCSVRow(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

function toNumber(value: string | undefined): number {
  const n = parseFloat((value || "").replace(/[^\d.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function loadCSVs(): Keyword[] {
  if (!existsSync(KEYWORD_DIR)) {
    mkdirSync(KEYWORD_DIR, { recursive: true });
    console.log(`Created ${KEYWORD_DIR} — drop keyword CSVs here (e.g. from Google Keyword Planner).`);
    return [];
  }

  const keywords: Keyword[] = [];
  const files = readdirSync(KEYWORD_DIR).filter((f) => f.toLowerCase().endsWith(".csv"));

  for (const file of files) {
    const rows = readFileSync(join(KEYWORD_DIR, file), "utf8").split(/\r?\n/).filter(Boolean);
    const header = rows[0].toLowerCase();
    const colIndex = (names: string[]) => {
      for (const n of names) {
        const idx = header.indexOf(n);
        if (idx !== -1) return header.split(",").findIndex((c) => c.includes(n));
      }
      return -1;
    };

    const kwCol = colIndex(["keyword", "query", "term", "search term"]);
    const volCol = colIndex(["volume", "avg monthly searches", "monthly searches"]);
    const diffCol = colIndex(["difficulty", "competition", "kd"]);

    if (kwCol === -1) {
      console.log(`Skipping ${file}: no keyword column found.`);
      continue;
    }

    for (const row of rows.slice(1)) {
      const cells = parseCSVRow(row);
      const keyword = cells[kwCol];
      if (!keyword) continue;
      const volume = volCol !== -1 ? toNumber(cells[volCol]) : 0;
      const difficulty = diffCol !== -1 ? toNumber(cells[diffCol]) : 0;
      keywords.push({ keyword, volume, difficulty, intent: detectIntent(keyword), source: file });
    }
    console.log(`Loaded ${rows.length - 1} keywords from ${file}`);
  }

  return keywords;
}

function dedupeAndRank(keywords: Keyword[]): Keyword[] {
  const seen = new Map<string, Keyword>();
  for (const kw of keywords) {
    const key = kw.keyword.toLowerCase();
    const existing = seen.get(key);
    if (!existing || kw.volume > existing.volume) {
      seen.set(key, kw);
    }
  }
  return [...seen.values()].sort((a, b) => b.volume - a.volume);
}

const keywords = dedupeAndRank(loadCSVs());

const compiled = {
  generatedAt: new Date().toISOString(),
  total: keywords.length,
  byIntent: {
    transactional: keywords.filter((k) => k.intent === "transactional"),
    commercial: keywords.filter((k) => k.intent === "commercial"),
    informational: keywords.filter((k) => k.intent === "informational"),
    navigational: keywords.filter((k) => k.intent === "navigational"),
  },
  highValue: keywords.filter((k) => k.volume >= 100).slice(0, 100),
  all: keywords,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(compiled, null, 2));
console.log(`Wrote ${OUT_FILE} (${keywords.length} unique keywords).`);