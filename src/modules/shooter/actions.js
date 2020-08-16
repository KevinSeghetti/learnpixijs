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



