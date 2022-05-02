'use strict';
import dataValueModel from "../models/dataValueModel";

export default {
    Query: {
        dataValue: async(parent, args, context) => {
            //   if (!context.user) throw new AuthenticationError();
            console.log('search dataValue args:', args);
            return await dataValueModel.find();
        },
    },

    dataPoint: {
        data: async(parent, args, context) => {
            //  if (!context.user) throw new AuthenticationError();
            return await dataValueModel.find({ _id: { $in: parent.data } });
        },
    },
};