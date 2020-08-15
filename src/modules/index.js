import { combineReducers } from 'redux'
import firstReducer from 'modules/first'
import generatorReducer from 'modules/generator'

const rootReducer = combineReducers({
  first: firstReducer,
  generator: generatorReducer,
});

export default rootReducer

