// modules/generator/reducers

import { types as generatorTypes } from 'modules/generator/index'
import { RatePerSecond, PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { CreateGeneratorObject } from 'modules/common/generator'
import { CreateGameObject } from 'modules/common/gameObject'
import { CreateFallingObject } from 'modules/common/fallingObject'
import { GameTick } from 'modules/common/tick'
import {BunnyComponent} from "containers/generator/Assets";

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

    const objectCount = 2
    for(let i = 0;i < objectCount; ++i)
    {
        objects.push(
            CreateGameObject(
                "bounce",
                generatorTypes.stageOptions.width*Math.random(),generatorTypes.stageOptions.height*Math.random(),0,
                movementSpeed*Math.random(),movementSpeed*Math.random(),(rotationSpeed*Math.random()-(rotationSpeed/2)),
                BunnyComponent, Math.round(4*Math.random()))
            )
    }

    const CreateGeneratedObject = (x,y) =>
    {
        //console.log("CreateGeneratedObject:",x,y)
        return CreateFallingObject(
            "Generated",x,y,0,PixelsPerSecond(500),
            BunnyComponent
        )
    }
    const generationRate = RatePerSecond(4)
    objects.push(CreateGeneratorObject(0,2,generatorTypes.stageOptions.width,0,generationRate,CreateGeneratedObject))
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


