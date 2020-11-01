const { TestScheduler } = require('jest')
const { tc } = require('../src/')

describe('aws cloudformation', () => {
  describe('non-parameter command', () => {
    let cmd
    beforeEach(() => {
      cmd = tc(['aws', 'sts'])
    })

    test('generates command with parameters', () => {
      expect(cmd.getArguments()).toMatchSnapshot()
    })
  })

  describe('deploy', () => {
    let cmd
    beforeEach(() => {
      cmd = tc(['aws', 'cloudformation', 'deploy'])
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
    let cmd
    beforeEach(() => {
      cmd = tc(['aws', 'cloudformation', 'create-change-set'])
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

describe('sam', () => {
  describe('deploy', () => {
    let cmd
    beforeEach(() => {
      cmd = tc(['sam', 'deploy'])
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
  describe('deploy', () => {
    let cmd
    beforeEach(() => {
      cmd = tc(['rain', 'deploy'])
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
