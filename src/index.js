const path = require('path')

const params = '--params'
const parameters = '--parameters'
const parameterOverrides = '--parameter-overrides'
const identity = v => v
const keyValue = {
  formatParameter: (key, value) => `${key}=${value}`,
  formatParameters: identity,
  formatTag: (key, value) => `${key}=${value}`,
  formatTags: identity
}
const keyNameValueName = {
  formatParameter: (key, value) => `ParameterKey=${key},ParameterValue=${value}`,
  formatParameters: identity,
  formatTag: (key, value) => `Key=${key},Value=${value}`,
  formatTags: identity
}
const keyNameValueNameNoTags = {
  formatParameter: (key, value) => `ParameterKey=${key},ParameterValue=${value}`,
  formatParameters: identity,
  formatTag: () => null,
  formatTags: () => []
}
const keyNameValueNameJoinedCommand = {
  formatParameter: (key, value) => `${key}=${value}`,
  formatParameters: parameters => [parameters.join(',')],
  formatTag: (key, value) => `${key}=${value}`,
  formatTags: tags => [tags.join(',')]
}
const keyNameValueNameKeyValueTags = {
  formatParameter: (key, value) => `ParameterKey=${key},ParameterValue=${value}`,
  formatParameters: identity,
  formatTag: (key, value) => `${key}=${value}`,
  formatTags: identity
}
const nameValue = {
  formatParameter: (key, value) => `Name=${key},Value=${value}`,
  formatParameters: identity,
  formatTag: (key, value) => `Key=${key},Value=${value}`,
  formatTags: tags => [tags.join(',')]
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
      'create-change-set': [parameters, keyNameValueName],
      'create-stack': [parameters, keyNameValueName],
      'create-stack-instances': [parameterOverrides, keyNameValueNameNoTags],
      'create-stack-set': [parameters, keyNameValueName],
      'update-stack': [parameters, keyNameValueName],
      'update-stack-instances': [parameterOverrides, keyNameValueNameNoTags],
      'update-stack-set': [parameters, keyNameValueName]
    },
    serverlessrepo: {
      'create-cloud-formation-change-set': [parameterOverrides, nameValue]
    }
  },
  sam: {
    deploy: [parameterOverrides, keyNameValueNameKeyValueTags]
  },
  rain: {
    deploy: [params, keyNameValueNameJoinedCommand]
  }
}

class TCCommand {
  constructor () {
    this.logger = console.error
    this.loggingEnabled = false
    this.dryRun = false
    this.command = null
    this.commandName = null
    this.arguments = []
    this.configurationFile = path.resolve('template-configuration', 'default.json')
    this.readConfigurationFunction = f => {
      throw new Error('No configuration read function defined')
    }
  }

  isDryRun () {
    return this.dryRun
  }

  setLogger (logger) {
    this.logger = logger
  }

  log (str) {
    if (!this.loggingEnabled) {
      return
    }

    this.logger(str)
  }

  readConfiguration (f) {
    this.readConfigurationFunction = f
  }

  pushArguments (args) {
    args.forEach(arg => this.pushArgument(arg))
  }

  pushArgument (arg) {
    if (this.arguments.length === 0) {
      if (arg === '--dryrun') {
        this.dryRun = true
        this.loggingEnabled = true
        return
      } else if (arg === '--debug') {
        this.loggingEnabled = true
        return
      } else if (['-c', '--config'].indexOf(arg) > -1) {
        this.nextArgumentConfig = true
        return
      } else if (this.nextArgumentConfig) {
        this.configurationFile = path.resolve(arg)
        delete this.nextArgumentConfig
        return
      }
    }
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

  getParameterArguments ({ formatParameter, formatParameters }, parameters) {
    const keys = Object.keys(parameters)
    return formatParameters(
      keys.reduce(
        (acc, key) => [...acc, formatParameter(key, parameters[key])],
        []
      )
    )
  }

  getTagArguments ({ formatTag, formatTags }, tags) {
    const keys = Object.keys(tags)
    return formatTags(
      keys.reduce(
        (acc, key) => [...acc, formatTag(key, tags[key])],
        []
      )
    )
  }

  getArguments () {
    const { Parameters, Tags } = this.readConfigurationFunction(this.configurationFile)
    const parameterType = this.getParameterType()
    // TODO empty Parameters and Empty Tags
    const tagArguments = parameterType
      ? this.getTagArguments(parameterType[1], Tags)
      : []
    const args = [
      ...this.arguments,
      ...(
        parameterType && Object.keys(Parameters).length
          ? [parameterType[0], ...this.getParameterArguments(parameterType[1], Parameters)]
          : []
      ),
      ...(
        tagArguments.length
          ? ['--tags', ...tagArguments]
          : []
      )
    ]

    this.log(args.join(' '))
    return args
  }
}

module.exports = {
  TCCommand
}
