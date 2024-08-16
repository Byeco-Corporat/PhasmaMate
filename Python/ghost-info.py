import tkinter as tk
from tkinter import font

def create_interactive_overlay():
    def toggle_panel():
        # Panelin açılıp kapanmasını kontrol et
        if panel.winfo_ismapped():
            panel.place_forget()  # Paneli gizle
            toggle_button.config(text="☰")  # Buton metnini değiştir
        else:
            panel.place(x=overlay.winfo_width() - 300, y=0)  # Paneli göster
            toggle_button.config(text="✖")  # Buton metnini değiştir

    def submit_answer(answer):
        # Yanıtı işleme ve veriyi gösterme
        if answer == "yes":
            display_data("Ghost: x1, x2")  # Örnek veri
        elif answer == "no":
            display_data("Ghost: x1")  # Örnek veri
        else:
            display_data("No Data")  # 'Bilmiyorum' için örnek veri

    def display_data(data):
        # Veriyi göster
        data_label.config(text=data)

    # Ana pencereyi oluştur
    overlay = tk.Tk()
    overlay.title("Phasmophobia Interactive Overlay")
    
    # Pencere boyutları ve konumunu ayarla
    overlay.geometry('350x200+{}+{}'.format(overlay.winfo_screenwidth() - 350, 0))
    overlay.overrideredirect(True)  # Başlık çubuğunu kaldır
    overlay.attributes('-topmost', True)  # Pencerenin her zaman üstte olmasını sağlar
    overlay.attributes('-transparentcolor', overlay['bg'])  # Arka planı şeffaf yap

    # Yazı tipi ayarla
    custom_font = font.Font(family='Arial', size=12)

    # Paneli oluştur (koyu renkli arka plan)
    panel = tk.Frame(overlay, bg='black', width=300, height=overlay.winfo_height(), highlightthickness=0)

    # Panel içinde bir canvas oluştur
    canvas = tk.Canvas(panel, bg='black', highlightthickness=0)
    scroll_y = tk.Scrollbar(panel, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg='black')

    # Kaydırma bölgesini ayarla
    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.pack(side="left", fill="both", expand=True)
    scroll_y.pack(side="right", fill="y")
    canvas.configure(yscrollcommand=scroll_y.set)

    # Veriyi göstermek için etiket oluştur (Hayalet bilgisi)
    data_label = tk.Label(overlay, text="", font=custom_font, fg='white', bg='black', width=30, anchor='w')
    data_label.pack(pady=(10, 0))

    # Sorular ve butonları panel içine ekle
    questions = [
        "Do you see any ghost?",
        "Is the ghost active?",
        "Have you witnessed any ghost events?"
    ]
    
    for question in questions:
        # Soru etiketi
        label = tk.Label(scrollable_frame, text=question, font=custom_font, fg='white', bg='black')
        label.pack(pady=5, padx=10, anchor='w')
        
        # Yanıt butonları
        buttons_frame = tk.Frame(scrollable_frame, bg='black')
        buttons_frame.pack(pady=5, padx=10, anchor='w')

        yes_button = tk.Button(buttons_frame, text="Yes", command=lambda q=question: submit_answer("yes"), font=custom_font, bg='black', fg='white')
        yes_button.pack(side='left', padx=5)
        
        no_button = tk.Button(buttons_frame, text="No", command=lambda q=question: submit_answer("no"), font=custom_font, bg='black', fg='white')
        no_button.pack(side='left', padx=5)
        
        idk_button = tk.Button(buttons_frame, text="I don't know", command=lambda q=question: submit_answer("idk"), font=custom_font, bg='black', fg='white')
        idk_button.pack(side='left', padx=5)

    # Paneli açma/kapama butonunu oluştur
    toggle_button = tk.Button(overlay, text="✖", command=toggle_panel, font=custom_font, bg='black', fg='white', width=2)
    toggle_button.place(x=overlay.winfo_width() - 30, y=0)

    # Başlangıçta paneli göster
    panel.place(x=overlay.winfo_width() - 300, y=0)

    # Tkinter olay döngüsünü başlat
    overlay.mainloop()

if __name__ == "__main__":
    create_interactive_overlay()
