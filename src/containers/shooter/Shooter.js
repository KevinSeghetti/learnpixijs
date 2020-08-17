import React,{useEffect,useState} from "react";
import PropTypes from 'prop-types'
import { withApp, Container, Stage } from "react-pixi-fiber";

import 'bootstrap/dist/css/bootstrap.min.css';

import './Shooter.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("shooter")

const OPTIONS = {
  backgroundColor: 0x1099bb,
  width: 800,
  height: 600,
};

//===============================================================================

function useKey(key) {
    // Keep track of key state
    const [pressed, setPressed] = useState(false)

    // Does an event match the key we're watching?
    const match = event => key.toLowerCase() === event.key.toLowerCase()

    // Event handlers
    const onDown = event => {
        //console.log("useKey: down",event,key,match(event))
        if (match(event)) setPressed(true)
    }

    const onUp = event => {
        if (match(event)) setPressed(false)
    }

    // Bind and unbind events
    useEffect(() => {
        window.addEventListener("keydown", onDown)
        window.addEventListener("keyup", onUp)
        return () => {
            window.removeEventListener("keydown", onDown)
            window.removeEventListener("keyup", onUp)
        }
    }, [key])

    return pressed
}

// kts TODO: move InnerObjects into shared file (and rename)

const InnerObjects = (props) =>
{
    //console.log("inner ",props)

    let arrowLeft = useKey('arrowLeft')
    let arrowRight = useKey('arrowRight')
    let space = useKey(' ')

    //console.log('InnerObjects',arrowLeft, arrowRight,space)
    let keys = {
    }
    // kts TODO: pass array of keys to useKey
    if(arrowLeft)
    {
        keys['arrowLeft'] = true
    }
    if(arrowRight)
    {
        keys['arrowRight'] = true
    }
    if(space)
    {
        keys['space'] = true
    }

    let objectList = props.shooter.gameObjects.map( (entry,index) =>
    {
        if(entry.renderComponent)
        {
            if(entry.animation.frameIndex >= entry.renderComponent.gameData.frames)
            {
                console.error(`Shooter: object of type ${entry.type} has invalid frame index of ${entry.animation.frameIndex}, max is ${entry.renderComponent.gameData.frames}`)
            }
            return <entry.renderComponent
                    key={index}
                    x={entry.position.x}
                    y={entry.position.y}
                    texture={entry.animation.frameIndex}
                    rotation={entry.position.r}
                    {...entry.renderData}
            />
        }
        return null
    }
    )

    const animate = delta => {
        props.tick(props.app.ticker.elapsedMS,keys)
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
    shooter      : PropTypes.object.isRequired,
    tick           : PropTypes.func.isRequired,
}

//-------------------------------------------------------------------------------

const InnerObjectsWithApp = withApp(InnerObjects)

export const Shooter = props => {
  log.trace("Shooter renderer:",props)

  return (
    <div className="Shooter" >
      <h2>Shooter</h2>
        <Stage options={OPTIONS}>
            <InnerObjectsWithApp shooter={props.shooter} tick={props.tick} />
        </Stage>
    </div>
  );
}

//-------------------------------------------------------------------------------

Shooter.propTypes = {
    shooter      : PropTypes.object.isRequired,
    tick      : PropTypes.func.isRequired,
}

//===============================================================================

