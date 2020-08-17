// modules/shooter/reducers

import { types as shooterTypes } from 'modules/shooter/index'
import { Seconds,RatePerSecond, PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreatePlayerObject } from 'modules/common/playerObject'
import { CreateGameObject, CreateTimedObject } from 'modules/common/gameObject'
import { CreateEnemyObject } from 'modules/common/enemyObject'
import { CreateScoreObject } from 'modules/common/scoreObject'
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
            20,40,
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
    objects.push(CreatePlayerObject(shooterTypes.stageOptions.width/2,shooterTypes.stageOptions.height-20, PlayerComponent, BulletObjectFactory))
    return objects
}

//===============================================================================

const shooterInitialState = {
  globals:
  {
      score: 0,
  },
  gameObjects: CreateGameObjects()
}

export default function reducer(state = shooterInitialState, action) {
  log.trace(  'shooterReducer(', state, ', ',action,')')
  //console.log(  'shooterReducer', state ,action)
    const handler = SHOOTER_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


