// modules/shooter/reducers

import { types as shooterTypes } from 'modules/shooter/index'
import { RatePerSecond, PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreatePlayerObject } from 'modules/common/playerObject'
import { CreateGameObject, CreateTimedObject } from 'modules/common/gameObject'
import { CreateEnemyObject } from 'modules/common/enemyObject'
import { CreateBulletObject } from 'modules/common/bulletObject'
import { GameTick } from 'modules/common/tick'
import {PlayerComponent, BulletComponent, EnemyComponent, ExplosionComponent, RockComponent } from "containers/shooter/Assets";

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

// ------------------------------------
// Action Handlers
// ------------------------------------

const SHOOTER_ACTION_HANDLERS = {
  [shooterTypes.TICK                  ]       : (state, action) =>
  {
      return {
          ...state,
          gameObjects: GameTick(state.gameObjects,action.delta,action.keys,clipping)
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
    const objectCount = 10
    for(let i = 0;i < objectCount; ++i)
    {   // generate rocks
        objects.push(
            CreateGameObject(
                shooterTypes.stageOptions.width*Math.random(),shooterTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                RockComponent,0)
            )
    }

    const ExplosionObjectFactory = (x,y) =>
    {
        return CreateTimedObject(
            x,y,0,0,
            ExplosionComponent, 0,
            120 // last about 2 seconds
        )
    }

    const GeneratedObjectFactory = (x,y) =>
    {
        //console.log("GeneratedObjectFactory:",x,y)
        return CreateEnemyObject(
            x,y,0,PixelsPerSecond(500),
           EnemyComponent, 0,
           ExplosionObjectFactory,
        )
    }

    const BulletObjectFactory = (x,y) =>
    {
        return CreateBulletObject(
            x,y,0,PixelsPerSecond(-500),
            BulletComponent, 0,
        )
    }

    const generationRate = RatePerSecond(10)
    objects.push(CreateGeneratorObject(0,2,shooterTypes.stageOptions.width,0,generationRate,GeneratedObjectFactory))
    objects.push(CreatePlayerObject(shooterTypes.stageOptions.width/2,shooterTypes.stageOptions.height-20, PlayerComponent, 0,BulletObjectFactory))
    return objects
}

//===============================================================================

const shooterInitialState = {
  player:
  {
      position:
      {
          x: 0,
          y: 0
      }
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


