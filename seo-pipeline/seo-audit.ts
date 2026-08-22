import { execFileSync } from "child_process";
import { mkdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

// Generic SEO/AEO/GEO audit wrapper. Copies into any project.
// Requires: pip install geo-optimizer-skill  (provides the `geo` CLI)
// Usage:    SEO_BASE_URL=https://yourdomain.com npm run seo:audit
//           SEO_THRESHOLD=75 SEO_BASE_URL=... npm run seo:audit
//           GEO_BIN=/path/to/geo npm run seo:audit   (if geo not on PATH)

const GEO = process.env.GEO_BIN || "geo";

const BASE_URL =
  process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const THRESHOLD = parseInt(process.env.SEO_THRESHOLD || "70", 10);
const REPORT_DIR = join(process.cwd(), "reports");
const REPORT_FILE = join(REPORT_DIR, "geo-latest.json");

function main() {
  if (BASE_URL.startsWith("http://localhost") || BASE_URL.startsWith("http://127.0.0.1")) {
    console.warn(
      `WARNING: auditing "${BASE_URL}" — geo-optimizer-skill requires a publicly accessible HTTPS URL.\n` +
        `Start a tunnel (cloudflared/ngrok) or deploy, then set SEO_BASE_URL to the public URL.\n`
    );
  }

  mkdirSync(REPORT_DIR, { recursive: true });

  try {
    execFileSync(GEO, ["audit", "--url", BASE_URL, "--format", "json", "--output", REPORT_FILE], {
      stdio: "inherit",
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
  } catch {
    console.error("Audit exited nonzero — see output above.");
    process.exitCode = 1;
    return;
  }

  if (!existsSync(REPORT_FILE)) {
    console.error("No report produced.");
    process.exitCode = 1;
    return;
  }

  const report = JSON.parse(readFileSync(REPORT_FILE, "utf8"));
  const score = report.score ?? report.overall ?? report.total_score ?? null;

  if (score != null) {
    console.log(`\nGEO score: ${score} (threshold ${THRESHOLD})`);
    if (typeof score === "number" && score < THRESHOLD) {
      console.log("FAIL: score below threshold.");
      process.exitCode = 1;
    } else {
      console.log("PASS: score meets threshold.");
    }
  }
}

main();