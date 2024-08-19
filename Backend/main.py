import sys
from PyQt5.QtCore import QUrl
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("http://localhost:3000"))  # React uygulamanızın URL'si
        self.setCentralWidget(self.browser)
        self.show()

app = QApplication(sys.argv)
window = MainWindow()
sys.exit(app.exec_())
