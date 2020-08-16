import React,{useEffect} from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";

import 'bootstrap/dist/css/bootstrap.min.css';

import './First.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("first")

//===============================================================================

const InnerObjects = (props) =>
{
    //console.log("InnerObjects ",props)

    let objectList = props.first.gameObjects.map( (entry,index) =>
    {
            //console.log("inner",entry,index)

        if(entry.renderComponent)
        {
            return <entry.renderComponent key={index} x={entry.position.x} y={entry.position.y} texture={entry.animation.frameIndex} rotation={entry.position.r} />
        }
        return null
    }
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
        <Stage options={props.stageOptions}>
            <InnerObjectsWithApp first={props.first} tick={props.tick} />
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

