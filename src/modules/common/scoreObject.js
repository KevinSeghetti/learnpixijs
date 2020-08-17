import { CreateGameObject } from 'modules/common/gameObject'

export const ScoreObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("ScoreObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state)
    let result = object.baseTick(object,delta,clipping,keys,Callbacks,collisionList,state)

    let newText = "Score:" + state.globals.score.toString()
    return (
        {
            ...result,
            renderData:
            {
                ...result.renderData,
                text: newText
            }
        }
    )
}

//===============================================================================

export const CreateScoreObject = (type,x,y,xDelta,yDelta, renderComponent) =>
{
    let object = {
        ...CreateGameObject(
            type,
            x,y,0,
            xDelta,yDelta,0,
            renderComponent,0,false
        ),
        renderData:
        {
            text:"Score!"
        }
    }

    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = ScoreObjectTick
    return object
}

//===============================================================================

