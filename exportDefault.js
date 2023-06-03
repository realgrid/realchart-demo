const exportDefault = () => {
    let esm = false;

    return {
        name: 'exportDefault',
        renderStart: async (outputOptions, inputOptions) => {
            esm = ['es', 'esm'].includes(outputOptions.format);
            return outputOptions;
        },
        // renderChunk: async (code, chunk) => {
        //     return !chunk.exports.includes('default') && esm ? `${code}\nexport default { ${chunk.exports.join(', ')} };` : null;
        // },
        generateBundle(options, bundle) {
            if (esm) {
                for (const fileName in bundle) {
                    const file = bundle[fileName];
                    if (file.type === 'chunk') {
                        const code = file.code.replace(/export {/g, 'export default {');
                        file.code = code;
                    }
                }
            }
        }
    }
}
export default exportDefault;