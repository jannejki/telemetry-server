'use strict';

import { getDecodingRules } from "./DBC";

class DBCMessage {

    constructor(CANID, name, DLC, TXNode, comments) {
        this.CANID = CANID;
        this.name = name;
        this.DLC = DLC;
        this.TXNode = TXNode;
        this.comments = comments;
        this.signals = [];
    }

    getSignals = () => {
        this.signals = getDecodingRules(this.CANID);
    }

}

export default DBCMessage;