from flask import Flask, request, jsonify

app = Flask(__name__)

def determine_ghost(evidences):
    ghost_list = {
        "Spirit": ["EMF Level 5", "Ghost Writing", "Spirit Box"],
        "The Twins": ["EMF Level 5", "Freezing Temperatures", "Spirit Box"],
        "Phantom": ["Fingerprints", "Ghost Orb", "Ghost Writing"],
        "Banshee": ["EMF Level 5", "Freezing Temperatures", "Spirit Box"],
        # Diğer hayaletler buraya eklenebilir
    }

    matching_ghosts = [ghost for ghost, ev in ghost_list.items() if all(e in ev for e in evidences)]
    
    return matching_ghosts

@app.route('/determine-ghost', methods=['POST'])
def get_ghost():
    data = request.json
    evidences = data.get('evidences', [])

    if len(evidences) > 4:
        return jsonify({"error": "Maksimum 4 kanıt seçebilirsiniz"}), 400
    
    matching_ghosts = determine_ghost(evidences)
    
    return jsonify({"ghosts": ", ".join(matching_ghosts) if matching_ghosts else "Bilinmiyor"})

if __name__ == '__main__':
    app.run(debug=True)
