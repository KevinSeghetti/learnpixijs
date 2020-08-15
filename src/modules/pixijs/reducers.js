// modules/pixijs/reducers

import { types as pixijsTypes } from 'modules/pixijs/index'

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("pixijs")

// ------------------------------------
// Action Handlers
// ------------------------------------

const PIXIJS_ACTION_HANDLERS = {
  [pixijsTypes.TICK                  ]       : (state, action) =>
  {
      let delta = action.delta
      return {
          ...state,
          gameObjects: state.gameObjects.map( (entry,index) =>
          (
             {
                ...entry,
                position :
                {
                    x: entry.position.x + (entry.velocity.x*delta),
                    y: entry.position.y + (entry.velocity.y*delta),
                }
             }
          ))
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

const CreateGameObject = (x,y,vx,vy) =>
{
    return {
        position:
        {
            x: x,
            y: y
        },
        velocity:
        {
            x: vx,
            y: vy
        },
    }
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
  gameObjects:
  [
    CreateGameObject(50,50,2,2),
    CreateGameObject(100,100,0,0),
    CreateGameObject(200,100,0,0),
  ]
}

export default function reducer(state = pixijsInitialState, action) {
  log.trace(  'pixijsReducer(', state, ', ',action,')')
  //console.log(  'pixijsReducer', state ,action)
    const handler = PIXIJS_ACTION_HANDLERS[action.type]
    return handler ? handler(state, action) : state
}

//-------------------------------------------------------------------------------


