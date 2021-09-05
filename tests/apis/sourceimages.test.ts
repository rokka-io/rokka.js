import { rokka, queryAndCheckAnswer } from '../mockServer'
import fs from 'fs'
import nock from 'nock'

describe('sourceimages', () => {
  it('sourceimages.list', async () => {
    await queryAndCheckAnswer(
      async () => rokka().sourceimages.list('rokka-js-tests'),
      {
        mockFile: 'sourceimages_list.json',
      },
    )
  })

  it('sourceimages.list with args', async () => {
    await queryAndCheckAnswer(
      async () => {
        const search = {
          'user:int:id': '42',
          height: '64',
        }
        return rokka().sourceimages.list('rokka-js-tests', {
          search,
          limit: 2,
          offset: 1,
        })
      },

      {
        mockFile: 'sourceimages_list_with_args.json',
      },
    )
  })

  it('sourceimages.get', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.get(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
        ),
      {
        mockFile: 'sourceimages_get.json',
      },
    )
  })

  it('sourceimages.getWithBinaryHash', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.getWithBinaryHash(
          'rokka-js-tests',
          '498fed612f01199cd6702f5effe5fa7bb67e44f4',
        ),

      {
        mockFile: 'sourceimages_get_binaryhash.json',
      },
    )
  })

  it('sourceimages.download', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.download(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
        ),
      {
        mockFile: 'sourceimages_download.json',
      },
    )
  })

  it('sourceimages.create', async () => {
    nock('https://api.rokka.io')
      .post(
        '/sourceimages/rokka-js-tests',
        body =>
          body.includes('filename="cartman3.svg"') &&
          !body.includes('Content-Disposition: form-data; name="meta_user[0]'),
      )
      .reply(200, {
        total: 1,
        items: [
          {
            hash: 'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
            short_hash: 'fe5d9a',
            binary_hash: '63a65da81cae86964e3369b4431b80252f9404b0',
            created: '2019-12-10T10:45:32+00:00',
            name: 'cartman3.svg',
            mimetype: 'image/svg+xml',
            format: 'svg',
            size: 1202,
            width: 104,
            height: 97,
            organization: 'rokka-js-tests',
            link: '/sourceimages/rokka-js-tests/fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
            deleted: false,
            opaque: false,
          },
        ],
      })

    const resp = await rokka().sourceimages.create(
      'rokka-js-tests',
      'cartman3.svg',
      fs.createReadStream('tests/fixtures/cartman.svg'),
    )

    expect(resp.body.items[0].hash).toBe(
      'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
    )
  })

  it('sourceimages.create with metadata', async () => {
    nock('https://api.rokka.io')
      .post(
        '/sourceimages/rokka-js-tests',
        body =>
          body.includes('filename="cartman2.svg"') &&
          body.includes('Content-Disposition: form-data; name="meta_user[0]'),
      )
      .reply(200, {
        total: 1,
        items: [
          {
            hash: '063c3dce6a528d8944a63185bd4c7b161454ee4f',
            short_hash: '063c3d',
            binary_hash: '498fed612f01199cd6702f5effe5fa7bb67e44f4',
            created: '2019-12-10T11:13:24+00:00',
            name: 'cartman2.svg',
            mimetype: 'image/svg+xml',
            format: 'svg',
            size: 1203,
            width: 104,
            height: 97,
            organization: 'rokka-js-tests',
            link: '/sourceimages/rokka-js-tests/063c3dce6a528d8944a63185bd4c7b161454ee4f',
            user_metadata: {
              foo: 'bar',
            },
            deleted: false,
            opaque: false,
          },
        ],
      })

    const resp = await rokka().sourceimages.create(
      'rokka-js-tests',
      'cartman2.svg',
      fs.createReadStream('tests/fixtures/cartman.svg'),
      { meta_user: { foo: 'bar' } },
    )

    expect(resp.body.items[0].hash).toBe(
      '063c3dce6a528d8944a63185bd4c7b161454ee4f',
    )
    expect(resp.body.items[0].user_metadata?.foo).toBe('bar')
  })

  it('sourceimages.delete', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.delete(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
        ),
      {
        mockFile: 'sourceimages_delete.json',
      },
    )
  })

  it('sourceimages.restore', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.restore(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
        ),
      {
        mockFile: 'sourceimages_restore.json',
      },
    )
  })

  it('sourceimages.copy', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.copy(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
          'rokka-js-tests-new2',
        ),
      {
        mockFile: 'sourceimages_copy.json',
      },
    )
  })

  it('sourceimages.copy with no overwrite', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.copy(
          'rokka-js-tests',
          '063c3dce6a528d8944a63185bd4c7b161454ee4f',
          'rokka-js-tests-new2',
          false,
        ),
      {
        mockFile: 'sourceimages_copy_no_overwrite.json',
        returnError: true,
      },
    )
  })

  it('sourceimages.deleteWithBinaryHash', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.deleteWithBinaryHash(
          'rokka-js-tests',
          '498fed612f01199cd6702f5effe5fa7bb67e44f4',
        ),
      {
        mockFile: 'sourceimages_delete_with_binary.json',
        returnError: true,
      },
    )
  })
})
