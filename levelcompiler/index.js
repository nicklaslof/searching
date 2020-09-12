#!/usr/bin/env node
//Compiles the level image to two text files. One with the leveltiles and the other one with metadata using the alpha value of the color.
//The resulting files will be 8kb but zip will compress them alot resulting in two files much smaller than using the png itself.
const { createCanvas, loadImage,ImageData } = require('canvas');
const canvas = createCanvas(64, 53);
const ctx = canvas.getContext('2d');
canvas.imageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let level = new Array(64*53);
level.fill("x");
let metaData = new Array(64*53);
metaData.fill("x");

loadImage("level.png").then((image) => {
    ctx.drawImage(image, 0, 0);
        //Draw the image and then loop over it
        for (let x = 0; x < 64; x++) {
            for (let z = 0; z < 53; z++) {
                //Get the color of the pixel
                let c = new Uint32Array(ctx.getImageData(x, z, 1, 1).data.buffer);
                //Bit shift the color to extract just the alpha value
                let alpha = (c >>> 24 );
                //If we have an alpha value save it to the metadata values using the matching asciicode of the alpha value. Also substract 126 from the asciivalue to avoid using weird characters (had some issues with this)
                if (alpha != 0 && alpha < 255){
                    addToLevel(metaData,x,z,String.fromCharCode(126-(255-alpha)));
                    let b = 126-(255-alpha);
                }
                //Bitmask the color so we don't have to use the alpha value in the rest of the checks
                c = (c & 0x0FFFFFF);

                //Based on the color set an asciicharacter in the level textfile
                if (c == 0x333324) addToLevel(level,x,z,"s"); // Stonewall 
                if (c == 0x444424) addToLevel(level,x,z,"g"); // Grassy Stonewall
                if (c == 0x0050ff) addToLevel(level,x,z,"l"); // Lava
                if (c == 0x00ff00) addToLevel(level,x,z,"p"); // Player
                if (c == 0x202020) addToLevel(level,x,z,"b"); // Bat
                if (c == 0x808080) addToLevel(level,x,z,"d"); // Dagger
                if (c == 0x00ffff) addToLevel(level,x,z,"w"); // Dagger
                if (c == 0x003359) addToLevel(level,x,z,"j"); // Jar
                if (c == 0x3f3f7f) addToLevel(level,x,z,"c"); // Box
                if (c == 0xffff99) addToLevel(level,x,z,"f"); // Appaering floor
                if (c == 0x0000ff) addToLevel(level,x,z,"a"); // Apple
                //PNG compression issues I think.. sometimes the pixelcolor is also changed when the alpha value changes so I need to check two colors
                if (c == 0xaaaaaa || c == 0xa9a9a9) addToLevel(level,x,z,"e"); // Bars
                if (c == 0xffffff || c == 0xfefefe) addToLevel(level,x,z,"t"); // Floortrigger
                if (c == 0xee00ff || c == 0xed00ff) addToLevel(level,x,z,"o"); // Projectile shooter
            }
        }
    
        saveLevel("../src/l.txt",getLevelString(level));
        saveLevel("../src/m.txt",getLevelString(metaData));
});

// Save the metadata and level data to a text file that will be used in the game.
function saveLevel(filename, data){
    fs = require('fs');
    fs.writeFile(filename, data, "ascii", function (err) {
        if (err) return console.log(err);
        console.log("save successfully");
      });   
}

function addToLevel(level,x,z,data){
    if (x == 33 && z == 3) console.log(x+" "+ z +" " +data);
    level[x + (z*64)] = data;
}

function getLevelString(level){
    let txt = "";
    for (let x = 0; x < 64; x++) {
        for (let z = 0; z < 53; z++) {
            txt += level[z + (x*53)];
        }
    }
    return txt;
}

