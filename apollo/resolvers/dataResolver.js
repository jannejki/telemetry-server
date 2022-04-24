import dataModel from "../../models/dataModel";

export default {
    Query: {
        data: async(parent, args) => {

            if (args.canNode.canID) {
                return await dataModel.find({ canNode: args.canNode.canID });
            }

            return await dataModel.find();
        },
    },
};