// modules/common/positionAffectors.js

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("positionAffectors") // eslint-disable-line no-unused-vars

//===============================================================================

const ClipPosition = (position, clipping) =>
{
    //log.trace("ClipPosition",position,clipping)
    //log.trace("  ", position.x,clipping.min.x,clipping.max.x)
    //log.trace("  min", Math.max(position.x,clipping.min.x))
    //log.trace("  result",Math.min(Math.max(position.x,clipping.min.x),clipping.max.x))

    return {
        x: Math.min(Math.max(position.x,clipping.min.x),clipping.max.x),
        y: Math.min(Math.max(position.y,clipping.min.y),clipping.max.y),
    }
}

//===============================================================================

const MoveObject = (object, delta,clipping) =>
{
    log.trace("MoveObject",object,delta,clipping)
    let newX = object.position.x + (object.velocity.x*delta)
    let newY = object.position.y + (object.velocity.y*delta)
    let newR = object.position.r + (object.velocity.r*delta)
    log.trace("MoveObject:new",newX,newY,newR)
    let {x:clippedX, y:clippedY} = ClipPosition({x:newX,y:newY},clipping)

    let clippedR = newR

    //log.trace("MoveObject",object,delta,{newX,newY},{clippedX,clippedY})
    return (
        {
               x: clippedX,
               y: clippedY,
               r: clippedR
        }
    )
}

//===============================================================================
// position affectors

const VelocityPositionAffectorTick = (object,delta,clipping) =>
{

    const VelocityUpdateObjectSpeed = (position,velocity,delta,clipping) =>
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

    let newPos = MoveObject(object,delta,clipping)
    let velocity = VelocityUpdateObjectSpeed(newPos,object.velocity,delta,clipping)

    return (
    {
        ...object,
        position: newPos,
        velocity: velocity,
    }
    )
}

//===============================================================================

export const CreateVelocityPositionAffector = (x,y,rotation,vx,vy,rv) =>
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

const PlatformPositionAffectorTick = (object,delta,clipping) =>
{
    log.trace("PlatformPositionAffectorTick",object,delta,clipping)
    const PlatformUpdateObjectSpeed = (newPos,object,delta,clipping) =>
    {
        log.trace("PlatformPositionAffectorTick:PlatformUpdateObjectSpeed",object,delta,clipping)

        //log.trace("MoveObject",object,delta,clipping)
        let newX = object.velocity.x + (object.acceleration.x*delta)
        let newY = object.velocity.y + (object.acceleration.y*delta)
        let newR = object.velocity.r + (object.acceleration.r*delta)
        //log.trace("new",newX,newY,newR)
        let {x:clippedX, y:clippedY} = ClipPosition({x:newX,y:newY},clipping)

        let clippedR = newR

        //log.trace("MoveObject",object,delta,{newX,newY},{clippedX,clippedY})
        return (
            {
                   x: clippedX,
                   y: clippedY,
                   r: clippedR
            }
        )
    }

    let newPos = MoveObject(object,delta,clipping)
    let velocity = PlatformUpdateObjectSpeed(newPos,object,delta,clipping)
    log.trace("PlatformPositionAffectorTick: new velocity",velocity)

    return (
    {
        ...object,
        position: newPos,
        velocity: velocity,
    }
    )
}

//===============================================================================
// falling physics, with collisions with background
// platformName is the name of the tile mapped playfield we are doing collisions with

export const CreatePlatformPositionAffector = (x,y,rotation,platformName) =>
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
            x: 0,
            y: 0,
            r: 0,
        },
        acceleration:
        {
            x: 0,
            y: 0.001,
            r: 0,
        },

        tick: PlatformPositionAffectorTick,
    }
}

//===============================================================================

