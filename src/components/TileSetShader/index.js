// tile set shader. Given a tile set, and a 2D map, render the tiles

import React from "react"
import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"

import image from 'components/images/scroller/PlatformTilesets32x32.png'
import tileMap from 'components/images/scroller/platform.json'

//const app = new PIXI.Application()
//document.body.appendChild(app.view)

const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', // the attribute name
        [  -100, -100, // x, y
            100, -100, // x, y
            100,  100,
           -100,  100
        ], // x, y
        2) // the size of the attribute
    .addAttribute('aUvs', // the attribute name
        [   0, 0, // u, v
            1, 0, // u, v
            1, 1,
            0, 1
        ], // u, v
        2) // the size of the attribute
    .addIndex([0, 1, 2, 0, 2, 3])

const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

const fragmentSrc = `

    precision mediump float;

    varying vec2 vUvs;

    uniform sampler2D uSampler2;
    uniform sampler2D uTileMap;
    uniform int tileXSize;
    uniform int tileYSize;
    uniform float time;

    void main() {

        //mapX = texture2D(tileMap,
        gl_FragColor = texture2D(uTileMap, vUvs )+vec4(0,0,0,255);
        //gl_FragColor = vec4(255,0,255,255);

//      vec2 tileXY = vec2(floor(vUvs.x) / 512.0,floor(vUvs.y) / 512.0); // figure out which tile we´re in from the 3D coordinates
//      float tex = texture2D(map,tileXY).r; // get tile´s texture ID
//
//      vec2 UV = vec2(0.0625 * (tex + fract(vUvs.x)), fract(vUvs.y)); // calculate UV within the texture|.
//      // The factor 0.0625 is if you have 16 textures next to each other from left to right in your atlas, this entirely depends on your layout for it
//
//      gl_FragColor = vec4(texture2D(uSampler2,UV)); //fetch texel for fragment

    }`;


console.log("tileMap",tileMap)
// RGBA
//let mapArray3 = new Float32Array(tileMap.layers[0].data.map( (entry,index) => entry ))

let intermediate = []

tileMap.layers[0].data.forEach( (entry,index) =>
    {
        intermediate.push(entry/10.0)
        intermediate.push(0.0)
        intermediate.push(0.0)
        intermediate.push(1.0)
    }
)

let mapArray = new Float32Array(intermediate.map( (entry,index) => entry ))

//console.log("mapArray",mapArray)

//console.log("texture", PIXI.Texture.fromBuffer(mapArray,tileMap.width,tileMap.height))

const uniforms = {
    uSampler2: PIXI.Texture.from(image),
    //uTileMap: PIXI.Texture.fromBuffer(mapArray,10,10),
    uTileMap: PIXI.Texture.fromBuffer(mapArray,tileMap.width,tileMap.height),
    tileXSize: 32,
    tileYSize: 32,
    time: 0,
}

const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms)

const TYPE = "MeshWithShader"
const behavior = {
  customDisplayObject: props => new PIXI.Mesh(geometry, shader),
    customApplyProps: function(instance, oldProps, newProps) {
      if(oldProps === undefined) {
          return
      }
      this.applyDisplayObjectProps(oldProps, newProps)
      instance.shader.uniforms.time = newProps.texture/5.0
      instance.position.set(newProps.x,newProps.y)
    }
}

let Shader = CustomPIXIComponent(behavior, TYPE)

// unclear to me why the Shader is coming back as a string. Wrapping it in this component
// so I can add the game data. (kts smell: unsure if adding gameData to render components
// is a good design, or if we should move that data up a level)
let ShaderComponent = (props) =>
{
    return <Shader {...props} />
}

ShaderComponent.gameData = {
    size : { x:10,y:10},            // kts need to read this from texture?
    frames: 200          // kts temp
}

export default ShaderComponent

