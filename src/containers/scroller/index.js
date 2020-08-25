
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Scroller.scss';

import { Scroller } from './Scroller'
import { actions as scrollerActions } from 'modules/scroller'

const mapStateToProps = (state) => {
    return {
        state      : state.app.scroller,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : scrollerActions.scrollerActionsTick
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scroller)
