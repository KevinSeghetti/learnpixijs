// helpers to make logging easier in this application

//var {defaultLoggingLevel, loggingLevels } = require('./applicationData')
// kts: might want to move this up somewhere else

//var defaultLoggingLevel = 'DEBUG'
//var defaultLoggingLevel = 'OFF'
//defaultLoggingLevel='ALL'

var defaultLoggingLevel='ERROR'
//loggingLevel='ERROR'
//loggingLevel='ALL'

// overrides over the default logging level
export var appLoggingLevels       = {
    //'gameObject'        : "TRACE",
    //'playerObject'      : "TRACE",
    //'positionAffectors' : "TRACE",
    //'tiledMapObject' : "TRACE",
}

//===============================================================================

let loggingLevels =
{
    'OFF'   : 0,
    'FATAL' : 1,
    'ERROR' : 2,
    'WARN'  : 3,
    'INFO'  : 4,
    'DEBUG' : 5,
    'TRACE' : 6,
    'ALL'   : 7,

}
//-------------------------------------------------------------------------------

function CreateLogger(loggerName) {

    let loggingLevel = defaultLoggingLevel

    let loggingEntry = appLoggingLevels[loggerName]
    if(loggingEntry)
    {
        loggingLevel = loggingEntry
    }

    let log = {}

    let loggingLevelInt = loggingLevels[loggingLevel]
    Object.keys(loggingLevels).forEach( (key,index ) =>
    {
        let entry = loggingLevels[key]
        if(entry <= loggingLevelInt)
        {
            log[key.toLowerCase()] =
                (...args) =>
                {
                    console.log(loggerName,":"+key.toLowerCase()+":",...args)
                }
        }
        else
        {
            log[key.toLowerCase()] = () =>
            {
            }
        }
    })


    log['stackTrace'] =
        (...args ) =>
        {
            console.log(loggerName,":stackTrace:",...args)
            console.trace()
        }

    log['assert'] =
        (condition,...args ) =>
        {
            if(!condition)
            {
                console.log(loggerName,":assert:",...args)
                console.trace()
                throw new Error("assertion failed")
            }
        }

    return log
}

export default CreateLogger


