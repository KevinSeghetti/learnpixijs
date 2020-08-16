import { CreateFallingObject } from 'modules/common/fallingObject'

export const BulletObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("BulletObjectTick",object,delta,clipping,keys,AddGameObject,collisionList)

    if(collisionList.length)
       // collided with anything
    {   // at any edge of screen, time to delete
        return null
    }

    return object.fallTick(object,delta,clipping,keys,AddGameObject,collisionList)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateBulletObject = (x,y,xDelta,yDelta, renderComponent, frameIndex) =>
{
    let object = CreateFallingObject(
        x,y,
        xDelta,yDelta,
        renderComponent,frameIndex
    )
    object.fallTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = BulletObjectTick
    return object
}

//===============================================================================

