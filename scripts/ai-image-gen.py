import requests
import sys
import os

def generate(prompt_text, output_filename, aspect_ratio="1:1"):
    url = "https://api.pruna.ai/v1/predictions"
    PRUNA_API_KEY = "pru_4zFhFMCcNHfq1RDzTJlivSa-TaTByYV3"

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": PRUNA_API_KEY,
        "Model": "p-image",
        "Try-Sync": "true",
    }

    payload = {
        "input": {
            "prompt": prompt_text,
            "aspect_ratio": aspect_ratio,
            "disable_safety_checker": True,
        }
    }

    print("Generating:", output_filename)
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=90)
        if response.status_code in [200, 201]:
            response_data = response.json()
            image_url = response_data.get("generation_url")
            if image_url:
                img_data = requests.get(image_url).content
                with open(output_filename, "wb") as f:
                    f.write(img_data)
                print("Saved:", output_filename, len(img_data), "bytes")
            else:
                print("No image URL. Payload:", response_data)
        else:
            print("API Error", response.status_code, response.text[:300])
    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    out = sys.argv[2] if len(sys.argv) > 2 else "test-product.jpg"
    prompt = sys.argv[1] if len(sys.argv) > 1 else "a test product on a plain background"
    generate(prompt, out)