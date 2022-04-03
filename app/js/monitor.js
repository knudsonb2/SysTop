const path = require('path')
const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os


// Set model
document.getElementById('cpu-model').innerText = cpu.model()


// Computer Name
document.getElementById('comp-name').innerHTML = os.hostname()


// OS
document.getElementById('os').innerHTML = `${os.type()} ${os.arch()}`

// Memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = `${info.totalMemMb} (MB)`
    document.getElementById('mem-usage').innerText = `${info.usedMemMb} (MB)`
    document.getElementById('mem-free').innerText = `${info.freeMemMb} (MB)`
    document.getElementById('mem-percent').innerText = `${info.freeMemPercentage}%`
})

// Used Memory
