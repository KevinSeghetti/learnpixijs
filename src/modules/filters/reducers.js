// modules/filters/reducers

import { PixelsPerSecond, RadiansPerSecond } from 'modules/common/time'
import { types as filtersTypes } from 'modules/filters/index'
import { CreateGameObject } from 'modules/common/gameObject'
import { GameTick } from 'modules/common/tick'
import * as PIXI from "pixi.js";

import {
    BackgroundComponent,
    BunnyComponent,
    PixiFilterComponent,
    ShaderComponent,

} from "containers/filters/Assets";

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("filters")

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
        x: filtersTypes.stageOptions.width,
        y: filtersTypes.stageOptions.height,
    }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const FILTERS_ACTION_HANDLERS = {
  [filtersTypes.TICK                  ]       : (state, action) =>
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



const CreateGameObjects = () =>
{
    let objects = []

        let backgroundSpeed = 60
        objects.push(
            {...CreateGameObject('Background',2000,0,0,PixelsPerSecond(backgroundSpeed),PixelsPerSecond(backgroundSpeed),0,BackgroundComponent,0,false),
                clipping:backgroundClipping
            })

    objects.push(
        {...CreateGameObject('displacement map',256,256,0,PixelsPerSecond(20),PixelsPerSecond(20),0,PixiFilterComponent,0,false),
            clipping:backgroundClipping,
//          pixiFilter: (ref) => {
//              return new PIXI.filters.DisplacementFilter(ref, 200)
//          },
            scale: 2,
        })

    objects.push(
        {...CreateGameObject('Shader',200,0,0,PixelsPerSecond(backgroundSpeed*2),PixelsPerSecond(backgroundSpeed),0,ShaderComponent,0,false),
            //clipping:backgroundClipping
        })

     const rotationSpeed = RadiansPerSecond(Math.PI*2)
    const movementSpeed = PixelsPerSecond(400)
    const objectCount = 10
    for(let i = 0;i < objectCount; ++i)
    {
        objects.push(
            {
                ...CreateGameObject(
                    "filters",
                    filtersTypes.stageOptions.width*Math.random(),filtersTypes.stageOptions.height*Math.random(),0,
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

const filtersInitialState = {
    globals:
    {
        score: 0,
    },
    gameObjects: CreateGameObjects(),
}

export default function reducer(state = filtersInitialState, action) {
  log.trace(  'filtersReducer(', state, ', ',action,')')
  //console.log(  'filtersReducer', state ,action)
    const handler = FILTERS_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


