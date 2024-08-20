import sys
import subprocess
import os
import time
import logging
import configparser
from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QMainWindow, QMessageBox
from PyQt5.QtWebEngineWidgets import QWebEngineView

# Load configuration
config = configparser.ConfigParser()
config.read('config.ini')

# Configuration variables
RETRIES = config.getint('General', 'retries', fallback=3)
INITIAL_DELAY = config.getint('General', 'initial_delay', fallback=5)
LOG_LEVEL = config.get('General', 'log_level', fallback='INFO').upper()
ERROR_PAGE = config.get('General', 'error_page', fallback='Asset/error.html')

# Set up logging based on configuration
logging.basicConfig(filename="app.log", level=getattr(logging, LOG_LEVEL),
                    format="%(asctime)s - %(levelname)s - %(message)s")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Check if the icon file exists
        icon_path = "Asset/app.ico"
        if not os.path.exists(icon_path):
            error_message = f"Icon file not found: {icon_path}"
            logging.error(error_message)
            QMessageBox.critical(self, "Error", error_message)
            sys.exit(1)

        # Set the window title
        self.setWindowTitle("PhasmaMate")

        # Set the window icon (Windows icon)
        self.setWindowIcon(QIcon(icon_path))

        # Add WebEngineView
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("http://localhost:3000"))  # React app URL
        self.setCentralWidget(self.browser)

        # Connect signals for logging page load success/failure
        self.browser.loadFinished.connect(self.on_page_load_finished)
        self.browser.loadStarted.connect(lambda: logging.info("Web page load started."))

        # Set window size
        self.setGeometry(100, 100, 1280, 720)

        # Show the window
        self.show()

    def on_page_load_finished(self, success):
        if success:
            logging.info("Web page loaded successfully.")
        else:
            logging.error("Failed to load web page. Loading fallback page.")
            if os.path.exists(ERROR_PAGE):
                self.browser.setUrl(QUrl.fromLocalFile(os.path.abspath(ERROR_PAGE)))
            else:
                self.browser.setHtml("<h1>Unable to load the application.</h1><p>Please try again later.</p>")

# Create the QApplication instance and set the taskbar icon before the MainWindow is created
app = QApplication(sys.argv)

# Check if the icon file exists before setting the taskbar icon
icon_path = "Asset/app.ico"
if not os.path.exists(icon_path):
    error_message = f"Icon file not found: {icon_path}"
    logging.error(error_message)
    QMessageBox.critical(None, "Error", error_message)
    sys.exit(1)

app.setWindowIcon(QIcon(icon_path))  # Set the taskbar icon

# Function to start the npm command with a retry mechanism
def start_npm_with_retry(retries=RETRIES, initial_delay=INITIAL_DELAY):
    for attempt in range(retries):
        try:
            logging.info("Attempting to start npm (Attempt %d of %d)", attempt + 1, retries)
            subprocess.Popen(["npm", "start"], shell=True)
            logging.info("npm started successfully.")
            return
        except FileNotFoundError:
            error_message = "npm command not found. Please ensure Node.js is installed and npm is available in the PATH."
            logging.error(error_message)
            QMessageBox.critical(None, "Error", error_message)
            sys.exit(1)
        except Exception as e:
            logging.error("An error occurred while starting npm: %s", str(e))
            # Adjust delay dynamically: immediate retry for certain errors, longer for others
            if "network" in str(e).lower() or "port" in str(e).lower():
                delay = 2  # Shorter delay for network/port-related issues
            else:
                delay = initial_delay  # Default delay
            if attempt < retries - 1:
                logging.info("Retrying in %d seconds...", delay)
                time.sleep(delay)
            else:
                QMessageBox.critical(None, "Error", f"Failed to start npm after {retries} attempts.")
                sys.exit(1)

# Start npm with retries
start_npm_with_retry()

# Create and show the main window
window = MainWindow()

# Execute the application
sys.exit(app.exec_())
