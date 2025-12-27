import { rokka } from '../mockServer'
import nock from 'nock'

describe('render.imagesByAlbum', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('gets images from an album', async () => {
    nock('https://myorg.rokka.io')
      .get('/_albums/vacation/all.json')
      .reply(200, {
        album: 'vacation',
        images: [
          { hash: 'abc123', name: 'beach.jpg' },
          { hash: 'def456', name: 'sunset.jpg' },
        ],
        total: 2,
      })

    const resp = await rokka().render.imagesByAlbum('myorg', 'vacation')

    expect(resp.body.album).toBe('vacation')
    expect(resp.body.images).toHaveLength(2)
    expect(resp.body.images[0].hash).toBe('abc123')
  })

  it('gets favorite images from an album', async () => {
    nock('https://myorg.rokka.io')
      .get('/_albums/vacation/favorites.json')
      .reply(200, {
        album: 'vacation',
        images: [{ hash: 'def456', name: 'sunset.jpg', favorite: true }],
        total: 1,
      })

    const resp = await rokka().render.imagesByAlbum('myorg', 'vacation', {
      favorites: true,
    })

    expect(resp.body.images).toHaveLength(1)
    expect(resp.body.images[0].favorite).toBe(true)
  })

  it('handles album with special characters', async () => {
    nock('https://myorg.rokka.io')
      .get('/_albums/My%20Summer%20Photos/all.json')
      .reply(200, {
        album: 'My Summer Photos',
        images: [],
        total: 0,
      })

    const resp = await rokka().render.imagesByAlbum('myorg', 'My Summer Photos')

    expect(resp.body.album).toBe('My Summer Photos')
  })

  it('handles empty album', async () => {
    nock('https://myorg.rokka.io')
      .get('/_albums/empty-album/all.json')
      .reply(200, {
        album: 'empty-album',
        images: [],
        total: 0,
      })

    const resp = await rokka().render.imagesByAlbum('myorg', 'empty-album')

    expect(resp.body.total).toBe(0)
    expect(resp.body.images).toHaveLength(0)
  })

  it('handles not found error', async () => {
    nock('https://myorg.rokka.io')
      .get('/_albums/nonexistent/all.json')
      .reply(404, {
        error: { message: 'Album not found' },
      })

    try {
      await rokka().render.imagesByAlbum('myorg', 'nonexistent')
      fail('Expected an error to be thrown')
    } catch (error: any) {
      expect(error.statusCode).toBe(404)
    }
  })
})
