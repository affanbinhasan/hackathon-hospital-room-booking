const fs = require('fs');
const csv = require('csv-parser');



const readCSV = async () => {
    const results = [];

    try {
        return new Promise((resolve, reject) => {
            fs.createReadStream('./input-files/InputDump.csv')
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                });
        }) 
    } catch (error) {
        throw new Error('Error while reading file')
    }
}

const validateRecords = (csvRecords) => {
    return csvRecords.length > 0;
}

module.exports.readCSV = readCSV;