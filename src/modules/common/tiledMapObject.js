// modules/common/tiledMapObject.js

import { CreateGameObject } from 'modules/common/gameObject'
import { PixelsPerSecond } from 'modules/common/time'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("tiledMapObject")

//===============================================================================

export const TiledMapTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("TiledMapObjectTick:",object,delta,clipping,keys,Callbacks,collisionList,state)
    //console.log("TiledMapTick:keys",keys)

    let newTileMapXOffset = object.renderData.tileMapXOffset
    let newTileMapYOffset = object.renderData.tileMapYOffset
    let newTileMapXPer = object.renderData.tileMapXPer

    const mapSpeed = object.mapSpeed
    const zoomSpeed = object.zoomSpeed         // not really pixels

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

export const CreateTiledMapObject = (x,y, renderComponent, name, tileMapXPer) =>
{

    let object = {
        ...CreateGameObject(
            name,
            x,y,0,
            0,PixelsPerSecond(0),PixelsPerSecond(0),
            renderComponent,
        ),
        mapSpeed : PixelsPerSecond(25),
        zoomSpeed: PixelsPerSecond(10),            // not really pixels

    }

    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = TiledMapTick
    return {
        ...object,
        wallClock: 0,
        renderData:
        {
            tileMapXOffset: 0,
            tileMapYOffset: 0,
            tileMapXPer,
        },
        honorCamera: false,
    }
}

//===============================================================================

export const FindTileInMap = (map,position) =>
{
    log.trace("FindTileInMap",map,position)

    let layer = map.layers[0]
    let tileX = Math.floor(position.x/map.tilewidth )
    let tileY = Math.floor(position.y/map.tileheight)
    let tileIndex = (tileY*layer.width)+tileX
    let tileValue = layer.data[tileIndex]
    log.trace("FindTileInMap: ",tileX,tileY)
    log.trace("FindTileInMap: result",tileValue)
    return tileValue
}

//===============================================================================

