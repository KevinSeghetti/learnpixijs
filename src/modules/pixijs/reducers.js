// modules/pixijs/reducers

import { types as pixijsTypes } from 'modules/pixijs/index'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("pixijs")

// ------------------------------------
// Action Handlers
// ------------------------------------

const clipping =
{
    min:
    {
        x: 0,
        y: 0
    },
    max:
    {
        x: 500,
        y: 500,
    }
}

const ClipPosition = (position, clipping) =>
{
    //console.log("ClipPosition",position,clipping)
    //console.log("  ", position.x,clipping.min.x,clipping.max.x)
    //console.log("  min", Math.max(position.x,clipping.min.x))
    //console.log("  result",Math.min(Math.max(position.x,clipping.min.x),clipping.max.x))

    return {
        x: Math.min(Math.max(position.x,clipping.min.x),clipping.max.x),
        y: Math.min(Math.max(position.y,clipping.min.y),clipping.max.y),
    }
}

const MoveObject = (object, delta) =>
{
    let newX = object.position.x + (object.velocity.x*delta)
    let newY = object.position.y + (object.velocity.y*delta)
    let newR = object.position.r + (object.velocity.r*delta)

    let {x:clippedX, y:clippedY} = ClipPosition({x:newX,y:newY},clipping)

    let clippedR = newR

    //console.log("MoveObject",object,delta,{newX,newY},{clippedX,clippedY})
    return (
        {
               x: clippedX,
               y: clippedY,
               r: clippedR
        }
    )
}

const UpdateObjectSpeed = (position,velocity,delta) =>
{
    let xSpeed = velocity.x
    let ySpeed = velocity.y

    if(position.x === clipping.min.x || position.x === clipping.max.x)
    {
        xSpeed = - xSpeed
    }
    if(position.y === clipping.min.y || position.y === clipping.max.y)
    {
        ySpeed = - ySpeed
    }

    return {
        x: xSpeed,
        y: ySpeed,
        r: velocity.r
    }
}

const PIXIJS_ACTION_HANDLERS = {
  [pixijsTypes.TICK                  ]       : (state, action) =>
  {
      let delta = action.delta
      return {
          ...state,
          gameObjects: state.gameObjects.map( (entry,index) =>
          {
            let position = MoveObject(entry,delta)
            return {
             ...entry,
             position : position,
             velocity : UpdateObjectSpeed(position,entry.velocity,delta)
            }
          }
          )
      }
  },

  [pixijsTypes.MOVE_PLAYER_LEFT                   ]       : (state, action) =>
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
  [pixijsTypes.MOVE_PLAYER_RIGHT                   ]       : (state, action) =>
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

  [pixijsTypes.MOVE_PLAYER_UP                   ]       : (state, action) =>
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
  [pixijsTypes.MOVE_PLAYER_DOWN                 ]       : (state, action) =>
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

const CreateGameObject = (x,y,rotation,vx,vy,rv) =>
{
    return {
        position:
        {
            x: x,
            y: y,
            r: rotation,
        },
        velocity:
        {
            x: vx,
            y: vy,
            r: rv,
        },

    }
}

const CreateGameObjects = () =>
{
    let objects = []

    for(let i = 0;i < 100; ++i)
    {
        objects.push(CreateGameObject(200*Math.random(),200*Math.random(),0,10*Math.random(),10*Math.random(),2*Math.random()))
    }

    objects.push(CreateGameObject(50,50,0,2,2,0))
    objects.push(CreateGameObject(100,100,10,-2,4,30))
    objects.push(CreateGameObject(200,100,23,6,2,50))
    return objects
}


const pixijsInitialState = {
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

export default function reducer(state = pixijsInitialState, action) {
  log.trace(  'pixijsReducer(', state, ', ',action,')')
  //console.log(  'pixijsReducer', state ,action)
    const handler = PIXIJS_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


