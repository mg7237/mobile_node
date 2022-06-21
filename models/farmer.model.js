class FarmerProfile{
    constructor(farmerId, farmerName, lat, long,location,farmlands) {
        this.farmerId,this.farmerName, this.lat, this.long, this.location, this.farmlands
    }
}

class Farmland{
    constructor(farmlandId, farmlandName, blocks) {
        this.farmlandId, this.farmlandName, this.blocks
    }
}

class Block{
    constructor(blockId, blockName, plots) {
        this.blockId,this.blockName, this.plots
    }
}

class Plot{
    constructor(plotId, plotName) {
        this.plotId, this.plotName}
}

module.exports = { FarmerProfile, Farmland, Block ,Plot };