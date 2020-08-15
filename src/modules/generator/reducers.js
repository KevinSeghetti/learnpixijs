// modules/generator/reducers

import { types as generatorTypes } from 'modules/generator/index'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreateGameObject, CreateFallingObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("generator")

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
        x: generatorTypes.stageOptions.width,
        y: generatorTypes.stageOptions.height,
    }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const GENERATOR_ACTION_HANDLERS = {
  [generatorTypes.TICK                  ]       : (state, action) =>
  {
      return {
          ...state,
          gameObjects: GameTick(state.gameObjects,action.delta,clipping)
      }
  },

  [generatorTypes.MOVE_PLAYER_LEFT                   ]       : (state, action) =>
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
  [generatorTypes.MOVE_PLAYER_RIGHT                   ]       : (state, action) =>
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

  [generatorTypes.MOVE_PLAYER_UP                   ]       : (state, action) =>
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
  [generatorTypes.MOVE_PLAYER_DOWN                 ]       : (state, action) =>
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
                generatorTypes.stageOptions.width*Math.random(),generatorTypes.stageOptions.height*Math.random(),0,
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
    objects.push(CreateGeneratorObject(0,0,generatorTypes.stageOptions.width,0,generationRate,CreateGeneratedObject))
    return objects
}


const generatorInitialState = {
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

export default function reducer(state = generatorInitialState, action) {
  log.trace(  'generatorReducer(', state, ', ',action,')')
  //console.log(  'generatorReducer', state ,action)
    const handler = GENERATOR_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


