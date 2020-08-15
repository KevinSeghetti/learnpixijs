import React,{useEffect} from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";
import Bunny from "components/Bunny";

import 'bootstrap/dist/css/bootstrap.min.css';

import './First.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("first")

const OPTIONS = {
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
};

//===============================================================================

const InnerObjects = (props) =>
{
    //console.log("inner ",props)

    let objectList = props.first.gameObjects.map( (entry,index) =>
        <Bunny key={index} x={entry.position.x} y={entry.position.y} texture={0} rotation={entry.position.r} />
    )

    const animate = delta => {
        props.tick(delta)
    };

    useEffect(() => {
        props.app.ticker.add(animate)

        return function cleanup() {
                   props.app.ticker.remove(animate);
        }
    })

    return (
        <Container ref={c => (window.example = c)}>
            { objectList }
        </Container>
    )
}

InnerObjects.propTypes = {
    first      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//-------------------------------------------------------------------------------

const InnerObjectsWithApp = withApp(InnerObjects)

export const First = props => {
  log.trace("First renderer:",props)

  return (
    <div className="First" >
      <h2>First</h2>
        <Stage options={OPTIONS}>
            <InnerObjectsWithApp first={props.first} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

First.propTypes = {
    first      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

