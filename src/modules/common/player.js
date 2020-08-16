// modules/common/player.js

import { CreateGameObject } from 'modules/common/gameObject'

//===============================================================================

export const PlayerTick = (object,delta,clipping,keys,AddGameObject) =>
{
    //object.wallClock
    //console.log("PlayerObjectTick:",object,delta,clipping,keys,AddGameObject)
    //console.log("PlayerTick:keys",keys)
//    let lastGenerated = object.lastGenerated
//  if(object.wallClock > object.lastGenerated+object.rate)
//  {
//      lastGenerated += object.rate
//      let x = object.position.x + (object.size.x*Math.random())
//      let y = object.position.y + (object.size.y*Math.random())
//      //console.log("calling add game object")
//      AddGameObject(object.generateObject(x,y))
//  }


    const playerSpeed = 2
    let xDelta = 0

    if(keys.arrowLeft &&  object.position.x > clipping.min.x)
    {
        xDelta = -playerSpeed * delta
    }
    if(keys.arrowRight &&  object.position.x < clipping.max.x)
    {
        xDelta = playerSpeed * delta
    }


    let newX = object.position.x + xDelta

    if(keys.space)
    {
        AddGameObject(object.createBullet(object.position.x,object.position.y) )
    }

    return {
        ...object,
        position: {...object.position, x:newX }
    }
}

//===============================================================================

export const CreatePlayerObject = (x,y,frameIndex,CreateBullet) =>
{
    let object = CreateGameObject(
        x,y,0,
        0,5,0,
        frameIndex
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = PlayerTick
    return {
        ...object,
        lastGenerated: 0,
        createBullet: CreateBullet,
    }
}

//===============================================================================

