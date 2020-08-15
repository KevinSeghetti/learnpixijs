import { combineReducers } from 'redux'
import pixijsReducer from 'modules/pixijs'

const rootReducer = combineReducers({
  //login: loginReducer,
  pixijs: pixijsReducer
});

export default rootReducer

