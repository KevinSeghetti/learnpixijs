import { CreateFallingObject } from 'modules/common/fallingObject'

export const EnemyObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("EnemyObjectTick",object,delta,clipping,keys,AddGameObject,collisionList)

    if(collisionList.length)
       // collided with anything
    {
        let x = object.position.x
        let y = object.position.y
        //console.log("calling add game object")
        AddGameObject(object.explosionFactory(x,y))

        return null
    }

    return object.fallTick(object,delta,clipping,keys,AddGameObject,collisionList)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateEnemyObject = (x,y,xDelta,yDelta, renderComponent, frameIndex,ExplosionFactory) =>
{
    let object = CreateFallingObject(
        x,y,
        xDelta,yDelta,
        renderComponent,frameIndex
    )
    object.fallTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = EnemyObjectTick
    object.explosionFactory = ExplosionFactory
    return object
}

