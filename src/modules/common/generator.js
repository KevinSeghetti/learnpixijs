// modules/common/generator.js
//===============================================================================

export const GeneratorObjectTick = (object,delta,clipping,AddGameObject) =>
{
    //object.wallClock
    //console.log("GeneratorObjectTick:",object,delta,clipping,AddGameObject)
    let lastGenerated = object.lastGenerated
    if(object.wallClock > object.lastGenerated+object.rate)
    {
        lastGenerated += object.rate
        let x = object.position.x + (object.size.x*Math.random())
        let y = object.position.y + (object.size.y*Math.random())
        //console.log("calling add game object")
        AddGameObject(object.generateObject(x,y))
    }
    return {
     ...object,
     wallClock: object.wallClock + delta,
     lastGenerated: lastGenerated,
    }
}

//===============================================================================

export const CreateGeneratorObject = (x,y,sizeX,sizeY, rate, GenerateObject) =>
{
    //console.log("CreateGeneratorObject:",x,y,sizeX,sizeY, rate, GenerateObject)
    return {
        position:
        {
            x: x,
            y: y,
        },
        size:
        {
            x: sizeX,
            y: sizeY,
        },
        wallClock: 0,
        rate: rate,
        lastGenerated: 0,
        tick: GeneratorObjectTick,
        generateObject: GenerateObject,
        frameIndex: -1,
    }
}

//===============================================================================

