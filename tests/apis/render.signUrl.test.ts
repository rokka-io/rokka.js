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

  it('render.signUrl with custom roundDateUpTo', () => {
    const rka = rokka()

    // with roundDateUpTo = 60 (1 minute), the date gets rounded up to next minute
    const result1 = rka.render.signUrl(signPath, signKey, {
      until: new Date('2050-02-08T08:03:30+01:00'),
      roundDateUpTo: 60,
    })
    // Verify the sigopts contains the rounded time (to next minute)
    expect(result1).toContain('sigopts=')
    expect(result1).toContain('sig=')
    expect(result1).toContain('2050-02-08T07%3A04%3A00.000Z')

    // with roundDateUpTo = 1 (no rounding), the exact time is preserved
    const result2 = rka.render.signUrl(signPath, signKey, {
      until: new Date('2050-02-08T08:03:30+01:00'),
      roundDateUpTo: 1,
    })
    expect(result2).toContain('2050-02-08T07%3A03%3A30.000Z')

    // with roundDateUpTo = 3600 (1 hour), the date gets rounded to the next hour
    const result3 = rka.render.signUrl(signPath, signKey, {
      until: new Date('2050-02-08T08:03:30+01:00'),
      roundDateUpTo: 3600,
    })
    expect(result3).toContain('2050-02-08T08%3A00%3A00.000Z')

    // Signatures should differ when roundDateUpTo differs (because the until time differs)
    expect(result1).not.toBe(result2)
    expect(result2).not.toBe(result3)
  })

  it('render.signUrlWithOptions directly', () => {
    const rka = rokka()

    // without options
    expect(rka.render.signUrlWithOptions(signPath, signKey)).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sig=62e7a9ccd3dea053',
    )

    // with null options
    expect(rka.render.signUrlWithOptions(signPath, signKey, null)).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sig=62e7a9ccd3dea053',
    )

    // with until option
    expect(
      rka.render.signUrlWithOptions(signPath, signKey, {
        until: '2050-02-08T07:05:00.000Z',
      }),
    ).toBe(
      'https://myorg.rokka.io/dynamic/c1b110.jpg?sigopts=%7B%22until%22%3A%222050-02-08T07%3A05%3A00.000Z%22%7D&sig=0f6370995020ce81',
    )
  })
})
