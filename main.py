from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont
import sys

class OverlayWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.initUI()
        self.update_data()  # Veriyi güncellemek için çağır

    def initUI(self):
        self.setWindowTitle('Phasmophobia Overlay')
        self.setWindowFlags(Qt.WindowStaysOnTopHint | Qt.FramelessWindowHint | Qt.WindowTransparentForInput)
        self.setAttribute(Qt.WA_TranslucentBackground)
        
        # Ekran boyutlarını al
        screen = QApplication.primaryScreen().availableGeometry()
        # Pencere boyutlarını belirle
        window_width, window_height = 200, 100
        # Pencereyi sağ üst köşeye yerleştir
        self.setGeometry(screen.width() - window_width, 0, window_width, window_height)

        layout = QVBoxLayout()

        self.mental_health_label = QLabel('Mental Health: 100%', self)
        self.mental_health_label.setFont(QFont('Arial', 14))
        self.mental_health_label.setStyleSheet('color: white;')

        layout.addWidget(self.mental_health_label)

        self.setLayout(layout)

    def update_data(self):
        try:
            # Phasmophobia'dan veri okuma
            with open('path_to_phasmophobia_data_file.txt', 'r') as file:
                data = file.read()
                # Veriyi işleme ve güncelleme
                self.mental_health_label.setText(f'Mental Health: {data}')
        except FileNotFoundError:
            self.mental_health_label.setText('Data file not found')

if __name__ == '__main__':
    app = QApplication(sys.argv)
    overlay = OverlayWindow()
    overlay.show()
    sys.exit(app.exec_())
