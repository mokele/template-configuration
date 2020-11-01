#!/usr/bin/env node

const childProcess = require('child_process')
const fs = require('fs')
const { TCCommand } = require('.')

const main = (args) => {
  // TODO is linux vs windows any different here?
  const command = new TCCommand()
  command.setLogger(console.log)
  command.readConfiguration(file => JSON.parse(fs.readFileSync(file)))
  command.pushArguments(args)
  const cmdArguments = command.getArguments()
  if (!command.isDryRun()) {
    childProcess.spawnSync('command', cmdArguments, { stdio: 'inherit' })
  }
}

main(process.argv.slice(2))
