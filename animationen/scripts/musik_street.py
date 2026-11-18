"""Street/Phonk-Track für Berlin v2: 150 BPM (1 Beat = 0,4 s = 12 Frames), E-Moll, 16 Takte = 25,6 s.
Aufbau (in Beats): 0-5 Buchstaben-Hits, 6-7 Riser, 8-39 Drop 1, 40-47 Breakdown, 48-61 Drop 2, 62-63 Endhit.
Aufruf: python3 musik_street.py ausgabe.wav
"""
import sys, wave
import numpy as np

SR = 44100
BEAT = 0.4
N = int(SR * (64 * BEAT + 3))
rng = np.random.default_rng(3)

def t_(d): return np.arange(int(SR * d)) / SR
def note(n): return 440 * 2 ** ((n - 69) / 12)
def put(bus, beat, sig, g=1.0):
    i = int(beat * BEAT * SR); j = min(len(bus), i + len(sig)); bus[i:j] += sig[:j - i] * g
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    if hi: X *= 1 / (1 + (f / hi) ** 4)
    if lo: X *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X, len(x))
def fades(x, a=0.002, r=0.01):
    t = np.arange(len(x)) / SR; d = len(x) / SR
    return x * np.minimum(1, t / a) * np.minimum(1, (d - t) / r)
def reverb(x, d=1.6, mix=0.25):
    ir = filt(rng.standard_normal(int(SR * d)) * np.exp(-t_(d) * 4), hi=5000)
    n = len(x) + len(ir); y = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[:len(x)]
    return x + y / (np.max(np.abs(y)) + 1e-9) * np.max(np.abs(x)) * mix

drums = np.zeros(N); bass = np.zeros(N); bell = np.zeros(N); fx = np.zeros(N)

def kick():
    t = t_(0.35); f = 50 + 140 * np.exp(-t * 35)
    return fades(np.tanh(2.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 9), r=0.03)
def b808(n, d):
    t = t_(d); f = note(n) * (1 + 1.5 * np.exp(-t * 25))
    return fades(np.tanh(3 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 1.6), r=0.04)
def clap():
    return fades(filt(rng.standard_normal(int(SR * .3)), lo=1200, hi=7000) * np.exp(-t_(.3) * 14))
def hat(d=0.05):
    return fades(filt(rng.standard_normal(int(SR * d)), lo=8000) * np.exp(-t_(d) * 70), r=0.005)
def cowbell(n):
    t = t_(0.3); f = note(n)
    s = np.sign(np.sin(2 * np.pi * f * t)) + np.sign(np.sin(2 * np.pi * f * 1.48 * t))
    return fades(filt(s, lo=f * 0.8, hi=f * 4) * np.exp(-t * 11), r=0.02)
def boom(d=1.6):
    t = t_(d); return fades(np.tanh(2 * np.sin(2 * np.pi * (35 + 60 * np.exp(-t * 10)) * t)) * np.exp(-t * 2.5), r=0.1)
def riser(beats):
    d = beats * BEAT; t = t_(d)
    return fades(filt(rng.standard_normal(len(t)), lo=1500) * (t / d) ** 2.5, r=0.01)

ROOT = [40, 36, 38, 35]                          # Em – C – D – B (808)
MELODIE = [76, 76, 79, 76, 74, 76, 71, 72,       # Cowbell, Achtel über 2 Takte
           76, 76, 79, 81, 79, 76, 74, 71]

def bar_full(bar, hats=True, kicks=True):
    b0 = bar * 4
    if kicks:
        for k in (0, 1.5, 2.75):
            put(drums, b0 + k, kick(), 0.8)
            put(bass, b0 + k, b808(ROOT[bar % 4], 0.9 if k == 0 else 0.5), 0.5)
        put(drums, b0 + 2, clap(), 0.45)
    if hats:
        for e in range(8):
            put(drums, b0 + e / 2, hat(), 0.16 if e % 2 else 0.22)
        if bar % 2 == 1:  # Hi-Hat-Roll
            for s in range(6):
                put(drums, b0 + 3 + s / 6, hat(0.03), 0.14)

def bar_bell(bar, g=0.11, dunkel=False):
    for e in range(8):
        n = MELODIE[(bar % 2) * 8 + e]
        s = cowbell(n)
        put(bell, bar * 4 + e / 2, filt(s, hi=1500) if dunkel else s, g)

# Intro: Buchstaben-Hits auf Beat 0-5, Bell gedämpft, Riser 6-7, Stille vor dem Drop
for b in range(6):
    put(fx, b, boom(0.5), 0.55); put(drums, b, clap(), 0.3); put(drums, b, kick(), 0.6)
for bar in (0, 1): bar_bell(bar, 0.07, dunkel=True)
put(fx, 6, riser(1.75), 0.18)
# Drop 1
put(fx, 8, boom(), 0.7)
for bar in range(2, 10): bar_full(bar); bar_bell(bar)
# Breakdown: nur 808 lang + Bell dunkel, Riser
for bar in (10, 11):
    put(bass, bar * 4, b808(ROOT[bar % 4], 1.6), 0.45); bar_bell(bar, 0.08, dunkel=True)
put(fx, 44, riser(3.75), 0.2)
# Drop 2
put(fx, 48, boom(), 0.7)
for bar in range(12, 15): bar_full(bar); bar_bell(bar)
bar_full(15, hats=True)  # wird ab Beat 62 abgeschnitten
# Endhit: alles ab Beat 62 stumm, dann Boom + Ausklang
cut = int(62 * BEAT * SR)
drums[cut:] = 0; bass[cut:] = 0; bell[cut:] = 0
put(fx, 62, boom(2.5), 0.9); put(drums, 62, clap(), 0.4)
put(bass, 62, b808(40, 2.4), 0.45)

# Sidechain der Bell auf die Kicks
mix = drums + bass + reverb(bell, 1.2, 0.3) + reverb(fx, 2.0, 0.3)
mix = np.tanh(mix * 1.4) / 1.4
R = mix.copy(); d = int(0.009 * SR); R[d:] = 0.7 * mix[d:] + 0.3 * mix[:-d]
st = np.stack([mix, R], 1)
fl = int(SR * 0.8); st[-fl:] *= np.linspace(1, 0, fl)[:, None]
st /= np.max(np.abs(st)) * 1.05
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print('ok', len(st) / SR)
