"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const fs = require("fs");
const migrate = () => {
    fs.readFile("./src/migration/user.json", async (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            try {
                let result = JSON.parse(data.toString());
                let ret = await user_model_1.default.create(result);
                if (ret) {
                    console.log("added");
                }
            }
            catch {
                console.log("already exist");
            }
        }
    });
};
exports.migrate = migrate;
