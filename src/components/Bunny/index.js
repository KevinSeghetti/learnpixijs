// bunny
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import image from "./bunnys.png";


//-------------------------------------------------------------------------------

const width = 26
const height = 37
const frames = 5

const imageTextures = new PIXI.Texture.from(image);
const textures = [
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(2,  47, width, height)),
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(2,  86, width, height)),
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(2, 125, width, height)),
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(2, 164, width, height)),
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(2,   2, width, height)),
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
