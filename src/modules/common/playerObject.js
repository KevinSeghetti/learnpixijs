// modules/common/player.js

import CreateLogger from 'components/loggingConfig'

let log = CreateLogger("playerObject")  // eslint-disable-line no-unused-vars

//===============================================================================

export const PlayerStates =
{
    INVALID: 0,
    PLAYING: 1,
    DYING:   2,          // playing explosion animation
    DEAD:    3,           // no more lives, so between games
}

