/**
 * @file
 * Get options from arguments and config file
 */
var Path = require('path');

var ArgumentParser = require('argparse').ArgumentParser;
var Fs = require('q-io/fs');
var Q = require('q');
var thr = require('throw');
var _ = require('lodash');

var packageInfo = require('../../package.json');

/**
 * Get options
 * @returns {Promise<Object>} Options
 */
module.exports = function () {
    var parser = new ArgumentParser({
        version: packageInfo.version,
        addHelp: true,
        description: packageInfo.description,
        epilog: 'Feed validator: Of Steamworks and Magick Obscura'
    });
    parser.addArgument(['-c', '--config'], {
        action: 'store',
        metavar: 'FILE_PATH',
        required: false,
        help: 'Config file path'
    });
    parser.addArgument(['--no-colors'], {
        action: 'storeTrue',
        dest: 'noColors',
        help: 'Don\'t use colors'
    });
    parser.addArgument(['url'], {
        action: 'store',
        help: 'Feed url to validate'
    });

    var args = parser.parseArgs();
    if (!args.config) {
        return Q(args);
    }

    var configPath = Path.join(process.cwd(), args.config);
    return Fs.exists(configPath)
        .then(function (exists) {
            if (!exists) {
                thr('Config not found in path %s', args.config);
            }
            return _.assign({}, args, require(configPath));
        });
};
