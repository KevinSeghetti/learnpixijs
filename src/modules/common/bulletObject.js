import { CreateFallingObject } from 'modules/common/fallingObject'

// kts TODO: move scoring into common file
const Score = {
    Enemy: 10,
}

export const BulletObjectTick = (object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore) =>
{
    //console.log("BulletObjectTick",object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore)

    // list of objects that kill us
    let localCollisionList = collisionList.filter( entry => [ 'Enemy', 'Rock'].includes(entry.type))

    // check for scores
    collisionList.forEach( (entry) =>
        {
            if(entry.type === 'Enemy')
            {
                ChangeScore(Score.Enemy)
            }
        }
    )

    if(localCollisionList.length)
    {   // collided with something


        // kill self
        return null
    }

    return object.fallTick(object,delta,clipping,keys,AddGameObject,collisionList,state,ChangeScore)
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

