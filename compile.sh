#!/bin/sh
rm dist.zip
mkdir -p dist
cd src
cp -av f-tinified.png ../dist/f.png
cp -av a-tinified.png ../dist/a.png
cp -av *.txt ../dist/
cp index.html index.css ../dist/
rollup mainloop.js --format cjs --file ../dist/bundle.js
cd ../dist
terser bundle.js -o mainloop.js --compress --mangle --mangle-props reserved=["movementX"] --timings --toplevel --module
rm bundle.js
cd ..
cd dist
/c/Program\ Files/7-Zip/7z.exe a -mx9 -tzip ../dist.zip *
cd ..
./advzip.exe  -4 -i 1000 -z dist.zip