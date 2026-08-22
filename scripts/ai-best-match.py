import requests
import os
import time
import io as io_module
from PIL import Image

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
FILES_URL = "https://api.pruna.ai/v1/files"
PRED_URL = "https://api.pruna.ai/v1/predictions"

REF_IMG = "public/products/214-classic-fountain-pen.jpg"
BASE_PROMPT = "brass fountain pen with fine nib, classic, elegant, laid flat"
OUTPUTS = [
    ("public/products/214-classic-fountain-pen-2.jpg", "same brass fountain pen with fine nib, classic, elegant, same background, same lighting, no text, no logo, no brand. Change the viewing angle to a clear angled close-up view: the pen seen at an angle, the nib in view, distinct from the reference view. Photorealistic, high detail, square composition."),
]
TRIES = 4


def gen_t2i(prompt):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image",
        "Try-Sync": "false",
    }
    payload = {"input": {"prompt": prompt, "aspect_ratio": "1:1", "disable_safety_checker": True}}
    resp = requests.post(PRED_URL, json=payload, headers=headers, timeout=120)
    if resp.status_code not in [200, 201]:
        return None, f"POST {resp.status_code}"
    data = resp.json()
    get_url = data.get("get_url")
    if get_url:
        for _ in range(60):
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


def gen_edit(ref_url, prompt):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image-edit",
        "Try-Sync": "false",
    }
    payload = {
        "input": {"prompt": prompt, "images": [ref_url], "aspect_ratio": "1:1", "disable_safety_checker": True}
    }
    resp = requests.post(PRED_URL, json=payload, headers=headers, timeout=120)
    if resp.status_code not in [200, 201]:
        return None, f"POST {resp.status_code}"
    data = resp.json()
    get_url = data.get("get_url")
    if get_url:
        for _ in range(60):
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


def upload_reference(path):
    with open(path, "rb") as f:
        resp = requests.post(FILES_URL, headers={"apikey": API_KEY}, files={"content": f}, timeout=120)
    resp.raise_for_status()
    data = resp.json()
    url = data.get("urls", {}).get("get")
    if not url:
        raise RuntimeError(f"no urls.get in upload response: {data}")
    return url


def diff_to(path, img_bytes):
    ref = Image.open(path).convert("RGB").resize((64, 64))
    cand = Image.open(io_module.BytesIO(img_bytes)).convert("RGB").resize((64, 64))
    return sum(abs(a - b) for a, b in zip(ref.getdata(), cand.getdata()) for a, b in zip(a, b)) / (64 * 64 * 3)


if __name__ == "__main__":
    os.makedirs("public/products", exist_ok=True)

    if not os.path.exists(REF_IMG):
        raise SystemExit(f"reference missing: {REF_IMG}")

    ref = upload_reference(REF_IMG)
    print(f"ref({REF_IMG}): {ref}")
    for out, prompt in OUTPUTS:
        results = []
        for n in range(TRIES):
            img, err2 = gen_edit(ref, prompt)
            if not img:
                print(f"{out} try {n+1}: {err2}")
                continue
            d = diff_to(REF_IMG, img)
            results.append((d, img))
            print(f"{out} try {n+1}: diff={d:.1f}/255")
            time.sleep(1)
        if results:
            in_range = [r for r in results if 15.0 <= r[0] <= 45.0]
            pick = in_range[0] if in_range else max(results, key=lambda x: x[0])
            best_d, best = pick
            with open(out, "wb") as f:
                f.write(best)
            print(f"KEPT {out} diff={best_d:.1f}/255 ({len(best)} bytes)")