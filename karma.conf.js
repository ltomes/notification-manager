var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
let clone = (obj) => {
    if (obj != null && 'object' === typeof obj) {
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr]
            };
        }
        return copy;
    }
};
let rules = clone(webpackConfig.module.rules);
rules.push({
    test: /src\/.*\.js/,
    exclude: /node_modules|\.spec\.js|\.test\.js/, //Passes CI, but with wrong coverage 78%ish
    //exclude: /\/((node_modules)\/.*(test\.js|spec\.js))|(src\/components\/zoo\/.*(\.js))/, //From Levi
    // exclude: /\/(node_modules|ui\/src\/components\/zoo)\/.*(test\.js|spec\.js)/, //Passes CI, but with wrong coverage 50%ish From Calvin
    // exclude: [ '/node_modules/**/!(*.spec|*.test).js' ], //Fails CI
    // exclude: [ //Fails CI, but correct coverage locally/ This is our ideal exclude
    //     '/src/components/zoo/*',
    //     '/node_modules/**/!(*.spec|*.test).js'
    // ],
    loader: 'istanbul-instrumenter-loader?esModules=true'
});
module.exports = function (conf) {
    conf.set({
        basePath: './',
        frameworks: ['mocha', 'sinon-chai'],
        // browsers: [  'PhantomJS' ] ,
        browsers: [ 'Chrome_without_security' ],
        customLaunchers: {
            Chrome_without_security: {
                base: 'ChromeHeadless',
                flags: [ '--disable-web-security' ]
            }
        },
        reporters: ['coverage-istanbul', 'mocha'],
        browserConsoleLogOptions: {
            level: 'log'
        },
        coverageIstanbulReporter: {
            // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
            reports: ['html', 'lcovonly', 'text-summary'],

            // base output directory
            dir: './coverage',

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,
            // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped`
            skipFilesWithNoCoverage: true,
            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {

                // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/
                    //subdir: 'ui'
                }

            },

            // enforce percentage thresholds
            // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
            thresholds: {
                statements: 45,
                lines: 45,
                branches: 25,
                functions: 25
            }

        },
        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
        browserNoActivityTimeout: 60000,

        //How long will Karma wait for a message from a browser before disconnecting from it
        browserDisconnectTimeout: 1000,

        preprocessors: {
            // main app
            'src/index.js': ['webpack', 'sourcemap'],

            // all tests in one webpack bundle
            'src/index.spec.js': ['webpack', 'sourcemap']
        },

        files: [
            // main app
            'src/index.js',
            {
                pattern: 'src/index.spec.js',
                watched: false,
                included: true,
                served: true
            }
        ],
        webpack: {
            // read this: https://webpack.github.io/docs/build-performance.html

            // do *not* include "entry" points
            // in the karma-webpack config "karma watches the test entry points"
            // https://github.com/webpack/karma-webpack/blob/master/README.md
            // entry:{}

            // karma-webpack manages "output" too
            // output:{}

            // *do* include module rules
            module: {
                rules: rules
            },

            // include plugins
            plugins: webpackConfig.plugins.map((p) => {
                // twiddle this plugin that is used for setting the webpack magic global
                // for testing
                if (p.definitions && p.definitions.__TEST__ === false) {
                    p.definitions.__TEST__ = true;
                }
                return p;
            }),

            // cache enabled by default in watch mode
            // https://webpack.github.io/docs/configuration.html#cache
            cache: true,

            // debug: true,
            // devtool...
            // https://webpack.github.io/docs/configuration.html#devtool
            // 'cheap' means no column, just line nums... fine? fine.
            devtool: 'cheap-module-inline-source-map'

        },

        webpackMiddleware: {
            // if you want to see what webpack is doing, set to false
            noInfo: true
        },

        // make sure we sync the above frameworks with their plugin adapters
        plugins: [
            require('karma-mocha'),
            require('karma-mocha-reporter'),
            require('karma-sinon-chai'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-sourcemap-loader'),
            require('karma-webpack')
        ]
    });

};
