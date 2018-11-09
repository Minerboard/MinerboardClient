var hardware = require('../hardware/hardware-info')
var logger = require('../../../config/winston')

function getRegistrationString(name){
    var timeStamp = Math.floor(new Date() / 1000).toString()  // seconds since 01/01/1970
    var hw = hardware.getHardware()
    var gpuCount = hw.gpu.length

    var json = {
        time_stamp: timeStamp,
        rig_name: name,

        miner: {
            name: '',
            version: ''
        },

        hardware: hw,

        result: {
            up_work: 0,
            temps: fillArray(0, gpuCount),
            fans: fillArray(0, gpuCount),

            hrate: [
                {
                    total_speed: 0,
                    total_vshares: 0,
                    total_rshares: 0,
                    every_speed: fillArray(0, gpuCount)
                },

                {
                    total_speed: 0,
                    total_vshares: 0,
                    total_rshares: 0,
                    every_speed: fillArray(0, gpuCount)
                }
            ]
        }
    }

    return JSON.stringify(json)
}

function getStatString(settings, rigName){
    var timeStamp = Math.floor(new Date() / 1000).toString()  // seconds since 01/01/1970
    var hw = hardware.getHardware()

    var mainTotalInfo = settings[2].split(';').map((item) => { return parseInt(item, 10) })
    var secTotalInfo = settings[4].split(';').map((item) => { return parseInt(item, 10) })
    var ver = (settings[0].split(' '))[0]

    var json = {
        time_stamp: timeStamp,
        rig_name: rigName,

        miner: {
            name: 'ClaymoresEthereum',  // TODO: add miner name
            version: ver
        },

        hardware: hw,

        result: {
            up_work: parseInt(settings[1]),
            temps: getSlotsEveryFirst(settings[6]),
            fans: getSlotsEverySecond(settings[6]),

            hrate: [
                {
                    total_speed: mainTotalInfo[0],
                    total_vshares: mainTotalInfo[1],
                    total_rshares: mainTotalInfo[2],
                    every_speed: getSlots(settings[3])
                },

                {
                    total_speed: secTotalInfo[0],
                    total_vshares: secTotalInfo[1],
                    total_rshares: secTotalInfo[2],
                    every_speed: getSlots(settings[5])
                }
            ]
        }
    }

    return JSON.stringify(json)
}

function getSlotsEveryFirst(entries)
{
    if(!entries)
        return []

    var slots = []

    s.foreach((el, index) => {
        if (index % 2 == 0)
            slots.push(el);
    })

    return slots;
}

function getSlotsEverySecond(entries)
{
    if(!entries)
        return []

    var slots = []

    s.foreach((el, index) => {
        if (index % 2 != 0)
            slots.push(el);
    })

    return slots;
}

function getSlots(entries)
{
    if(!entries)
        return []

    if(!entries.includes(';')){
        if(entries == 'off')
            return [0]
        return [parseInt(entries)]
    }
        

    var slots = []
    
    var s = entries.split(';');

    //logger.debug(`entries: '${entries}'\nsplit: '${s}' type: ${typeof(s)}`)

    s.foreach((el) => {
        if(el == "off")
            slots.Add(0);
        else
            slots.Add(parseInt(el, 10));
    })

    return slots;
}

function fillArray(value, len) {
    if (len == 0) return [];
    var a = [value];
    while (a.length * 2 <= len) a = a.concat(a);
    if (a.length < len) a = a.concat(a.slice(0, len - a.length));
    return a;
}

module.exports = { getRegistrationString, getStatString }