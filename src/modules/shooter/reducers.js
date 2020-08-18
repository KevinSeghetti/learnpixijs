// modules/shooter/reducers

import { types as shooterTypes } from 'modules/shooter/index'
import { GameStates } from 'modules/common/tick'
import { Seconds,RatePerSecond, PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreatePlayerObject,PlayerStates } from 'modules/common/playerObject'
import { CreateAttractObject } from 'modules/common/attractObject'
import { CreateGameObject, CreateTimedObject } from 'modules/common/gameObject'
import { CreateEnemyObject } from 'modules/common/enemyObject'
import { CreateScoreObject } from 'modules/common/scoreObject'
import { CreatePlayerStatsObject } from 'modules/common/playerStatsObject'
import { CreateBulletObject } from 'modules/common/bulletObject'
import { GameTick } from 'modules/common/tick'
import {
    PlayerComponent,
    BulletComponent,
    EnemyComponent,
    ExplosionComponent,
    RockComponent,
    BackgroundComponent,
    TextComponent,
} from "containers/shooter/Assets";

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("shooter")

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
        x: shooterTypes.stageOptions.width,
        y: shooterTypes.stageOptions.height,
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

const SHOOTER_ACTION_HANDLERS = {
  [shooterTypes.TICK                  ]       : (state, action) =>
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

    const objectCount = 5
    for(let i = 0;i < objectCount; ++i)
    {   // generate rocks
        objects.push(
            CreateGameObject(
                'Rock',
                shooterTypes.stageOptions.width*Math.random(),shooterTypes.stageOptions.height*Math.random(),0,
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
            shooterTypes.stageOptions.width-150,20,
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

    const GeneratedObjectFactory = (x,y) =>
    {
        //console.log("GeneratedObjectFactory:",x,y)
        return CreateEnemyObject(
            x,y,0,PixelsPerSecond(500),
           EnemyComponent,
           ExplosionObjectFactory,
        )
    }

    const BulletObjectFactory = (x,y) =>
    {
        return CreateBulletObject(
            x,y,0,PixelsPerSecond(-500),
            BulletComponent
        )
    }

    const generationRate = RatePerSecond(4)
    objects.push(CreateGeneratorObject(0,2,shooterTypes.stageOptions.width,0,generationRate,GeneratedObjectFactory))
    objects.push(CreatePlayerObject(
        shooterTypes.stageOptions.width/2,
        shooterTypes.stageOptions.height-20,
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

    const rotationSpeed = RadiansPerSecond((Math.PI*2)/4)
    const movementSpeed = PixelsPerSecond(100)

//  objects.push(
//      {...CreateGameObject('Background',2000,0,0,PixelsPerSecond(40),PixelsPerSecond(40),0,BackgroundComponent,0,false),
//          clipping:backgroundClipping
//      })

    const objectCount = 40

    const components = [RockComponent,PlayerComponent,BulletComponent,EnemyComponent]
    for(let i = 0;i < objectCount; ++i)
    {   // generate rocks
        objects.push(
            CreateGameObject(
                'Rock',
                shooterTypes.stageOptions.width*Math.random(),shooterTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                components[Math.floor(Math.random()*components.length)],
            )
        )
    }

    // text objects
    objects.push(
        {
            ...CreateGameObject(
                'GameOver',
                (shooterTypes.stageOptions.width/2)-40,(shooterTypes.stageOptions.height/2)-40,0,
                0,0,0,
                TextComponent,
            ),
            renderData:
            {
                text:"Game Over"
            }
        }
    )

    objects.push(
        {
            ...CreateGameObject(
                'Start',
                (shooterTypes.stageOptions.width/2)-80,(shooterTypes.stageOptions.height/2)+40,0,
                0,0,0,
                TextComponent,
            ),
            renderData:
            {
                text:"Press s To Start"
            }
        }
    )

    // this object listens for button presses to start the game
    objects.push(CreateAttractObject() )

    return objects
}

//-------------------------------------------------------------------------------

const shooterInitialState = {
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

export default function reducer(state = shooterInitialState, action) {
  log.trace(  'shooterReducer(', state, ', ',action,')')
  //console.log(  'shooterReducer', state ,action)
    const handler = SHOOTER_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


