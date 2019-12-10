import { rokka, queryAndCheckAnswer } from '../mockServer'

describe('sourceimages.metadata', () => {
  it('sourceimages.setSubjectArea', async () => {
    const subjectArea = { x: 100, y: 100, width: 50, height: 50 }

    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.setSubjectArea(
          'rokka-js-tests',
          'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
          subjectArea
        ),
      {
        mockFile: 'sourceimages_metadata_set_subjectarea.json'
      }
    )
  })

  it('sourceimages.setSubjectArea.deletePrevious', async () => {
    const subjectArea = { x: 120, y: 120, width: 40, height: 40 }

    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.setSubjectArea(
          'rokka-js-tests',
          'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
          subjectArea,
          { deletePrevious: true }
        ),
      {
        mockFile: 'sourceimages_metadata_set_subjectarea_delete.json'
      }
    )
  })

  it('sourceimages.removeSubjectArea', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.removeSubjectArea(
          'rokka-js-tests',
          '76114710a44fb15fb37ecf66bbad250643373990'
        ),
      {
        mockFile: 'sourceimages_metadata_remove_subjectarea.json'
      }
    )
  })

  it('sourceimages.removeSubjectArea.deletePrevious', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.removeSubjectArea(
          'rokka-js-tests',
          'e551164763cdbabcd0b75b144f3f08112844a81f',
          { deletePrevious: true }
        ),
      {
        mockFile: 'sourceimages_metadata_remove_subjectarea_delete.json'
      }
    )
  })

  it('sourceimages.meta.add', async () => {
    const userData = {
      somefield: 'somevalue',
      'int:some_number': 0,
      delete_this: null
    }
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.meta.add(
          'rokka-js-tests',
          'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
          userData
        ),
      {
        mockFile: 'sourceimages_metadata_add.json'
      }
    )
  })

  it('sourceimages.meta.replace', async () => {
    const userData = { somefield: 'somevalue', 'int:another_number': 23 }

    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.meta.add(
          'rokka-js-tests',
          'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2',
          userData
        ),
      {
        mockFile: 'sourceimages_metadata_replace.json'
      }
    )
  })

  it('sourceimages.meta.delete', async () => {
    await queryAndCheckAnswer(
      async () =>
        rokka().sourceimages.meta.delete(
          'rokka-js-tests',
          'fe5d9a097df0e93cf9570cbdb0386b137b4c9ed2'
        ),
      {
        mockFile: 'sourceimages_metadata_delete.json'
      }
    )
  })
})
