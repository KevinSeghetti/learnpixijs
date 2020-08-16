import React,{useEffect} from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";
import Bunny from "components/Bunny";

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

// kts TODO: move InnerObjects into shared file (and rename)

const InnerObjects = (props) =>
{
    //console.log("inner ",props)

    let objectList = props.generator.gameObjects.map( (entry,index) =>
    {
        if(entry.animation.frameIndex >= 0)
        {
            return <Bunny key={index} x={entry.position.x} y={entry.position.y} texture={entry.animation.frameIndex} rotation={entry.position.r} />
        }
        return null
    }
    )

    const animate = delta => {
        // kts smell: this is in 60ths of a second
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
    generator      : PropTypes.object.isRequired,
    tick           : PropTypes.func.isRequired,
}

//-------------------------------------------------------------------------------

const InnerObjectsWithApp = withApp(InnerObjects)

export const Generator = props => {
  log.trace("Generator renderer:",props)

  return (
    <div className="Generator" >
      <h2>Generator</h2>
        <Stage options={OPTIONS}>
            <InnerObjectsWithApp generator={props.generator} tick={props.tick} />
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

