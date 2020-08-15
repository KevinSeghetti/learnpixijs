
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Generator.scss';

import { Generator } from './Generator'
import { actions as generatorActions } from 'modules/generator'

const mapStateToProps = (state) => {
    return {
        state         : state,
        generator          : state.app.generator,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : (delta) => generatorActions.generatorActionsTick(delta)
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Generator)
