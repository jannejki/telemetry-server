import canNodeModel from "../../models/canNodeModel";
import dataModel from "../../models/dataModel";

export default {
    Query: {
        data: async(parent, args) => {

            if (args.canNode.canID) {
                const node = await canNodeModel.findOne({ canID: args.canNode.canID });
                return await dataModel.find({ canNode: node._id });
            }

            return await dataModel.find();
        },
    },
};