const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
console.log('Generating dataset...');

const root = path.resolve(__filename, '..', '..');

const transcriptionFilePath = path.resolve(root, 'archive', 'WUWII_Transcriptions.txt')
const transcriptionFile = fs.readFileSync(transcriptionFilePath).toString('utf8').trim();
const transcriptionFileEntries = transcriptionFile.split('\n').splice(5);

const entries = [];

transcriptionFileEntries.forEach(entry => {
    if(!entry) return;
    try {
        const [
            date,
            time,
            gender,
            dialect,
            phonetype,
            sessionNumber,
            utteranceNumber,
            fileName,
            startTime,
            endTime,
            transcription
        ] = entry.split('|');

        const filePath = path.resolve(root, 'calls', sessionNumber, fileName);
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

        const [month, day, year] = date.split('.')
        const dateTime = new Date([year, month, day].join('-') + 'T' + time.replaceAll('.', ':'));
        const userTimezoneOffset = dateTime.getTimezoneOffset() * 60000;

        entries.push({
            dateRecorded: new Date(dateTime.getTime() - userTimezoneOffset).toISOString(),
            gender,
            dialect,
            phonetype,
            sessionNumber,
            utteranceNumber,
            fileName,
            filePath: path.relative(root, filePath),
            checksum,
            startTime: parseFloat(startTime),
            endTime: parseFloat(endTime),
            transcription
        });
    } catch (err) {
        console.log(`Unhandled error with ${entry}!`);
        throw err;
    }
})


// let verifiedCount = 0;
// files.forEach(file => {
//     try {
//         const info = file.split(',')
//         const filePath = path.resolve(root, 'calls', info[0]);
//         const exists = fs.existsSync(filePath);
//         if (!exists) {
//             console.log(`Cannot find: ${filePath}!`);
//             return;
//         }
//         const fileData = fs.readFileSync(filePath);

//         const checksum = crypto
//             .createHash('md5')
//             .update(fileData, 'utf8')
//             .digest('hex');

//         // pairs.push([file, checksum].join(','))

//         const checksumCorrect = checksum != info[1];

//         if (checksumCorrect) {
//             console.log(`File checksum incorrect!: ${filePath}! Expected ${info[1]}, got ${checksum} `);
//             return;
//         }

//         const transcriptionFileEntry = transcriptionFileEntries.find(entry => entry.includes(info[0].split('/')[1]));

//         if (!transcriptionFileEntry) {
//             console.log(`File transcription missing: ${filePath}!`);
//             return;
//         }

//         const [
//             date,
//             time,
//             gender,
//             dialect,
//             phonetype,
//             sessionNumber,
//             utteranceNumber,
//             fileName,
//             startTime,
//             endTime,
//             transcription
//         ] = transcriptionFileEntry.split('|');

//         const [month, day, year] = date.split('.')
//         const dateTime = new Date([year, month, day].join('-') + 'T' + time.replaceAll('.', ':'));
//         const userTimezoneOffset = dateTime.getTimezoneOffset() * 60000;

//         entries.push({
//             dateRecorded: new Date(dateTime.getTime() - userTimezoneOffset).toISOString(),
//             gender,
//             dialect,
//             phonetype,
//             sessionNumber,
//             utteranceNumber,
//             fileName,
//             filePath: path.relative(root, filePath),
//             checksum,
//             startTime: parseFloat(startTime),
//             endTime: parseFloat(endTime),
//             transcription
//         })

//         verifiedCount++;
//     } catch (err) {
//         console.log(`Unhandled error verifying ${file}!`);
//         throw err;
//     }
// })

// Uncomment to generate data.json
fs.writeFileSync(path.resolve(root, 'data.json'), JSON.stringify({ entries }, null, '    '));

// console.log(`${verifiedCount} /${files.length} files verified.`);
// if (verifiedCount !== files.length) {
//     throw new Error('Not all files verfied, you may need to redownload dataset.');
// }

console.log('Generation complete.')