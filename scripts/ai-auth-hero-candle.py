import requests
import time
import io
import os
from PIL import Image

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
FILES_URL = "https://api.pruna.ai/v1/files"
PRED_URL = "https://api.pruna.ai/v1/predictions"

REF = "public/auth-hero.jpg"
OUT = "public/auth-hero.jpg"
PROMPT = (
    "make the soy candle in the glass jar smaller so it no longer dominates the scene, "
    "scale it down to be in proportion with the other products inside the bag, "
    "keep everything else exactly the same: the same kraft shopping bag, the same terracotta ceramic plant pot, "
    "the same rolled woven throw blanket, the same trio of lip balms, same cream linen background, "
    "same lighting, same square centered composition. Photorealistic, high detail. No text, no logo, no watermark."
)
ASPECT = "1:1"
TRIES = 4


def upload_reference(path):
    with open(path, "rb") as f:
        resp = requests.post(FILES_URL, headers={"apikey": API_KEY}, files={"content": f}, timeout=120)
    resp.raise_for_status()
    data = resp.json()
    url = data.get("urls", {}).get("get")
    if not url:
        raise RuntimeError(f"no urls.get: {data}")
    return url


def gen_edit(ref_url, prompt, aspect):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image-edit",
        "Try-Sync": "false",
    }
    payload = {"input": {"prompt": prompt, "images": [ref_url], "aspect_ratio": aspect, "disable_safety_checker": True}}
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
    os.makedirs("public", exist_ok=True)
    ref = upload_reference(REF)
    print(f"ref: {ref}")
    saved = 0
    for n in range(TRIES):
        img, err = gen_edit(ref, PROMPT, ASPECT)
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