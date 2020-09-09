// modules/common/gameObject.js
//===============================================================================
import { RatePerSecond, } from 'modules/common/time'
import CreateLogger from 'components/loggingConfig'
import { CreateVelocityPositionAffector } from './positionAffectors'

let log = CreateLogger("gameObject")    // eslint-disable-line no-unused-vars

//===============================================================================
// timed object deletes itself after a given duration

export const TimedObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //log.trace("TimedObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state)

    if(object.wallClock > object.duration)
    {   // time to delete oneself
        return null
    }

    return {
        ...object.baseTick(object,delta,clipping,keys,Callbacks,collisionList,state),
        wallClock: object.wallClock+delta
    }
}

//===============================================================================

export const CreateTimedObject = (type,x,y,xDelta,yDelta, renderComponent, duration) =>
{
    let object = CreateGameObject(
        type,x,y,0,
        xDelta,yDelta,0,
        renderComponent
    )

    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = TimedObjectTick
    object.duration = duration
    object.wallClock = 0
    return object

}

//===============================================================================

let GameObjectAnimationRender = (object) =>
{
    let frameIndex = 0

    if(object.animation )
    {
        frameIndex = object.animation.frameIndex
    }

    return (
    {
        x       : object.position.x,
        y       : object.position.y,
        rotation: object.position.r,    // kts stink, rename r to rotation everywhere
        texture : frameIndex,
    }
    )
}

export const GameObjectRender = (object) =>
{
    let animationData = GameObjectAnimationRender(object)

    return {
        ...animationData,
        ...object.renderData,
    }
}

//===============================================================================
// returns first match

export const FindGameObject = (array,name) =>
{
    return array.find( (entry) => entry.type === name)
}

// returns array of all matches
export const FindGameObjects = (array,name) =>
{
    return array.filter( (entry) => entry.type === name)
}

//===============================================================================
// kts TODO: make a better object constructor, one that makes it easy to specify various
// parameters, but doesn't assume things like an animation speed

export const CreateGameObject = (type,x,y,rotation,vx,vy,rv,renderComponent,frameIndex=0,collides=true) =>
{
    //log.trace("CreateGameObject",x,y,rotation,vx,vy,rv, frameIndex)

    let vpa = CreateVelocityPositionAffector(x,y,rotation,vx,vy,rv)
    return {
        type,
        position:   // temporary until affectors have calculated over this
        {
            x,
            y,
            r: rotation,
        },
        positionAffectors: [
            vpa,
        ],
        collision:
        {
            collides, // if 0, then we don't collide with this at all
        },
        animation:
        {
            frameIndex,
            animationSpeed: RatePerSecond(16),
            wallClock: 0,
        },
        tick: GameObjectTick,
        render: GameObjectRender,
        renderComponent,
    }
}

//===============================================================================

export const AnimateObject = (object, delta) =>
{
    //log.trace("AnimateObject",object,delta)
    let frameIndex = object.animation.frameIndex

    let animation = {...object.animation}
    if(object.renderComponent)
    {
        if(object.animation.animationSpeed)
        {
            frameIndex = Math.floor((animation.wallClock/animation.animationSpeed) % object.renderComponent.gameData.frames )
        }

        animation =
        {
            ...animation,
            frameIndex: frameIndex,
            wallClock: animation.wallClock+delta
        }
    }

    return ( animation )
}

//===============================================================================

export const GameObjectUpdatePositionAffectors = (object,delta,clipping,gameObjects,keys) =>
{
    //log.trace("GameObjectUpdatePostionAffectors:",object,delta,clipping,gameObjects,keys)
    return object.positionAffectors.map( (entry) =>
        {
            log.trace("GameObjectUpdatePostionAffectors:entry",entry)
            return entry.tick(entry, object, delta,clipping,gameObjects,keys)
        }
    )
}

export const GameObjectCalculatePositionFromAffectors = (object) =>
{
    //log.trace("GameObjectCalculatePositionFromAffectors:",object)
    let result = object.positionAffectors.reduce( (accumulator,entry) =>
        {

            return (
                {
                    x:accumulator.x+entry.position.x,
                    y:accumulator.y+entry.position.y,
                    r:accumulator.r+entry.position.r,
                }
            )
        }
    , {x:0,y:0,r:0})
    //log.trace("GameObjectCalculatePositionFromAffectors: returns",result)
    return result
}

//===============================================================================

export const GameObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //log.trace("GameObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state)

    let localClipping = object.clipping?object.clipping:clipping

    return {
     ...object,
     positionAffectors: GameObjectUpdatePositionAffectors(object,delta,localClipping,state.gameObjects,keys),
     position: GameObjectCalculatePositionFromAffectors(object),
     animation: AnimateObject(object,delta),
    }
}

//===============================================================================

