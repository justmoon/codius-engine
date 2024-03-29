# Contracts Engine
The engine to run contracts

## Playing with the engine

+ `npm install`
+ `npm test` runs the existing tests
+ `node run-test-contract.js` will compile and run the `test_contract` and all of its submodules and files

## IPC Messaging Format

### Contract -> Sandbox

API call with callback
```js
{
  "type": "api",
  "api": "http",
  "method": "get",
  "data": "http://some.url",
  "callback": 4
}
```

Process finished message?

### Sandbox -> Contract

API callback
```js
{
  "type": "callback",
  "callback": 4,
  "error": null,
  "result": "some stringified result"
}
```

Event listener triggered
```js
{
  "type": "event",
  "handler": "eventHandlerName",
  "data": "data passed in on event"
}
```

Unprompted message? (e.g. the contract client triggering a contract to run)
- how to reference a specific contract?
- how do you validate they have permissions to send it a message?


## Contract-specific Secrets and Keypairs

### Secret Derivation

The engine must be started with a `MASTER_SECRET`.

This secret is used to derive multiple other secrets, which are used to provide contracts with unique private values and public/private key pairs. Derived secrets are the HMAC of the "parent" secret and the name of the "child" secret

+ `CONTRACT_SECRET_GENERATOR` - used to generate 512-bit private values
+ `CONTRACT_KEYPAIR_GENERATOR_ec_secp256k1` - used to generate `secp256k1` key pairs (e.g. `CONTRACT_KEYPAIR_13550350a8681c84c861aac2e5b440161c2b33a3e4f302ac680ca5b686de48de`)
+ other `CONTRACT_KEYPAIR_GENERATOR_{other signature schemes}` (e.g. `ec_ed25519`)
+ `MASTER_KEYPAIR_ec_secp256k1` - used to sign contracts' public keys
+ other `MASTER_KEYPAIR_{other signature schemes}` (e.g. `ec_ed25519`)


### API

```js
var secrets = require('secrets');

// Get a secret that is deterministically generated and unique for the contract
secrets.getSecret(function(error, secret){
  // error: null
  // secret: "c88097bb32531bd14fc0c4e8afbdb8aa22d4d6eefcbe980d8c52bd6381c6c60ca746b330ce93decf5061a011ed71afde8b4ed4fbbf1531d010788e8bb79c8b6d"
});

// Get a secp256k1 key pair and the engine's signature on the public key
// Note that the signature is in DER format
secrets.getKeypair('ec_secp256k1', function(error, keypair){
  // error: null
  // keypair: {
  //   public: '0417b9f5b3ba8d550f19fdfb5233818cd27d19aaea029b667f547f5918c307ed3b1ee32e285f9152d61c2a85b275f1b27d955c2b59a313900c4006377afa538370',
  //   private: '9e623166ac44d4e75fa842f3443485b9c8380551132a8ffaa898b5c93bb18b7d',
  //   signature: '304402206f1c9e05bc2ad120e0bb58ff368035359d40597ef034509a7dc66a79d4648bea022015b417401d194cf2917e853a7565cfbce32ee90c5c8f34f54075ee2f87519d88'
  // }
});


```

## Require

`require` can be used in the sandbox to load modules, javascript files, and JSON files.

The following table explains how `require` will interpret paths:

| Given path  | File returned  |
|---|---|
| `module_name`  | `main` file identified in `codius_modules/module_name/codius-manifest.json`  |
| `./file.js` or `./file`  | `./file.js` or `file.js` listed in the `files` of the current context's manifest  |
| `./file.json` | `./file.json` or `file.json` listed in the `files` of the current context's manifest |
| `./codius_modules/module_name/file.js` or `module_name/file.js`  | `./file.js` or `file.js` listed in the `files` of `module_name`'s manifest  |
| `./directory`  | `main` file identified in `./directory/codius-manifest.json` or `./directory/package.json`, or `./directory/index.js`  |
| `../file.js`  | `./file.js` or `file.js` from the parent directory or parent module of the current context  |

\* Note that absolute paths (e.g. `/codius_modules/module_name/file.js`) are not currently supported.
