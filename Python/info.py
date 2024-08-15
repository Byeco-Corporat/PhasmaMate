import tkinter as tk
from tkinter import font

def create_overlay():
    # Pencere oluşturma
    overlay = tk.Tk()
    overlay.title("Phasmophobia Overlay")
    
    # Pencere boyutları ve konumu ayarla (sağ üst köşe)
    overlay.geometry('300x150+{}+{}'.format(overlay.winfo_screenwidth() - 320, 0))  # Ekranın sağ üst köşesinde yer alacak
    overlay.overrideredirect(True)  # Başlık çubuğu ve kenar boşluklarını kaldır
    overlay.attributes('-topmost', True)  # Pencerenin her zaman üstte olmasını sağlar

    # Arka plan rengini şeffaf yap
    overlay.attributes('-transparentcolor', overlay['bg'])  # Pencerenin arka plan rengini şeffaf yapar

    # Yazı tipini ayarla
    custom_font = font.Font(family='Arial', size=14)

    # Akıl sağlığı
    mental_health_label = tk.Label(overlay, text="Byeco & onayB09", font=custom_font, fg='white', bg=overlay['bg'])
    mental_health_label.pack(anchor='n', pady=(20, 0))  # Pencerenin üst kısmında yerleştirir

    # Lanetli Eşya 
    # cursed_items_label = tk.Label(overlay, text="Cursed Items: Unknown", font=custom_font, fg='white', bg=overlay['bg'])
    # cursed_items_label.pack(anchor='n', pady=(10, 0))  # İkinci metni ekler

    # Hayalet tahmin
    # cursed_items_label = tk.Label(overlay, text="Cursed Items: Unknown", font=custom_font, fg='white', bg=overlay['bg'])
    # cursed_items_label.pack(anchor='n', pady=(10, 0))  # İkinci metni ekler

    # Pencereyi göster
    overlay.mainloop()

if __name__ == "__main__":
    create_overlay()
