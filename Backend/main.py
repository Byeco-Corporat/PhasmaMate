import sys
import time
import subprocess
import requests
from PyQt5.QtWidgets import QApplication, QMainWindow
from pypresence import Presence
import tkinter as tk
from tkinter import Label
from PIL import Image, ImageTk
import custom_presence
custom_presence.run_presence()
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set up Discord Rich Presence
        self.client_id = '1275166330579849247'
        self.rpc = Presence(self.client_id)

        try:
            self.rpc.connect()
            self.update_discord_presence()
        except Exception as e:
            print(f"Failed to connect to Discord: {e}")

        self.setWindowTitle("My React App in Electron")
        self.setGeometry(100, 100, 800, 600)
        self.show()

        # Start the Electron application after ensuring React server is running
        self.ensure_react_server_running()
        self.start_electron()

        # Start the custom-presence.py script
        self.start_custom_presence()

    def update_discord_presence(self):
        self.rpc.update(
            details="Using the PyQt5 app",
            state="Browsing React App",
            large_image="ekran_g_r_nt_s_2024-08-16_110522",
            large_text="React Application",
            start=time.time()
        )

    def closeEvent(self, event):
        self.rpc.clear()
        event.accept()

    def ensure_react_server_running(self):
        url = "http://localhost:3000"
        timeout = 60  # Wait up to 60 seconds
        for _ in range(timeout):
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    print("React server is running.")
                    return
            except requests.ConnectionError:
                pass
            time.sleep(1)  # Wait 1 second before retrying
        print(f"React server did not start within {timeout} seconds.")
        sys.exit(1)

    def start_electron(self):
        try:
            subprocess.Popen(['npm', 'run', 'start-electron'])  # Start Electron app
        except Exception as e:
            print(f"Failed to start Electron: {e}")

    def start_custom_presence(self):
        try:
            subprocess.Popen([sys.executable, 'custom-presence.py'])
            print("Started custom-presence.py successfully.")
        except Exception as e:
            print(f"Failed to start custom-presence.py: {e}")

def show_toast():
    toast = tk.Tk()
    toast.title("PhasmaMate Notification")
    toast.geometry("300x100")
    toast.overrideredirect(True)
    toast.attributes("-topmost", True)

    check_icon_path = "root/Asset/check.png"
    image = Image.open(check_icon_path)
    image = image.resize((32, 32), Image.ANTIALIAS)
    check_icon = ImageTk.PhotoImage(image)

    label = Label(toast, image=check_icon, text="PhasmaMate başarılı şekilde açıldı.", compound='left', padx=10)
    label.pack(pady=20)

    toast.after(3000, toast.destroy)
    toast.mainloop()

if __name__ == '__main__':
    # Start the React server manually
    subprocess.Popen(['npm', 'start'])

    # Show the toast when the program starts
    show_toast()

    # Create the PyQt application and main window
    app = QApplication(sys.argv)
    window = MainWindow()

    # Run the application loop
    sys.exit(app.exec_())
