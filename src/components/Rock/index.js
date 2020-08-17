// rock
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import image from "./image.png";

//-------------------------------------------------------------------------------

const width = 20
const height = 19
const frames = 1

const imageTextures = new PIXI.Texture.from(image);

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations

// kts automate this
const textures = [
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*0, height*0, width, height)),
];

//-------------------------------------------------------------------------------

const centerAnchor = new PIXI.Point(0.5, 0.5);

function Image(props) {
  const texture = textures[props.texture];
  const Component = props.as;
  return <Component anchor={centerAnchor} {...props} texture={texture} />;
}
Image.propTypes = {
  as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  texture: PropTypes.number,
};
Image.defaultProps = {
  as: Sprite,
  texture: 0,
};

Image.gameData = {
    size : { x:width,y:height},
    frames,
}

export default Image;
