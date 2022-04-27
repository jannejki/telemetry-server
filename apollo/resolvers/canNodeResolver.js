'use strict';
import { AuthenticationError } from "apollo-server-express";
import { loadCanList, loadCanRules } from "../../controllers/dbcFileController";
import { getDecodingRules } from "../../utils/DBC";

export default {
    Query: {
        canNodes: async(parent, args, context) => {
            if (!context.user) throw new AuthenticationError();
            const result = loadCanList();

            let wantedNodes = [];

            if (args.canID) {
                result.forEach((node) => {
                    if (node.canID === args.canID) wantedNodes.push(node);
                });
            } else {
                wantedNodes = result;
            }

            if (args.rules) {
                const withRules = wantedNodes.map((node) => {
                    const rule = loadCanRules(node.canID);
                    return {
                        canID: node.canID,
                        name: node.name,
                        rules: rule
                    }
                })

                return withRules;
            }

            return wantedNodes;
        },
    },
};