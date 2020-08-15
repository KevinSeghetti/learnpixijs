
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './First.scss';

import { First } from './First'
import { actions as firstActions,types as firstTypes } from 'modules/first'

const mapStateToProps = (state) => {
    return {
        state         : state,
        first          : state.app.first,
        stageOptions   : firstTypes.stageOptions,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : (delta) => firstActions.firstActionsTick(delta)
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(First)
