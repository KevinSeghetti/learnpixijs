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




