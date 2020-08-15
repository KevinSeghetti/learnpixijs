import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import App from './containers/app'
import 'bootstrap/dist/css/bootstrap.min.css'

import './index.css'

const target = document.querySelector('#root')

ReactDOM.render(

  <React.StrictMode>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <App />
          </div>
        </ConnectedRouter>
      </Provider>
  </React.StrictMode>,
  target
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();




