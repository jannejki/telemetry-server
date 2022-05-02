'use strict';
import { newUser, getNewPassword } from "../../utils/newUser";
import userModel from "../models/userModel";
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import bcrypt from 'bcrypt';


export default {
    Query: {
        users: async(parent, args, context) => {
            if (!context.user) throw new AuthenticationError('UNAUTHENTICATED');

            // Find by admin rights
            if (args.rights && !args.username) return await userModel.find({ rights: args.rights });

            // Find by username
            if (!args.rights && args.username) return await userModel.find({ username: args.username });

            // find by admin rights && username
            if (args.rights && args.username) return await userModel.find({ rights: args.rights, username: args.username });

            // Find all
            return await userModel.find();
        },
    },

    Mutation: {
        addUser: async(parent, args, context) => {
            process.env.ADMIN = process.env.ADMIN || 'TRUE';
            if (!context.user.rights && process.env.ADMIN == 'TRUE') throw new ForbiddenError('UNAUTHORIZED');

            const createdUser = await newUser(args);
            return createdUser;
        },

        deleteUser: async(parent, args, context) => {
            if (!context.user.rights) throw new ForbiddenError('UNAUTHORIZED');

            const result = await userModel.findOneAndDelete({ _id: args.id });
            return result;
        },

        changePassword: async(parent, args, context) => {
            if (!context.user.rights) throw new ForbiddenError('UNAUTHORIZED');

            const hashedPwd = await getNewPassword(args.password);
            const result = await userModel.findOneAndUpdate({ _id: args.id }, { password: hashedPwd });
            return result;
        }
    }
};