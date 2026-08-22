import requests
import os
import time

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
URL = "https://api.pruna.ai/v1/predictions"

STYLE = (
    "professional e-commerce product photography, single product centered on a "
    "warm cream studio background, soft diffused lighting, gentle shadow, "
    "photorealistic, high detail, square composition"
)

PRODUCTS = [
    ("193-wireless-bluetooth-headphones", "premium over-ear wireless Bluetooth headphones in matte black, active noise cancelling, cushioned earcups"),
    ("194-mechanical-keyboard-rgb", "compact mechanical keyboard with colorful per-key RGB backlighting, black keycaps"),
    ("195-usb-c-hub", "silver aluminum USB-C hub with multiple ports: HDMI, USB-A, SD card slot, connected cables"),
    ("196-smart-watch", "modern smartwatch with black strap and bright watch face showing fitness stats"),
    ("197-canvas-tote-bag", "natural cotton canvas tote bag, minimalist, empty, standing upright"),
    ("198-denim-jacket", "classic blue denim jacket on display, button front, denim texture"),
    ("199-urban-running-sneakers", "lightweight urban running sneaker in white and gray with knit upper"),
    ("200-leather-bifold-wallet", "brown genuine leather bifold wallet, closed, stitched edges"),
    ("201-ceramic-plant-pot-set", "set of three small hand-painted ceramic plant pots in earthy terracotta tones"),
    ("202-bamboo-desk-organizer", "natural bamboo desk organizer with compartments for pens, phone and notes"),
    ("203-soy-candle", "scented soy candle in a glass jar with wooden lid, cream colored wax"),
    ("204-woven-throw-blanket", "soft woven throw blanket in neutral beige and cream tones, neatly folded"),
    ("205-performance-running-shoes", "performance running shoe in bold blue and black with knit upper"),
    ("206-yoga-mat", "extra thick dark teal yoga mat rolled with strap, alignment lines visible"),
    ("207-insulated-water-bottle", "stainless steel insulated water bottle in matte forest green"),
    ("208-adjustable-dumbbells", "pair of adjustable dumbbells with black weight plates on a stand"),
    ("209-bamboo-toothbrush-set", "set of four biodegradable bamboo toothbrushes with natural bristles"),
    ("210-beeswax-food-wraps", "set of three reusable beeswax food wraps in honey and cream patterns"),
    ("211-lip-balm-trio", "set of three natural lip balm tubes in kraft packaging with herbal labels"),
    ("212-compostable-phone-case", "plant-based compostable phone case in sage green for a smartphone"),
    ("213-notebook-set", "set of three linen-bound hardcover notebooks stacked, in neutral colors"),
    ("214-classic-fountain-pen", "brass fountain pen with fine nib, classic, elegant, laid flat"),
    ("215-weekly-planner", "open weekly planner with durable cover, ribbon bookmark, clean layout"),
    ("216-reading-journal", "hardcover reading journal with pages for notes, a small bookmark"),
]


def generate(prompt, output_filename):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image",
        "Try-Sync": "true",
    }
    payload = {
        "input": {
            "prompt": f"{prompt}. {STYLE}",
            "aspect_ratio": "1:1",
            "disable_safety_checker": True,
        }
    }
    try:
        response = requests.post(URL, json=payload, headers=headers, timeout=120)
        if response.status_code in [200, 201]:
            data = response.json()
            image_url = data.get("generation_url")
            if image_url:
                img_data = requests.get(image_url).content
                with open(output_filename, "wb") as f:
                    f.write(img_data)
                print(f"OK {output_filename} ({len(img_data)} bytes)")
                return True
            else:
                print(f"NOURL {output_filename}: {data}")
        else:
            print(f"ERR {output_filename} status={response.status_code} {response.text[:200]}")
    except Exception as e:
        print(f"EXC {output_filename}: {e}")
    return False


if __name__ == "__main__":
    os.makedirs("public/products", exist_ok=True)
    only = os.environ.get("ONLY", "")
    for slug, prompt in PRODUCTS:
        if only and only not in slug:
            continue
        out = os.path.join("public", "products", f"{slug}.jpg")
        if os.path.exists(out):
            print(f"SKIP {slug} (exists)")
            continue
        ok = generate(prompt, out)
        time.sleep(1)