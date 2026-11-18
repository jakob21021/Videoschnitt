#!/usr/bin/env bash
# v2 "Street": ganze Clips, 1080x1920/30fps, harter Kontrast-Look. Aufruf: scripts/berlin_street_prep.sh ../Rohdateien/Berlin
set -euo pipefail
SRC="$1"; OUT="$(dirname "$0")/../public/berlin/street"; mkdir -p "$OUT"
FMT="scale=1080:1920:flags=lanczos,setsar=1,fps=30"
STREET="eq=contrast=1.16:saturation=0.8,colorbalance=rs=-0.05:gs=-0.01:bs=0.08:rm=-0.02:bm=0.03:rh=0.03:bh=-0.02,curves=master='0/0 0.12/0.035 0.5/0.47 0.85/0.9 1/0.98'"
NACHT="hqdn3d=3:3:6:6,eq=gamma=1.25:contrast=1.14:saturation=0.9,colorbalance=rs=-0.05:bs=0.09:rh=0.05:bh=-0.03,curves=master='0/0 0.1/0.04 0.5/0.5 1/0.97'"
DUNKEL="hqdn3d=4:4:8:8,eq=gamma=1.7:contrast=1.12:saturation=0.95,colorbalance=rs=-0.05:bs=0.09:rh=0.06:bh=-0.03,curves=master='0/0 0.1/0.04 1/0.96'"
c () { ffmpeg -loglevel error -y -i "$SRC/$2" -an -vf "$FMT,$3" -c:v libx264 -crf 16 -preset fast -pix_fmt yuv420p "$OUT/$1.mp4"; echo "  $1"; }
c strasse IMG_5067.mov "$STREET"
c tor     IMG_5084.mov "$STREET"
c saeulen IMG_5102.mov "$NACHT"
c dom     IMG_5105.mov "$NACHT"
c bikini  IMG_5124.mov "$STREET"
c kirche  IMG_5123.mov "$STREET"
c alex    IMG_5131.mov "$STREET"
c nacht1  IMG_5171.mov "$DUNKEL"
c nacht2  IMG_5172.mov "$DUNKEL"
c selfie  4E63D808-9767-4869-8C59-F7AD75D73322.mov "$NACHT"
ffmpeg -loglevel error -y -i "$SRC/IMG_5162.jpeg" -vf "scale=-2:2400,crop=1350:2400,eq=contrast=1.12:saturation=0.9" -q:v 2 "$OUT/ubahn.jpg"; echo "  ubahn"
