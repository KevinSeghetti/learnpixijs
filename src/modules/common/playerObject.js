// modules/common/player.js

import { CreateGameObject } from 'modules/common/gameObject'
import { MILLISECONDS, RatePerSecond, PixelsPerSecond } from 'modules/common/time'

//===============================================================================

export const PlayerTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("PlayerObjectTick:",object,delta,clipping,keys,AddGameObject,collisionList)
    //console.log("PlayerTick:keys",keys)

    const playerSpeed = PixelsPerSecond(250)
    let xDelta = 0
    let lastGenerated = object.lastGenerated

    if(keys.arrowLeft &&  object.position.x > clipping.min.x)
    {
        xDelta = -playerSpeed * delta
    }
    if(keys.arrowRight &&  object.position.x < clipping.max.x)
    {
        xDelta = playerSpeed * delta
    }


    let newX = object.position.x + xDelta

    if(keys.space && object.wallClock > object.lastGenerated+object.fireRate )
    {
        AddGameObject(object.createBullet(object.position.x,object.position.y-40) )
        lastGenerated = object.wallClock
    }
    else
    {
        //lastGenerated = object.wallCLock - object.fireRate
    }

    return {
        ...object,
        position: {...object.position, x:newX },
        wallClock: object.wallClock + delta,
        lastGenerated: lastGenerated,
    }
}

//===============================================================================

export const CreatePlayerObject = (x,y, renderComponent, frameIndex, CreateBullet) =>
{
    let object = CreateGameObject(
        'Player',
        x,y,0,
        0,5,0,
        renderComponent, frameIndex,
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = PlayerTick
    return {
        ...object,
        lastGenerated: 0,
        createBullet: CreateBullet,
        fireRate: RatePerSecond(10),
        wallClock: 0,
    }
}

//===============================================================================

