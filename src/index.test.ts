import { run } from '../src/main'

describe('index', () => {
  it('calls run when imported', async () => {
    require('../src/index')

    expect(run).toHaveBeenCalled()
  })
})

jest.mock('../src/main', () => ({
  run: jest.fn()
}))
