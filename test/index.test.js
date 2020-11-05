const { TCCommand } = require('../src/')
const path = require('path')

let cmd
beforeEach(() => {
  cmd = new TCCommand()
})

describe('no readConfiguration function', () => {
  beforeEach(() => {
    cmd = new TCCommand()
    cmd.pushArguments(['aws', 'sts'])
  })

  test('getArguments throws', () => {
    expect(() => cmd.getArguments()).toThrow()
  })
})

describe('init', () => {
  beforeEach(() => {
    cmd = new TCCommand()
    cmd.pushArguments(['init'])
  })

  test('isOwnCommand', () => {
    expect(cmd.isOwnCommand()).toBe(true)
  })

  test('without existsConfigurationFunction', () => {
    expect(() => cmd.run()).toThrow()
  })

  describe('with existsConfigurationFunction => true', () => {
    let writeConfig, existsConfig
    beforeEach(() => {
      writeConfig = jest.fn()
      existsConfig = jest.fn().mockReturnValue(true)
      cmd.existsConfiguration(existsConfig)
      cmd.writeConfiguration(writeConfig)
    })

    test('throws file exist', () => {
      expect(() => cmd.run()).toThrow()
      expect(existsConfig).toHaveBeenCalled()
    })

    test('does not call writeConfiguration', () => {
      expect(writeConfig).not.toHaveBeenCalled()
    })
  })

  describe('with existsConfigurationFunction => false', () => {
    let existsConfig
    beforeEach(() => {
      existsConfig = jest.fn().mockReturnValue(false)
      cmd.existsConfiguration(existsConfig)
    })

    test('without writeConfigurationFunction', () => {
      expect(() => cmd.run()).toThrow()
      expect(existsConfig).toHaveBeenCalled()
    })

    describe('with writeConfigurationFile', () => {
      let writeConfig
      beforeEach(() => {
        writeConfig = jest.fn()
        cmd.writeConfiguration(writeConfig)
        cmd.run()
      })

      test('calls writeConfig', () => {
        expect(writeConfig).toHaveBeenCalled()
      })
    })
  })
})

describe('with readConfigution function', () => {
  let readConfig
  beforeEach(() => {
    readConfig = jest.fn().mockReturnValue(JSON.stringify({
      Parameters: {
        key1: 'value1',
        key2: 'value2'
      },
      Tags: {
        tagKey1: 'tagValue1',
        tagKey2: 'tagValue2'
      }
    }))
    cmd.readConfiguration(readConfig)
  })

  describe('--dryrun', () => {
    let log
    beforeEach(() => {
      log = jest.fn()
      cmd.setLogger(log)
      cmd.pushArguments(['--dryrun', 'aws', 'sts'])
      cmd.getArguments()
    })

    test('isDryRun is true', () => {
      expect(cmd.isDryRun()).toBe(true)
    })

    test('logged command', () => {
      expect(log).toHaveBeenCalledWith('aws sts')
    })
  })

  describe('--debug', () => {
    let log
    beforeEach(() => {
      log = jest.fn()
      cmd.setLogger(log)
      cmd.pushArguments(['--debug', 'aws', 'sts'])
      cmd.getArguments()
    })

    test('isDryRun is false', () => {
      expect(cmd.isDryRun()).toBe(false)
    })

    test('logged command', () => {
      expect(log).toHaveBeenCalledWith('aws sts')
    })
  })

  describe('--config', () => {
    beforeEach(() => {
      cmd.pushArguments(['--config', path.join('template-configuration', 'test.json')])
      cmd.pushArguments(['aws', 'cloudformation', 'deploy'])
      cmd.getArguments()
    })

    test('readConfig called with file argument', () => {
      expect(readConfig).toHaveBeenCalledWith(path.resolve(path.join('template-configuration', 'test.json')))
    })
  })

  describe('aws', () => {
    beforeEach(() => {
      cmd.pushArgument('aws')
    })

    describe('non-parameter command', () => {
      beforeEach(() => {
        cmd.pushArgument('sts')
      })

      test('generates command with parameters', () => {
        expect(cmd.getArguments()).toMatchSnapshot()
      })
    })

    describe('cloudformation', () => {
      beforeEach(() => {
        cmd.pushArgument('cloudformation')
      })

      describe('deploy', () => {
        beforeEach(() => {
          cmd.pushArgument('deploy')
        })

        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })

        describe('with help as last argument', () => {
          beforeEach(() => {
            cmd.pushArgument('help')
          })

          test('does not add parameters', () => {
            expect(cmd.getArguments()).toMatchSnapshot()
          })
        })
      })

      describe('create-change-set', () => {
        beforeEach(() => {
          cmd.pushArgument('create-change-set')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('create-change-set', () => {
        beforeEach(() => {
          cmd.pushArgument('create-change-set')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('create-stack', () => {
        beforeEach(() => {
          cmd.pushArgument('create-stack')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('create-stack-instances', () => {
        beforeEach(() => {
          cmd.pushArgument('create-stack-instances')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('create-stack-set', () => {
        beforeEach(() => {
          cmd.pushArgument('create-stack-set')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('update-stack', () => {
        beforeEach(() => {
          cmd.pushArgument('update-stack')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('update-stack-instances', () => {
        beforeEach(() => {
          cmd.pushArgument('update-stack-instances')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('update-stack-set', () => {
        beforeEach(() => {
          cmd.pushArgument('update-stack-set')
        })
        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })
    })

    describe('serverlessrepo', () => {
      beforeEach(() => {
        cmd.pushArgument('serverlessrepo')
      })

      describe('create-cloud-formation-change-set', () => {
        beforeEach(() => {
          cmd.pushArgument('create-cloud-formation-change-set')
        })

        test('generates command with parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })
    })
  })

  describe('sam', () => {
    beforeEach(() => {
      cmd.pushArgument('sam')
    })
    describe('deploy', () => {
      beforeEach(() => {
        cmd.pushArgument('deploy')
      })

      test('generates command with parameters', () => {
        expect(cmd.getArguments()).toMatchSnapshot()
      })

      describe('with --help as last argument', () => {
        beforeEach(() => {
          cmd.pushArgument('--help')
        })

        test('does not add parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })
    })
  })

  describe('rain', () => {
    beforeEach(() => {
      cmd.pushArgument('rain')
    })
    describe('deploy', () => {
      beforeEach(() => {
        cmd.pushArgument('deploy')
      })

      test('generates command with parameters', () => {
        expect(cmd.getArguments()).toMatchSnapshot()
      })

      describe('with --help as last argument', () => {
        beforeEach(() => {
          cmd.pushArgument('--help')
        })

        test('does not add parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })

      describe('with -h as last argument', () => {
        beforeEach(() => {
          cmd.pushArgument('-h')
        })

        test('does not add parameters', () => {
          expect(cmd.getArguments()).toMatchSnapshot()
        })
      })
    })
  })
})
