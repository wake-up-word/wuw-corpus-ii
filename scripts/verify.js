const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
console.log('Verifying dataset...');

const root = path.resolve(__filename, '..', '..');

const data = require('../data.json')

let verifiedCount = 0;
data.entries.forEach(entry => {
    try {
        const filePath = path.resolve(root, entry.filePath);
        const exists = fs.existsSync(filePath);
        if (!exists) {
            console.log(`Cannot find: ${filePath}!`);
            return;
        }
        const fileData = fs.readFileSync(filePath);

        const checksum = crypto
            .createHash('md5')
            .update(fileData, 'utf8')
            .digest('hex');

        const checksumCorrect = checksum != entry.checksum;

        if (checksumCorrect) {
            console.log(`File checksum incorrect!: ${filePath}! Expected ${info[1]}, got ${checksum} `);
            return;
        }

        verifiedCount++;
    } catch (err) {
        console.log(`Unhandled error verifying ${entry.filePath}!`);
        throw err;
    }
})

console.log(`${verifiedCount} /${data.entries.length} files verified.`);
if (verifiedCount !== data.entries.length) {
    throw new Error('Not all files verfied, you may need to redownload dataset.');
}

console.log('Verification complete.')