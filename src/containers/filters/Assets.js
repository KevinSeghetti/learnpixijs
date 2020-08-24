import {PixiComponentFactory} from "components/PixiComponentFactory"
import Shader from "components/Shaders"

import image from 'components/images/displacement_map.png'
import backgroundImage  from "components/images/background.png";
import bunnyImage      from "components/images/bunnys.png"

export const PixiFilterComponent = PixiComponentFactory(image   ,512,512)
export const BackgroundComponent = PixiComponentFactory(backgroundImage  ,6000,6000)

export const ShaderComponent =    Shader



const bunnyFrames = [
  {width: 2, height: 47,},
  {width: 2, height: 86,},
  {width: 2, height:125,},
  {width: 2, height:164,},
  {width: 2, height:  2,},
];

export const BunnyComponent      = PixiComponentFactory(bunnyImage   ,26,37,bunnyFrames)



