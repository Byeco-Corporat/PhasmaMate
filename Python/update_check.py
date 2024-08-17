import requests
import zipfile
import io
import os

# Güncelleme kontrolü için URL
UPDATE_URL = "https://api.github.com/repos/byeco/PhasmaMate/releases/latest"
DOWNLOAD_URL_KEY = "browser_download_url"  # GitHub için doğru anahtar

DOWNLOAD_DIR = "updates"

def check_for_update():
    response = requests.get(UPDATE_URL)
    response.raise_for_status()
    latest_release = response.json()
    download_url = latest_release['assets'][0][DOWNLOAD_URL_KEY]

    return download_url

def download_and_extract(update_url):
    response = requests.get(update_url)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
        if not os.path.exists(DOWNLOAD_DIR):
            os.makedirs(DOWNLOAD_DIR)
        zip_ref.extractall(DOWNLOAD_DIR)

def main():
    try:
        print("Checking for updates...")
        update_url = check_for_update()
        print(f"Update available: {update_url}")
        print("Downloading and extracting update...")
        download_and_extract(update_url)
        print("Update downloaded and extracted.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
