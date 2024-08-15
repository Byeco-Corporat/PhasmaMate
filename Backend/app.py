import time
import sys

def main():
    while True:
        print("Python script is running...")
        time.sleep(5)  # Örneğin 5 saniyede bir çalışacak

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Python script stopped.")
        sys.exit()
