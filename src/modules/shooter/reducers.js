// modules/shooter/reducers

import { types as shooterTypes } from 'modules/shooter/index'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreatePlayerObject } from 'modules/common/player'
import { CreateGameObject, CreateFallingObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'

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

  [shooterTypes.MOVE_PLAYER_LEFT                   ]       : (state, action) =>
  {
      return {
          ...state,
          playerPosition:
          {
              ...state.playerPosition,
              x: state.playerPosition.x-action.payload
          },
      }
  },
  [shooterTypes.MOVE_PLAYER_RIGHT                   ]       : (state, action) =>
  {
      return {
          ...state,
          playerPosition:
          {
              ...state.playerPosition,
              x: state.playerPosition.x+action.payload
          },
      }
  },

  [shooterTypes.MOVE_PLAYER_UP                   ]       : (state, action) =>
  {
      return {
          ...state,
          playerPosition:
          {
              ...state.playerPosition,
              y: state.playerPosition.y-action.payload
          },
      }
  },
  [shooterTypes.MOVE_PLAYER_DOWN                 ]       : (state, action) =>
  {
      return {
          ...state,
          playerPosition:
          {
              ...state.playerPosition,
              y: state.playerPosition.y+action.payload
          },
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
                Math.round(4*Math.random()))
            )
    }

    const CreateGeneratedObject = (x,y) =>
    {
        //console.log("CreateGeneratedObject:",x,y)
        return CreateFallingObject(
            x,y,2,
        )
    }
    const generationRate = 5
    objects.push(CreateGeneratorObject(0,0,shooterTypes.stageOptions.width,0,generationRate,CreateGeneratedObject))
    objects.push(CreatePlayerObject(shooterTypes.stageOptions.width/2,shooterTypes.stageOptions.height-20, 3))
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


