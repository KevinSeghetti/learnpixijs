
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Pixijs.scss';

import { Pixijs } from './Pixijs'

const mapStateToProps = (state) => {
    return {
        state         : state,
        pixijs          : state.app.pixijs,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pixijs)
