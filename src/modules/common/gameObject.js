// modules/common/gameObject.js
//===============================================================================
import { RatePerSecond, } from 'modules/common/time'
import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("gameObject")

//===============================================================================
// timed object deletes itself after a given duration

export const TimedObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("TimedObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state)

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
// kts TODO: make a better object constructor, one that makes it easy to specify various
// parameters, but doesn't assume things like an animation speed

// position affectors

let VelocityPositionAffectorTick = (object,delta,clipping) =>
{
    let newPos = MoveObject(object,delta,clipping)
    let velocity = UpdateObjectSpeed(newPos,object.velocity,delta,clipping)

    return (
    {
        ...object,
        position: newPos,
        velocity: velocity,
    }
    )
}

//===============================================================================

let CreateVelocityPositionAffector = (x,y,rotation,vx,vy,rv) =>
{
    return {
        position:
        {
            x,
            y,
            r: rotation,
        },
        velocity:
        {
            x: vx,
            y: vy,
            r: rv,
        },
        tick: VelocityPositionAffectorTick,
    }
}

//===============================================================================

export const CreateGameObject = (type,x,y,rotation,vx,vy,rv,renderComponent,frameIndex=0,collides=true) =>
{
    //console.log("CreateGameObject",x,y,rotation,vx,vy,rv, frameIndex)

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

const ClipPosition = (position, clipping) =>
{
    //console.log("ClipPosition",position,clipping)
    //console.log("  ", position.x,clipping.min.x,clipping.max.x)
    //console.log("  min", Math.max(position.x,clipping.min.x))
    //console.log("  result",Math.min(Math.max(position.x,clipping.min.x),clipping.max.x))

    return {
        x: Math.min(Math.max(position.x,clipping.min.x),clipping.max.x),
        y: Math.min(Math.max(position.y,clipping.min.y),clipping.max.y),
    }
}

//===============================================================================

export const MoveObject = (object, delta,clipping) =>
{
    //console.log("MoveObject",object,delta,clipping)
    let newX = object.position.x + (object.velocity.x*delta)
    let newY = object.position.y + (object.velocity.y*delta)
    let newR = object.position.r + (object.velocity.r*delta)
    //console.log("new",newX,newY,newR)
    let {x:clippedX, y:clippedY} = ClipPosition({x:newX,y:newY},clipping)

    let clippedR = newR

    //console.log("MoveObject",object,delta,{newX,newY},{clippedX,clippedY})
    return (
        {
               x: clippedX,
               y: clippedY,
               r: clippedR
        }
    )
}

//===============================================================================

export const AnimateObject = (object, delta) =>
{
    //console.log("AnimateObject",object,delta)
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

export const UpdateObjectSpeed = (position,velocity,delta,clipping) =>
{
    let xSpeed = velocity.x
    let ySpeed = velocity.y

    if(position.x === clipping.min.x || position.x === clipping.max.x)
    {
        xSpeed = - xSpeed
    }
    if(position.y === clipping.min.y || position.y === clipping.max.y)
    {
        ySpeed = - ySpeed
    }

    return {
        x: xSpeed,
        y: ySpeed,
        r: velocity.r
    }
}

//===============================================================================

let GameObjectUpdatePositionAffectors = (object,delta,clipping) =>
{
    //log.trace("GameObjectUpdatePostionAffectors:",object,delta,clipping)
    return object.positionAffectors.map( (entry) =>
        {
            return entry.tick(entry,delta,clipping)
        }
    )
}

let GameObjectCalculatePositionFromAffectors = (object) =>
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


export const GameObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("GameObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state)

    let localClipping = object.clipping?object.clipping:clipping

    return {
     ...object,
     positionAffectors: GameObjectUpdatePositionAffectors(object,delta,localClipping),
     position: GameObjectCalculatePositionFromAffectors(object),
     animation: AnimateObject(object,delta),
    }
}

//===============================================================================

