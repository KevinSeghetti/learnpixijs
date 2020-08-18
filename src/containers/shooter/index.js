
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Shooter.scss';

import { Shooter } from './Shooter'
import { actions as shooterActions } from 'modules/shooter'

const mapStateToProps = (state) => {
    return {
        state         : state,
        shooter       : state.app.shooter,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : shooterActions.shooterActionsTick
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Shooter)
