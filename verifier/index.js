const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
console.log('Verifying dataset...');

const listFilePath = path.resolve(__filename, '../../', 'WUWII_File_List.txt')
const listFile = fs.readFileSync(listFilePath).toString('utf8').trim();
const files = listFile.split('\n');

const transcriptionFilePath = path.resolve(__filename, '../../', 'WUWII_Transcriptions.txt')
const transcriptionFile = fs.readFileSync(transcriptionFilePath).toString('utf8').trim();

// const pairs = []

let verifiedCount = 0;
files.forEach(file => {
    const info = file.split(',')
    const filePath = path.resolve(__filename, '../../calls', info[0]);
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

    // pairs.push([file, checksum].join(','))

    if (checksum != info[1]) {
        console.log(`File checksum incorrect!: ${filePath}! Expected ${info[1]}, got ${checksum} `);
        return;
    }

    if (!transcriptionFile.includes(info[0].split('/')[1])) {
        console.log(`File transcription missing: ${filePath}!`);
        return;
    }


    verifiedCount++;
})

// fs.writeFileSync('results.txt', pairs.join('\n'));

console.log(`${verifiedCount} /${files.length} files verified.`);
if (verifiedCount !== files.length) {
    throw new Error('Not all files verfied, you may need to redownload dataset.');
}

console.log('Verification complete.')