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

  it('get URL from Url', async () => {
    const url = rokka().render.getUrlFromUrl(
      'https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png',
      'mystack',
    )

    expect(url).toBe(
      'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png',
    )

    const url2 = rokka().render.getUrlFromUrl(
      'https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.png',
      [{ name: 'resize', options: { width: '100' } }],
      { format: 'jpg' },
    )

    expect(url2).toBe(
      'https://myorg.rokka.io/dynamic/resize-width-100/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg',
    )

    const url3 = rokka().render.getUrlFromUrl(
      'https://myorg.rokka.io/dynamic/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.png',
      [{ name: 'resize', options: { width: '200' } }],
      { format: 'jpg', filename: 'bar', stackoptions: { af: '1' } },
    )

    expect(url3).toBe(
      'https://myorg.rokka.io/dynamic/resize-width-200/o-af-1/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/bar.jpg',
    )
    const url4 = rokka().render.getUrlFromUrl(
      'https://myorg.rokka.io/dynamic/resize-width-100/v-foo-bar/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
      'newStack',
      {
        removeSafeUrlFromQuery: true,
        clearVariables: false,
        variables: { hi: 'ho' },
      },
    )
    expect(url4).toBe(
      'https://myorg.rokka.io/newStack/v-foo-bar-hi-ho/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
    )

    const url5 = rokka().render.getUrlFromUrl(
      'https://myorg.rokka.io/dynamic/resize-width-100/v-foo-bar/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
      'newStack',
      {
        removeSafeUrlFromQuery: true,
        variables: { hi: 'ho' },
      },
    )
    expect(url5).toBe(
      'https://myorg.rokka.io/newStack/v-hi-ho/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg',
    )
  })
  it('render.addStackVariables', async () => {
    const url = rokka().render.addStackVariables(
      'https://myorg.rokka.io/dynamic/resize-width-100/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg',
      { foo: 'bar', baz: 'hello-world' },
      true,
    )
    expect(url).toBe(
      'https://myorg.rokka.io/dynamic/resize-width-100/v-foo-bar/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
    )
    const url2 = rokka().render.addStackVariables(
      'https://myorg.rokka.io/dynamic/resize-width-100/v-foo-bar/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
      { lal: 'lol' },
      true,
    )
    expect(url2).toBe(
      'https://myorg.rokka.io/dynamic/resize-width-100/v-foo-bar-lal-lol/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/foo.jpg?v={"baz":"hello-world"}',
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
