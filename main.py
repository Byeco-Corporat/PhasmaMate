import sys
import subprocess
import os
from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QMainWindow, QMessageBox
from PyQt5.QtWebEngineWidgets import QWebEngineView

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        
        # Check if the icon file exists
        icon_path = "Asset/app.ico"
        if not os.path.exists(icon_path):
            QMessageBox.critical(self, "Error", f"Icon file not found: {icon_path}")
            sys.exit(1)

        # Set the window title
        self.setWindowTitle("PhasmaMate")

        # Set the window icon (Windows icon)
        self.setWindowIcon(QIcon(icon_path))

        # Add WebEngineView
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("http://localhost:3000"))  # React app URL
        self.setCentralWidget(self.browser)

        # Set window size
        self.setGeometry(100, 100, 1280, 720)

        # Show the window
        self.show()

# Create the QApplication instance and set the taskbar icon before the MainWindow is created
app = QApplication(sys.argv)

# Check if the icon file exists before setting the taskbar icon
icon_path = "Asset/app.ico"
if not os.path.exists(icon_path):
    QMessageBox.critical(None, "Error", f"Icon file not found: {icon_path}")
    sys.exit(1)

app.setWindowIcon(QIcon(icon_path))  # Set the taskbar icon

# Start the npm command with error handling
try:
    subprocess.Popen(["npm", "start"], shell=True)
except FileNotFoundError:
    QMessageBox.critical(None, "Error", "npm command not found. Please ensure Node.js is installed and npm is available in the PATH.")
    sys.exit(1)
except Exception as e:
    QMessageBox.critical(None, "Error", f"An error occurred while starting npm: {str(e)}")
    sys.exit(1)

# Create and show the main window
window = MainWindow()

# Execute the application
sys.exit(app.exec_())
