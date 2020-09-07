// modules/filters/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as filtersActionsTypes from "./types"

// ------------------------------------
// Actions
// ------------------------------------


export function filtersActionsTick(delta) {
  return {
    type    : filtersActionsTypes.TICK,
    delta   : delta
  }
}



