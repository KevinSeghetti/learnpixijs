import React from "react";
import PropTypes from 'prop-types'
import { Stage } from "react-pixi-fiber";
import { WorldRenderer  } from 'components/WorldRenderer'

import 'bootstrap/dist/css/bootstrap.min.css';

import './Shooter.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("shooter")   // eslint-disable-line no-unused-vars

const OPTIONS = {
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
};


//===============================================================================

export const Shooter = ({state,tick}) => {
  log.trace("Shooter renderer:",state,tick)

  return (
    <div className="Shooter" >
      <h2>Shooter</h2>
        <Stage options={OPTIONS}>
            <WorldRenderer state={state} tick={tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Shooter.propTypes = {
    state     : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

