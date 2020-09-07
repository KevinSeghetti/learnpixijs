// modules/scroller/actions

//import CreateLogger from 'components/Shared/loggingConfig'
import * as scrollerActionsTypes from "./types"

//let log = CreateLogger("scrollerActions") // eslint-disable-line no-unused-vars

// ------------------------------------
// Actions
// ------------------------------------


export function scrollerActionsTick(delta,keys) {
  //console.log("scrollerActionsTick",delta,keys)

  return {
    type    : scrollerActionsTypes.TICK,
    delta   : delta,
    keys    : keys,
  }
}



