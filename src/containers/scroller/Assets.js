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

import {ConstructTileSetShaderComponent}    from "components/TileSetShader"

import map from 'components/images/scroller/platform.json'



// kts TODO: learn to read size of image automatically
export const PlayerComponent      = PixiComponentFactory(playerImage     ,60,54)
export const BulletComponent      = PixiComponentFactory(bulletImage     ,12,20)
export const EnemyComponent       = PixiComponentFactory(enemyImage      ,31,28)

//export const TileSetShaderComponent =    TileSetShader
const tileSetWidth = 544                                    // pixel width of the tile set
const tileSetHeight = 832                                   // pixel height of the tile set
export const MapComponent =    ConstructTileSetShaderComponent(tileSet,tileSetWidth,tileSetHeight,tileMap)
//console.log("Map!!",map)


//export const MapComponent = {}


const width = 25
const height = 28

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations
// kts automate this
const explosionFrames = [
    {width: width*0, height: height*0},
    {width: width*0, height: height*1},
    {width: width*0, height: height*2},
    {width: width*1, height: height*0},
    {width: width*1, height: height*1},
    {width: width*1, height: height*2},
    {width: width*2, height: height*0},
    {width: width*2, height: height*1},
    {width: width*2, height: height*2},
    {width: width*3, height: height*0},
    {width: width*3, height: height*1},
    {width: width*3, height: height*2},
    {width: width*4, height: height*0},
    {width: width*4, height: height*1},
    {width: width*4, height: height*2},
];

export const ExplosionComponent   = PixiComponentFactory(explosionImage  ,25,28,explosionFrames)
export const BackgroundComponent  = PixiComponentFactory(backgroundImage ,6000,6000)
export const TileSetComponent  = PixiComponentFactory(tileImage ,544,832)
export const RockComponent        = PixiComponentFactory(rockImage       ,20,19)

export const TextComponent       = Text

