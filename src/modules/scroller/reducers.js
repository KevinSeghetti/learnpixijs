// modules/scroller/reducers

import { types as scrollerTypes } from 'modules/scroller/index'
import { GameStates } from 'modules/common/tick'
import { Seconds,RatePerSecond, PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { CreatePlayerObject,PlayerStates } from 'modules/common/playerObject'
import { CreateTiledMapObject } from 'modules/common/tiledMapObject'
import { CreateAttractObject } from 'modules/common/attractObject'
import { CreateGameObject, CreateTimedObject } from 'modules/common/gameObject'
import { CreateScoreObject } from 'modules/common/scoreObject'
import { CreatePlayerStatsObject } from 'modules/common/playerStatsObject'
import { CreateBulletObject } from 'modules/common/bulletObject'
import { GameTick } from 'modules/common/tick'
import {
    PlayerComponent,
    BulletComponent,
    ExplosionComponent,
    RockComponent,
    BackgroundComponent,
    MapComponent,
    Map2Component,
    TextComponent,
} from "containers/scroller/Assets";

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("scroller")

//===============================================================================

const clipping =
{
    min:
    {
        x: 0,
        y: 0
    },
    max:
    {
        x: scrollerTypes.stageOptions.width,
        y: scrollerTypes.stageOptions.height,
    }
}

const backgroundClipping =
{
    min:
    {
        x: -2000,
        y: -2000,
    },
    max:
    {
        x: 3000,
        y: 3000,
    }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const SCROLLER_ACTION_HANDLERS = {
  [scrollerTypes.TICK                  ]       : (state, action) =>
  {
      return {
          ...state,
          ...GameTick(state,action.delta,action.keys,clipping)
      }
  },
}

// ------------------------------------
// Reducers
// ------------------------------------

const CreateGameObjects = () =>
{
    let objects = []

    const rotationSpeed = RadiansPerSecond(Math.PI*2)
    const movementSpeed = PixelsPerSecond(400)

    objects.push(
        {...CreateGameObject('Background',2000,0,0,PixelsPerSecond(40),PixelsPerSecond(40),0,BackgroundComponent,0,false),
            clipping:backgroundClipping
        })

//  objects.push(
//      {
//          ...CreateTiledMapObject((scrollerTypes.stageOptions.width/2),(scrollerTypes.stageOptions.height/2),Map2Component),
//          mapSpeed : PixelsPerSecond(10),
//      }
//  )
    objects.push( CreateTiledMapObject((scrollerTypes.stageOptions.width/2),(scrollerTypes.stageOptions.height/2),MapComponent) )


    const objectCount = 5
    for(let i = 0;i < objectCount; ++i)
    {   // generate rocks
        objects.push(
            CreateGameObject(
                'Rock',
                scrollerTypes.stageOptions.width*Math.random(),scrollerTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                RockComponent,0)
            )
    }

    // score object
    objects.push(CreateScoreObject(
            'Score',
            50,20,
            0,0,
            TextComponent,
        )
    )

    // player stats object
    objects.push(CreatePlayerStatsObject(
            'PlayerStats',
            scrollerTypes.stageOptions.width-150,20,
            0,0,
            TextComponent,
        )
    )

    const ExplosionObjectFactory = (x,y) =>
    {
        let object = CreateTimedObject(
                'Explosion',
                x,y,0,0,
                ExplosionComponent,
                Seconds(0.5),
            )

        return (
            {
                ...object,
                animation:
                {
                    ...object.animation,
                    animationSpeed: RatePerSecond(16)
                }
            }
        )
    }

    const BulletObjectFactory = (x,y) =>
    {
        return CreateBulletObject(
            x,y,0,PixelsPerSecond(-500),
            BulletComponent
        )
    }

    objects.push(CreatePlayerObject(
        scrollerTypes.stageOptions.width/2,
        scrollerTypes.stageOptions.height-20,
        PlayerComponent,
        BulletObjectFactory,
        ExplosionObjectFactory,
        )
    )
    return objects
}

//===============================================================================

const CreateAttractObjects = () =>
{
    let objects = []

    objects.push(
        {...CreateGameObject('Background',2000,0,0,PixelsPerSecond(40),PixelsPerSecond(40),0,BackgroundComponent,0,false),
            clipping:backgroundClipping
        })

    objects.push(
        {
            ...CreateTiledMapObject((scrollerTypes.stageOptions.width/2),(scrollerTypes.stageOptions.height/2),Map2Component),
            mapSpeed : PixelsPerSecond(10),
        }
    )
    objects.push( CreateTiledMapObject((scrollerTypes.stageOptions.width/2),(scrollerTypes.stageOptions.height/2),MapComponent) )

    objects.push(
        {
            ...CreateGameObject(
                'Start',
                (scrollerTypes.stageOptions.width/2)-80,(scrollerTypes.stageOptions.height/2)+40,0,
                0,0,0,
                TextComponent,
            ),
            renderData:
            {
                text:"Press Enter To Start"
            }
        }
    )

    // this object listens for button presses to start the game
    objects.push(CreateAttractObject() )

    return objects
}

//-------------------------------------------------------------------------------

const scrollerInitialState = {
  globals:
  {     // stored here so that other objects can see them.
      score: 0,
      playerLives: 4,
      gameState: GameStates.ATTRACT,
      playerState: PlayerStates.PLAYING,
  },
  gameObjects: CreateGameObjects(),
  attractObjects: CreateAttractObjects(),
}

export default function reducer(state = scrollerInitialState, action) {
  log.trace(  'scrollerReducer(', state, ', ',action,')')
  //console.log(  'scrollerReducer', state ,action)
    const handler = SCROLLER_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


