import requests
import os
import time

API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"
FILES_URL = "https://api.pruna.ai/v1/files"
PRED_URL = "https://api.pruna.ai/v1/predictions"

MAIN = "public/products/196-smart-watch.jpg"

VARIANTS = [
    (
        "public/products/196-smart-watch-2.jpg",
        "keep the exact same modern smartwatch with black strap and bright watch face showing fitness stats, same product, same background, same lighting, same shadows as the reference image. Only change the positioning of the watch slightly: a slightly different angle and placement. Remove any text, logos, brand names or words from the watch face and product. Clean minimal watch face with no text, no brand, no letters, no numbers. Photorealistic, high detail, square composition",
    ),
]


def upload_reference(path):
    headers = {"apikey": API_KEY}
    with open(path, "rb") as f:
        resp = requests.post(
            FILES_URL, headers=headers, files={"content": f}, timeout=120
        )
    resp.raise_for_status()
    data = resp.json()
    url = data.get("urls", {}).get("get")
    if not url:
        raise RuntimeError(f"no urls.get in upload response: {data}")
    return url


def generate_variant(ref_url, prompt, output_filename):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": API_KEY,
        "Model": "p-image-edit",
        "Try-Sync": "false",
    }
    payload = {
        "input": {
            "prompt": prompt,
            "images": [ref_url],
            "aspect_ratio": "1:1",
            "disable_safety_checker": True,
        }
    }
    resp = requests.post(PRED_URL, json=payload, headers=headers, timeout=120)
    if resp.status_code not in [200, 201]:
        print(f"ERR {output_filename} status={resp.status_code} {resp.text[:300]}")
        return False
    data = resp.json()
    get_url = data.get("get_url")
    if get_url:
        for _ in range(60):
            time.sleep(3)
            status = requests.get(get_url, headers={"apikey": API_KEY}, timeout=30).json()
            st = status.get("status", "")
            image_url = status.get("generation_url")
            if st in ["succeeded", "SUCCEEDED", "completed", "COMPLETED", "done", "Done"] or image_url:
                if image_url:
                    img = requests.get(image_url).content
                    with open(output_filename, "wb") as f:
                        f.write(img)
                    print(f"OK {output_filename} ({len(img)} bytes)")
                    return True
                print(f"STATUS {output_filename}: {status}")
                return False
            if st in ["failed", "FAILED", "error", "ERROR", "canceled"]:
                print(f"FAILED {output_filename}: {status}")
                return False
        print(f"TIMEOUT {output_filename}")
        return False
    image_url = data.get("generation_url")
    if image_url:
        img = requests.get(image_url).content
        with open(output_filename, "wb") as f:
            f.write(img)
        print(f"OK {output_filename} ({len(img)} bytes)")
        return True
    print(f"NOURL {output_filename}: {data}")
    return False


if __name__ == "__main__":
    os.makedirs("public/products", exist_ok=True)
    ref = upload_reference(MAIN)
    print(f"ref: {ref}")
    for out, prompt in VARIANTS:
        ok = generate_variant(ref, prompt, out)
        time.sleep(1)
        if not ok:
            print(f"FAILED: {out}")