"""Google Cloud TTS per line -> assets/voice/<id>.wav, then concat with gaps -> assets/voice/voice.wav + voice-timing.json.
Usage: python tools/tts.py <access_token> <gcp_project> [voice] [rate] [lead_in]"""
import base64, json, sys, subprocess, urllib.request, wave, os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(root, "script.json"), encoding="utf-8-sig"))
token, project = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else cfg["voice"]
rate = float(sys.argv[4]) if len(sys.argv) > 4 else cfg["rate"]
lead = float(sys.argv[5]) if len(sys.argv) > 5 else 0.2
out = os.path.join(root, "assets", "voice")
os.makedirs(out, exist_ok=True)
SR = 24000

def synth(text, path):
    body = {
        "input": {"text": text},
        "voice": {"languageCode": "en-US", "name": voice},
        "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": SR, "speakingRate": rate},
    }
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {token}", "x-goog-user-project": project, "Content-Type": "application/json"},
    )
    data = json.load(urllib.request.urlopen(req))
    open(path, "wb").write(base64.b64decode(data["audioContent"]))

def frames(path):
    with wave.open(path) as w:
        return w.readframes(w.getnframes()), w.getnframes()

pcm = b"\x00\x00" * int(lead * SR)
timing, t = [], lead
for ln in cfg["lines"]:
    p = os.path.join(out, f"{ln['id']}.wav")
    synth(ln["text"], p)
    raw, n = frames(p)
    d = n / SR
    timing.append({"id": ln["id"], "start": round(t, 3), "end": round(t + d, 3), "text": ln["text"]})
    pcm += raw + b"\x00\x00" * int(ln["gap"] * SR)
    t += d + ln["gap"]
    print(f"{ln['id']:7s} {timing[-1]['start']:6.2f}-{timing[-1]['end']:6.2f}  {ln['text']}")

with wave.open(os.path.join(out, "voice.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
json.dump({"voice": voice, "rate": rate, "total": round(t, 3), "lines": timing},
          open(os.path.join(root, "voice-timing.json"), "w"), indent=1)
print("TOTAL", round(t, 2))
