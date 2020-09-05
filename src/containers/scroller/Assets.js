import {PixiComponentFactory} from "components/PixiComponentFactory"

import tileImage        from "components/images/scroller/PlatformTilesets32x32.png"
import playerImage      from "components/images/player.png";
import bulletImage      from "components/images/bullet.png";
import enemyImage       from "components/images/enemy.png";
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

// kts TODO: learn to read size of image automatically (not easy, since these are loaded async, so we don't have it yet)
// probably need to set up a promise that backfills that data
export const PlayerComponent      = PixiComponentFactory(playerImage     ,60,54)
export const BulletComponent      = PixiComponentFactory(bulletImage     ,12,20)
export const EnemyComponent       = PixiComponentFactory(enemyImage      ,31,28)

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

export const ExplosionComponent   = PixiComponentFactory(explosionImage  ,25,28,explosionFrames)
export const BackgroundComponent  = PixiComponentFactory(backgroundImage ,6000,6000)
export const TileSetComponent     = PixiComponentFactory(tileImage ,544,832)
export const RockComponent        = PixiComponentFactory(rockImage       ,20,19)

export const TextComponent       = Text

