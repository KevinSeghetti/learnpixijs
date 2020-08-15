// modules/first/reducers

import { types as firstTypes } from 'modules/first/index'
import { CreateGameObject } from 'modules/common/gameObject'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("first")

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
        x: firstTypes.stageOptions.width,
        y: firstTypes.stageOptions.height,
    }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const FIRST_ACTION_HANDLERS = {
  [firstTypes.TICK                  ]       : (state, action) =>
  {
      return {
          ...state,
          gameObjects: state.gameObjects.map( (entry,index) => entry.tick(entry,action.delta,clipping) )
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
        objects.push(CreateGameObject(400*Math.random(),400*Math.random(),0,7*Math.random(),7*Math.random(),2*Math.random(),Math.round(5*Math.random())))
    }

    return objects
}


const firstInitialState = {
  gameObjects: CreateGameObjects()
}

export default function reducer(state = firstInitialState, action) {
  log.trace(  'firstReducer(', state, ', ',action,')')
  //console.log(  'firstReducer', state ,action)
    const handler = FIRST_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


