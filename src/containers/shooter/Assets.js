import {PixiComponentFactory} from "components/PixiComponentFactory"

import playerImage      from "components/images/player.png";
import bulletImage      from "components/images/bullet.png";
import enemyImage       from "components/images/enemy.png";
import explosionImage   from "components/images/explosion.png";
import backgroundImage  from "components/images/background.png";
import rockImage        from "components/images/rock.png";
import Text             from "components/Text";

// kts TODO: learn to read size of image automatically
export const PlayerComponent      = PixiComponentFactory(playerImage     ,60,54,1)
export const BulletComponent      = PixiComponentFactory(bulletImage     ,12,20,1)
export const EnemyComponent       = PixiComponentFactory(enemyImage      ,31,28,1)
export const ExplosionComponent   = PixiComponentFactory(explosionImage  ,25,28,1)
export const BackgroundComponent = PixiComponentFactory(backgroundImage  ,6000,6000,1)
export const RockComponent        = PixiComponentFactory(rockImage       ,20,19,1)

export const TextComponent       = Text


