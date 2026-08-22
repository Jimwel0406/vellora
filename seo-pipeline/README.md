# seo-pipeline/

Reusable SEO / AEO / GEO tooling for any project. Copy this folder (and `SEO-AEO-GEO-BEST-PRACTICES.md` at the repo root) into your next project.

## Files

- `seo-audit.ts` — runs the `geo-optimizer-skill` CLI audit against `SEO_BASE_URL`, writes `reports/geo-latest.json`, exits 1 below `SEO_THRESHOLD`.
- `seo-keywords.ts` — reads keyword CSVs from `seo-keywords/`, classifies by intent, writes `seo-keywords/compiled.json`.

## Setup

```bash
pip install geo-optimizer-skill   # provides the `geo` CLI
```

## Wire into package.json

```json
{
  "scripts": {
    "seo:audit": "tsx seo-pipeline/seo-audit.ts",
    "seo:keywords": "tsx seo-pipeline/seo-keywords.ts"
  }
}
```

(If the project isn't TypeScript/Node, run the equivalent logic via Python or shell — see the best-practices doc for the raw `geo` commands.)

## Usage

```bash
# Audit against a deployed URL (audit tools require public HTTPS)
SEO_BASE_URL=https://yourdomain.com npm run seo:audit

# Lower/raise the pass bar
SEO_THRESHOLD=75 SEO_BASE_URL=https://yourdomain.com npm run seo:audit

# Classify dropped-in keyword CSVs
npm run seo:keywords
```

## Notes

- `SEO_BRAND=YourBrand` overrides the brand token used for navigational-intent detection in `seo-keywords.ts` (default `yourbrand`).
- The audit requires a publicly accessible HTTPS URL — for local dev, use a tunnel (cloudflared/ngrok) or deploy first.
- On Windows the audit wrapper sets `PYTHONIOENCODING=utf-8` to avoid console encoding crashes from the CLI's emoji output.