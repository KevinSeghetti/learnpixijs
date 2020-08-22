import React from "react";
import PropTypes from 'prop-types'
import { Stage } from "react-pixi-fiber";
import "@pixi/filter-displacement";
import 'bootstrap/dist/css/bootstrap.min.css';

import { WorldRenderer  } from 'components/WorldRenderer'

import './Filters.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("filters")

//===============================================================================

export const Filters = props => {
  log.trace("Filters renderer:",props)

  return (
    <div className="Filters" >
      <h2>Filters</h2>
        <Stage options={props.stageOptions}>
            <WorldRenderer state={props.filters} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Filters.propTypes = {
    filters      : PropTypes.object.isRequired,
    stageOptions: PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

