import requests
import time
import io
import os
from PIL import Image

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
PRED_URL = "https://api.pruna.ai/v1/predictions"

PROMPT = (
    "minimal elegant lifestyle photograph, square centered composition: a single intact kraft-paper "
    "shopping bag with handles standing centered on a warm cream linen table, empty clean bag, "
    "soft diffused golden morning light casting a gentle shadow, warm cream and terracotta and ochre tones, "
    "photorealistic, high detail, lots of breathing room around the bag. No text, no logo, no watermark."
)
OUT = "public/auth-hero.jpg"
ASPECT = "1:1"
TRIES = 4


def gen(prompt, aspect):
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
        return None, f"POST {resp.status_code} {resp.text[:300]}"
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
    os.makedirs("public", exist_ok=True)
    saved = 0
    for n in range(TRIES):
        img, err = gen(PROMPT, ASPECT)
        if not img:
            print(f"try {n+1}: {err}")
            continue
        im = Image.open(io.BytesIO(img))
        print(f"try {n+1}: {im.size}")
        if n == 0:
            with open(OUT, "wb") as f:
                f.write(img)
            saved = 1
            print(f"WROTE {OUT} ({len(img)} bytes)")
        time.sleep(1)
    if not saved:
        print("FAILED: no image generated")