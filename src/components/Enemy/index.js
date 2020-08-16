// enemy
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import image from "./image.png";

//-------------------------------------------------------------------------------

const width = 31
const height = 28
const frames = 1

const imageTextures = new PIXI.Texture.from(image);
const textures = [
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(0, 0, width,height)),
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
