import { rokka } from '../mockServer'
import nock from 'nock'

describe('sourceimages extended', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('sourceimages.autolabel', () => {
    it('calls autolabel endpoint', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg/abc123/autolabel')
        .reply(200, {
          labels: ['cat', 'animal', 'pet'],
        })

      const resp = await rokka().sourceimages.autolabel('myorg', 'abc123')

      expect(resp.body.labels).toEqual(['cat', 'animal', 'pet'])
    })
  })

  describe('sourceimages.autodescription', () => {
    it('calls autodescription endpoint with languages', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg/abc123/autodescription', {
          languages: ['en', 'de'],
          force: false,
        })
        .reply(200, {
          descriptions: {
            en: 'A cat sitting on a couch',
            de: 'Eine Katze sitzt auf einem Sofa',
          },
        })

      const resp = await rokka().sourceimages.autodescription(
        'myorg',
        'abc123',
        ['en', 'de'],
        false,
      )

      expect(resp.body.descriptions.en).toBe('A cat sitting on a couch')
      expect(resp.body.descriptions.de).toBe('Eine Katze sitzt auf einem Sofa')
    })

    it('forces regeneration when force is true', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg/abc123/autodescription', {
          languages: ['en'],
          force: true,
        })
        .reply(200, {
          descriptions: {
            en: 'Updated description',
          },
        })

      const resp = await rokka().sourceimages.autodescription(
        'myorg',
        'abc123',
        ['en'],
        true,
      )

      expect(resp.body.descriptions.en).toBe('Updated description')
    })
  })

  describe('sourceimages.createByUrl', () => {
    it('creates image from URL', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg', body => {
          // Body is multipart form data containing url[0]
          return (
            body.includes('name="url[0]"') &&
            body.includes('https://example.com/image.jpg')
          )
        })
        .reply(200, {
          total: 1,
          items: [
            {
              hash: 'abc123def456',
              short_hash: 'abc123',
              name: 'image.jpg',
              format: 'jpg',
            },
          ],
        })

      const resp = await rokka().sourceimages.createByUrl(
        'myorg',
        'https://example.com/image.jpg',
      )

      expect(resp.body.items[0].hash).toBe('abc123def456')
    })

    it('creates image from URL with metadata', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg', body => {
          // Body is multipart form data containing url[0] and meta_user[0]
          return (
            body.includes('name="url[0]"') &&
            body.includes('https://example.com/image.jpg') &&
            body.includes('name="meta_user[0]"') &&
            body.includes('{"foo":"bar"}')
          )
        })
        .reply(200, {
          total: 1,
          items: [
            {
              hash: 'abc123def456',
              user_metadata: { foo: 'bar' },
            },
          ],
        })

      const resp = await rokka().sourceimages.createByUrl(
        'myorg',
        'https://example.com/image.jpg',
        { meta_user: { foo: 'bar' } },
      )

      expect(resp.body.items[0].user_metadata?.foo).toBe('bar')
    })
  })

  describe('sourceimages.setProtected', () => {
    it('sets image as protected', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/options/protected')
        .query({ deletePrevious: 'false' })
        .reply(200, {
          hash: 'newHash123',
          protected: true,
        })

      const resp = await rokka().sourceimages.setProtected(
        'myorg',
        'abc123',
        true,
      )

      expect(resp.body.protected).toBe(true)
    })

    it('unsets protected with deletePrevious option', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/options/protected')
        .query({ deletePrevious: 'true' })
        .reply(200, {
          hash: 'abc123',
          protected: false,
        })

      const resp = await rokka().sourceimages.setProtected(
        'myorg',
        'abc123',
        false,
        { deletePrevious: true },
      )

      expect(resp.body.protected).toBe(false)
    })
  })

  describe('sourceimages.setLocked', () => {
    it('locks an image', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/options/locked')
        .reply(200, {
          hash: 'abc123',
          locked: true,
        })

      const resp = await rokka().sourceimages.setLocked('myorg', 'abc123', true)

      expect(resp.body.locked).toBe(true)
    })

    it('unlocks an image', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/options/locked')
        .reply(200, {
          hash: 'abc123',
          locked: false,
        })

      const resp = await rokka().sourceimages.setLocked(
        'myorg',
        'abc123',
        false,
      )

      expect(resp.body.locked).toBe(false)
    })
  })

  describe('sourceimages.setSubjectArea', () => {
    it('sets subject area', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/meta/dynamic/subject_area', {
          x: 100,
          y: 100,
          width: 50,
          height: 50,
        })
        .query({ deletePrevious: 'false' })
        .reply(200, {
          hash: 'newHash456',
          dynamic_metadata: {
            subject_area: { x: 100, y: 100, width: 50, height: 50 },
          },
        })

      const resp = await rokka().sourceimages.setSubjectArea(
        'myorg',
        'abc123',
        { x: 100, y: 100, width: 50, height: 50 },
      )

      expect(resp.body.dynamic_metadata.subject_area).toEqual({
        x: 100,
        y: 100,
        width: 50,
        height: 50,
      })
    })

    it('sets subject area with deletePrevious', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/meta/dynamic/subject_area')
        .query({ deletePrevious: 'true' })
        .reply(200, {
          hash: 'abc123',
        })

      const resp = await rokka().sourceimages.setSubjectArea(
        'myorg',
        'abc123',
        { x: 0, y: 0, width: 100, height: 100 },
        { deletePrevious: true },
      )

      expect(resp.statusCode).toBe(200)
    })
  })

  describe('sourceimages.removeSubjectArea', () => {
    it('removes subject area', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/abc123/meta/dynamic/subject_area')
        .query({ deletePrevious: 'false' })
        .reply(200, {
          hash: 'newHash789',
        })

      const resp = await rokka().sourceimages.removeSubjectArea(
        'myorg',
        'abc123',
      )

      expect(resp.statusCode).toBe(200)
    })
  })

  describe('sourceimages.addDynamicMetaData', () => {
    it('adds crop_area dynamic metadata', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/meta/dynamic/crop_area', {
          x: 10,
          y: 20,
          width: 200,
          height: 150,
        })
        .query({ deletePrevious: 'false' })
        .reply(200, {
          hash: 'newHash',
          dynamic_metadata: {
            crop_area: { x: 10, y: 20, width: 200, height: 150 },
          },
        })

      const resp = await rokka().sourceimages.addDynamicMetaData(
        'myorg',
        'abc123',
        'crop_area',
        { x: 10, y: 20, width: 200, height: 150 },
        {},
      )

      expect(resp.body.dynamic_metadata.crop_area).toEqual({
        x: 10,
        y: 20,
        width: 200,
        height: 150,
      })
    })

    it('adds version dynamic metadata', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/meta/dynamic/version', {
          text: 'v2.0',
        })
        .query({ deletePrevious: 'false' })
        .reply(200, {
          hash: 'newHash',
          dynamic_metadata: {
            version: { text: 'v2.0' },
          },
        })

      const resp = await rokka().sourceimages.addDynamicMetaData(
        'myorg',
        'abc123',
        'version',
        { text: 'v2.0' },
        {},
      )

      expect(resp.body.dynamic_metadata.version.text).toBe('v2.0')
    })
  })

  describe('sourceimages.deleteDynamicMetaData', () => {
    it('deletes dynamic metadata', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/abc123/meta/dynamic/crop_area')
        .reply(200, {
          hash: 'newHash',
        })

      const resp = await rokka().sourceimages.deleteDynamicMetaData(
        'myorg',
        'abc123',
        'crop_area',
        {},
      )

      expect(resp.statusCode).toBe(200)
    })
  })

  describe('sourceimages.putName', () => {
    it('updates image name', async () => {
      nock('https://api.rokka.io')
        .put('/sourceimages/myorg/abc123/name', '"new-image-name.jpg"')
        .reply(204)

      const resp = await rokka().sourceimages.putName(
        'myorg',
        'abc123',
        'new-image-name.jpg',
      )

      expect(resp.statusCode).toBe(204)
    })
  })

  describe('sourceimages.copyAll', () => {
    it('copies multiple images to another organization', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg/copy', ['hash1', 'hash2', 'hash3'])
        .matchHeader('Destination', 'targetorg')
        .reply(200, {
          copied: 3,
        })

      const resp = await rokka().sourceimages.copyAll(
        'myorg',
        ['hash1', 'hash2', 'hash3'],
        'targetorg',
      )

      expect(resp.body.copied).toBe(3)
    })

    it('copies without overwrite', async () => {
      nock('https://api.rokka.io')
        .post('/sourceimages/myorg/copy')
        .matchHeader('Destination', 'targetorg')
        .matchHeader('Overwrite', 'F')
        .reply(200, {
          copied: 2,
          existing: 1,
        })

      const resp = await rokka().sourceimages.copyAll(
        'myorg',
        ['hash1', 'hash2'],
        'targetorg',
        false,
      )

      expect(resp.body.copied).toBe(2)
    })
  })

  describe('sourceimages.invalidateCache', () => {
    it('invalidates cache for an image', async () => {
      nock('https://api.rokka.io')
        .delete('/sourceimages/myorg/abc123/cache')
        .reply(200, {})

      const resp = await rokka().sourceimages.invalidateCache('myorg', 'abc123')

      expect(resp.statusCode).toBe(200)
    })
  })

  describe('sourceimages.downloadList', () => {
    it('downloads list of images as zip', async () => {
      nock('https://api.rokka.io')
        .get('/sourceimages/myorg/download')
        .reply(200, 'zip-binary-data', {
          'content-type': 'application/zip',
        })

      const resp = await rokka().sourceimages.downloadList('myorg')

      expect(resp.statusCode).toBe(200)
    })

    it('downloads filtered list', async () => {
      nock('https://api.rokka.io')
        .get('/sourceimages/myorg/download')
        .query({ limit: 10, height: '100' })
        .reply(200, 'zip-binary-data')

      const resp = await rokka().sourceimages.downloadList('myorg', {
        limit: 10,
        search: { height: '100' },
      })

      expect(resp.statusCode).toBe(200)
    })
  })
})
