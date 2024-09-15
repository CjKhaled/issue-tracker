const crypto = require('crypto')
const fs = require('fs')

function genKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    fs.writeFileSync(__dirname + '/keys/public.key', keyPair.publicKey)
    fs.writeFileSync(__dirname + '/keys/private.key', keyPair.privateKey)
}

// remember to make this run in server file
genKeyPair()