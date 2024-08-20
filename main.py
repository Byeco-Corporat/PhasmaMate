import sys
import subprocess
from PyQt5.QtCore import QUrl
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QApplication, QMainWindow
from PyQt5.QtWebEngineWidgets import QWebEngineView

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        
        # Pencere başlığını ayarla
        self.setWindowTitle("PhasmaMate")  # Pencerenin adı

        # Pencere simgesini ayarla (Windows ikonu)
        self.setWindowIcon(QIcon("Asset/app.ico"))  # .ico formatında bir ikon dosyası

        # WebEngineView ekleyin
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("http://localhost:3000"))  # React uygulamanızın URL'si
        self.setCentralWidget(self.browser)

        # Pencere boyutlarını ayarla
        self.setGeometry(100, 100, 1280, 720)

        # Pencereyi göster
        self.show()

# npm start komutunu çalıştırıyoruz
subprocess.Popen(["npm", "start"], shell=True)

app = QApplication(sys.argv)
window = MainWindow()
sys.exit(app.exec_())
