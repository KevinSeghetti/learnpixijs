// modules/shooter/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as shooterActionsTypes from "./types"

//let log = CreateLogger("shooterActions")

// ------------------------------------
// Actions
// ------------------------------------


export function shooterActionsTick(delta,keys) {
  //console.log("shooterActionsTick",delta,keys)

  return {
    type    : shooterActionsTypes.TICK,
    delta   : delta,
    keys    : keys,
  }
}

export function shooterActionsMovePlayerUp(delta) {
  return {
    type    : shooterActionsTypes.MOVE_PLAYER_UP,
    payload : delta
  }
}

export function shooterActionsMovePlayerDown(delta) {
  return {
    type    : shooterActionsTypes.MOVE_PLAYER_DOWN,
    payload : delta
  }
}

export function shooterActionsMovePlayerLeft(delta) {
  return {
    type    : shooterActionsTypes.MOVE_PLAYER_LEFT,
    payload : delta
  }
}

export function shooterActionsMovePlayerRight(delta) {
  return {
    type    : shooterActionsTypes.MOVE_PLAYER_RIGHT,
    payload : delta
  }
}



