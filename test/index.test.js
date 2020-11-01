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
    expect(() => cmd.getArguments())
      .toThrow()
  })
})

describe('with readConfigution function', () => {
  let readConfig
  beforeEach(() => {
    readConfig = jest.fn().mockReturnValue({
      Parameters: {
        key1: 'value1',
        key2: 'value2'
      },
      Tags: {
        tagKey1: 'tagValue1',
        tagKey2: 'tagValue2'
      }
    })
    cmd.readConfiguration(readConfig)
  })

  describe('--dryrun', () => {
    let log = jest.fn()
    beforeEach(() => {
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
    let log = jest.fn()
    beforeEach(() => {
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

        describe('with help as last argument', () => {
          beforeEach(() => {
            cmd.pushArgument('help')
          })

          test('does not add parameters', () => {
            expect(cmd.getArguments()).toMatchSnapshot()
          })
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
