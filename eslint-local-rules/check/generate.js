// leave only variants with the specified variantID in the result (regexp)
const FILTER_VARIANTID = null;
// const FILTER_VARIANTID = /^b.*!/;

/**
 * go through the code variants and the expected results of the eslint rule application, in order to run
 * it through eslint --fix and check that the expected code is obtained as a result
 */
// eslint-disable-next-line unicorn/prefer-module
exports.variantsGenerator = (function* buildVariants(_config, codeRenderer, id, _opts) {
    const opts = { ..._opts };

    if (_config.length > 0) {
        // the first value of config level is the key in which the values
        // from the second parameter of the config record will be enumerated in the context
        const level = _config[0];
        let config = _config.slice(1);
        // the second value of config level is an array of possible values, or a function returning
        // an array or a generator function
        let valuesList = level[1];
        const verionKey = level[0];
        let cnt = 0;

        if (typeof valuesList === 'function') valuesList = valuesList(opts);
        for (const value of valuesList) {
            opts[verionKey] = value;
            // A configuration tree can have conditional branching if you specify a function that
            // returns an array as the tail of the config depending on the context
            if (typeof level[2] === 'function') config = level[2](opts);
            yield* buildVariants(config, codeRenderer, (id || '') + String.fromCodePoint(97 + cnt++), opts);
        }
    } else {
        if (FILTER_VARIANTID && !FILTER_VARIANTID.test(id)) return;

        const fromOpts = {};
        const toOpts = {};

        for (const key in opts) { // different value for from and to
            if (Array.isArray(opts[key])) {
                [fromOpts[key], toOpts[key]] = opts[key];
            } else { // same value for from and to
                fromOpts[key] = opts[key];
                toOpts[key] = opts[key];
            }
        }
        fromOpts.type = 'from';
        fromOpts.id = id;
        toOpts.type = 'to';
        toOpts.id = id;
        yield {
            id,
            from: {
                code: codeRenderer(fromOpts),
                opts: fromOpts,
            },
            to: {
                code: codeRenderer(toOpts),
                opts: toOpts,
            },
            fromOpts,
            toOpts,
        };
    }
}(
    [ // config
        ['call', [
            ['V();', 'ctx.doSync(() => V());'],
            ['await V();', 'await ctx.do(() => V());'],
            ['ctx.doSync(() => V());', 'ctx.doSync(() => V());'],
            ['await ctx.do(() => V());', 'await ctx.do(() => V());'],
            ['await ctx.doAsync(() => V());', 'await ctx.do(() => V());'], // wrong to right
        ]],
        ['class', [true, false], (v) => (v.class
            ? [ // class
                ['accessibility', ['', 'public ', 'protected ', 'private ']],
                ['static', ['', 'static ']],
                ['wrapCode', (opts) => [
                    {
                        before: `${opts.accessibility}${opts.static}F() {`,
                        after: '}',
                    },
                    {
                        before: `${opts.accessibility}${opts.static}F = () => {`,
                        after: '}',
                    },
                    {
                        before: `${opts.accessibility}${opts.static}F = () => `,
                        after: '',
                    },
                ].map((t) => ({
                    before: `class A { ${t.before}`,
                    after: `${t.after} }`,
                }))],
            ]
            : [ // function
                ['wrapCode', [
                    {
                        before: 'function() {',
                        after: '};',
                    },
                    {
                        before: '() => {',
                        after: '};',
                    },
                    {
                        before: '() => ',
                        after: ';',
                    },
                ]],
            ])],
    ],
    (opts) => { // code renderer
        try {
            return `${opts.wrapCode.before}\n${opts.call}\n${opts.wrapCode.after}`;
        } catch (error) {
            console.info(`v: ${JSON.stringify(opts)}`);
            error.message = `Fialed on render (variantID: ${opts.variantID}): ${error.message}`;
            throw error;
        }
    },
));
