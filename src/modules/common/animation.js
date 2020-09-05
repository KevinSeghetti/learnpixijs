

// kts TODO: turn this into an object which encodes number of frames in animation, and supports multiple animations
// kts automate this



// this assumes frames increment in sequence down the image, then go to next column
// frameSize is 2D point indicating the X & Y size of each frame of the animation
// frames2D is a 2D point indicating how many frames per row (in x), how many frames per column (in y)
export const CalcAnimationFrames = (frameSize, frames2D) =>
{
    let result = []


    for(let frameY = 0; frameY < frames2D.y; frameY++)
    {
        for(let frameX = 0; frameX < frames2D.x; frameX++)
        {
            result.push({width: frameSize.x*frameX, height: frameSize.y*frameY})
        }
    }
    return result
}


