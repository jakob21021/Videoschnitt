#!/usr/bin/env bash
# Bereitet die Berlin-Clips vor: Trimmen, Tempo, 1080x1920/30fps, Color Grading.
# Aufruf: scripts/berlin_prep.sh <ordner-mit-rohmaterial>
set -euo pipefail
SRC="$1"; OUT="$(dirname "$0")/../public/berlin"; mkdir -p "$OUT"

FMT="scale=1080:1920:flags=lanczos,setsar=1,fps=30"
# Looks
TAG="eq=contrast=1.07:saturation=0.9:gamma=0.98,colorbalance=rs=-0.04:gs=-0.01:bs=0.05:rm=0.01:rh=0.05:gh=0.01:bh=-0.04,curves=master='0/0.03 0.25/0.22 0.75/0.79 1/0.97'"
NACHT="hqdn3d=2:2:4:4,eq=contrast=1.05:saturation=1.05,colorbalance=rs=-0.03:bs=0.06:rh=0.06:gh=0.02:bh=-0.05,curves=master='0/0.04 0.5/0.5 1/0.96'"
DUNKEL="hqdn3d=4:4:8:8,eq=gamma=1.65:brightness=0.02:contrast=1.04:saturation=1.1,colorbalance=rs=-0.03:bs=0.07:rh=0.07:gh=0.02:bh=-0.05,curves=master='0/0.05 1/0.95'"

clip () { # name datei start dauer_quelle tempo look
  local name=$1 f=$2 ss=$3 t=$4 pts=$5 look=$6
  ffmpeg -loglevel error -y -ss "$ss" -t "$t" -i "$SRC/$f" -an \
    -vf "setpts=${pts}*PTS,$FMT,$look" -t "$(python3 -c "print(round($t*$pts,3))")" \
    -c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p "$OUT/$name.mp4"
  echo "  $name.mp4"
}

clip 01-intro     de013542-IMG_5067.mov 0.0  4.8  1    "$TAG"
clip 02-tor       b3f70c3b-IMG_5084.mov 0.2  2.4  1    "$TAG"
clip 04-saeulen   b27dcc09-IMG_5102.mov 0.0  1.92 1.25 "$NACHT"
clip 05-dom       b49d6f6d-IMG_5105.mov 1.6  2.4  1    "$NACHT"
clip 06-bikini    c7a14857-IMG_5124.mov 0.8  2.4  1    "$TAG"
clip 07-kirche    e38c4588-IMG_5123.mov 1.9  2.4  1    "$TAG"
clip 08-alex      452ddc78-IMG_5131.mov 0.1  4.8  1    "$TAG"
clip 10-nacht1    6e6aa8c1-IMG_5171.mov 1.9  2.4  1    "$DUNKEL"
clip 11-nacht2    6672999e-IMG_5172.mov 0.4  2.4  1    "$DUNKEL"
clip 12-selfie    c2cdc4ed-4E63D808-9767-4869-8C59-F7AD75D73322.mov 1.4 4.8 1 "$NACHT"

# Fotos: 3:4 -> 9:16 (Höhe 2400 für Ken-Burns-Spielraum)
ffmpeg -loglevel error -y -i "$SRC/8dc3336a-image.jpg" -vf "scale=-2:2400,crop=1350:2400,hue=s=0.25,eq=contrast=1.1:gamma=0.95" -q:v 2 "$OUT/03-denkmal.jpg"
ffmpeg -loglevel error -y -i "$SRC/0f7786db-image.jpg" -vf "scale=-2:2400,crop=1350:2400,eq=contrast=1.05:saturation=1.05,colorbalance=bs=0.03:rh=0.03" -q:v 2 "$OUT/09-ubahn.jpg"
echo "  Fotos fertig"
