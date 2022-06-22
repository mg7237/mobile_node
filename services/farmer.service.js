const { setServers } = require('dns');
const sql = require('mssql');
const config = require('../config/db.config');
const { Farmland, FarmerProfile, Block, Plot } = require('../models/farmer.model');
const contactFarmer = require('../utils/contact_farmer.js');

async function generateOTP(mobile) {
    try {
        await sql.connect(config.sqlConfig);
        validFarmerSql = 'Select * from Farmer Where (MobileNumberPrimary = ' + mobile + ' OR MobileNumberSecondary =' + mobile + ') AND DeleteYN != 1';
        result = await sql.query(validFarmerSql);
        
        if (result.recordset.length > 0) {
            const otp = Math.floor(1000 + Math.random() * 9000);
    
            if (await contactFarmer.SendOTP(mobile, otp)) {
                return otp;
            } else {
                return -1;
            }
        } else {
            return 0;
        }
    } catch (err) {
        console.log(err);
        return 0;
    }
}

async function getFarmerProfile(mobile) { 
    try {
        await sql.connect(config.sqlConfig);
        validFarmerSql = 'Select * from Farmer Where (MobileNumberPrimary = ' + mobile + ' OR MobileNumberSecondary =' + mobile + ') AND DeleteYN != 1';
        console.log(validFarmerSql);
        let result = await sql.query(validFarmerSql);
        console.log("Result c ount" + result.recordset.length);
        console.dir(result);
        let lResult = result.recordset;
        if (result.recordset.length > 0) {
            console.log("max", result.recordset[0]["ID"]);
            getfarmLandsJson = await getfarmLands(result.recordset[0]["ID"]);
            console.log('getfarmLandsJson');
            console.dir(getfarmLandsJson);
            console.dir(lResult);
            if (getfarmLandsJson["success"]) {
                console.log('Finally success');
                let data =
                {
                    "farmer_id": lResult[0]["ID"], "name": lResult[0]["Name"], "lat": lResult[0]["Latitude"], "long": lResult[0]["Longitude"], "village_id": lResult[0]
                    ["VillageID"], farmlands: getfarmLandsJson["data"]
                };
                console.log('Finally success 2');
                return {
                    "success": true, 
                    "data": data
                };
            } else {
                return {"success": false,"message": getfarmLandsJson["message"]}
            }
        } else {
            return {"success": false, "message": "Farmland not found for the farmer"};;
        }
    } catch (err) {
        console.log(err);
        return {"success": false, "message": err.message};
    }
}

async function getfarmLands(id) {
    try {
        if (id == undefined || id == "" || id == 0) {
            return { "success": false, "message": "Invalid Farmer Id" };
        } else {
            strSQL = "Select * from FarmerFarmLandDetails where FarmerID = " + id + " AND DeleteYN != 1";
            result = await sql.query(strSQL);
            console.log('GetFarmLandDetails');
            console.dir(result);
            let farmLandId = 0;
            let farmLandName = "";
            let blocks = {};
            if (result.recordset.length > 0) {
                let farmLands = new Array();
                console.dir(farmLands);

                for (var i = 0; i < result.recordset.length; i++) {
                    console.log('length', result.recordset[i]["ID"]);
                    farmLandId = result.recordset[i]["ID"];
                    farmLandName = result.recordset[i]["Name"];
                  
                    console.log(farmLandId, farmLandName);
                    console.dir(blocks);
                    getBlocksJson = await getBlocks(result.recordset[i]["ID"]);
                    console.dir(getBlocksJson);
                    if (getBlocksJson["success"]) {
                        blocks = getBlocksJson["data"];
                        console.log("blocks");
                        console.dir(blocks);
                    }
                    console.log('farmLands i', i);
                    console.dir(farmLandId);
                   
                
                    console.log('Check this field   ');
                    console.log(farmLandId, farmLandName);
                    console.dir(blocks)
                    let farmland = new Farmland(farmLandId, farmLandName, blocks);
                    console.dir(farmland);
                    console.dir(farmLands);
                    console.log('farmLands j');
                    farmLands.push(farmland);
                    console.log('length k','ere');
                    console.dir(farmLands);
                }
            
                return { "success": true, "data": farmLands };
            
            
            } else {
                return ({ "success": false, "message": "Famlands not found" });
            }
          
        }
    } catch (error) {
        return ({ "success": false, "message": error.message });
    }
}

async function getBlocks(id) {
    try {
        let blocks = new Array();

        if (id == undefined || id == "" || id == 0) {
            return { "success": false, "message": "Invalid Block Id" };
        } else {
            strSQL = "Select * from FarmerBlockDetails where FarmerFarmLandDetailsID = " + id + " AND DeleteYN != 1";
            result = await sql.query(strSQL);
            if (result.recordset.length > 0) {
                for (var i = 0; i < result.recordset.length; i++) {
                    getPlotsJson = await getPlots(result.recordset[i]["ID"]);
                    if (getPlotsJson["success"]) {
                        let plots = getPlotsJson["data"];
                    }
                    blocks.push({ id: result.recordset[i]["ID"], "name": result.recordset[i]["Name"], "plots": plots});
                };
            }
        }
        return { "success": true, "data": blocks };
        
    } catch (error) {
        console.log(error);
        return { "success": false, "message": error.message };
    }
}

    async function getPlots(id) {
        try {
            let plots = new Array();
            if (id == undefined || id == "" || id == 0) {
                return { "success": false, "message": "Invalid Block Id" };
            } else {
                strSQL = "Select * from FarmerPlotDetails where FarmerBlockDetailsID = " + id + " AND DeleteYN != 1";
                let resultPlot = await sql.query(strSQL);
                console.log('GetPlots');
                console.dir(result);
                if (resultPlot.recordset.length > 0) {
                    for (var i = 0; i < result.recordset.length; i++) {
                        plots.push(Plot(resultPlot.recordset[i]["ID"], resultPlot.recordset[i]["Name"]),);
                    }
                }
                return { "success": true, "data": plots };
            }
        } catch (error) {
            console.log(error);
             return { "success": false, "message": error.message };
        }
}


module.exports = { generateOTP, getFarmerProfile };