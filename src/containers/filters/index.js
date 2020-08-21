
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Filters.scss';

import { Filters } from './Filters'
import { actions as filtersActions,types as filtersTypes } from 'modules/filters'

const mapStateToProps = (state) => {
    return {
        state         : state,
        filters          : state.app.filters,
        stageOptions   : filtersTypes.stageOptions,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    tick : (delta) => filtersActions.filtersActionsTick(delta)
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters)
