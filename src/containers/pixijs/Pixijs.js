import React,{useEffect} from "react";
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
  //console.log("Director: props = ",props)
  return null
}

//===============================================================================

const InnerObjects = (props) =>
{
    //console.log("inner ",props)

    let objectList = props.pixijs.gameObjects.map( (entry,index) =>
        <Bunny key={index} x={entry.position.x} y={entry.position.y} texture={0} rotation={entry.position.r} />
    )

    const animate = delta => {
        //console.log("animate!")
        props.tick(delta)
      // just for fun, let's rotate mr rabbit a little
      // delta is 1 if running at 100% performance
      // creates frame-independent tranformation
    //this.setState(state => ({
    //  ...state,
    //  rotation: state.rotation + this.props.step * delta,
    //}));
    };


    useEffect(() => {
        props.app.ticker.add(animate)

        return function cleanup() {
                   props.app.ticker.remove(animate);
        }
    })

    return (
        <Container ref={c => (window.example = c)}>
            <Director />
            { objectList }
        </Container>
    )

}

InnerObjects.propTypes = {
    pixijs      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//-------------------------------------------------------------------------------

const InnerObjectsWithApp = withApp(InnerObjects)


export const Pixijs = props => {
  log.trace("Pixijs renderer:",props)



  return (
    <div className="Pixijs" >
      <h2>Pixijs</h2>
        <Stage width={800} height={600} options={OPTIONS}>
            <InnerObjectsWithApp pixijs={props.pixijs} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Pixijs.propTypes = {
    pixijs      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

