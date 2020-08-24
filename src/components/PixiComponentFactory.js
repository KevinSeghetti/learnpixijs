// PixiComponentFactory
import React from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

//-------------------------------------------------------------------------------

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations

const centerAnchor = new PIXI.Point(0.5, 0.5);


// kts TODO: use asset loader so we don't have to manually enter the width/height of images
// https://github.com/pixijs/pixi.js/issues/35

export const PixiComponentFactory = (image,width,height,frames)  =>
{
    let frameCount = 1
    const imageTextures = new PIXI.Texture.from(image);
    //console.log("PixiComponentFactory",width,height,"@@",imageTextures.width,imageTextures.height,frames)

    let textures
    if(frames )
    {
        textures = frames.map( (entry,index) =>
            new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(entry.width, entry.height, width, height)),
        )
        frameCount = frames.length
    }
    else
    {
        width = imageTextures.width
        height = imageTextures.height
        textures = [
            new PIXI.Texture(imageTextures.baseTexture, new PIXI.Rectangle(0, 0, width, height)),
        ];
    }

    let Image = React.forwardRef( ({as:Component, texture: textureIndex, ...rest},ref) =>
    {
        const texture = textures[textureIndex];
        return <Component ref={ref} anchor={centerAnchor} {...rest} texture={texture} />;
    })
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
        frames:frameCount,
    }

    return Image
}

//===============================================================================

