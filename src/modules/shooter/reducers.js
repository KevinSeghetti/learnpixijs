// modules/shooter/reducers

import { types as shooterTypes } from 'modules/shooter/index'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreatePlayerObject } from 'modules/common/player'
import { CreateGameObject, CreateFallingObject, CreateBulletObject, CreateEnemyObject, CreateTimedObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'
import {PlayerComponent, BulletComponent, EnemyComponent, ExplosionComponent } from "containers/shooter/Assets";

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

    const rotationSpeed = 0.25
    const movementSpeed = 5
    const objectCount = 2
    for(let i = 0;i < objectCount; ++i)
    {
        objects.push(
            CreateGameObject(
                shooterTypes.stageOptions.width*Math.random(),shooterTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                EnemyComponent,Math.round(4*Math.random()))
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
            x,y,0,5,
           EnemyComponent, 0,
           ExplosionObjectFactory,
        )
    }

    const BulletObjectFactory = (x,y) =>
    {
        return CreateBulletObject(
            x,y,0,-5,
            BulletComponent, 0,
        )
    }

    const generationRate = 5
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


