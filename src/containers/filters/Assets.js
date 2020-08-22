import {PixiComponentFactory} from "components/PixiComponentFactory"

import bunnyImage      from "components/images/bunnys.png"
import image from 'components/images/displacement_map.png'
import backgroundImage  from "components/images/background.png";

export const BunnyComponent      = PixiComponentFactory(bunnyImage   ,26,37,5)
export const PixiFilterComponent = PixiComponentFactory(image   ,512,512,1)
export const BackgroundComponent = PixiComponentFactory(backgroundImage  ,6000,6000,1)


