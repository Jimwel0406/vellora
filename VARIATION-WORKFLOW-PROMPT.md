# Variation Workflow Prompt

A workflow for creating, comparing, and selecting design variations for UI sections.

## Overview

Instead of creating variations and taking screenshots (which breaks interactivity), this workflow builds **live, switchable variations** directly in the app using a tab/toggle UI. This lets you compare variations side-by-side in the browser with real data, real interactions, and real responsive behavior.

## When to Use

Use this workflow when:
- A section needs visual refinement but the direction is unclear
- The user asks for "variations" or "options" of an existing section
- You want to present multiple approaches without blocking on a decision

## Workflow

### 1. Analyze the Current Section

- Read the existing component and its styling
- Understand the data it receives (props/schema)
- Note the design tokens (colors, spacing, typography) from DESIGN.md or globals.css

### 2. Create Variation Components

Each variation gets its own file in the same component directory:

```
src/components/home/
  section-name.tsx            ← original (keep or delete after selection)
  section-name-variation-a.tsx
  section-name-variation-b.tsx
  section-name-variation-c.tsx
  section-name-section.tsx    ← switcher wrapper
```

**Naming convention:**
- Variation files: `{section-name}-{variation-name}.tsx`
- Switcher file: `{section-name}-section.tsx`

### 3. Build the Switcher Component

Create a `"use client"` wrapper that renders tabs and conditionally shows the active variation:

```tsx
"use client";

import { useState } from "react";
import type { SomeProps } from "./original-component";
import { VariationA } from "./section-name-variation-a";
import { VariationB } from "./section-name-variation-b";

const VARIATIONS = [
  { id: "variation-a", label: "Variation A" },
  { id: "variation-b", label: "Variation B" },
] as const;

type VariationId = (typeof VARIATIONS)[number]["id"];

export function SectionNameSection({ ...props }: { ...props }) {
  const [active, setActive] = useState<VariationId>("variation-a");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {VARIATIONS.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase font-label tracking-[0.15em] transition-all duration-200 ${
              active === v.id
                ? "bg-clay text-sand"
                : "bg-clay/8 text-clay-mute hover:bg-clay/15"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Variation content */}
      {active === "variation-a" && <VariationA {...props} />}
      {active === "variation-b" && <VariationB {...props} />}
    </div>
  );
}
```

**Tab styling by section theme:**
- Light sections (sand background): `bg-clay text-sand` (active) / `bg-clay/8 text-clay-mute` (inactive)
- Dark sections (clay background): `bg-terracotta text-white` (active) / `bg-white/10 text-white/40` (inactive)

### 4. Wire Into the Page

Replace the original component import with the switcher in the parent page:

```tsx
// Before
import { OriginalComponent } from "@/components/home/section-name";

// After
import { SectionNameSection } from "@/components/home/section-name-section";

// In JSX
<SectionNameSection {...props} />
```

### 5. Verify

- TypeScript compiles (`npx tsc --noEmit`)
- All variations render correctly
- Tab switching works
- Responsive at 320px, 768px, 1280px+

### 6. Select and Clean Up

Once the user picks a variation:
1. Update the page to import the chosen variation directly
2. Delete the other variation files
3. Delete the switcher wrapper
4. If the chosen variation has a different name than the original, update the import

```tsx
// After selection — e.g., user chose "variation-b"
import { VariationB } from "@/components/home/section-name-variation-b";

// In JSX
<VariationB {...props} />
```

## Example: New Arrivals Section

```
new-arrivals-slideshow.tsx          ← original (deleted)
new-arrivals-slideshow-v2.tsx       ← kept (Slideshow V2)
new-arrivals-bento.tsx              ← deleted after selection
new-arrivals-carousel.tsx           ← deleted after selection
new-arrivals-section.tsx            ← deleted after selection
```

## Rules

- **Always create a switcher** — don't make the user restart the app to compare
- **Keep variations in the same directory** — co-located for easy cleanup
- **Use the same data** — all variations receive the same props
- **Don't over-variate** — 2-3 variations is enough; more causes decision paralysis
- **Clean up immediately** after selection — don't leave dead files
- **TypeScript must compile** before presenting variations
