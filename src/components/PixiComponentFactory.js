// PixiComponentFactory
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

//-------------------------------------------------------------------------------

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations

const centerAnchor = new PIXI.Point(0.5, 0.5);

export const PixiComponentFactory = (image,width,height,frames)  =>
{
    const imageTextures = new PIXI.Texture.from(image);

    const textures = [
        new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(width*0, height*0, width, height)),
    ];

    let Image = ({as:Component, texture: textureIndex, ...rest}) =>
    {
        const texture = textures[textureIndex];
        return <Component anchor={centerAnchor} {...rest} texture={texture} />;
    }
    Image.propTypes =
    {
      as: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      texture: PropTypes.number,
    };
    Image.defaultProps =
    {
      as: Sprite,
      texture: 0,
    };

    Image.gameData = {
        size : { x:width,y:height},
        frames,
    }

    return Image
}

//===============================================================================

