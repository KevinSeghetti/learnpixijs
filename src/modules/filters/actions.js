// modules/filters/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as filtersActionsTypes from "./types"

//let log = CreateLogger("filtersActions")

// ------------------------------------
// Actions
// ------------------------------------


export function filtersActionsTick(delta) {
  return {
    type    : filtersActionsTypes.TICK,
    delta   : delta
  }
}



