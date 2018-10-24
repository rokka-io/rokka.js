import test from 'ava'

import rka from '../../src'

test('render.getUrl using stack', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const url = rokka.render.getUrl(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    'png',
    'mystack'
  )

  t.is(
    url,
    'https://myorg.rokka.io/mystack/c421f4e8cefe0fd3aab22832f51e85bacda0a47a.png'
  )
})

test('render.getUrl using custom operations', t => {
  const rokka = rka({ apiKey: 'APIKEY' })

  const operations = [
    rokka.operations.rotate(45),
    rokka.operations.resize(100, 100)
  ]

  const url = rokka.render.getUrl(
    'myorg',
    'c421f4e8cefe0fd3aab22832f51e85bacda0a47a',
    'png',
    operations
  )

  t.not(
    url.indexOf(
      'https://myorg.rokka.io/dynamic/rotate-angle-45--resize-width-100-height-100/c42'
    ),
    -1
  )
})
