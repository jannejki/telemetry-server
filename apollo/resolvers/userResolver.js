'use strict';
import { newUser, getNewPassword } from "../../utils/newUser";
import userModel from "../models/userModel";
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import bcrypt from 'bcrypt';


export default {
    Query: {
        users: async (parent, args, context) => {
            if (!context.user) throw new AuthenticationError('UNAUTHENTICATED');

            // Find by admin rights
            if (args.PRIVILEGE && !args.NAME) return await userModel.find({ PRIVILEGE: args.PRIVILEGE });

            // Find by username
            if (!args.PRIVILEGE && args.NAME) return await userModel.find({ NAME: args.NAME });

            // find by admin rights && username
            if (args.PRIVILEGE && args.NAME) return await userModel.find({ PRIVILEGE: args.PRIVILEGE, NAME: args.NAME });

            // Find all
            return await userModel.find();
        },
    },

    Mutation: {
        addUser: async (parent, args, context) => {
            process.env.ADMIN = process.env.ADMIN || 'TRUE';
            if (context.user.PRIVILEGE != 'admin' && process.env.ADMIN == 'TRUE') throw new ForbiddenError('UNAUTHORIZED');

            const createdUser = await newUser(args);
            return createdUser;
        },

        deleteUser: async (parent, args, context) => {
            if (context.user.PRIVILEGE != 'admin') throw new ForbiddenError('UNAUTHORIZED');
            const result = await userModel.delete({ID: args.ID});
            return result;
        },

        changePassword: async (parent, args, context) => {
            if (context.user.PRIVILEGE != 'admin') throw new ForbiddenError('UNAUTHORIZED');

            const hashedPwd = await getNewPassword(args.PASSWORD);
            const result = await userModel.edit( args.ID, { PASSWORD: hashedPwd });
            return result;
        },

        changePrivilege: async(parent, args, context) => {
            if (context.user.PRIVILEGE != 'admin') throw new ForbiddenError('UNAUTHORIZED');

            const result = await userModel.edit( args.ID, { PRIVILEGE: args.PRIVILEGE });
            return result;
        }
    }
};