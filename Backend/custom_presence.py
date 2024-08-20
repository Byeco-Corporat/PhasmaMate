from pypresence import Presence
import time
def run_presence():
    print("Running Discord Rich Presence...")

start = int(time.time())
client_id = "1275166330579849247"  # your application's client id
RPC = Presence(client_id)
RPC.connect()

while True:  # infinite loop
    RPC.update(
        large_image="ekran_g_r_nt_s_2024-08-16_110522",  # name of your asset
        large_text="PhasmaMate Logosu",
        details="thinking...",
        state="Visual Studio Code",
        start=start,
        buttons=[
            {"label": "The Bora Moment", "url": "http://localhost:3000/"},
            {"label": "Discord", "url": "https://discord.gg/byeco"}  # Corrected URL
        ]  # up to 2 buttons
    )
    time.sleep(60)  # can be as low as 15, depends on how often you want to update
