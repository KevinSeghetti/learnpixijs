import {PixiComponentFactory} from "components/PixiComponentFactory"

import tileImage        from "components/images/scroller/PlatformTilesets32x32.png"
import playerImage      from "components/images/scroller/Player16x16.png"

import bulletImage      from "components/images/bullet.png";
import explosionImage   from "components/images/explosion.png";
import backgroundImage  from "components/images/background.png";
import rockImage        from "components/images/rock.png";
import Text             from "components/Text";
import tileSet          from 'components/images/scroller/PlatformTilesets32x32.png'
import tileMap          from 'components/images/scroller/platform.json'

import secondTileSet    from 'components/images/scroller/world-spritesheet.png'
import secondRawTileMap from 'components/images/scroller/map.json'

import {ConstructTileSetShaderComponent}    from "components/TileSetShader"
import { CalcAnimationFrames }              from "modules/common/animation";

const destSize = { x:800, y:600 }
export const MapComponent =    ConstructTileSetShaderComponent(tileSet,{ x: 544, y: 832 },tileMap,destSize)
let secondTileMap =
{
    width:120,
    height:70,
    tilewidth:16,
    tileheight:16,

    layers:
    [
        {
            data: secondRawTileMap.flat().map( entry => entry+1)
        }
    ]
}

export const Map2Component =    ConstructTileSetShaderComponent(secondTileSet,{ x: 448, y: 80 },secondTileMap,destSize)
//console.log("Map!!",map)

const explosionFrames = CalcAnimationFrames({x:25,y:28},{x:5,y:3})

const playerFrames = CalcAnimationFrames({x:16,y:16},{x:4,y:1})

export const BulletComponent      = PixiComponentFactory(bulletImage     ,12,20)
export const ExplosionComponent   = PixiComponentFactory(explosionImage  ,25,28,explosionFrames)
export const PlayerComponent      = PixiComponentFactory(playerImage  ,16,16,playerFrames)

export const BackgroundComponent  = PixiComponentFactory(backgroundImage ,6000,6000)
export const TileSetComponent     = PixiComponentFactory(tileImage ,544,832)
export const RockComponent        = PixiComponentFactory(rockImage       ,20,19)

export const TextComponent       = Text

