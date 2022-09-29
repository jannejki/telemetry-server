'use strict';
import { AuthenticationError } from "apollo-server-express";
import { loadCanList, loadCanRules } from "../../controllers/dbcFileController";
import { getDecodingRulesFromDBC } from "../../models/DBC";

export default {
    Query: {
        canNodes: async (parent, args, context) => {
            if (!context.user) throw new AuthenticationError();

            const result = loadCanList();
            let wantedNodes = [];

            if (args.CANID) {
                result.forEach((node) => {
                    if (node.canID === args.canID) {
                        wantedNodes.push(node)
                    }
                });
            } else if (args.name) {
                result.forEach((node) => {
                    if (node.name == args.name) {
                        wantedNodes.push(node)
                    }
                });
            } else if (args.fault == true) {
                result.forEach((node) => {
                    node.comments.forEach((comment) => {
                        if (comment === 'fault') {
                            wantedNodes.push(node);
                            return;
                        }
                    });
                });
            } else if (args.fault == false) {
                result.forEach((node) => {
                    let fault = false;
                    node.comments.forEach((comment) => {
                        if (comment === 'fault') {
                            fault = true;
                        }
                    })
                    if (fault == false) {
                        wantedNodes.push(node);
                    }
                })
            } else {
                wantedNodes = result;
            }

            return wantedNodes;
        },
    },
};