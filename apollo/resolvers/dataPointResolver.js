'use strict';
import dataPointModel from "../models/dataPointModel";

export default {
    Query: {
        dataPoint: async(parent, args) => {

            if (args.CAN) {
                return await dataPointModel.find({ CAN: args.CAN });
            }
            return await dataPointModel.find();
        },
    },
};