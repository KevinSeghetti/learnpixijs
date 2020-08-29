// modules/common/attractObject.js

import { CreateGameObject } from 'modules/common/gameObject'

//===============================================================================

export const AttractTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("AttractTick",keys)
    if(keys.enter)
    {
        Callbacks.StartNewGame()
    }
    return object
}

//===============================================================================

export const CreateAttractObject = () =>
{
    let object = CreateGameObject(
        'attract',
        0,0,0,
        0,5,0,
        null
    )
    object.baseTick = object.tick
    object.tick = AttractTick
    return object
}

//===============================================================================

