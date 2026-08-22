import requests
import time
import os

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
PRED_URL = "https://api.pruna.ai/v1/predictions"

PROMPT = "minimal elegant product photography on a warm cream linen background: a natural soy candle in a glass jar with wooden lid standing next to a small hand-painted terracotta ceramic plant pot with a green plant, soft diffused warm lighting, gentle shadows, earthy terracotta and ochre tones, photorealistic, high detail, portrait composition. Only these two items. No toothbrush, no other objects, no text, no logo."
OUT = "public/hero-curation.jpg"


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
    best = None
    best_diff = None
    for n in range(4):
        img, err = gen(PROMPT, "3:4")
        if not img:
            print(f"try {n+1}: {err}")
            continue
        from PIL import Image
        import io as io_module

        im = Image.open(io_module.BytesIO(img))
        print(f"try {n+1}: generated {im.size}")
        if best is None:
            best = img
        time.sleep(1)
    with open(OUT, "wb") as f:
        f.write(best)
    print(f"WROTE {OUT} ({len(best)} bytes)")