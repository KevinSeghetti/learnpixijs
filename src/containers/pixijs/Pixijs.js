import React from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";
import RotatingBunny from "components/BunnyExample/RotatingBunny";
import Bunny from "components/Bunny";

import 'bootstrap/dist/css/bootstrap.min.css';

import './Pixijs.scss';
//import BunnyExample from 'components/BunnyExample'
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("pixijs")

const OPTIONS = {
  backgroundColor: 0x1099bb,
};


const Director = (props) =>
{
  console.log("Director: props = ",props)
  return null
}

//===============================================================================

const InnerObjects = (props) =>
{
    console.log("inner ",props)

    let objectList = props.pixijs.gameObjects.map( (entry,index) =>
        <Bunny key={index} x={entry.position.x} y={entry.position.y} texture={0} rotation={0} />
    )

    return (
        <Container ref={c => (window.example = c)}>

            <Director />
            { objectList }

            <RotatingBunny x={400} y={300} texture={0} name="regular" step={0.1} />
            <RotatingBunny x={200} y={200} texture={1} name="cool" step={0.2} />
            <RotatingBunny x={200} y={400} texture={2} name="sport" step={-0.25} />
            <RotatingBunny x={600} y={200} texture={3} name="cyborg" step={-0.1} />
            <RotatingBunny x={600} y={400} texture={4} name="astronaut" step={-0.02} />
        </Container>
    )

}

const InnerObjectsWithApp = withApp(InnerObjects)


export const Pixijs = props => {
  log.trace("Pixijs renderer:",props)



  return (
    <div className="Pixijs" >
      <h2>Pixijs</h2>
        <Stage width={800} height={600} options={OPTIONS}>
            <InnerObjectsWithApp pixijs={props.pixijs} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Pixijs.propTypes = {
    pixijs      : PropTypes.object.isRequired,
}



//===============================================================================

