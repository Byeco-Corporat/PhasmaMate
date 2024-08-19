import sys
import time
from PyQt5.QtCore import QUrl
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from pypresence import Presence

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set up Discord Rich Presence
        self.client_id = '1275166330579849247'  # Replace with your Discord app's client ID
        self.rpc = Presence(self.client_id)
        self.rpc.connect()

        # Update Discord Rich Presence
        self.update_discord_presence()

        # Initialize the main widget
        self.browser = QWebEngineView()

        # Load the specified URL (React app)
        self.browser.setUrl(QUrl("http://localhost:3000"))

        # Set up the layout and central widget
        self.central_widget = QWidget()
        self.layout = QVBoxLayout()
        self.layout.addWidget(self.browser)
        self.central_widget.setLayout(self.layout)
        self.setCentralWidget(self.central_widget)

        # Set window properties
        self.setWindowTitle("My React App in PyQt")
        self.setGeometry(100, 100, 1200, 800)  # Set initial window size

        # Show the main window
        self.show()

    def update_discord_presence(self):
        # Set the Rich Presence details
        self.rpc.update(
            details="Using the PyQt5 app",
            state="Browsing React App",
            large_image="ekran_g_r_nt_s_2024-08-16_110522",  # Replace with your image key from Discord Developer Portal
            large_text="React Application",
            start=time.time()
        )

    def closeEvent(self, event):
        # Clear Rich Presence on exit
        self.rpc.clear()
        event.accept()  # Allows the window to close

if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = MainWindow()
    sys.exit(app.exec_())

try:
    self.rpc.connect()
    self.update_discord_presence()
except Exception as e:
    print(f"Failed to connect to Discord: {e}")
