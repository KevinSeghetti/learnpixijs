import { CreateFallingObject } from 'modules/common/fallingObject'

export const BulletObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("BulletObjectTick",object,delta,clipping,keys,AddGameObject,collisionList)

    // list of objects that kill us
    let localCollisionList = collisionList.filter( entry => [ 'Enemy', 'Rock'].includes(entry.type))

    if(localCollisionList.length)
    {   // collided with something
        return null
    }

    return object.fallTick(object,delta,clipping,keys,AddGameObject,collisionList)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateBulletObject = (x,y,xDelta,yDelta, renderComponent) =>
{
    let object = CreateFallingObject(
        'Bullet',
        x,y,
        xDelta,yDelta,
        renderComponent
    )
    object.fallTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = BulletObjectTick
    return object
}

//===============================================================================

