// modules/generator/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as generatorActionsTypes from "./types"

//let log = CreateLogger("generatorActions")    // eslint-disable-line no-unused-vars

// ------------------------------------
// Actions
// ------------------------------------


export function generatorActionsTick(delta) {
  return {
    type    : generatorActionsTypes.TICK,
    delta   : delta
  }
}




