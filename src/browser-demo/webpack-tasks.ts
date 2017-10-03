// entry point that is never loaded in the browser but triggers some webpack build tasks.

// Copy all .html to the output directory
require.context('file?name=./[path][name].[ext]!../', true, /\.html$/);

// Copy other misc
require.context('file?name=./.nojekyll!../.nojekyll');
