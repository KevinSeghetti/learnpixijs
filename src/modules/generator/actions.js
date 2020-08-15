// modules/generator/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as generatorActionsTypes from "./types"

//let log = CreateLogger("generatorActions")

// ------------------------------------
// Actions
// ------------------------------------


export function generatorActionsTick(delta) {
  return {
    type    : generatorActionsTypes.TICK,
    delta   : delta
  }
}

export function generatorActionsMovePlayerUp(delta) {
  return {
    type    : generatorActionsTypes.MOVE_PLAYER_UP,
    payload : delta
  }
}

export function generatorActionsMovePlayerDown(delta) {
  return {
    type    : generatorActionsTypes.MOVE_PLAYER_DOWN,
    payload : delta
  }
}

export function generatorActionsMovePlayerLeft(delta) {
  return {
    type    : generatorActionsTypes.MOVE_PLAYER_LEFT,
    payload : delta
  }
}

export function generatorActionsMovePlayerRight(delta) {
  return {
    type    : generatorActionsTypes.MOVE_PLAYER_RIGHT,
    payload : delta
  }
}



