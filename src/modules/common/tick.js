// modules/common/tick.js
//===============================================================================

export const GameTick = (gameObjects,delta,clipping) =>
{
    //console.log("GameTick",gameObjects,delta,clipping)
    let newGameObjects = []

    const AddGameObject = (object) =>
    {
        //console.log("AddGameObject",object)
        newGameObjects.push(object)
    }
    let resultingGameObjects = gameObjects.map( (entry,index) => entry.tick(entry,delta,clipping,AddGameObject) )
    .filter(x => x)

    return [...resultingGameObjects, ...newGameObjects ]
}

//===============================================================================

