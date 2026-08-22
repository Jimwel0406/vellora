import requests
import time
import os
import io as io_module
from PIL import Image

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
PRED_URL = "https://api.pruna.ai/v1/predictions"

STORES = [
    ("techhub", "minimal modern electronics brand mark for a tech store called TechHub, a sleek stylized chip or circuit motif, dark charcoal and green accent, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
    ("stylenest", "minimal elegant fashion brand mark for a clothing store called StyleNest, a stylized clothing hanger or fold motif, warm beige and charcoal tones, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
    ("homecraft", "minimal handcrafted home decor brand mark for a store called HomeCraft, a stylized house and hand motif, terracotta and clay tones, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
    ("fitgear", "minimal sport and fitness brand mark for a store called FitGear, a stylized lightning or dumbbell motif, bold charcoal and teal accents, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
    ("greenleaf", "minimal eco-friendly brand mark for a store called GreenLeaf, a stylized leaf motif, forest green and ochre tones, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
    ("booknook", "minimal cozy bookstore brand mark for a store called BookNook, a stylized open book motif, warm brown and cream tones, flat vector logo style on a solid warm cream background, centered, photorealistic render of a logo badge, no text, no letters"),
]


def gen(prompt, aspect="1:1"):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image",
        "Try-Sync": "false",
    }
    payload = {"input": {"prompt": prompt, "aspect_ratio": aspect, "disable_safety_checker": True}}
    resp = requests.post(PRED_URL, json=payload, headers=headers, timeout=120)
    if resp.status_code not in [200, 201]:
        return None, f"POST {resp.status_code} {resp.text[:200]}"
    data = resp.json()
    get_url = data.get("get_url")
    if get_url:
        for _ in range(90):
            time.sleep(3)
            status = requests.get(get_url, headers={"apikey": API_KEY}, timeout=30).json()
            image_url = status.get("generation_url")
            if image_url:
                return requests.get(image_url).content, "ok"
            if status.get("status") in ["failed", "FAILED", "error", "ERROR", "canceled"]:
                return None, f"job failed: {status}"
        return None, "timeout"
    image_url = data.get("generation_url")
    if image_url:
        return requests.get(image_url).content, "ok"
    return None, f"no url: {data}"


if __name__ == "__main__":
    os.makedirs("public/stores", exist_ok=True)
    for slug, prompt in STORES:
        out = os.path.join("public", "stores", f"{slug}.jpg")
        ok = False
        for n in range(4):
            img, err = gen(prompt)
            if not img:
                print(f"{slug} try {n+1}: {err}")
                continue
            im = Image.open(io_module.BytesIO(img)).convert("RGB")
            im.thumbnail((400, 400), Image.LANCZOS)
            im.save(out, quality=90)
            print(f"OK {out} {im.size}")
            ok = True
            break
        if not ok:
            print(f"FAILED {slug}")
        time.sleep(1)