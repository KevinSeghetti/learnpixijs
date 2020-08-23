import React,{useEffect,useState} from "react"
import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"

import image from 'components/images/bg_scene_rotate.jpg'

//const app = new PIXI.Application()
//document.body.appendChild(app.view)

const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', // the attribute name
        [-100, -100, // x, y
            100, -100, // x, y
            100, 100,
            -100, 100], // x, y
        2) // the size of the attribute
    .addAttribute('aUvs', // the attribute name
        [0, 0, // u, v
            1, 0, // u, v
            1, 1,
            0, 1], // u, v
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
    uniform float time;

    void main() {

        gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );
    }`;

const uniforms = {
    uSampler2: PIXI.Texture.from(image),
    time: 0,
}

const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms)

//const quad = new PIXI.Mesh(geometry, shader)
//
//quad.position.set(400, 300)
//quad.scale.set(2)

//app.stage.addChild(quad)
//
//// start the animation..
//// requestAnimationFrame(animate)
//
//app.ticker.add((delta) => {
//    quad.rotation += 0.01
//    quad.shader.uniforms.time += 0.1
//})

const TYPE = "MeshWithShader"
const behavior = {
  customDisplayObject: props => new PIXI.Mesh(geometry, shader),
    customApplyProps: function(instance, oldProps, newProps) {
      if(oldProps === undefined) {
          return
      }
//    if (Object.keys(oldProps).length !== 0) {
//      return
//    }
//
      this.applyDisplayObjectProps(oldProps, newProps)
      instance.shader.uniforms.time = newProps.texture/5.0
      instance.position.set(newProps.x,newProps.y)
    }
}

let Shader = CustomPIXIComponent(behavior, TYPE)

let ShaderComponent = (props) =>
{
    //console.log("ShaderComponent",props)
    return <Shader {...props} />
}

ShaderComponent.gameData = {
    size : { x:10,y:10},            // kts need to read this from texture?
    frames: 200          // kts temp
}

export default ShaderComponent

