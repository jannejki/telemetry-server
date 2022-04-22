import canNode from "../../models/canNodeModel";

export default {
    Query: {
        canNodes: async(parent, args) => {
            return await canNode.find();
        },
    },

    Data: {
        node: async(parent, args) => {
            return await canNode.findOne({ _id: parent.canNode });
        },
    },
};