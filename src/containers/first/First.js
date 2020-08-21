import React from "react";
import PropTypes from 'prop-types'
import { Stage } from "react-pixi-fiber";
import { WorldRenderer } from 'components/WorldRenderer'

import 'bootstrap/dist/css/bootstrap.min.css';

import './First.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("first")

//===============================================================================

export const First = props => {
  log.trace("First renderer:",props)

  return (
    <div className="First" >
      <h2>First</h2>
        <Stage options={props.stageOptions}>

            <WorldRenderer state={props.first} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

First.propTypes = {
    first      : PropTypes.object.isRequired,
    stageOptions: PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

