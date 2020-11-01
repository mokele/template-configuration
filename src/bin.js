#!/usr/bin/env node

const child_process = require('child_process')
const fs = require('fs')
const { TCCommand } = require('.')

const main = (args) => {
  // TODO is linux vs windows any different here?
  const command = new TCCommand()
  command.setLogger(console.log)
  command.readConfiguration(file => JSON.parse(fs.readFileSync(file)))
  command.pushArguments(args)
  const arguments = command.getArguments()
  if (!command.isDryRun()) {
    child_process.spawnSync('command', arguments, { stdio: 'inherit' })
  }
}

main(process.argv.slice(2))
