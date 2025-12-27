import { rokka } from '../mockServer'

describe('render.getUrlComponents', () => {
  const rka = rokka()

  describe('parses standard rokka URLs', () => {
    it('parses URL with hash and format', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'png',
        filename: undefined,
      })
    })

    it('parses URL with hash, filename and format', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a/image.jpg',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: 'image',
      })
    })

    it('parses URL with short hash', () => {
      const url = new URL('https://myorg.rokka.io/mystack/c421f4.png')
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: 'c421f4',
        format: 'png',
        filename: undefined,
      })
    })

    it('parses URL with dynamic stack and operations', () => {
      const url = new URL(
        'https://myorg.rokka.io/dynamic/resize-width-100/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.jpg',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'dynamic/resize-width-100',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: undefined,
      })
    })

    it('parses URL with stack options', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/o-af-1/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.jpg',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack/o-af-1',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: undefined,
      })
    })

    it('parses URL with variables', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/v-foo-bar/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.jpg',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack/v-foo-bar',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: undefined,
      })
    })
  })

  describe('parses path-based URLs', () => {
    it('parses URL with path hash', () => {
      const url = new URL('https://myorg.rokka.io/mystack/-path-to-image-.jpg')
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: '-path-to-image-',
        format: 'jpg',
        filename: undefined,
      })
    })

    it('parses URL with path hash and filename', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/-path-to-image-/myfile.png',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: '-path-to-image-',
        format: 'png',
        filename: 'myfile',
      })
    })
  })

  describe('handles different formats', () => {
    it.each(['jpg', 'png', 'gif', 'webp', 'avif', 'svg'])(
      'parses URL with %s format',
      format => {
        const url = new URL(
          `https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.${format}`,
        )
        const result = rka.render.getUrlComponents(url)

        expect(result).not.toBe(false)
        if (result) {
          expect(result.format).toBe(format)
        }
      },
    )
  })

  describe('returns false for invalid URLs', () => {
    it('returns false for non-rokka URL pattern', () => {
      const url = new URL('https://example.com/some/random/path.jpg')
      const result = rka.render.getUrlComponents(url)

      expect(result).toBe(false)
    })

    it('returns false for URL without format', () => {
      const url = new URL('https://myorg.rokka.io/mystack/c421f4')
      const result = rka.render.getUrlComponents(url)

      expect(result).toBe(false)
    })
  })

  describe('handles query parameters', () => {
    it('ignores query parameters when parsing', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.jpg?v={"foo":"bar"}',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: undefined,
      })
    })

    it('ignores signature query parameters', () => {
      const url = new URL(
        'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.jpg?sig=abc123&sigopts=xyz',
      )
      const result = rka.render.getUrlComponents(url)

      expect(result).toEqual({
        stack: 'mystack',
        hash: 'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
        format: 'jpg',
        filename: undefined,
      })
    })
  })
})
