const params = '--params'
const parameters = '--parameters'
const parameterOverrides = '--parameter-overrides'
const identity = v => v
const keyValue = {
  formatParameter: (key, value) => `${key}=${value}`,
  formatParameters: identity
}
const keyNameValueName = {
  formatParameter: (key, value) => `ParameterKey=${key},ParameterValue=${value}`,
  formatParameters: identity
}
const keyNameValueNameJoinedCommand = {
  formatParameter: (key, value) => `${key}=${value}`,
  formatParameters: parameters => [parameters.join(',')]
}

const helpCommands = {
  aws: ['help'],
  sam: ['--help'],
  rain: ['--help', '-h']
}
const parameterTypes = {
  aws: {
    cloudformation: {
      deploy: [parameterOverrides, keyValue],
      'create-change-set': [parameters, keyNameValueName]
    }
  },
  sam: {
    deploy: [parameterOverrides, keyNameValueName]
  },
  rain: {
    deploy: [params, keyNameValueNameJoinedCommand]
  }
}

class TCCommand {
  constructor () {
    this.command = null
    this.commandName = null
    this.arguments = []
    this.parameters = {
      key1: 'value1',
      key2: 'value2'
    }
  }

  pushArguments (args) {
    args.forEach(arg => this.pushArgument(arg))
  }

  pushArgument (arg) {
    this.arguments.push(arg)
  }

  isHelp () {
    const cmd = this.arguments[0]
    const [help] = this.arguments.slice(-1)
    return helpCommands[cmd].indexOf(help) !== -1
  }

  getParameterType () {
    let next = parameterTypes
    for (const arg of this.arguments) {
      const parameterType = next[arg]
      if (Array.isArray(parameterType)) {
        return this.isHelp(this.arguments)
          ? null
          : parameterType
      }

      if (!parameterType) {
        return
      }

      next = parameterType
    }
  }

  getParameterArguments({ formatParameter, formatParameters }) {
    const keys = Object.keys(this.parameters)
    return formatParameters(
      keys.reduce(
        (acc, key) => [...acc, formatParameter(key, this.parameters[key])],
        []
      )
    )
  }

  getArguments () {
    const parameterType = this.getParameterType()
    return [
      ...this.arguments,
      ...(
        parameterType
          ? [parameterType[0], ...this.getParameterArguments(parameterType[1])]
          : []
      )
    ]
  }
}

const tc = ([...args]) => {
  const cmd = new TCCommand()
  cmd.pushArguments(args)
  return cmd
}

module.exports = { tc }
