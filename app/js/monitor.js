const path = require('path')
const osu = require('node-os-utils')
const drive = require('node-disk-info')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

let cpuOverload = 10
let memOverload = 30
let alertFrequency = 1



// Run every 2 seconds
setInterval(() => {
    //CPU Usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = `${info}%`

        document.getElementById('cpu-progress').style.width = `${info}%`

        // Make bar red if overload
        if (info > cpuOverload) {
            document.getElementById('cpu-progress').style.background = 'red'
        } else {
            document.getElementById('cpu-progress').style.background = '#30c88b'
        }

        // Check Overload
        if (info >= cpuOverload && runNotify(alertFrequency)) {
            notifyUser({
                title: 'CPU Overload',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            })

            localStorage.setItem('lastNotify', +new Date())
        }
    })

    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = `${info}%`
    })

    //Uptime
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())

    // Memory
    mem.info().then(info => {
        document.getElementById('mem-total').innerText = `${info.totalMemMb} (MB)`
        document.getElementById('mem-usage').innerText = `${info.usedMemMb} (MB)`
        document.getElementById('mem-free').innerText = `${info.freeMemMb} (MB)`
        document.getElementById('mem-percent').innerText = `${info.freeMemPercentage}%`

        document.getElementById('mem-progress').style.width = `${info.freeMemPercentage}%`
        if (info.freeMemPercentage > memOverload) {
            document.getElementById('mem-progress').style.background = 'red'
        } else {
            document.getElementById('mem-progress').style.background = '#30c88b'
        }
    })


}, 2000)


// Set model
document.getElementById('cpu-model').innerText = cpu.model()


// Computer Name
document.getElementById('comp-name').innerHTML = os.hostname()


// OS
document.getElementById('os').innerHTML = `${os.type()} ${os.arch()}`



// HDD
    // HDD
    drive.getDiskInfo().then(info => {
        assignHDDResults(info)
    })
    .catch(reason =>{
        console.error(reason)
    })

function assignHDDResults(disks){
    let blocksToGBConversion = 2097152
    for (const disk of disks) {
        if (disk.mounted == "C:") {
            document.getElementById('hdd-total').innerText = `${formatBytes(disk.blocks)}`
            document.getElementById('hdd-used').innerText = `${formatBytes(disk.used)}`
            document.getElementById('hdd-free').innerText = `${formatBytes(disk.available)}`
            document.getElementById('hdd-capacity').innerText = `${disk.capacity}`
            // document.getElementById('hdd-free-percent').innerText = `${info.freePercentage}%`
        }
    }
}

function secondsToDhms(seconds) {
    let secondsInAnHour = 3600
    let minutesInAnHour = 60
    let hoursInADay = 24
    let secondsInADay = secondsInAnHour * hoursInADay
    seconds = +seconds
    const d = Math.floor(seconds / secondsInADay)
    const h = Math.floor((seconds % secondsInADay) / secondsInAnHour)
    const m = Math.floor((seconds % secondsInAnHour) / minutesInAnHour)
    const s = Math.floor(seconds % minutesInAnHour)
    return `${d}d, ${h}h, ${m}m, ${s}s`
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

//  Send Notification
function notifyUser (options) {
    new Notification(options.title, options)
}

// Check how much time has passed since notification
function runNotify(frequency) {
    if (localStorage.getItem('lastNotify') === null) {
        // Store timestamp
        localStorage.setItem('lastNotify', +new Date())
        return true
    }
}