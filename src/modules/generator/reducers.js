// modules/generator/reducers

import { types as generatorTypes } from 'modules/generator/index'
import { CreateGameObject } from 'modules/common/gameObject'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("generator")


//===============================================================================

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
          gameObjects: state.gameObjects.map( (entry,index) => entry.tick(entry,action.delta,clipping) )
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

    for(let i = 0;i < 100; ++i)
    {
        objects.push(CreateGameObject(200*Math.random(),200*Math.random(),0,10*Math.random(),10*Math.random(),2*Math.random(),Math.round(5*Math.random())))
    }
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


