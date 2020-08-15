// modules/first/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as firstActionsTypes from "./types"

//let log = CreateLogger("firstActions")

// ------------------------------------
// Actions
// ------------------------------------


export function firstActionsTick(delta) {
  return {
    type    : firstActionsTypes.TICK,
    delta   : delta
  }
}

export function firstActionsMovePlayerUp(delta) {
  return {
    type    : firstActionsTypes.MOVE_PLAYER_UP,
    payload : delta
  }
}

export function firstActionsMovePlayerDown(delta) {
  return {
    type    : firstActionsTypes.MOVE_PLAYER_DOWN,
    payload : delta
  }
}

export function firstActionsMovePlayerLeft(delta) {
  return {
    type    : firstActionsTypes.MOVE_PLAYER_LEFT,
    payload : delta
  }
}

export function firstActionsMovePlayerRight(delta) {
  return {
    type    : firstActionsTypes.MOVE_PLAYER_RIGHT,
    payload : delta
  }
}



