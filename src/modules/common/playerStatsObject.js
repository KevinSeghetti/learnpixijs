import { CreateGameObject } from 'modules/common/gameObject'

export const PlayerStatsObjectTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("PlayerStatsObjectTick",object,delta,clipping,keys,Callbacks,collisionList,state,ChangePlayerStats)
    let result = object.baseTick(object,delta,clipping,keys,Callbacks,collisionList,state)

    let newText = "Lives:" + state.globals.playerLives.toString()
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

export const CreatePlayerStatsObject = (type,x,y,xDelta,yDelta, renderComponent) =>
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
            text:"PlayerStats!"
        }
    }

    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = PlayerStatsObjectTick
    return object
}

//===============================================================================

