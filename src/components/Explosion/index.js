// explosion
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import image from "./image.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

const imageTextures = new PIXI.Texture.from(image);
let width = 26
let height = 28

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations

// kts automate this
const textures = [
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*0, height*0, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*0, height*1, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*0, height*2, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*1, height*0, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*1, height*1, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*1, height*2, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*2, height*0, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*2, height*1, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*2, height*2, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*3, height*0, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*3, height*1, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*3, height*2, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*4, height*0, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*4, height*1, width, height)),
    new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*4, height*2, width, height)),
];

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

export default Image;