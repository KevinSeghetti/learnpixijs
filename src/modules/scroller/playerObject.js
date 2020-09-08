// modules/common/player.js

import { CreateGameObject } from 'modules/common/gameObject'
import { PlayerStates } from 'modules/common/playerObject'
import { Seconds,RatePerSecond, PixelsPerSecond } from 'modules/common/time'
import { CreatePlatformPositionAffector } from 'modules/common/positionAffectors'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("playerObject")  // eslint-disable-line no-unused-vars

export { PlayerStates }

//===============================================================================

export const PlayerTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    log.trace("PlayerObjectTick:",object,delta,clipping,keys,Callbacks,collisionList,state)
    //log.trace("PlayerTick:keys",keys)

    let newObject = object.baseTick(object,delta,clipping,keys,Callbacks,collisionList,state)

    const playerSpeed = PixelsPerSecond(250)
    const deadTime = Seconds(2)

    let lastGenerated = object.lastGenerated
    let playerState = state.globals.playerState
    //log.trace("playerstate",playerState)
    let animation = newObject.animation

    if(playerState === PlayerStates.DYING)
    {
        if(state.globals.playerLives <= 0)
        {
            Callbacks.ChangePlayerState(PlayerStates.DEAD)
            Callbacks.GameOver()
        }

        if(newObject.wallClock > lastGenerated+deadTime && state.globals.playerLives > 0)
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

    }

    return {
        ...newObject,
        wallClock: object.wallClock + delta,
        lastGenerated: lastGenerated,
        animation: animation,
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
        positionAffectors: [
            CreatePlatformPositionAffector(x,y,0,"Platform"),
        ],
    }
}

//===============================================================================

