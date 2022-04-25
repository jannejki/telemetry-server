'use strict';
import newUser from "../../utils/newUser";
import userModel from "../models/userModel";

export default {
    Query: {
        users: async(parent, args) => {

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
        addUser: async(parent, args) => {
            console.log('addUser ', args);
            const createdUser = await newUser(args);
            console.log(createdUser);
            return createdUser;
        },

        deleteUser: async(parent, args) => {
            console.log(args);
            const result = await userModel.findOneAndDelete({ _id: args.id });
            console.log(result);
            return result;
        }
    }
};