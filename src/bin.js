#!/usr/bin/env node

const child_process = require('child_process')
const { tc } = require('.')

const main = (args) => {
  // TODO is linux vs windows any different here?
  child_process.spawnSync(
    'command',
    tc(args).getArguments(),
    {
      stdio: 'inherit'
    }
  )
}

main(process.argv.slice(2))
