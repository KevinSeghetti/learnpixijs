
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';

import { Home } from './Home'

const mapStateToProps = (state) => ({
    state               : state.app,
})


const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
