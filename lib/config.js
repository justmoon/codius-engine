var path = require('path');
var extend = require('extend');

function Config(opts) {
  extend(this, Config.defaults);
  extend(this, opts);
}

Config.defaults = {
  /**
   * Path where the virtual contracts filesystem lives on the physical disk.
   */
  contractsFilesystemPath: path.resolve(__dirname, '../contract_filesystem/')+path.sep,

  /**
   * Path to API modules.
   */
  apisPath: path.resolve(__dirname, '../apis/')+path.sep,

  /**
   * Api modules that the engine should load and have available.
   */
  apis: [
    'fs',
    'foo',
    'secrets'
  ],

  /**
   * Apis to be added to automatically generated manifests.
   */
  defaultManifestApis: [
    'fs',
    'foo',
    'secrets'
  ],

  /**
   * Name for the manifest file.
   *
   * The manifest file specifies the basic properties of the contract.
   */
  manifestFilename: 'codius-manifest.json',

  /**
   * Default filenames for primary contract script.
   *
   * When generating an implicit manifest, the contract engine will look for
   * these filenames as the entry point.
   */
  defaultMainFilenames: [
    'contract.js',
    'main.js',
    'index.js'
  ]
};

exports.Config = Config;
