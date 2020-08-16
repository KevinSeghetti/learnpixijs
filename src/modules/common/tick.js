// modules/common/tick.js
//===============================================================================

const CheckCollision = (first,second) =>
{
    //console.log("CheckCollision:first",first)
    //console.log("CheckCollision:second",second)
    if(first.renderComponent && second.renderComponent)
    {
        let firstSize = first.renderComponent.gameData.size
        let secondSize = second.renderComponent.gameData.size

        if(
            first.position.x               < second.position.x + secondSize.x &&
            first.position.x + firstSize.x > second.position.x &&
            first.position.y               < second.position.y + secondSize.y &&
            first.position.y + firstSize.y > second.position.y)
        {
            return true
        }
    }
    return false
}

//===============================================================================

export const GameTick = (gameObjects,delta,keys,clipping) =>
{
    //console.log("GameTick",gameObjects,delta,keys,clipping)

    // do collision detection
    // for now, full NxM checking

    // collisionList has an entry for each game object, containing an array of other objects that object overlaps with
    let collisionList = []

    gameObjects.forEach( (entry,index) =>
    {
        let collides = true
        if(entry.collision)
        {
            collides = entry.collision.collides
        }

        if(collides)
        {
            // inner loop. Go over every object comparing to this one
            gameObjects.forEach( (innerEntry,innerIndex) =>
                {
                    collisionList.push([])

                    let innerCollides = true
                    if(innerEntry.collision)
                    {
                        innerCollides = innerEntry.collision.collides
                    }
                    if(index !== innerIndex && CheckCollision(entry,innerEntry) && innerCollides)
                    {
                        collisionList[index].push(innerEntry)       // trust javascript to make these references
                    }
                }
            )
        }
    }
    )

    //console.log("collsionList",collisionList)
    // tick all objects
    let newGameObjects = []

    const AddGameObject = (object) =>
    {
        //console.log("AddGameObject",object)
        newGameObjects.push(object)
    }
    let resultingGameObjects = gameObjects.map( (entry,index) => entry.tick(entry,delta,clipping,keys,AddGameObject,collisionList[index]) )
    .filter(x => x)

    return [...resultingGameObjects, ...newGameObjects ]
}

//===============================================================================

