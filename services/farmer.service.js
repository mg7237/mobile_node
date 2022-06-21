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
        console.dir(result.recordset.length);
        console.dir(result);
        
        if (result.recordset.length > 0) {
            const otp = Math.floor(1000 + Math.random() * 9000);
            console.log('generated otp', otp);
    
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
        result = await sql.query(validFarmerSql);
        console.log("Result c ount" + result.recordset.length);
        console.dir(result);
        
        if (result.recordset.length > 0) {
            getFarmLandsJson = await getFarmLands(result.recordset[0]["ID"]);
            if (getFarmLandsJson["success"]) {
                return FarmerProfile(result.recordset[0]["ID"], result.recordset[0]["Name"], result.recordset[0]["Latitude"], result.recordset[0]["Longitude"], result.recordset[0]["VillageID"], getFarmLandsJson["data"]);
            } 
        } else {
            return {"success": false, "message": "Farmland not found for the farmer"};;
        }
    } catch (err) {
        console.log(err);
        return {"success": false, "message": err.message};
    }
}

async function getFarmLands(id) {
    try {
        let farmLands = new Array();
        if (id == undefined || id == "" || id == 0) {
            return { "success": false, "message": "Invalid Farmer Id" };
        } else {
            strSQL = "Select * from FarmerFarmLandDetails where FarmerID = " + id + " AND DeleteYN != 1";
            result = await sql.query(strSQL);
            console.log('GetFarmLandDetails');
            console.dir(result)
            if (result.recordset.length > 0) {
                for (var i = 0; i < result.recordset.length; i++) {
                    console.log('length', result.recordset[i]["ID"]);
                    farmLandId = result.recordset[i]["ID"];
                    farmLandName = result.recordset[i]["Name"];
                    getBlocksJson = await getBlocks(result.recordset[i]["ID"]);
                    console.dir(getBlocksJson);
                    if (getBlocksJson["success"]) {
                        blocks = getBlocksJson["data"];
                        console.log("blocks");
                        console.dir(blocks);
                    }
                    console.log('farmlands i', i);
                    console.dir(farmLandId);
                    farmland = new Farmland(farmLandId, farmLandName, blocks);
                    console.log('farmlands i');
                    console.dir(farmland);
                    farmLands.push(farmLand);
                }
                console.log('farmLands i');
                console.dir(farmlands);
            } 
            console.log('farmlands');
            console.dir(farmlands);
            return { "success": true, "data": farmlands};
        }
    } catch (error) {
        return ({ "success": false, "message": error.message });
    }
}

async function getBlocks(id) {
    try {
        let blocks = new Array();

        if (id == undefined || id == "" || id == 0) {
            return { "success": false, "message": "Invalid FarmerLand Id" };
        } else {
            strSQL = "Select * from FarmerBlockDetails where FarmerFarmLandDetailsID = " + id + " AND DeleteYN != 1";
            result = await sql.query(strSQL);
            console.log('GetBlocks');
            console.dir(result);
            if (result.recordset.length > 0) {
                for (var i = 0; i < result.recordset.length; i++) {
                    getPlotsJson = await getPlots(result.recordset[i]["ID"]);
                    if (getPlotsJson["success"]) { 
                        plots = getPlotsJson["data"];
                    }
                    blocks.push(Block(result.recordset[i]["ID"], result.recordset[i]["Name"], plots));
                }
            }
            console.dir(blocks);
            return { "success": true, "data": blocks };
                
        }
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
                result = await sql.query(strSQL);
                console.log('GetPlots');
                console.dir(result);
                if (result.recordset.length > 0) {
                    for (var i = 0; i < result.recordset.length; i++) {
                        plot = plots.push(Plot(result.recordset[i]["ID"], result.recordset[i]["Name"]),);
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