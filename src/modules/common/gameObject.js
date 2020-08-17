// modules/common/gameObject.js
//===============================================================================
import { RatePerSecond, } from 'modules/common/time'

//===============================================================================
// timed object deletes itself after a given duration

export const TimedObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore) =>
{
    //console.log("TimedObjectTick",object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore)

    if(object.wallClock > object.duration)
    {   // time to delete oneself
        return null
    }

    return {
        ...object.baseTick(object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore),
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

export const CreateGameObject = (type,x,y,rotation,vx,vy,rv,renderComponent,frameIndex=0,collides=true) =>
{
    //console.log("CreateGameObject",x,y,rotation,vx,vy,rv, frameIndex)
    return {
        type,
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

export const GameObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore) =>
{
    //console.log("GameObjectTick",object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore)

    let localClipping = object.clipping?object.clipping:clipping

    let position = MoveObject(object,delta,localClipping)
    return {
     ...object,
     position : position,
     velocity : UpdateObjectSpeed(position,object.velocity,delta,localClipping),
     animation: AnimateObject(object,delta),
    }
}

//===============================================================================

