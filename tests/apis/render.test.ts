import { rokka } from '../mockServer'

describe('render', () => {
  it('get URL', async () => {
    const url = rokka().render.getUrl(
      'myorg',
      'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      'png',
      'mystack',
    )

    expect(url).toBe(
      'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png',
    )
  })

  it('render.getUrl using custom operations', async () => {
    const rka = rokka()
    const operations = [
      rka.operations.rotate(45),
      rka.operations.resize(100, 100),
    ]

    const url = rka.render.getUrl(
      'myorg',
      'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
      'png',
      operations,
    )
    expect(url).toBe(
      'https://myorg.rokka.io/dynamic/rotate-angle-45--resize-width-100-height-100/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png',
    )
  })
})
