"""Synthetischer, lizenzfreier Soundtrack: 100 BPM, A-Moll, 16 Takte (38,4 s).
Struktur passt zum Berlin-Schnitt (1 Takt = 2,4 s = 72 Frames bei 30 fps).
Aufruf: python3 musik.py ausgabe.wav
"""
import sys, wave
import numpy as np

SR = 44100
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
TAKTE = 16
N = int(SR * TAKTE * BAR) + SR * 3  # + Ausklang
rng = np.random.default_rng(7)

def t_(dauer):
    return np.arange(int(SR * dauer)) / SR

def put(bus, start, sig, gain=1.0):
    i = int(start * SR)
    j = min(len(bus), i + len(sig))
    bus[i:j] += sig[: j - i] * gain

def note(n):  # MIDI -> Hz
    return 440 * 2 ** ((n - 69) / 12)

def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi:
        X *= 1 / (1 + (f / hi) ** 4)
    if lo:
        X *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))

def reverb(x, dauer=2.8, mix=0.35):
    ir = rng.standard_normal(int(SR * dauer)) * np.exp(-t_(dauer) * 3.2)
    ir = fft_filter(ir, hi=6000)
    n = len(x) + len(ir)
    y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x)]
    y /= np.max(np.abs(y)) + 1e-9
    return x * (1 - mix) + y * mix * np.max(np.abs(x))

# Akkorde: Am – F – C – G (MIDI-Noten)
AKKORDE = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
GRUND = [45, 41, 36, 43]

# Abschnitte je Takt
INTRO, BEAT_, BREAK, VOLL, OUTRO = range(5)
plan = [INTRO, INTRO, BEAT_, BREAK, VOLL, VOLL, VOLL, VOLL, VOLL, VOLL, BREAK, VOLL, VOLL, VOLL, VOLL, OUTRO]
ARP_TAKTE = {8, 9, 11, 12, 13, 14}

pad = np.zeros(N); drums = np.zeros(N); bass = np.zeros(N); arp = np.zeros(N); fx = np.zeros(N)

def saw(f, dauer, harm):
    t = t_(dauer)
    s = np.zeros_like(t)
    for k in range(1, harm + 1):
        s += np.sin(2 * np.pi * f * k * t) / k
    return s

def kick():
    t = t_(0.5)
    f = 45 + 110 * np.exp(-t * 30)
    env = np.exp(-t * 7) * np.minimum(1, t / 0.002) * np.minimum(1, (0.5 - t) / 0.05)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env

def hat(lang=False):
    d = 0.12 if lang else 0.04
    e = np.exp(-t_(d) * (25 if lang else 90)) * np.minimum(1, (d - t_(d)) / 0.005)
    return fft_filter(rng.standard_normal(int(SR * d)), lo=7000) * e

def clap():
    s = fft_filter(rng.standard_normal(int(SR * 0.25)), lo=900, hi=5000)
    env = np.exp(-t_(0.25) * 18)
    env *= np.minimum(1, t_(0.25) / 0.001)
    return s * env

def pluck(f):
    t = t_(0.5)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 9)

for takt, art in enumerate(plan):
    t0 = takt * BAR
    ak = AKKORDE[takt % 4]
    # Pad (heller im vollen Teil, dunkler im Break)
    harm = {INTRO: 4, BEAT_: 7, BREAK: 3, VOLL: 8, OUTRO: 5}[art]
    dauer = BAR + (2.5 if art == OUTRO else 0.15)
    p = sum(saw(note(n) * d, dauer, harm) for n in ak for d in (0.997, 1.003))
    env = np.minimum(1, t_(dauer) / 0.35) * np.minimum(1, (dauer - t_(dauer)) / 0.3)
    put(pad, t0, p * env, 0.06 if art != OUTRO else 0.07)

    if art in (BEAT_, VOLL):
        for b in range(4):
            put(drums, t0 + b * BEAT, kick(), 0.9)
            for h in range(2):
                put(drums, t0 + b * BEAT + h * BEAT / 2 + BEAT / 4, hat(), 0.18)
            if b in (1, 3):
                put(drums, t0 + b * BEAT, clap(), 0.35)
        # Bass: Grundton, synkopiert
        for pos, l in ((0, 0.75), (0.75, 0.25), (1.5, 0.5), (2.5, 0.5), (3.25, 0.5)):
            t = t_(l * BEAT)
            f = note(GRUND[takt % 4])
            s = np.tanh(2 * np.sin(2 * np.pi * f * t)) * np.minimum(1, (l * BEAT - t) / 0.03)
            put(bass, t0 + pos * BEAT, s, 0.22)
    if takt in ARP_TAKTE:
        tones = [n + 12 for n in ak] + [ak[0] + 24]
        for s16 in range(16):
            put(arp, t0 + s16 * BEAT / 4, pluck(note(tones[(s16 * 3) % 4])), 0.08)

# Riser vor den Drops (Takt 1 und 10), Impact auf Takt 2, 4, 11, 15
for takt in (1, 10):
    d = BAR
    t = t_(d)
    r = fft_filter(rng.standard_normal(len(t)), lo=2500) * (t / d) ** 3
    put(fx, takt * BAR, r, 0.045)
for takt, g in ((2, 0.8), (11, 0.8), (15, 1.0)):
    t = t_(2.5)
    boom = np.sin(2 * np.pi * (38 + 40 * np.exp(-t * 8)) * t) * np.exp(-t * 2.2)
    put(fx, takt * BAR, boom, 0.6 * g)

# Sidechain: Pad duckt auf jede Kick
duck = np.ones(N)
for takt, art in enumerate(plan):
    if art in (BEAT_, VOLL):
        for b in range(4):
            i = int((takt * BAR + b * BEAT) * SR)
            l = int(0.35 * SR)
            a = int(0.006 * SR)
            kurve = 0.45 + 0.55 * np.linspace(0, 1, l) ** 0.6
            kurve[:a] = np.linspace(1, 0.45, a)
            duck[i:i + l] = np.minimum(duck[i:i + l], kurve)

pad = reverb(pad * duck, 3.0, 0.4)
arp = reverb(arp, 2.0, 0.3)
fx = reverb(fx, 2.5, 0.3)
mix = pad + drums + bass + arp + fx
mix = np.tanh(mix * 1.2) / 1.2

# leichtes Stereo über verzögertes Pad/Arp
L = mix
R = mix.copy()
d = int(0.012 * SR)
R[d:] = (mix - 0.5 * (pad + arp))[:-d] + (0.5 * (pad + arp))[:-d]
R = 0.5 * R + 0.5 * np.roll(pad + arp, d) * 0.5 + 0.5 * (drums + bass + fx)
fade = np.ones(N); fl = int(SR * 2.5); fade[-fl:] = np.linspace(1, 0, fl)
st = np.stack([L * fade, R * fade], 1)
st /= np.max(np.abs(st)) * 1.05

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok", len(st) / SR, "s")
