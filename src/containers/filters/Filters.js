import React,{useEffect} from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";

import 'bootstrap/dist/css/bootstrap.min.css';

import './Filters.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("filters")

//===============================================================================

const InnerObjects = (props) =>
{
    //console.log("InnerObjects ",props)

    let objectList = props.filters.gameObjects.map( (entry,index) =>
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
        props.tick(props.app.ticker.elapsedMS)
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
    filters      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//-------------------------------------------------------------------------------

const InnerObjectsWithApp = withApp(InnerObjects)

export const Filters = props => {
  log.trace("Filters renderer:",props)

  return (
    <div className="Filters" >
      <h2>Filters</h2>
        <Stage options={props.stageOptions}>
            <InnerObjectsWithApp filters={props.filters} tick={props.tick} />
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


