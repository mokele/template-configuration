#!/usr/bin/env node

const childProcess = require('child_process')
const fs = require('fs')
const { TCCommand } = require('.')

const main = (args) => {
  // TODO is linux vs windows any different here?
  const command = new TCCommand()

  command.setLogger(console.log)
  command.readConfiguration(fs.readFileSync)
  command.existsConfiguration(fs.existsSync)
  command.writeConfiguration(fs.writeFileSync)
  command.pushArguments(args)
  if (command.isOwnCommand()) {
    return command.run()
  }

  const cmdArguments = command.getArguments()
  if (!command.isDryRun()) {
    childProcess.spawnSync('command', cmdArguments, { stdio: 'inherit' })
  }
}

main(process.argv.slice(2))
