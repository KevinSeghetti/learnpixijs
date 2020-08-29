// modules/common/tiledMapObject.js

import { CreateGameObject } from 'modules/common/gameObject'
import { Seconds,RatePerSecond, PixelsPerSecond } from 'modules/common/time'

//===============================================================================

export const MapStates =
{
    INVALID: 0,
    PLAYING: 1,
    DYING:   2,          // playing explosion animation
    DEAD:    3,           // no more lives, so between games
}

//===============================================================================

export const MapTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("MapObjectTick:",object,delta,clipping,keys,Callbacks,collisionList,state)
    //console.log("MapTick:keys",keys)

    let newTileMapXOffset = object.renderData.tileMapXOffset
    let newTileMapYOffset = object.renderData.tileMapYOffset
    let newTileMapXPer = object.renderData.tileMapXPer

    const mapSpeed = PixelsPerSecond(25)
    const zoomSpeed = PixelsPerSecond(10)            // not really pixels

    // override clipping for now
    let movementClipping =
    {
        min:
        {
            x: 0,
            y: 0
        },
        max:
        {
            x: 120,
            y: 70,
        }
    }


    if(keys.plus &&  newTileMapXPer > 5)
    {
        newTileMapXPer = newTileMapXPer - (zoomSpeed * delta)
    }
    if(keys.minus &&  newTileMapXPer < 128)
    {
        newTileMapXPer = newTileMapXPer + (zoomSpeed * delta)
    }

    if(keys.arrowLeft &&  newTileMapXOffset > movementClipping.min.x)
    {
        newTileMapXOffset = newTileMapXOffset - (mapSpeed * delta)
    }
    if(keys.arrowRight &&  newTileMapXOffset < movementClipping.max.x)
    {
        newTileMapXOffset = newTileMapXOffset + (mapSpeed * delta)
    }

    if(keys.arrowUp &&  newTileMapYOffset > movementClipping.min.x)
    {
        newTileMapYOffset = newTileMapYOffset - (mapSpeed * delta)
    }
    if(keys.arrowDown &&  newTileMapYOffset < movementClipping.max.x)
    {
        newTileMapYOffset = newTileMapYOffset + (mapSpeed * delta)
    }

    return {
        ...object.baseTick(object,delta,clipping,keys,Callbacks,collisionList,state) ,
        wallClock: object.wallClock + delta,
        renderData:
        {
            ...object.renderData,
            tileMapXOffset: newTileMapXOffset,
            tileMapYOffset: newTileMapYOffset,
            tileMapXPer: newTileMapXPer,
        }
    }
}

//===============================================================================

export const CreateTiledMapObject = (x,y, renderComponent) =>
{

    let object = CreateGameObject(
        'Map',
        x,y,0,
        0,0,0,
        renderComponent
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = MapTick
    return {
        ...object,
        wallClock: 0,
        renderData:
        {
            tileMapXOffset: 0,
            tileMapYOffset: 0,
            tileMapXPer: 64,
        }
    }
}

//===============================================================================

