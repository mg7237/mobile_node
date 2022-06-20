const sql = require('mssql');
const config = require('../config/db.config');

async function generateOTP(mobile) {
    try {
        await sql.connect(config.sqlConfig);
        validFarmerSql = 'Select * from Farmer Where (MobileNumberPrimary = ' + mobile + ' OR MobileNumberSecondary =' + mobile + ') AND DeleteYN != 1';
        result = await sql.query(validFarmerSql);
        console.dir(result.recordset.length);
        console.dir(result);
        
        if (result. recordset.length > 0) {
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log('generated otp', otp);
            return otp;
        } else {
            return 0;
        }
    } catch (err) {
        console.log(err);
        return 0;
    }
}
    
module.exports = { generateOTP };