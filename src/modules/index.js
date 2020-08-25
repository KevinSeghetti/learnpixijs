import { combineReducers } from 'redux'
import firstReducer from 'modules/first'
import generatorReducer from 'modules/generator'
import shooterReducer from 'modules/shooter'
import filtersReducer from 'modules/filters'
import scrollerReducer from 'modules/scroller'

const rootReducer = combineReducers({
  first: firstReducer,
  generator: generatorReducer,
  shooter: shooterReducer,
  filters: filtersReducer,
  scroller: scrollerReducer,
});

export default rootReducer

