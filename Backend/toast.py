import tkinter as tk
from tkinter import Label
from PIL import Image, ImageTk

def show_toast():
    # Create a new Tkinter window
    toast = tk.Tk()
    toast.title("PhasmaMate Notification")
    toast.geometry("300x100")
    toast.overrideredirect(True)  # Remove window decorations
    toast.attributes("-topmost", True)  # Keep the window on top

    # Load the check icon
    check_icon_path = "root/Asset/check.png"
    image = Image.open(check_icon_path)
    image = image.resize((32, 32), Image.ANTIALIAS)
    check_icon = ImageTk.PhotoImage(image)

    # Create a label to hold the image and text
    label = Label(toast, image=check_icon, text="PhasmaMate başarılı şekilde açıldı.", compound='left', padx=10)
    label.pack(pady=20)

    # Close the toast after 3 seconds
    toast.after(3000, toast.destroy)

    # Start the Tkinter event loop
    toast.mainloop()

# Show the toast when the program starts
if __name__ == "__main__":
    show_toast()
