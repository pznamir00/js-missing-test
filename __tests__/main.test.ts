/**
 * Unit tests for the action's main functionality, src/main.js
 */
import core from '@actions/core'
import * as main from '../src/main'

describe.skip('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    // getInputMock.mockImplementation(name => {
    //   switch (name) {
    //     case 'milliseconds':
    //       return '500'
    //     default:
    //       return ''
    //   }
    // })
    // await main.run()
    // expect(runMock).toHaveReturned()
    // // Verify that all of the core library functions were called correctly
    // expect(debugMock).toHaveBeenNthCalledWith(1, 'Waiting 500 milliseconds ...')
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   2,
    //   expect.stringMatching(timeRegex)
    // )
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   3,
    //   expect.stringMatching(timeRegex)
    // )
    // expect(setOutputMock).toHaveBeenNthCalledWith(
    //   1,
    //   'time',
    //   expect.stringMatching(timeRegex)
    // )
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    // getInputMock.mockImplementation(name => {
    //   switch (name) {
    //     case 'milliseconds':
    //       return 'this is not a number'
    //     default:
    //       return ''
    //   }
    // })
    // await main.run()
    // expect(runMock).toHaveReturned()
    // // Verify that all of the core library functions were called correctly
    // expect(setFailedMock).toHaveBeenNthCalledWith(
    //   1,
    //   'milliseconds not a number'
    // )
  })

  it('fails if no input is provided', async () => {
    // Set the action's inputs as return values from core.getInput()
    // getInputMock.mockImplementation(name => {
    //   switch (name) {
    //     case 'milliseconds':
    //       throw new Error('Input required and not supplied: milliseconds')
    //     default:
    //       return ''
    //   }
    // })
    // await main.run()
    // expect(runMock).toHaveReturned()
    // // Verify that all of the core library functions were called correctly
    // expect(setFailedMock).toHaveBeenNthCalledWith(
    //   1,
    //   'Input required and not supplied: milliseconds'
    // )
  })
})
