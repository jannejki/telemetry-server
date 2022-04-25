'use strict';
import dataValueModel from "../models/dataValueModel";

export default {
    Query: {
        dataValue: async(parent, args) => {
            console.log('search dataValue args:', args);
            return await dataValueModel.find();
        },
    },

    dataPoint: {
        data: async(parent, args) => {
            return await dataValueModel.find({ _id: { $in: parent.data } });
        },
    },
};