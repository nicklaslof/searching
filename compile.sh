#!/bin/sh
rm dist.zip
mkdir -p dist
cd src
cp -av a-tinified.png ../dist/a.png
cp -av *.txt ../dist/
cp index.html i.css ../dist/
rollup m.js --format cjs --file ../dist/bundle.js
cd ../dist
terser bundle.js -o m.js --compress --mangle --mangle-props reserved=["movementX","imageSmoothingEnabled"] --timings --toplevel --module
rm bundle.js
cd ..
cd dist
/c/Program\ Files/7-Zip/7z.exe a -mx9 -tzip ../dist.zip *
cd ..
echo "advzip:"
./advzip.exe  -4 -i 1000 -z dist.zip