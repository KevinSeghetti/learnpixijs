import { CreateGameObject } from 'modules/common/gameObject'


// falling object moves, deletes itself when it reaches any edge of the screen


export const FallingObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("FallingObjectTick",object,delta,clipping)

    if(
       object.position.x === clipping.max.y ||
       object.position.x === clipping.min.y ||
       object.position.y === clipping.min.y ||
       object.position.y === clipping.max.y
    )
    {   // at any edge of screen, time to delete
        return null
    }

    return object.baseTick(object,delta,clipping,keys,AddGameObject,collisionList)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateFallingObject = (type="Falling",x,y,xDelta,yDelta, renderComponent) =>
{
    let object = CreateGameObject(
        type,
        x,y,0,
        xDelta,yDelta,0,
        renderComponent
    )
    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort
    object.tick = FallingObjectTick
    return object
}

//===============================================================================

