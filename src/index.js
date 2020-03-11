'use strict'

import { defaultWarper as warp } from '@warpjs/warp'
import engine from '@warpjs/engine'

engine.init()

/** Say hello */
const hello = name => {
  'warp +server -client'

  return `Hello World!`
}

/** Get cpu/mem usage */
const usage = () => {
  'warp +server -client'

  const os = require('os')

  return {
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    uptime: os.uptime()
  }
}

const result = document.getElementById('result')
const stats = document.getElementById('stats')

/** Refresh stats */
const refresh = async () => {
  const data = await warp.call(usage)
  const cpus = data.cpus.map(cpu => {
    const data = {}
    let total = 0

    for (var type in cpu.times) {
      total += cpu.times[type]
    }
    for (type in cpu.times) {
      data[type] = total ? Math.round((100 * cpu.times[type]) / total) : 0
    }
    data.speed = cpu.speed
    return data
  })

  const uptime = data.uptime
  const freemem = data.freemem / 1024 ** 3
  const totalmem = data.totalmem / 1024 ** 3
  const usedmem = (totalmem - freemem).toFixed(2)

  stats.innerHTML = `<hr>
  <ul>
    <li>
      Uptime: <b>${uptime} sec</b>
      <br>
      <progress>
    </li>
    <li>
      Memory: <b>${usedmem} Go</b> / <b>${totalmem} Go</b>
      <br>
      <progress max="100" value="${(usedmem * 100) /
        totalmem}">${usedmem} Go</progress>
    <li>
    ${cpus
      .map(
        ({ user, speed }, index) =>
          `<li>
            CPU ${index + 1}: <b>${String(user).padStart(
            2,
            ' '
          )} % (${speed} Mhz)</b>
            <br>
            <progress max="100" value="${user}">${user}%</progress>
          </li>`
      )
      .join('')}
  </ul>`
}

// on page load
window.addEventListener('DOMContentLoaded', async () => {
  const message = await warp.call(hello, 'World')
  result.innerHTML = message
  refresh()
  setInterval(refresh, 3000)
})
