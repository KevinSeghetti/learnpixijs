// enemy
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import image from "./image.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

const imageTextures = new PIXI.Texture.from(image);
const textures = [
  new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(0, 0, 31, 28)),
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
