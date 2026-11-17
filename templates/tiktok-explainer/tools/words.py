"""Word timestamps for assets/voice/voice.wav -> words.json (uses known script text per line as the truth)."""
import json, os, sys
from faster_whisper import WhisperModel
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(os.path.join(root, "assets", "voice", "voice.wav"), word_timestamps=True, beam_size=5)
words = []
for s in segs:
    for w in s.words:
        words.append({"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
json.dump(words, open(os.path.join(root, "words.json"), "w"), indent=0)
print(len(words), "words")
print(" ".join(f"{w['w']}@{w['s']}" for w in words))
