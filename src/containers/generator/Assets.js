import {PixiComponentFactory} from "components/PixiComponentFactory"

import bunnyImage      from "components/images/bunnys.png"

const bunnyFrames = [
  {width: 2, height: 47,},
  {width: 2, height: 86,},
  {width: 2, height:125,},
  {width: 2, height:164,},
  {width: 2, height:  2,},
];

export const BunnyComponent      = PixiComponentFactory(bunnyImage   ,26,37,bunnyFrames)


