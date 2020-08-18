// modules/common/player.js

import { CreateGameObject } from 'modules/common/gameObject'
import { Seconds,RatePerSecond, PixelsPerSecond } from 'modules/common/time'

//===============================================================================

export const PlayerStates =
{
    INVALID: 0,
    PLAYING: 1,
    DYING:   2,          // playing explosion animation
    DEAD:    3,           // no more lives, so between games
}

//===============================================================================

export const PlayerTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("PlayerObjectTick:",object,delta,clipping,keys,Callbacks,collisionList,state)
    //console.log("PlayerTick:keys",keys)

    const playerSpeed = PixelsPerSecond(250)
    const deadTime = Seconds(2)

    let lastGenerated = object.lastGenerated
    let xDelta = 0
    let playerState = state.globals.playerState
    console.log("playerstate",playerState)
    let animation = object.animation

    if(playerState === PlayerStates.DYING)
    {
        if(state.globals.playerLives <= 0)
        {
            Callbacks.ChangePlayerState(PlayerStates.DEAD)
            Callbacks.GameOver()
        }

        if(object.wallClock > lastGenerated+deadTime && state.globals.playerLives > 0)
        {
            Callbacks.ChangePlayerState(PlayerStates.PLAYING)
            Callbacks.ChangePlayerLives(-1)
            animation = { ...animation, frameIndex: 0 }
        }
    }

    if(playerState === PlayerStates.PLAYING)
    {
        // list of objects that kill us
        let localCollisionList = collisionList.filter( entry => [ 'Enemy', ].includes(entry.type))

        if(localCollisionList.length)
           // collided with something that can kill us
        {
            let x = object.position.x
            let y = object.position.y
            Callbacks.AddGameObject(object.explosionFactory(x,y))
            Callbacks.ChangePlayerState(PlayerStates.DYING)
            // we don't kill this object, we just transition its state
            lastGenerated = object.wallClock            // borrow fire rate variable for how long to be dead
            animation = { ...animation, frameIndex: -1 }

            //return null     // kill ourselves
        }

        if(keys.arrowLeft &&  object.position.x > clipping.min.x)
        {
            xDelta = -playerSpeed * delta
        }
        if(keys.arrowRight &&  object.position.x < clipping.max.x)
        {
            xDelta = playerSpeed * delta
        }

        if(keys.space && object.wallClock > object.lastGenerated+object.fireRate )
        {
            Callbacks.AddGameObject(object.bulletFactory(object.position.x,object.position.y-40) )
            lastGenerated = object.wallClock
        }
        else
        {
            //lastGenerated = object.wallCLock - object.fireRate
        }

    }

    return {
        ...object,
        animation: animation,
        position: {...object.position, x:object.position.x + xDelta },
        wallClock: object.wallClock + delta,
        lastGenerated: lastGenerated,
    }
}

//===============================================================================

export const CreatePlayerObject = (x,y, renderComponent, bulletFactory,explosionFactory) =>
{
    let object = CreateGameObject(
        'Player',
        x,y,0,
        0,5,0,
        renderComponent
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = PlayerTick
    return {
        ...object,
        lastGenerated: 0,
        bulletFactory: bulletFactory,
        explosionFactory: explosionFactory,
        fireRate: RatePerSecond(10),
        wallClock: 0,
    }
}

//===============================================================================

