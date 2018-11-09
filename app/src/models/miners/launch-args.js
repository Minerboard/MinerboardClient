
function getLaunchArgs(settings, logFolder){
    var minerName = settings.miner.name

    var s = settings.settings.default
    var c = settings.settings.custom

    var ttli = makeDict(c.ttli)
    var tt = makeDict(c.tt)
    var ttdcr = makeDict(c.ttdcr)
    var cclock = makeDict(c.cclock)
    var mclock = makeDict(c.mclock)
    var powlim = makeDict(c.powlim)
    var cvddc = makeDict(c.cvddc)
    var mvddc = makeDict(c.mvddc)

    var name = s.name

    if (minerName == "ClaymoresDualEthereum"){
        var logName = `${logFolder}/EthDcrMiner64.log`

        return ['-logfile', logName, '-epool', s.pool, '-ewal', 's.wal'+'.'+name,
        'epsw', s.psw, '-mode', s.mode, '-dcoin', s.dcoin, '-dpool', s.dpool, 
        '-dwal', s.dwal+'.'+s.ename, '-dpsw', s.dpsw, '-tt', tt, '-ttli', ttli,
        '-ttdcr', ttdcr, '-dcri', s.dcri, '-wd', '1', '-r', '0', '-nofee', '1']
    }

    if (minerName == "ClaymoresEthereum"){
        var logName = `${logFolder}/EthDcrMiner64.log`

        return ['-logfile', logName, '-epool', s.pool, '-ewal', s.wal+'.'+name,
        '-epsw', s.psw, '-mode', s.mode, '-tt', tt, '-ttli', ttli, '-wd', '1', '-r', '0', '-nofee', '1']
        // launchCmd = appRoot + "/eth_miner/b.exe"
        // launchCmd = 'notepad'
    }

    if (minerName == "ClaymoresZCashAMD"){
        var logName = `${logFolder}/ZecMiner64.log`

        return ['-logfile', logName, '-zpool', s.pool, '-zwal', s.wal+'.'+name,
        '-zpsw', s.psw, '-tt', tt, '-ttli', '-wd', '1', '-r', '0', '-nofee', '1']
    }

    if (minerName == "ClaymoresCryptoNoteAMD"){
        var logName = `${logFolder}/NsGpuCNMiner.log`

        return ['-logfile', logName, '-xpool', s.pool, '-xwal', s.wal+'.'+name,
        '-xpsw', s.psw, '-tt', tt, '-ttli', '-wd', '1', '-r', '0', '-nofee', '1']
    }
}

function makeDict(d){
    var vals = []
    for(var key in d){
        vals.push(d[key])
    }

    if(vals.length <= 0)
        return ''

    return vals.join(',')
}

function make(param, d){
    // logger.debug(param + ' : ' + d)
    if(d && d.toString().length > 0)
        return '-' + param + ' ' + d.toString()
    return ''
}

module.exports = { getLaunchArgs}