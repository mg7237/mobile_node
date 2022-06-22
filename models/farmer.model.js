class FarmerProfile{
    constructor(farmerId, farmerName, lat, long,location,farmlands) {
        this.farmerId,this.farmerName, this.lat, this.long, this.location, this.farmlands
    }
}

class Farmland{
    constructor(farmlandId, farmlandName, blocks) {
        this.farmlandId = farmlandId, this.farmlandName = farmlandName, this.blocks = blocks
    }
}

class Block{
    constructor(blockId, blockName, plots) {
        this.blockId =blockId,this.blockName = blockName, this.plots = plots
    }
}

class Plot{
    constructor(plotId, plotName) {
        this.plotId = plotId, this.plotName = plotName}
}

module.exports = { FarmerProfile, Farmland, Block ,Plot };