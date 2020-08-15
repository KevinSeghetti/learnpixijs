
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Pixijs.scss';

import { Pixijs } from './Pixijs'
import { actions as pixijsActions } from 'modules/pixijs'

const mapStateToProps = (state) => {
    return {
        state         : state,
        pixijs          : state.app.pixijs,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : (delta) => pixijsActions.pixijsActionsTick(delta)
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pixijs)
