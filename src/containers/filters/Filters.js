import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Container, Sprite, Stage, TilingSprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import "@pixi/filter-displacement";

import displacement_BG  from "./displacement_BG.jpg";
import overlay          from "./overlay.png";
import displacement_map from "./displacement_map.png";


const OPTIONS = {
  backgroundColor: 0x1099bb,
  height: 400,
  width: 400
};

const bgTexture           = PIXI.Texture.from(displacement_BG );
const overlayTexture      = PIXI.Texture.from(overlay         );
const displacementTexture = PIXI.Texture.from(displacement_map);

export function Filters() {
  const [filters, setFilters] = useState([]);
  const displacementSprite = useRef();
  const overlaySprite = useRef();

  useEffect(() => {
    console.log(overlaySprite.current);
    console.log(displacementSprite.current);

    const move = () => {
      overlaySprite.current.tilePosition.x -= 1;
      overlaySprite.current.tilePosition.y -= 1;
    };

    setFilters([
      new PIXI.filters.DisplacementFilter(displacementSprite.current, 50)
    ]);

    PIXI.Ticker.shared.add(move, this);

    return () => {
      PIXI.Ticker.shared.remove(move, this);
    };
  }, []);

  return (
    <div>
      <h2>top</h2>
    <Stage options={OPTIONS}>
      <Container filters={filters}>
        <Sprite texture={bgTexture} />
        <TilingSprite
          ref={overlaySprite}
          texture={overlayTexture}
          width={512}
          height={512}
        />
        <Sprite
          ref={displacementSprite}
          texture={displacementTexture}
          alpha={0.5}
        />
      </Container>
    </Stage>
   </div>
  );
}

