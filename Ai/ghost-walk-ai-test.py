import librosa
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
import os

# Ses dosyalarını yükleme ve özellik çıkarma
def load_data_and_extract_features(step_sounds_dir, no_step_sounds_dir):
    step_sounds, no_step_sounds = [], []

    # Adım seslerini yükleme
    for file in os.listdir(step_sounds_dir):
        if file.endswith('.wav'):
            file_path = os.path.join(step_sounds_dir, file)
            sound, _ = librosa.load(file_path, sr=22050)
            step_sounds.append(sound)
    
    # Adım sesi olmayan sesleri yükleme
    for file in os.listdir(no_step_sounds_dir):
        if file.endswith('.wav'):
            file_path = os.path.join(no_step_sounds_dir, file)
            sound, _ = librosa.load(file_path, sr=22050)
            no_step_sounds.append(sound)

    # Özellikleri çıkarma ve etiketleme
    X, y = [], []
    
    for sound in step_sounds:
        features = extract_features(sound)
        X.append(features)
        y.append(1)  # Adım sesi

    for sound in no_step_sounds:
        features = extract_features(sound)
        X.append(features)
        y.append(0)  # Adım sesi değil

    return np.array(X), np.array(y)

# Özellik çıkarma
def extract_features(sound):
    # MFCC özelliklerini çıkar
    mfccs = librosa.feature.mfcc(y=sound, sr=22050, n_mfcc=13)
    return np.mean(mfccs.T, axis=0)

# Eğitim süreci
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test))
    
    model.save('phasmamate-ai.h5')

if __name__ == "__main__":
    # Ses dosyalarının bulunduğu dizinler
    step_sounds_dir = 'Data/Yokai/yokai1.wav'  # Adım seslerinin bulunduğu dizin
    no_step_sounds_dir = 'Data/NoStep'  # Adım sesi olmayan seslerin bulunduğu dizin
    
    X, y = load_data_and_extract_features(step_sounds_dir, no_step_sounds_dir)
    train_model(X, y)
