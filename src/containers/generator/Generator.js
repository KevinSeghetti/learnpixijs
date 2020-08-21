import React from "react";
import PropTypes from 'prop-types'
import { Stage } from "react-pixi-fiber";
import { WorldRenderer } from 'components/WorldRenderer'

import 'bootstrap/dist/css/bootstrap.min.css';

import './Generator.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("generator")

const OPTIONS = {
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
};

//===============================================================================

export const Generator = props => {
  log.trace("Generator renderer:",props)

  return (
    <div className="Generator" >
      <h2>Generator</h2>
        <Stage options={OPTIONS}>
            <WorldRenderer state={props.generator} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Generator.propTypes = {
    generator      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

