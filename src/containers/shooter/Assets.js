import {PixiComponentFactory} from "components/PixiComponentFactory"

import playerImage      from "components/images/player.png";
import bulletImage      from "components/images/bullet.png";
import enemyImage       from "components/images/enemy.png";
import explosionImage   from "components/images/explosion.png";
import backgroundImage  from "components/images/background.png";
import rockImage        from "components/images/rock.png";
import Text             from "components/Text";
import { CalcAnimationFrames }              from "modules/common/animation";

// kts TODO: learn to read size of image automatically
export const PlayerComponent      = PixiComponentFactory(playerImage     ,60,54)
export const BulletComponent      = PixiComponentFactory(bulletImage     ,12,20)
export const EnemyComponent       = PixiComponentFactory(enemyImage      ,31,28)

const explosionFrames = CalcAnimationFrames({x:25,y:28},{x:5,y:3})

export const ExplosionComponent   = PixiComponentFactory(explosionImage  ,25,28,explosionFrames)
export const BackgroundComponent  = PixiComponentFactory(backgroundImage ,6000,6000)
export const RockComponent        = PixiComponentFactory(rockImage       ,20,19)

export const TextComponent       = Text


