import { rokka } from '../mockServer'

const signPath = 'https://myorg.rokka.io/dynamic/c1b110.jpg'
const signKey = 'OCOuisGe30QyocYkQN1SPErGGKunyuhZ'

describe('render', () => {
  it('render.signUrl', async () => {
    const rka = rokka()
    expect(rka.render.signUrl(signPath, signKey)).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sig=62e7a9ccd3dea053',
    )

    expect(
      rka.render.signUrl(
        'https://myorg.rokka.io/dynamic/c1b110/foo.jpg',
        signKey,
      ),
    ).toBe('https://myorg.rokka.io/dynamic/c1b110.jpg?sig=62e7a9ccd3dea053')

    // time limited
    expect(
      rka.render.signUrl(signPath, signKey, {
        until: new Date('2050-02-08T08:03:00+01:00'),
      }),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sigopts=%7B%22until%22%3A%222050-02-08T07%3A05%3A00.000Z%22%7D&sig=0f6370995020ce81',
    )

    //same sig a minute later
    expect(
      rka.render.signUrl(signPath, signKey, {
        until: new Date('2050-02-08T08:04:00+01:00'),
      }),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sigopts=%7B%22until%22%3A%222050-02-08T07%3A05%3A00.000Z%22%7D&sig=0f6370995020ce81',
    )

    // different sig 2 minutes later
    expect(
      rka.render.signUrl(signPath, signKey, {
        until: new Date('2050-02-08T08:06:00+01:00'),
      }),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sigopts=%7B%22until%22%3A%222050-02-08T07%3A10%3A00.000Z%22%7D&sig=1b4ef0fce0a76d00',
    )

    // keep v querey
    expect(rka.render.signUrl(signPath + '?v={"a":"b"}', signKey)).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?v=%7B%22a%22%3A%22b%22%7D&sig=9259f07089f76a05',
    )

    // keep any query query
    expect(
      rka.render.signUrl(signPath + '?foo=bar&lala=hello&soso', signKey),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?foo=bar&lala=hello&soso=&sig=4d6173249ba045f0',
    )

    //remove existing sig
    expect(
      rka.render.signUrl(
        signPath + '?foo=bar&lala=hello&soso&sig=lala',
        signKey,
      ),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?foo=bar&lala=hello&soso=&sig=4d6173249ba045f0',
    )

    // remove existing sigopts & sig
    expect(
      rka.render.signUrl(
        signPath + '?foo=bar&lala=hello&soso&sig=lala&sigopts=84989',
        signKey,
      ),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?foo=bar&lala=hello&soso=&sig=4d6173249ba045f0',
    )

    //remove existing sigopts & sig with date
    expect(
      rka.render.signUrl(
        signPath + '?foo=bar&lala=hello&soso&sig=lala&sigopts=84989',
        signKey,
        { until: new Date('2050-02-08T08:03:00+01:00') },
      ),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?foo=bar&lala=hello&soso=&sigopts=%7B%22until%22%3A%222050-02-08T07%3A05%3A00.000Z%22%7D&sig=6f3e929c4a310e27',
    )
  })
})
