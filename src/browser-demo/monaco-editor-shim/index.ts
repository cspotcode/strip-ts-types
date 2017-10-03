// Simplest possible way to load Monaco.
// Use Monaco's own AMD loader, wrapped in a closure to keep it separate.
// Use the copy loader to copy all monaco assets to the output directory.
// ==Requirements:==
// * file-loader
// * imports-loader
// * monaco installed via npm

// Copy all monaco assets and code to the output directory.
// Inject global define into the .js files (except if running in a web worker)
require.context(
    "!file-loader?name=[path][name].[ext]" + 
    "!imports-loader?define=>self.importScripts%3Fself.define:window.__MONACO_AMD__.define&require=>self.importScripts%3Fself.require:window.__MONACO_AMD__.require" +
    "!monaco-editor/dev",
    true,
    /\.js$/
);
require.context(
    '!file-loader?name=[path][name].[ext]' +
    '!monaco-editor/dev',
    true,
    /\.(json|svg|css)$/
);

// Load the AMD loader, making sure the environment looks like a plain browser sans webpack magic.
const loader = require(
    '!imports-loader?' +
    'process=>undefined&require=>undefined&exports=>undefined&module=>undefined&define=>undefined' +
    '!monaco-editor/dev/vs/loader.js'
);
const {define: amdDefine, require: amdRequire} = loader;
window.__MONACO_AMD__ = loader;

// Configure the loader
amdRequire.config({ paths: { 'vs': '../_/node_modules/monaco-editor/dev/vs' }});

// Load the editor.  Export a promise that resolves with the loaded editor
export default new Promise((res, rej) => {
    amdRequire(['vs/editor/editor.main'], () => {
        res(window.monaco);
    });
});
