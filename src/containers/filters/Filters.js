import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types'
import ReactDOM from "react-dom";
import { withApp, Container, Sprite, Stage, TilingSprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import "@pixi/filter-displacement";
import 'bootstrap/dist/css/bootstrap.min.css';

import displacement_map from 'components/images/displacement_map.png'

import './Filters.scss';
import CreateLogger from 'components/loggingConfig'

//===============================================================================

let log = CreateLogger("filters")

//===============================================================================

const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 400,
  width: 400
};

const displacementTexture = PIXI.Texture.from(displacement_map  )

//===============================================================================

const FilterComponent = () =>
{
}


const InnerObjects = ({state,tick,app}) =>
{
    //console.log("InnerObjects ",state,tick)

    const itemsRef = useRef([]);

    const [filters, setFilters] = useState([])

    const move = (delta) => {
      tick(app.ticker.elapsedMS)
    };

    let filterObjectList = state.gameObjects.filter( (entry,index) => entry.pixiFilter)

    // kts TODO: handle degenerate case where one filter gets added while another gets subtracted
    useEffect(() => {
       itemsRef.current = itemsRef.current.slice(0, filterObjectList.length);

       console.log("filterObjectList",filterObjectList)
       setFilters(
           filterObjectList.map( (entry,index) =>
               new PIXI.filters.DisplacementFilter(itemsRef.current[index], 200)
           )
       )

    }, [filterObjectList.length]);


    useEffect(() => {
      PIXI.Ticker.shared.add(move, this);

      return () => {
        PIXI.Ticker.shared.remove(move, this);
      }
    }, [])

    // kts smell: maybe just have a ref for every game object instead?
    let filterIndex = 0
    let objectList = state.gameObjects.map( (entry,index) =>
    {
            //console.log("inner",entry,index)
        let result = null

        let extra = {}
        if(entry.pixiFilter)
        {
            extra.ref = el => itemsRef.current[filterIndex++] = el
        }
        if(entry.scale)
        {
            extra.scale = entry.scale
        }

        if(entry.renderComponent)
        {
            result = <entry.renderComponent
                key={index}
                x={entry.position.x}
                y={entry.position.y}
                texture={entry.animation.frameIndex}
                rotation={entry.position.r}
                { ...extra }
            />
        }

        return result
    }
    )

    return (
        <Container ref={c => (window.example = c)}  filters={filters}>
            { objectList }
        </Container>
    )
}

InnerObjects.propTypes = {
    state     : PropTypes.object.isRequired,
    app       : PropTypes.object.isRequired,
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
            <InnerObjectsWithApp state={props.filters} tick={props.tick} />
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


