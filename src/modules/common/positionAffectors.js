// modules/common/positionAffectors.js

import { FindGameObjects,FindGameObject } from 'modules/common/gameObject'
import { FindTileInMap } from 'modules/common/tiledMapObject'
import { PixelsPerSecond } from 'modules/common/time'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("positionAffectors") // eslint-disable-line no-unused-vars

//===============================================================================
// given a 2D vector of x,y, clip it to be within the clipping range of min,max

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
    //log.trace("MoveObject",object,delta,clipping)
    let newX = object.position.x + (object.velocity.x*delta)
    let newY = object.position.y + (object.velocity.y*delta)
    let newR = object.position.r + (object.velocity.r*delta)
    //log.trace("MoveObject:new",newX,newY,newR)
    let clipped = ClipPosition({x:newX,y:newY},clipping)




    let clippedR = newR

    //log.trace("MoveObject",object,delta,{newX,newY},{clippedX,clippedY})
    return (
        {
               ...clipped,
               r: clippedR
        }
    )
}

//===============================================================================
// position affectors

const VelocityPositionAffectorTick = (object,delta,clipping/*,gameObjects,keys*/) =>
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

const PlatformPositionAffectorTick = (object,delta,clipping,gameObjects,keys) =>
{
    //log.trace("PlatformPositionAffectorTick",object,delta,clipping,gameObjects)

    const playerSpeed = PixelsPerSecond(250)

    // see if we are standing on anything
    let platformObjects = FindGameObjects(gameObjects,"Platform")

    const PlatformUpdateObjectSpeed = (velocity,acceleration,delta,clipping) =>
    {
        //log.trace("PlatformPositionAffectorTick:PlatformUpdateObjectSpeed",velocity,acceleration,delta,clipping,platformObjects)

        // apply dampening, so objects come to a stop if no forces act on them.
        const dampeningX = 0.05
        const dampeningY = 1.0
        const dampeningR = 0.05
        let newVelocityX = velocity.x * (dampeningX*delta)
        let newVelocityY = velocity.y * (dampeningY*delta)
        let newVelocityR = velocity.r * (dampeningR*delta)

        newVelocityX = newVelocityX + (acceleration.x*delta)
        newVelocityY = newVelocityY + (acceleration.y*delta)
        newVelocityR = newVelocityR + (acceleration.r*delta)

        //log.trace("PlatformPositionAffectorTick:PlatformUpdateObjectSpeed:new",newX,newY,newR)
        let clippedPos = ClipPosition({x:newVelocityX,y:newVelocityY},clipping)

        let clippedR = newVelocityR

        //log.trace("PlatformPositionAffectorTick:PlatformUpdateObjectSpeed:new",{newX,newY},{clippedX,clippedY})
        return (
            {
                  ...clippedPos,
                   r: clippedR
            }
        )
    }

    let newPos = MoveObject(object,delta,clipping)
    log.trace("PlatformPositionAffectorTick: newPos",newPos,clipping,object)
    let acceleration = object.acceleration

    acceleration.x = 0

    if(keys.arrowLeft)
    {
        acceleration.x += -playerSpeed * delta
    }
    if(keys.arrowRight)
    {
        acceleration.x += playerSpeed * delta
    }

    //log.trace("@@",acceleration)

    const maxSpeedX = PixelsPerSecond(100)
    const maxSpeedY = PixelsPerSecond(300)
    const speedClipping = {
        min:
        {
            x:-maxSpeedX,
            y:-maxSpeedY,
        },
        max:
        {
            x:maxSpeedX,
            y:maxSpeedY,
        }

    }
    let velocity = PlatformUpdateObjectSpeed(object.velocity,acceleration,delta,speedClipping)

    // now check to see if we are standing on anything
    // kts TODO: make an AABB of old position to new position, to make sure we don't fall through anything
    platformObjects.forEach( (entry) =>
    {
        // for each platform, look up our current position in it
        //log.trace("PlatformPositionAffectorTick: check",entry.renderComponent.gameData.map)
        let tileIndex = FindTileInMap(entry.renderComponent.gameData.map,newPos)
        if(tileIndex !== 0)
        {
            newPos.y = object.position.y
            velocity =
                    {
                        ...velocity,
                        y:0,
                    }

        }
    }
    )

    //log.trace("PlatformPositionAffectorTick: new velocity",velocity)

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

const ObjectFollowPositionAffectorTick = (object,delta,clipping,gameObjects/*,keys*/) =>
{
    let newPosition = object.position
    let followObject = FindGameObject(gameObjects,object.followName)
    if(followObject)
    {
        newPosition =
        {
            x:followObject.position.x+object.positionOffset.x,
            y:followObject.position.y+object.positionOffset.y,
        }
    }
    return (
    {
        ...object,
        position: newPosition,
    }
    )
}

//===============================================================================

export const CreateObjectFollowPositionAffector = (name,positionOffset) =>
{
    return {
        position:
        {
            x:0,
            y:0,
            r: 0,
        },
        velocity:
        {
            x: 0,
            y: 0,
            r: 0,
        },
        tick: ObjectFollowPositionAffectorTick,
        followName: name,
        positionOffset,
        invert: true,
    }
}


//===============================================================================

