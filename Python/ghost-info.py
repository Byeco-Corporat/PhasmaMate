import tkinter as tk
from tkinter import messagebox

# Sorular ve seçenekler
questions = [
    {"question": "Normal speed when players undetected", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Speedup during line-of-sight", "options": ["unknown", "gradual", "sudden", "none"]},
    {"question": "Sudden speedup near active electronics", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Blink duration during hunt", "options": ["unknown", "short", "normal", "long"]},
    {"question": "Shapeshifts during hunts", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Footstep volume", "options": ["unknown", "quiet (audible within 12 m)", "normal (audible within 20 m)"]},
    {"question": "Hunt sanity level", "options": ["0%"]},
    {"question": "Targets a specific player", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can always find the player", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Player-held electronics detection range", "options": ["unknown", "normal (7.5 m)", "close (2.5 m)"]},
    {"question": "Voice detection range", "options": ["unknown", "normal (9 m)", "close (2.5 m)"]},
    {"question": "Electronic interference range", "options": ["unknown", "normal (10 m)", "long (15 m)"]},
    {"question": "Always throws things every ½ second during hunt", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Shows its breath during hunts if breaker is off", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Incense blindness duration", "options": ["unknown", "normal (6 sec)", "long (12 sec)"]},
    {"question": "Incense hunt suspension", "options": ["≤ 180 sec"]},
    {"question": "Disappears when a photo is taken during a ghost event", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can do “airball” ghost event", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can appear shadow form during a cursed ghost event", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Steps in salt", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Seems to follow a player", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can change favourite room", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can see interaction with DOTS projector with the naked eye", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Blows out flames instead of hunting", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Hunts after blowing out 3 flames", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Screams into the parabolic microphone", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can turn off the fuse box", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can turn on the fuse box", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can turn on lights, TVs, computers", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can perform a multi-throw", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Sometimes hides ultraviolet", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can leave unusual ultraviolet evidence", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can leave favourite room while incensed", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Can initiate a hunt from the room the player is in", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Suddenly changes abilities", "options": ["unknown", "confirmed", "ruled out"]},
    {"question": "Ages", "options": ["unknown", "confirmed", "ruled out"]}
]

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Ghost Investigation")
        self.geometry("800x600")
        
        self.current_question_index = 0
        self.create_widgets()
        self.update_question()

    def create_widgets(self):
        # Soru metni
        self.question_label = tk.Label(self, text="", wraplength=750)
        self.question_label.pack(pady=10)
        
        # Seçenek düğmeleri
        self.option_buttons = {}
        button_frame = tk.Frame(self)
        button_frame.pack(pady=10)
        
        for option in ["unknown", "confirmed", "ruled out"]:
            button = tk.Button(button_frame, text=option.capitalize(), command=lambda opt=option: self.answer_question(opt))
            button.pack(side=tk.LEFT, padx=5)
            self.option_buttons[option] = button
        
        # Bilgilendirme metni
        self.info_label = tk.Label(self, text="", wraplength=750)
        self.info_label.pack(pady=10)

    def update_question(self):
        if self.current_question_index < len(questions):
            question = questions[self.current_question_index]
            self.question_label.config(text=question["question"])
            self.info_label.config(text="")
        else:
            self.question_label.config(text="All questions answered!")
            self.info_label.config(text="")
            for button in self.option_buttons.values():
                button.config(state=tk.DISABLED)

    def answer_question(self, answer):
        question = questions[self.current_question_index]
        # Bilgilendirme güncelleme
        self.info_label.config(text=f"Answer for '{question['question']}' set to {answer}")
        self.current_question_index += 1
        self.update_question()

if __name__ == "__main__":
    app = App()
    app.mainloop()
