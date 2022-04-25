'use strict';
import dataPointModel from "../models/dataPointModel";
import getTimestamp from '../../utils/timestamp.js';
import { AuthenticationError } from "apollo-server-express";

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
};