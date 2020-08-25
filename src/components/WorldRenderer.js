import React,{ useState, useRef, useEffect } from "react";
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

    // Bind and unbind events
    useEffect(() => {

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
    log.trace("WorldRenderer::InnerObjects:renderer:",state,tick,app)

    //console.log("InnerObjects ",state,tick,app)

    // kts TODO: make this array driven
    let arrowLeft = useKey('arrowLeft')
    let arrowRight = useKey('arrowRight')
    let space = useKey(' ')
    let sKey = useKey('s')

    //console.log('InnerObjects',arrowLeft, arrowRight,space)
    let keys = {
    }
    const itemsRef = useRef([]);

    const [filters, setFilters] = useState([])

    // kts TODO: was having an issue on reload where useEffect/setState were getting into a recursive loop
    let filterObjectList = []
//  let filterObjectList = state.gameObjects.filter( (entry,index) => entry.pixiFilter)
//  // kts TODO: handle degenerate case where one filter gets added while another gets subtracted
//  useEffect(() => {
//     itemsRef.current = itemsRef.current.slice(0, filterObjectList.length);
//
//     log.trace("filterObjectList",filterObjectList)
//     setFilters(
//         filterObjectList.map( (entry,index) =>
//             entry.pixiFilter(itemsRef.current[index])
//         )
//     )
//  }, [filterObjectList]);

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

    // kts smell: maybe just have a ref for every game object instead?
    let filterIndex = 0
    let gameObjects = state.gameObjects

    if(state.globals.gameState === GameStates.ATTRACT)
    {
        gameObjects = state.attractObjects

    }
    let objectList = gameObjects.map( (entry,index) =>
    {
        if(entry.renderComponent && entry.animation.frameIndex >=0 )
        {
            if(entry.renderComponent.gameData && entry.animation.frameIndex >= entry.renderComponent.gameData.frames)
            {
                console.error(`WorldRenderer: object of type ${entry.type} has invalid frame index of ${entry.animation.frameIndex}, max is ${entry.renderComponent.gameData.frames}`)
            }
        let extra = {}
        if(entry.pixiFilter)
            {
            extra.ref = el => itemsRef.current[filterIndex++] = el
        }
        if(entry.scale)
        {
            extra.scale = entry.scale
        }
            return <entry.renderComponent
                    key={index}
                    x={entry.position.x}
                    y={entry.position.y}
                    texture={entry.animation.frameIndex}
                    rotation={entry.position.r}
                    {...entry.renderData}
                    {...extra }
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
        <Container ref={c => (window.example = c)}  filters={filters}>
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

