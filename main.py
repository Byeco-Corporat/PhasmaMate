import sys
import subprocess
import os
import time
import logging
import configparser
import smtplib
import traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from PyQt5.QtCore import QUrl, QTimer, QFileInfo, QPoint, Qt
from PyQt5.QtGui import QIcon, QMouseEvent
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
EMAIL_ON_FAILURE = config.get('Notifications', 'email_on_failure', fallback='').strip()
EMAIL_SERVER = config.get('Notifications', 'email_server', fallback='smtp.gmail.com')
EMAIL_PORT = config.getint('Notifications', 'email_port', fallback=587)

# Sensitive data from environment variables
EMAIL_USERNAME = os.environ.get('EMAIL_USERNAME', '')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', '')

# Set up logging based on configuration
logging.basicConfig(filename="app.log", level=getattr(logging, LOG_LEVEL),
                    format="%(asctime)s - %(levelname)s - %(message)s")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Variables to handle dragging
        self._is_dragging = False
        self._drag_position = QPoint()

        # Frameless window
        self.setWindowFlags(self.windowFlags() | Qt.FramelessWindowHint)

        # Check if the icon file exists
        icon_path = "Asset/app.ico"
        if not os.path.exists(icon_path):
            error_message = f"Icon file not found: {icon_path}"
            logging.error(error_message)
            notify_failure(error_message)
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

        # Timer to watch for changes in config.ini
        self.config_timer = QTimer(self)
        self.config_timer.timeout.connect(self.check_config_update)
        self.config_timer.start(5000)  # Check every 5 seconds
        self.last_modified_time = QFileInfo("config.ini").lastModified()

    def check_config_update(self):
        try:
            current_modified_time = QFileInfo("config.ini").lastModified()
            if current_modified_time > self.last_modified_time:
                self.last_modified_time = current_modified_time
                self.reload_configuration()
        except Exception as e:
            error_message = f"Failed to check/update configuration: {str(e)}"
            logging.error(error_message)
            notify_failure(error_message)

    def reload_configuration(self):
        try:
            logging.info("Reloading configuration from config.ini")
            config.read('config.ini')
            global RETRIES, INITIAL_DELAY, LOG_LEVEL, ERROR_PAGE, EMAIL_ON_FAILURE
            RETRIES = config.getint('General', 'retries', fallback=3)
            INITIAL_DELAY = config.getint('General', 'initial_delay', fallback=5)
            LOG_LEVEL = config.get('General', 'log_level', fallback='INFO').upper()
            ERROR_PAGE = config.get('General', 'error_page', fallback='Asset/error.html')
            EMAIL_ON_FAILURE = config.get('Notifications', 'email_on_failure', fallback='').strip()
            logging.getLogger().setLevel(getattr(logging, LOG_LEVEL))
            logging.info("Configuration reloaded successfully.")
        except Exception as e:
            error_message = f"Failed to reload configuration: {str(e)}"
            logging.error(error_message)
            notify_failure(error_message)

    def on_page_load_finished(self, success):
        if success:
            logging.info("Web page loaded successfully.")
        else:
            error_message = "Failed to load web page. Loading fallback page."
            logging.error(error_message)
            notify_failure(error_message)
            
            if os.path.exists(ERROR_PAGE):
                self.browser.setUrl(QUrl.fromLocalFile(os.path.abspath(ERROR_PAGE)))
            else:
                error_html = """
                <h1>Unable to load the application.</h1>
                <p>Please try again later.</p>
                <p><strong>Possible Reasons:</strong></p>
                <ul>
                    <li>The React application is not running.</li>
                    <li>Network issues.</li>
                    <li>Port 3000 is not accessible or in use by another process.</li>
                    <li>Check your npm and React configuration.</li>
                </ul>
                <p><strong>Steps to Resolve:</strong></p>
                <ol>
                    <li>Ensure the React application is started with <code>npm start</code>.</li>
                    <li>Check for any error messages in the console or log files.</li>
                    <li>Restart the application.</li>
                </ol>
                """
                self.browser.setHtml(error_html)

    def mousePressEvent(self, event: QMouseEvent):
        if event.button() == Qt.LeftButton:
            self._is_dragging = True
            self._drag_position = event.globalPos() - self.frameGeometry().topLeft()
            event.accept()

    def mouseMoveEvent(self, event: QMouseEvent):
        if self._is_dragging:
            self.move(event.globalPos() - self._drag_position)
            event.accept()

    def mouseReleaseEvent(self, event: QMouseEvent):
        if event.button() == Qt.LeftButton:
            self._is_dragging = False

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
            notify_failure(error_message)
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
                error_message = f"Failed to start npm after {retries} attempts."
                notify_failure(error_message)
                QMessageBox.critical(None, "Error", error_message)
                sys.exit(1)

def notify_failure(message):
    if EMAIL_ON_FAILURE and EMAIL_USERNAME and EMAIL_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg['From'] = EMAIL_USERNAME
            msg['To'] = EMAIL_ON_FAILURE
            msg['Subject'] = "Application Failure Notification"
            body = f"The following error occurred:\n\n{message}\n\nLog:\n{traceback.format_exc()}"
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT)
            server.starttls()
            server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
            text = msg.as_string()
            server.sendmail(EMAIL_USERNAME, EMAIL_ON_FAILURE, text)
            server.quit()

            logging.info("Failure notification sent to %s", EMAIL_ON_FAILURE)
        except Exception as e:
            logging.error("Failed to send failure notification: %s", str(e))

# Create the QApplication instance and set the taskbar icon before the MainWindow is created
app = QApplication(sys.argv)

# Check if the icon file exists before setting the taskbar icon
icon_path = "Asset/app.ico"
if not os.path.exists(icon_path):
    error_message = f"Icon file not found: {icon_path}"
    logging.error(error_message)
    notify_failure(error_message)
    QMessageBox.critical(None, "Error", error_message)
    sys.exit(1)

app.setWindowIcon(QIcon(icon_path))  # Set the taskbar icon

# Start npm with retries
start_npm_with_retry()

# Create and show the main window
window = MainWindow()

# Execute the application
sys.exit(app.exec_())
