"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backup = void 0;
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const config = require("config");
const MongoClient = require("mongodb").MongoClient;
// const dbUrl = config.get("dbUrl");
function getCollectionData(databaseName, collectionName, dbUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new MongoClient(dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            yield client.connect();
            console.log("Connected to MongoDB");
            const database = client.db(databaseName);
            const collection = database.collection(collectionName);
            const documents = yield collection.find().toArray();
            console.log(`Found ${documents.length} documents in collection ${collectionName}`);
            return documents;
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
        }
    });
}
function createBackup(dbUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const backupDirectory = path.join(__dirname, "public");
        const backupFilePath = path.join(backupDirectory, "backup.json");
        // file not exit that function create file
        if (!fs.existsSync(backupDirectory)) {
            fs.mkdirSync(backupDirectory, { recursive: true });
            console.log(`Created backup directory at ${backupDirectory}`);
        }
        const documents = yield getCollectionData("fuel-station", "detailsales", dbUrl);
        console.log(documents);
        // Write the data to a file
        const dataWriteStream = fs.createWriteStream(backupFilePath);
        documents.forEach((document) => {
            dataWriteStream.write(JSON.stringify(document));
            dataWriteStream.write("\n");
        });
        dataWriteStream.end();
        console.log("complete backup" + new Date());
    });
}
//
const backup = (dbUrl) => cron.schedule("0 0 * * *", () => createBackup(dbUrl));
exports.backup = backup;
