import { combineReducers } from 'redux'
import firstReducer from 'modules/first'
import generatorReducer from 'modules/generator'
import shooterReducer from 'modules/shooter'
import filtersReducer from 'modules/filters'

const rootReducer = combineReducers({
  first: firstReducer,
  generator: generatorReducer,
  shooter: shooterReducer,
  filters: filtersReducer,
});

export default rootReducer

