
jeml`${'def a, b, c'}

    ${'function name(a, b, c)'}

    ${'end'}

    ${'if x > 10'}

    ${'else if x > 30'}

    ${'end'}

    ${'each name in abc'}

    ${'end'}

    ${'each name in arr'}

    ${'= escaped'}
    ${'- unescaped'}
    ${'# this is comment'}

    ${{ let: 'arr', as: [1, 2, 3, 4, 5] }}
    ${{ call: fn, args: 'a, b, c, d' }}
    ${{ inject: '<raw string>' }}
    ${{ inject: 'something', escape: true /* default is false */ }}
`
