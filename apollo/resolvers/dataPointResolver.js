'use strict';
import dataPointModel from "../models/dataPointModel";
import getTimestamp from '../../utils/timestamp.js';
import { AuthenticationError } from "apollo-server-express";
import dataValueModel from "../models/dataValueModel";

export default {
    Query: {
        dataPoint: async(parent, args, context) => {
            if (!context.user) throw new AuthenticationError();

            const startTime = args.startTime || '1975-01-01 00:00:00.001';
            const endTime = args.endTime || getTimestamp();

            if (args.CAN) {
                return await dataPointModel.find({ CAN: args.CAN, timestamp: { $gte: startTime, $lte: endTime } });
            }
            return await dataPointModel.find({ timestamp: { $gte: startTime, $lte: endTime } });
        },
    },

    Mutation: {
        deleteDataPoint: async(parent, args, context) => {
            if (!context.user.rights) throw new ForbiddenError('UNAUTHORIZED');
            const startTime = args.startTime || '1975-01-01 00:00:00.001';
            const endTime = args.endTime || getTimestamp();

            if (args.CAN) {
                const datapoints = (await dataPointModel.find({ canID: args.CAN, timestamp: { $gte: startTime, $lte: endTime } }));

                datapoints.forEach(async(datapoint) => {
                    await datapoint.data.forEach(async dataValue => (await dataValueModel.deleteOne({ _id: dataValue._id })));
                });

                return await dataPointModel.deleteMany({ canID: args.CAN, timestamp: { $gte: startTime, $lte: endTime } });
            }

            const datapoints = (await dataPointModel.find({ timestamp: { $gte: startTime, $lte: endTime } }));
            datapoints.forEach(async(datapoint) => {
                await datapoint.data.forEach(async dataValue => (await dataValueModel.deleteOne({ _id: dataValue._id })));
            });

            return await dataPointModel.deleteMany({ timestamp: { $gte: startTime, $lte: endTime } });
        }
    }
};