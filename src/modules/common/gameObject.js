// modules/common/gameObject.js
//===============================================================================

// falling object deletes itself when it reaches the bottom of the screen

export const FallingObjectTick = (object,delta,clipping,keys,AddGameObject) =>
{
    //console.log("FallingObjectTick",object,delta,clipping)

    if(object.position.y === clipping.max.y)
    {   // at the bottom of the screen, time to delete
        return null
    }

    return object.baseTick(object,delta,clipping,keys,AddGameObject)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateFallingObject = (x,y,frameIndex) =>
{
    let object = CreateGameObject(
        x,y,0,
        0,5,0,
        frameIndex
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = FallingObjectTick
    return object

}

//===============================================================================

export const CreateGameObject = (x,y,rotation,vx,vy,rv, frameIndex) =>
{
    //console.log("CreateGameObject",x,y,rotation,vx,vy,rv, frameIndex)
    return {
        position:
        {
            x: x,
            y: y,
            r: rotation,
        },
        velocity:
        {
            x: vx,
            y: vy,
            r: rv,
        },
        tick: GameObjectTick,
        frameIndex: frameIndex,
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

export const GameObjectTick = (object,delta,clipping,keys,AddGameObject) =>
{
    //console.log("GameObjectTick",object,delta,clipping)

    let position = MoveObject(object,delta,clipping)
    return {
     ...object,
     position : position,
     velocity : UpdateObjectSpeed(position,object.velocity,delta,clipping)
    }
}

//===============================================================================

