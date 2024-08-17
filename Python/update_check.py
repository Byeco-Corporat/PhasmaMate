from flask import Flask, jsonify, request
import requests
import os
import zipfile

app = Flask(__name__)

REPO_OWNER = "byeco"
REPO_NAME = "PhasmaMate"
RELEASES_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/releases"
LOCAL_VERSION_FILE = "current_version.txt"
LOCAL_DOWNLOADS_DIR = "downloads"

def read_current_version():
    if os.path.exists(LOCAL_VERSION_FILE):
        with open(LOCAL_VERSION_FILE, 'r') as file:
            return file.read().strip()
    return None

def write_current_version(version):
    with open(LOCAL_VERSION_FILE, 'w') as file:
        file.write(version)

def get_latest_release():
    response = requests.get(RELEASES_URL)
    response.raise_for_status()
    releases = response.json()
    
    if releases:
        latest_release = releases[0]
        return latest_release
    return None

@app.route('/check-for-update', methods=['GET'])
def check_for_update():
    latest_release = get_latest_release()
    
    if latest_release:
        latest_version = latest_release['name']
        current_version = read_current_version()

        if current_version != latest_version:
            return jsonify({
                'updateAvailable': True,
                'latestVersion': latest_version,
                'assets': [{'name': asset['name'], 'downloadUrl': asset['browser_download_url']} for asset in latest_release['assets']]
            })
        else:
            return jsonify({'updateAvailable': False})
    else:
        return jsonify({'updateAvailable': False}), 404

@app.route('/download', methods=['GET'])
def download_file():
    download_url = request.args.get('url')
    file_name = download_url.split('/')[-1]
    file_path = os.path.join(LOCAL_DOWNLOADS_DIR, file_name)

    response = requests.get(download_url)
    response.raise_for_status()

    with open(file_path, 'wb') as file:
        file.write(response.content)
    
    return jsonify({'success': True, 'fileName': file_name})

@app.route('/extract', methods=['GET'])
def extract_zip():
    file_name = request.args.get('file')
    file_path = os.path.join(LOCAL_DOWNLOADS_DIR, file_name)

    if file_name.endswith('.zip'):
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(LOCAL_DOWNLOADS_DIR)
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'error': 'Not a zip file'}), 400

if __name__ == "__main__":
    if not os.path.exists(LOCAL_DOWNLOADS_DIR):
        os.makedirs(LOCAL_DOWNLOADS_DIR)
    app.run(debug=True)
