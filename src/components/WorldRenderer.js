import React,{useEffect,useState} from "react";
import PropTypes from 'prop-types'
import { withApp, Container } from "react-pixi-fiber";
import { GameStates  } from 'modules/common/tick'

import 'bootstrap/dist/css/bootstrap.min.css';

import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("worldRender")
//===============================================================================

// kts TODO: make this take an array of keys
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

//-------------------------------------------------------------------------------

const InnerObjects = ({state,tick,app}) =>
{
    //console.log("InnerObjects ",state,tick,app)

    // kts TODO: make this array driven
    let arrowLeft = useKey('arrowLeft')
    let arrowRight = useKey('arrowRight')
    let space = useKey(' ')
    let sKey = useKey('s')

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

    if(sKey)
    {
        keys['s'] = true
    }

    // default to gameplay
    let gameObjects = state.gameObjects

    if(state.globals.gameState === GameStates.ATTRACT)
    {
        gameObjects = state.attractObjects

    }
    let objectList = gameObjects.map( (entry,index) =>
    {
        if(entry.renderComponent && entry.animation.frameIndex >=0 )
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
        tick(app.ticker.elapsedMS,keys)
    };

    useEffect(() => {
        app.ticker.add(animate)

        return function cleanup() {
                   app.ticker.remove(animate);
        }
    })

    return (
        <Container ref={c => (window.example = c)}>
            { objectList }
        </Container>
    )
}

InnerObjects.propTypes = {
    state          : PropTypes.object.isRequired,
    tick           : PropTypes.func.isRequired,
    app            : PropTypes.object.isRequired,
}

//-------------------------------------------------------------------------------

export const WorldRenderer = withApp(InnerObjects)

//===============================================================================

