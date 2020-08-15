// modules/pixijs/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as pixijsActionsTypes from "./types"

//let log = CreateLogger("pixijsActions")

// ------------------------------------
// Actions
// ------------------------------------


export function pixijsActionsTick(delta) {
  return {
    type    : pixijsActionsTypes.TICK,
    delta   : delta
  }
}

export function pixijsActionsMovePlayerUp(delta) {
  return {
    type    : pixijsActionsTypes.MOVE_PLAYER_UP,
    payload : delta
  }
}

export function pixijsActionsMovePlayerDown(delta) {
  return {
    type    : pixijsActionsTypes.MOVE_PLAYER_DOWN,
    payload : delta
  }
}

export function pixijsActionsMovePlayerLeft(delta) {
  return {
    type    : pixijsActionsTypes.MOVE_PLAYER_LEFT,
    payload : delta
  }
}

export function pixijsActionsMovePlayerRight(delta) {
  return {
    type    : pixijsActionsTypes.MOVE_PLAYER_RIGHT,
    payload : delta
  }
}



