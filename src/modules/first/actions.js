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



