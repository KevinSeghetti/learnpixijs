import { types as scrollerTypes } from 'modules/scroller/index'
import { CreateGameObject } from 'modules/common/gameObject'
import { CreateObjectFollowPositionAffector } from 'modules/common/positionAffectors'

//===============================================================================

export const CreateCameraObject = (name) =>
{
    let object =
        CreateGameObject(
            'Camera',
            0,0,0,
            0,0,0,
            null,0
        )

    //object.baseTick = object.tick
    //object.tick = CameraTick
    //object.followObject = name

    let positionOffset =
    {
        x: -scrollerTypes.stageOptions.width/2,
        y: -scrollerTypes.stageOptions.height/2,

    }

    return (
        {
            ...object,
            positionAffectors: [
                CreateObjectFollowPositionAffector(name,positionOffset),
            ],

        }
    )
}

//===============================================================================

