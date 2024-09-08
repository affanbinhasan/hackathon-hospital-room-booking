const { readCSV } = require('./csvReader');

const handler = async () => {
    const availabilityByHospitalName = [];

    readCSV()
        .then(csvRecords => {
            if (csvRecords.length > 0) {
                csvRecords.forEach((record) => {                   
                    availabilityByHospitalName.push({ [record[Object.keys(record)[0]]]: record })
                })
                const groupByHospitals = groupByKeys(availabilityByHospitalName);
                console.log(groupByHospitals);
                
                return groupByHospitals;
            } else {
                throw new Error('Invalid Input: Empty File')
            }
        })
        .catch(error => {
            throw new Error('Error Occured while reading the file', error)
        });        
}

const groupByKeys = (data) => {
    return data.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj[key]);
      return acc;
    }, {});
  };

handler();