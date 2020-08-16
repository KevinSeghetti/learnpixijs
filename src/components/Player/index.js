import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import player from "./player.png";

const centerAnchor = new PIXI.Point(0.5, 0.5);

const playerTextures = new PIXI.Texture.from(player);
const textures = [
  new PIXI.Texture(playerTextures.baseTexture, new PIXI.Rectangle(0, 0, 60,54)),
];

function Player(props) {
  const texture = textures[props.texture];
  const Component = props.as;
  return <Component anchor={centerAnchor} {...props} texture={texture} />;
}
Player.propTypes = {
  as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  texture: PropTypes.number,
};
Player.defaultProps = {
  as: Sprite,
  texture: 0,
};

export default Player;
