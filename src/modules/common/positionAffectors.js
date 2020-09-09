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

const VelocityPositionAffectorTick = (affector,object,delta,clipping/*,gameObjects,keys*/) =>
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

    let newPos = MoveObject(affector,delta,clipping)
    let velocity = VelocityUpdateObjectSpeed(newPos,affector.velocity,delta,clipping)

    return (
    {
        ...affector,
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
// kts TODO move this elsewhere
// form AABB bounding box, around where we were and where we are going
let SurroundingBox = (pos1, pos2, size) =>
{
    let min = { x:Math.min(pos1.x,pos2.x), y:Math.min(pos1.y,pos2.y) }
    let max = { x:Math.min(pos1.x+size.x,pos2.x+size.x), y:Math.min(pos1.y+size.y,pos2.y+size.y) }
    return {min, max}
}

//===============================================================================

const PlatformPositionAffectorTick = (affector,object,delta,clipping,gameObjects,keys) =>
{
    log.trace("PlatformPositionAffectorTick",affector,delta,clipping,gameObjects)
    let onGround = false

    const playerSpeed = PixelsPerSecond(250)
    const playerJumpSpeed = PixelsPerSecond(25)
    const gravity = PixelsPerSecond(0.2)

    // see if we are standing on anything
    let platformObjects = FindGameObjects(gameObjects,"Platform")

    const PlatformUpdateObjectSpeed = (velocity,acceleration,delta,clipping) =>
    {
        //log.trace("PlatformPositionAffectorTick:PlatformUpdateObjectSpeed",velocity,acceleration,delta,clipping,platformObjects)

        // apply dampening, so objects come to a stop if no forces act on them.
        // kts TODO: consider turning this into actual drag. or maybe just on x axis when on the ground
        const dampeningX = 0.05
        const dampeningY = 1.0
        const dampeningR = 0.05
        let newVelocityX = velocity.x * (dampeningX*delta)
        let newVelocityY = velocity.y //  * (dampeningY*delta)
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

    let newPos = MoveObject(affector,delta,clipping)
    log.trace("PlatformPositionAffectorTick: newPos",newPos,clipping,affector)
    let acceleration = affector.acceleration

    acceleration.x = 0
    acceleration.y = 0

    if(keys.arrowLeft)
    {
        acceleration.x += -playerSpeed * delta
    }
    if(keys.arrowRight)
    {
        acceleration.x += playerSpeed * delta
    }

    acceleration.y += gravity * delta       // gravity

    if(keys.space && affector.onGround)
    {
        acceleration.y -= playerJumpSpeed * delta
    }

    //log.trace("@@",acceleration)

    const maxVelocityX = PixelsPerSecond(500)
    const maxVelocityY = PixelsPerSecond(2000)
    const velocityClipping = {
        min:
        {
            x:-maxVelocityX,
            y:-maxVelocityY,
        },
        max:
        {
            x:maxVelocityX,
            y:maxVelocityY,
        }

    }

    let velocity = PlatformUpdateObjectSpeed(affector.velocity,acceleration,delta,velocityClipping)
    log.trace("PlatformPositionAffectorTick: affvelocity",affector.ddvelocity)
    log.trace("PlatformPositionAffectorTick: velocity",velocity)
    log.trace("PlatformPositionAffectorTick: acceleration",acceleration)

    // now check to see if we have collided with anything in the tile map

    let movementBox = SurroundingBox(affector.position, newPos, object.renderComponent.gameData.size)
    //console.log("@@",movementBox)
    // ok, which way are we going


    platformObjects.forEach( (entry) =>
    {
        // for each platform, look up our current position in it
        //log.trace("PlatformPositionAffectorTick: check",entry.renderComponent.gameData.map)


        let hitSomething = false
        let tileXSize = entry.renderComponent.gameData.map.tilewidth
        let tileYSize = entry.renderComponent.gameData.map.tileheight
        for(let x = movementBox.min.x; x < movementBox.max.x;x+=tileXSize)
        {
            for(let y = movementBox.min.y; y < movementBox.max.y;y+=tileYSize)
            {
                let tileIndex = FindTileInMap(entry.renderComponent.gameData.map,newPos)
                if(tileIndex !== 0)
                {
                    hitSomething = true
                }
            }
        }

        if(hitSomething)
        {
            // ok, time to do sub-frame advancement, one pixel at a time
            let xDelta = newPos.x-affector.position.x
            let yDelta = newPos.y-affector.position.y
            let stepCount = Math.ceil(Math.max(Math.abs(xDelta),Math.abs(yDelta)))

            let prevX = affector.position.x
            let prevY = affector.position.y
            let xStep = xDelta/stepCount
            let yStep = yDelta/stepCount
            let newX = prevX
            let newY = prevY

            log.trace("PlatformPositionAffectorTick:subframe",{origPos:affector.position,newPos, stepCount,xDelta, yDelta,xStep,yStep})

            for(let step = 1; step <= stepCount;step++)
            {   // bressenham style, increment through both movements together, but only one at a time
                newX = affector.position.x+(xStep*step)
                newY = affector.position.y+(yStep*step)
                //console.log("@@",step,xStep,yStep,newX,newY)
                if(step === stepCount)
                {
                    log.trace("PlatformPositionAffectorTick:newpos",{newX,newY,step,stepCount})
                    log.trace("PlatformPositionAffectorTick:newdelta",xStep*step,yStep*step)
                }

                let tileIndex = FindTileInMap(entry.renderComponent.gameData.map,{x:newX,y:prevY})
                if(tileIndex !== 0)
                {
                    newX = prevX        // stop updating X if we hit
                    xStep = 0
                    velocity.x = 0
                    log.trace("PlatformPositionAffectorTick:X hit",step)
                }

                tileIndex = FindTileInMap(entry.renderComponent.gameData.map,{x:newX,y:newY})
                if(tileIndex !== 0)
                {
                    newY = prevY        // stop updating Y if we hit
                    velocity.y = 0
                    yStep = 0
                    if(yDelta > 0)
                    {
                        onGround = true         // kludge flag for when standing on ground
                    }
                    log.trace("PlatformPositionAffectorTick:Y hit",step)
                }

                prevX=newX
                prevY=newY
            }

            log.trace("PlatformPositionAffectorTick: results",{origpos:affector.position, newPos,newX,newY})
            newPos = { x:newX, y:newY,r:0}
            //newPos = affector.position
//              velocity =
//                      {
//                          x:0,
//                          y:0,
//                          r:0,
//                      }

        }

//      let tileIndex = FindTileInMap(entry.renderComponent.gameData.map,newPos)
//      if(tileIndex !== 0)
//      {
//          newPos.y = affector.position.y
//          velocity =
//                  {
//                      ...velocity,
//                      y:0,
//                  }
//
//      }
    }
    )

    //log.trace("PlatformPositionAffectorTick: new velocity",velocity)

    return (
    {
        ...affector,
        position: newPos,
        velocity: velocity,
        onGround,
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

const ObjectFollowPositionAffectorTick = (affector,object,delta,clipping,gameObjects/*,keys*/) =>
{
    let newPosition = affector.position
    let followObject = FindGameObject(gameObjects,affector.followName)
    if(followObject)
    {
        newPosition =
        {
            x:followObject.position.x+affector.positionOffset.x,
            y:followObject.position.y+affector.positionOffset.y,
        }
    }
    return (
    {
        ...affector,
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

