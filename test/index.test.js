const { TCCommand } = require('../src/')

const readConfig = jest.fn().mockReturnValue({
  Parameters: {
    key1: 'value1',
    key2: 'value2'
  },
  Tags: {
    tagKey1: 'tagValue1',
    tagKey2: 'tagValue2'
  }
})

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

describe('--dryrun', () => {
  let log = jest.fn()
  beforeEach(() => {
    cmd.setLogger(log)
    cmd.readConfiguration(readConfig)
    cmd.pushArguments(['--dryrun', 'aws', 'sts'])
  })

  test('isDryRun is true', () => {
    expect(cmd.isDryRun()).toBe(true)
  })

  test('logged command', () => {
    cmd.getArguments()
    expect(log).toHaveBeenCalledWith('aws sts')
  })
})

describe('aws', () => {
  beforeEach(() => {
    cmd.pushArgument('aws')
    cmd.readConfiguration(readConfig)
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
      cmd.readConfiguration(readConfig)
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
    cmd.readConfiguration(readConfig)
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
    cmd.readConfiguration(readConfig)
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
