#!/bin/sh
terser -m -c -o dist/min.js src/game.js src/inputhandler.js src/mainloop.js src/entities/*.js src/gl/*.js src/level/*.js src/screens/*.js src/tiles/*.js
