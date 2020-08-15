// modules/first/reducers

import { types as firstTypes } from 'modules/first/index'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreateGameObject, CreateFallingObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'

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
          gameObjects: GameTick(state.gameObjects,action.delta,clipping)
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
    const objectCount = 100
    for(let i = 0;i < objectCount; ++i)
    {
        objects.push(
            CreateGameObject(
                firstTypes.stageOptions.width*Math.random(),firstTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                Math.round(4*Math.random()))
            )
    }
    return objects
}

//===============================================================================

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


