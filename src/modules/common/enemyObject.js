import { CreateFallingObject } from 'modules/common/fallingObject'

export const EnemyObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList) =>
{
    //console.log("EnemyObjectTick",object,delta,clipping,keys,AddGameObject,collisionList)

    // list of objects that kill us
    let localCollisionList = collisionList.filter( entry => [ 'Player', 'Rock', 'Bullet'].includes(entry.type))

    if(localCollisionList.length)
       // collided with anything
    {
        let x = object.position.x
        let y = object.position.y
        AddGameObject(object.explosionFactory(x,y))
        return null     // kill ourselves
    }

    return object.fallTick(object,delta,clipping,keys,AddGameObject,collisionList)
    // will eventually want a taller clipping window for this
}

//===============================================================================

export const CreateEnemyObject = (x,y,xDelta,yDelta, renderComponent,ExplosionFactory) =>
{
    let object = CreateFallingObject(
        'Enemy',
        x,y,
        xDelta,yDelta,
        renderComponent
    )
    object.fallTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = EnemyObjectTick
    object.explosionFactory = ExplosionFactory
    return object
}

