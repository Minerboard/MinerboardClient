var si = require('systeminformation')
var logger = require('../../../config/winston')

var cpuModel, cpuCores, cpuFreq, totalRam, gpus

si.cpu((info) => {
    cpuModel = info.manufacturer + ' ' + info.brand
    cpuCores = info.cores
    cpuFreq = Math.floor(parseFloat(info.speed)*1000).toString()
    // logger.debug('cpu: ' + cpuModel)
});

si.graphics((info) => {
    gpus = []
    
    info.controllers.forEach((gpu) => {
        if(isProperGpu(gpu.model))
            gpus.push(gpu.model + ' ' + gpu.vram)
    });
    // logger.debug('gpu: ' + JSON.stringify(gpus))
});

si.mem((info) => {
    totalRam = (info.total / 1024 / 1024).toString()
    // logger.debug('mem: ' + totalRam)
});

function isProperGpu(gpu){
    gpu = gpu.toLowerCase()
    return gpu.includes('nvidia') || gpu.includes('amd')
}

function getHardware(){
    return {
        processor: {
            name: cpuModel,
            cores: cpuCores,
            frequency: cpuFreq
        },
        gpu: gpus,
        motherboard: {
            name: 'unknown'
        },
        ram: {
            value: totalRam
        }
    }
}

module.exports = { getHardware }