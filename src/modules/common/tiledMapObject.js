// modules/common/tiledMapObject.js

// kts smell
import {
    PlayerComponent,
    BulletComponent,
    EnemyComponent,
    ExplosionComponent,
    RockComponent,
    TileSetComponent,
    BackgroundComponent,
    MapComponent,
    TextComponent,
} from "containers/scroller/Assets";

import { types as scrollerTypes } from 'modules/scroller/index'
import { CreateGameObject } from 'modules/common/gameObject'
import { Seconds,RatePerSecond, PixelsPerSecond } from 'modules/common/time'

//===============================================================================

export const TiledMapTick = (object,delta,clipping,keys,Callbacks,collisionList,state) =>
{
    //console.log("TiledMapObjectTick:",object,delta,clipping,keys,Callbacks,collisionList,state)
    //console.log("TiledMapTick:keys",keys)

    return {
        ...object,
        wallClock: object.wallClock + delta,
    }
}

//===============================================================================

export const CreateTiledMapObject = (backgroundClipping) =>
{
    let object = CreateGameObject(
            'TiledMap',
            (scrollerTypes.stageOptions.width/2),(scrollerTypes.stageOptions.height/2),0,
            0,PixelsPerSecond(0),PixelsPerSecond(0),
            MapComponent,
        )


    object.baseTick = object.tick       // kts experiment with manual inheritance
                                        // if we go this way, this needs to become a linked list of some sort

    object.tick = TiledMapTick
    return {
        ...object,
        wallClock: 0,
        clipping:backgroundClipping,
        renderData:
        {
            mapXOffset: 0,
            mapYOffset: 30,
        }
    }
}

//===============================================================================

