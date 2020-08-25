import React from "react";
import PropTypes from 'prop-types'
import { Stage } from "react-pixi-fiber";
import { WorldRenderer  } from 'components/WorldRenderer'

import 'bootstrap/dist/css/bootstrap.min.css';

import './Scroller.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("scroller")

const OPTIONS = {
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
};


//===============================================================================

export const Scroller = ({state,tick}) => {
  log.trace("Scroller renderer:",state,tick)

  return (
    <div className="Scroller" >
      <h2>Scroller</h2>
        <Stage options={OPTIONS}>
            <WorldRenderer state={state} tick={tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Scroller.propTypes = {
    state     : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

