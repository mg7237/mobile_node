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
        let result = await sql.query(validFarmerSql);
        let lResult = result.recordset;
        if (result.recordset.length > 0) {
            getfarmLandsJson = await getfarmLands(result.recordset[0]["ID"]);
            if (getfarmLandsJson["success"]) {
                let data =
                {
                    "farmer_id": lResult[0]["ID"], "name": lResult[0]["Name"], "lat": lResult[0]["Latitude"], "long": lResult[0]["Longitude"], "village_id": lResult[0]
                    ["VillageID"], farmlands: getfarmLandsJson["data"]
                };
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
            let strSQL = "Select * from FarmerFarmLandDetails where FarmerID = " + id + " AND DeleteYN != 1";
            let result = await sql.query(strSQL);
            let farmLandId = 0;
            let farmLandName = "";
            let blocks = {};
            if (result.recordset.length > 0) {
                let farmLands = new Array();
                
                for (var i = 0; i < result.recordset.length; i++) {
                    farmLandId = result.recordset[i]["ID"];
                    farmLandName = result.recordset[i]["Name"];
               
                    let getBlocksJson = await getBlocks(result.recordset[i]["ID"]);
                    let blocks = [];
                    if (getBlocksJson["success"]) {
                        blocks = getBlocksJson["data"];
                    }
                    farmLands.push({"farmland_id" : farmLandId, "farmland_name" : farmLandName, "blocks" : blocks});
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
            let strSQL = "Select * from FarmerBlockDetails where FarmerFarmLandDetailsID = " + id + " AND DeleteYN != 1";
            let result = await sql.query(strSQL);
            if (result.recordset.length > 0) {
                for (var i = 0; i < result.recordset.length; i++) {
                    let getPlotsJson = await getPlots(result.recordset[i]["ID"]);
                    if (getPlotsJson["success"]) {
                        let plots = getPlotsJson["data"];
                        blocks.push({ "id": result.recordset[i]["ID"], "name": result.recordset[i]["Name"], "plots": plots });
                    } else {
                        return ({ "success": false, "message": "Error while getting plots" });
                    }
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
                strSQL = "Select * from FarmerPlotsDetails where FarmerBlockDetailsID = " + id + " AND DeleteYN != 1";
                let resultPlot = await sql.query(strSQL);
                if (resultPlot.recordset.length > 0) {
                    for (var i = 0; i < resultPlot.recordset.length; i++) {
                        plots.push({ "id": resultPlot.recordset[i]["ID"], "name": resultPlot.recordset[i]["Name"]});
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