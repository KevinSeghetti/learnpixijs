// tile set shader. Given a tile set, and a 2D map, render the tiles

import React,{useState} from "react"
import PropTypes from "prop-types";

import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"

//===============================================================================

const vertexSrc = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    uniform float mapDisplayWidth;
    uniform float mapDisplayHeight;

    uniform float tileMapXOffset;
    uniform float tileMapYOffset;

    varying vec2 vUvs;
    varying vec2 tileCoords;

    void main() {

        vUvs = aUvs;

        // use the vertex interpolation to generate our map coordinates
        tileCoords = (vec2(mapDisplayWidth,mapDisplayHeight)*aUvs)+vec2(tileMapXOffset,tileMapYOffset);
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

//===============================================================================
// since shaders are javascript strings, possible to create snippets of code
// ouside and inject them when needed. Might explore this idea more.

let RED   = "1.0,0.0,0.0,1.0"
let GREEN = "0.0,1.0,0.0,1.0"
let BLUE  = "0.0,0.0,1.0,1.0"
let GREY  = "0.5,0.5,0.5,1.0"
let YELLOW  = "1.0,1.0,0.5,1.0"


const fragmentSrc = `
    precision mediump float;

    varying vec2 vUvs;
    varying vec2 tileCoords;

    uniform sampler2D uTileSet;
    uniform sampler2D uTileMap;
    uniform int tileMapWidth;                   // width (in tiles) the map is
    uniform int tileMapHeight;

    uniform mediump int tileXSize;
    uniform mediump int tileYSize;
    uniform mediump int tileSetWidth;
    uniform mediump int tileSetHeight;

    void main() {
        vec2 tileSize = vec2(float(tileXSize),float(tileYSize));
        vec2 tileMapCoordinates = tileCoords*vec2(1.0/float(tileMapWidth),1.0/float(tileMapHeight));
        int tileIndex = int(floor(texture2D(uTileMap,tileMapCoordinates).r )); // force read from upper left corner, this should be 45
        //tileIndex = int(floor(texture2D(uTileMap,tileCoords).r)); // get tile´s texture ID
        //tileIndex = int(floor(texture2D(uTileMap,vec2(0.03,0.0)).r )); // force read from upper left corner, this should be 45
        //tileIndex = int(floor(texture2D(uTileMap,vec2((1.0/500.0)*20.0,0.0)).r )); // force read from upper left corner, this should be 45
        //tileIndex = 222;

        // tiles are numbered from 1. a 0 means draw nothing
        if(tileIndex != 0) {
            tileIndex -= 1;
            // now that we have the tile index, need to look up its pixels and draw it

            // convert 1D tile ID into 2D tile coordinates
            int tileSetTileWidth = tileSetWidth/tileXSize;
            int tileSetTileHeight = tileSetHeight/tileYSize;

            int tileSetModulo = tileSetWidth;
            // mod by hand, since int mod doesn't exist in ES 2.0, and float mod will bungle this
            // modulo is // test = x-(y*(x/y));
            int intermediateMod = tileIndex-(tileSetTileWidth*(tileIndex/tileSetTileWidth));
            float intermediateInt = floor(float(tileIndex)/float(tileSetTileWidth));
            vec2 tile2DCoordinates = vec2(float(intermediateMod),intermediateInt);
            //tile2DCoordinates = vec2(1.0,1.0);

            // need to scale that by the percentage of the width of the tileSet a single tile is
            vec2 tileToSetRatio = vec2(float(tileXSize)/float(tileSetWidth),float(tileYSize)/float(tileSetHeight));

            // given the x,y coordinate of a tile, map that to pixels in the tileSet
        vec2 fractTileCoords = fract(tileCoords);
        vec2 pixelCoordinates = floor(fractTileCoords*tileSize);
        vec2 fractCoords = (pixelCoordinates/tileSize)*tileToSetRatio;

        vec2 tileUV = (tileToSetRatio*tile2DCoordinates)        // offset to beginning of this tile
            + fractCoords                                       // pixels within the tile
        ;

            //tileUV = vec2(0.1,0.1);
            //vec2 UV = vec2(1.0/float(tileSetWidth) * (tex + fract(vUvs.x)), fract(vUvs.y)); // calculate UV within the texture|.
            gl_FragColor = vec4(texture2D(uTileSet,tileUV)+vec4(0,0,0,255)); //fetch texel for fragment

            gl_FragColor = vec4(texture2D(uTileSet,tileUV)); //fetch texel for fragment
            gl_FragColor = vec4(texture2D(uTileSet,vec2(tileUV.x/50.0,0.0))); //fetch texel for fragment

            gl_FragColor = vec4(texture2D(uTileSet,fract(tileUV))); //fetch texel for fragment

            //gl_FragColor = texture2D(uTileSet, vec2(0.0,0.0))+vec4(0,0,0,255);

            //gl_FragColor = texture2D(uTileMap, vUvs );
            //gl_FragColor = texture2D(uTileSet, vUvs )+vec4(0,0,0,255);
            //gl_FragColor = vec4(0,0,tex,255);
        }
        else
        {
            gl_FragColor = vec4(0,0,0,0);
        }

//      // debugging
//      if(floor(tileCoords.x) == 0.0&& vUvs.y > 0.8) {
//          gl_FragColor = vec4(${GREY});
//      }
//
//      if(floor(tileCoords.x) == 1.0&& vUvs.y > 0.8) {
//          gl_FragColor = vec4(${YELLOW});
//      }
//
//      if(floor(tileCoords.x) == 2.0&& vUvs.y > 0.8) {
//          gl_FragColor = vec4(${GREEN});
//      }
//      if(floor(tileCoords.x) == 3.0&& vUvs.y > 0.8) {
//          gl_FragColor = vec4(${BLUE});
//
//      }
//      // upper left
//      if(vUvs.x < 0.1 && vUvs.y < 0.1) {
//
//          //gl_FragColor = vec4(${RED});
//          gl_FragColor = texture2D(uTileSet, vUvs)+vec4(0,0,0,255);
//      }
//
//      // lower left
//      if(vUvs.x < 0.1 && vUvs.y > 0.9) {
//          if(texture2D(uTileMap,vec2(0.0,0.0)).r == 45.0)  {
//              gl_FragColor = vec4(${BLUE});
//          }
//          else
//          {
//              gl_FragColor = vec4(${GREEN});
//          }
//      }
//
//      // lower right
//      if(vUvs.x > 0.9 && vUvs.y > 0.9) {
//          gl_FragColor = vec4(${GREEN});
//      }

    }`;

//===============================================================================

const CalcUniforms = (tileSet,tileSetWidth,tileSetHeight,tileMap,destAspectRatio) =>
{
    let tileMapXOffset = 0.0
    let tileMapYOffset = 0.0

    const tileXSize = tileMap.tilewidth                         // size of the tiles
    const tileYSize = tileMap.tileheight

    const tileSetTileWidth  = tileSetWidth/tileXSize             // number of tiles wide the tile set image is
    const tileSetTileHeight = tileSetHeight/tileYSize             // number of tiles high the tile set image is

    let intermediate = []

    // store map info in r channel
    tileMap.layers[0].data.forEach( (entry,index) =>
        {
            intermediate.push(entry)
            intermediate.push(0.0)
            intermediate.push(0.0)
            intermediate.push(1.0)
        }
    )

    let mapArray = new Float32Array(intermediate.map( (entry,index) => entry ))
    //console.log("mapArray",mapArray)

    // values that may vary as the app runs
    let mapDisplayXPos = 0                  // where the upper left corner of the map is scrolled to
    let mapDisplayYPos = 0
    let mapDisplayWidth = 40                // how many tiles to display on the dest image
    let mapDisplayHeight = mapDisplayWidth*destAspectRatio

    let uniforms = {
        uTileSet: PIXI.Texture.from(tileSet,{ mipmap:false,premultiplyAlpha:false,}),
        uTileMap: PIXI.Texture.fromBuffer(mapArray,tileMap.width,tileMap.height),
        tileXSize,
        tileYSize,
        tileMapWidth: tileMap.width,
        tileMapHeight: tileMap.height,

        tileSetWidth,
        tileSetHeight,

        mapDisplayWidth ,
        mapDisplayHeight,

        tileMapXOffset,
        tileMapYOffset,
    }

    //console.log("uniforms",uniforms)
    return uniforms
}

const ConstructBehavior = (tileSet,tileSetWidth,tileSetHeight,tileMap)  =>
{
    // Size of destination buffer.
    const destSizeX = 800/2
    const destSizeY = 600/2
    const destAspectRatio = destSizeY / destSizeX

    const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, CalcUniforms(tileSet,tileSetWidth,tileSetHeight,tileMap, destAspectRatio))

    const geometry = new PIXI.Geometry()
        .addAttribute('aVertexPosition', // the attribute name
            [  -destSizeX, -destSizeY, // x, y
                destSizeX, -destSizeY, // x, y
                destSizeX,  destSizeY,
               -destSizeX,  destSizeY
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

    return{
      customDisplayObject: props => new PIXI.Mesh(geometry, shader),
        customApplyProps: function(instance, oldProps, newProps) {
          if(oldProps === undefined) {
              return
          }
          this.applyDisplayObjectProps(oldProps, newProps)
          //Object.assign(instance.shader.uniforms,CalcUniforms(tileSet,tileMap))
          instance.position.set(newProps.x,newProps.y)
          instance.shader.uniforms.tileMapXOffset = Math.floor(newProps.tileMapXOffset);
          instance.shader.uniforms.tileMapYOffset = Math.floor(newProps.tileMapYOffset);
          instance.shader.uniforms.mapDisplayWidth = Math.floor(newProps.tileMapXPer)
          instance.shader.uniforms.mapDisplayHeight = Math.floor(newProps.tileMapXPer*.75)

          //console.log("MapRendererBehavior",newProps)
        }
    }
}

//let Shader = CustomPIXIComponent(behavior, TYPE)

// unclear to me why the Shader is coming back as a string. Wrapping it in this component
// so I can add the game data. (kts smell: unsure if adding gameData to render components
// is a good design, or if we should move that data up a level)

export const ConstructTileSetShaderComponent = (tileSet, tileSetWidth,tileSetHeight,tileMap) =>
{
    const TYPE = "MeshWithShader"

    let ShaderComponent = (props) =>
    {
        const Shader = CustomPIXIComponent(ConstructBehavior(tileSet,tileSetWidth,tileSetHeight,tileMap), TYPE)
        return <Shader {...props} />
    }

    ShaderComponent.gameData = {
        size : { x:10,y:10},            // kts need to read this from texture?
        frames: 200          // kts temp
    }


    ShaderComponent.propTypes =
    {

    };
    ShaderComponent.defaultProps =
    {
      //as: Sprite,
      //texture: 0,
    };

    return ShaderComponent
}

//===============================================================================

