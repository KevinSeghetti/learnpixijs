// modules/common/tick.js
//===============================================================================

import { PlayerStates } from 'modules/common/playerObject'

//===============================================================================

export const GameStates =
{
    INVALID: 0,
    ATTRACT: 1,
    PLAYING: 2,
}

//===============================================================================

const CheckCollision = (first,second) =>
{
    //console.log("CheckCollision:first",first)
    //console.log("CheckCollision:second",second)
    if(first.renderComponent && second.renderComponent)
    {
        if(first.renderComponent.gameData && second.renderComponent.gameData)
        {
            let firstSize = first.renderComponent.gameData.size
            let secondSize = second.renderComponent.gameData.size

            if(
                first.position.x               < second.position.x + secondSize.x &&
                first.position.x + firstSize.x > second.position.x &&
                first.position.y               < second.position.y + secondSize.y &&
                first.position.y + firstSize.y > second.position.y)
            {
                return true
            }
        }
    }
    return false
}

//===============================================================================

export const GameTick = (state,delta,keys,clipping) =>
{
    //console.log("GameTick",gameObjects,delta,keys,clipping)

    // do collision detection
    // for now, full NxM checking

    // collisionList has an entry for each game object, containing an array of other objects that object overlaps with
    let collisionList = []

    // kts smell: think of a better way to do this
    let gameObjects = state.gameObjects
    let gameObjectsName = 'gameObjects'

    if(state.globals.gameState === GameStates.ATTRACT)
    {
        gameObjects = state.attractObjects
        gameObjectsName = 'attractObjects'
    }

    gameObjects.forEach( (entry,index) =>
    {
        let collides = true
        if(entry.collision)
        {
            collides = entry.collision.collides
        }

        if(collides)
        {
            // inner loop. Go over every object comparing to this one
            gameObjects.forEach( (innerEntry,innerIndex) =>
                {
                    collisionList.push([])

                    let innerCollides = true
                    if(innerEntry.collision)
                    {
                        innerCollides = innerEntry.collision.collides
                    }
                    if(index !== innerIndex && CheckCollision(entry,innerEntry) && innerCollides)
                    {
                        collisionList[index].push(innerEntry)       // trust javascript to make these references
                    }
                }
            )
        }
    }
    )

    //console.log("collsionList",collisionList)
    // tick all objects
    let newGameObjects = []


    // kts smell: this experiment in using Redux for game state didn't go very
    // well. Since we are not allowed to send a message (action) from inside
    // of a reducer, I ended up bundling the entire game frame update into
    // a single reducer, with a single tick() call.
    // If I were to do this again, I would try having a tick() function that
    // dispatched actions instead.

    const AddGameObject = (object) =>
    {
        //console.log("AddGameObject",object)
        newGameObjects.push(object)
    }

    let newScore = state.globals.score
    let newPlayerLives = state.globals.playerLives
    let newPlayerState = state.globals.playerState
    let newGameState = state.globals.gameState

    const ChangeScore = (delta) =>
    {
        newScore += delta
    }

    const ChangePlayerState = (newState) =>
    {
        newPlayerState = newState
    }

    const ChangePlayerLives = (delta) =>
    {
        newPlayerLives += delta
    }

    const StartNewGame = () =>
    {
        // kts TODO: refactor creation of game object list so it gets called from here
        newGameState = GameStates.PLAYING
        newPlayerLives = 4
        newScore = 0
        newPlayerState = PlayerStates.PLAYING
    }

    const GameOver = () =>
    {
        newGameState = GameStates.ATTRACT
    }

    const Callbacks =
    {
        ChangeScore,
        AddGameObject,
        ChangePlayerState,
        ChangePlayerLives,
        StartNewGame,
        GameOver,
    }

    let resultingGameObjects = gameObjects.map(
        (entry,index) => entry.tick(
            entry,
            delta,
            clipping,
            keys,
            Callbacks,
            collisionList[index],
            state,
        )
    )
    .filter(x => x)


    return (
        {
            ...state,
            [gameObjectsName]: [...resultingGameObjects, ...newGameObjects ],
            globals:
            {
                ...state.globals,
                score: newScore,
                playerState: newPlayerState,
                gameState: newGameState,
                playerLives: newPlayerLives,
            },

        }
    )
}

//===============================================================================

