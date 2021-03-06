// modules/first/reducers

import { PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { types as firstTypes } from 'modules/first/index'
import { CreateGameObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'
import {BunnyComponent} from "containers/first/Assets";

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("first") // eslint-disable-line no-unused-vars

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
    const objectCount = 100
    for(let i = 0;i < objectCount; ++i)
    {
        objects.push(
            {
                ...CreateGameObject(
                    "first",
                    firstTypes.stageOptions.width*Math.random(),firstTypes.stageOptions.height*Math.random(),0,
                    movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                    BunnyComponent
                ),
                animation: {
                    frameIndex:Math.round(4*Math.random()),
                    animationSpeed: 0,
                }
            }
        )
    }
    return objects
}

//===============================================================================

const firstInitialState = {
    globals:
    {
        score: 0,
    },
    gameObjects: CreateGameObjects(),
}

export default function reducer(state = firstInitialState, action) {
  log.trace(  'firstReducer(', state, ', ',action,')')
  //console.log(  'firstReducer', state ,action)
    const handler = FIRST_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


