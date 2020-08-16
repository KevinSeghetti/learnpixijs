import { combineReducers } from 'redux'
import firstReducer from 'modules/first'
import generatorReducer from 'modules/generator'
import shooterReducer from 'modules/shooter'

const rootReducer = combineReducers({
  first: firstReducer,
  generator: generatorReducer,
  shooter: shooterReducer,
});

export default rootReducer

