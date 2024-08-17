import pyaudio
import librosa
import numpy as np
import tensorflow as tf

# Modeli yükleme
model = tf.keras.models.load_model('phasmamate-ai.h5')

# Gerçek zamanlı adım sesi algılama
def detect_step_sound(audio_stream):
    while True:
        # Ses verilerini yakala
        data = audio_stream.read(1024)
        
        # Ses özelliklerini çıkar
        features = extract_features(data)
        
        # Modelle tahmin yap
        prediction = model.predict(np.array([features]))
        
        if prediction >= 0.5:  # Adım sesi olarak tahmin ediliyorsa
            print("Adım sesi algılandı!")
            # Burada istediğiniz aksiyonu alabilirsiniz.

# Ses özellikleri çıkarma
def extract_features(data):
    # Örneğin, MFCC özelliklerini çıkarabilirsiniz.
    # Veriyi ses formatına dönüştür
    audio = np.frombuffer(data, dtype=np.float32)
    mfccs = librosa.feature.mfcc(y=audio, sr=22050, n_mfcc=13)
    return np.mean(mfccs.T, axis=0)

# Ses yakalama ve işleme
def main():
    # Ses yakalama ayarları
    p = pyaudio.PyAudio()
    audio_stream = p.open(format=pyaudio.paFloat32, channels=1, rate=22050, input=True, frames_per_buffer=1024)
    
    detect_step_sound(audio_stream)

if __name__ == "__main__":
    main()
