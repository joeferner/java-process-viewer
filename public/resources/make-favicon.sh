#!/bin/bash

magick convert favicon.svg -resize 16x16 favicon-16.png
magick convert favicon.svg -resize 32x32 favicon-32.png
magick convert favicon.svg -resize 48x48 favicon-48.png

magick convert favicon-16.png favicon-32.png favicon-48.png favicon.ico

rm favicon-16.png favicon-32.png favicon-48.png
