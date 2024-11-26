"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendErrorDetailSales = exports.sendDetailSalesToMpta = exports.getFormattedDetailSales = exports.getAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("config"));
const detailSale_model_1 = require("../model/detailSale.model");
const moment_1 = __importDefault(require("moment"));
const helper_1 = require("./helper");
const categories_1 = require("./categories");
const mongoose_1 = __importDefault(require("mongoose"));
// Request access token from MPTA API
const getAccessToken = async () => {
    const baseUrl = config_1.default.get('mpta_base_url');
    const clientId = config_1.default.get('mpta_client_id');
    const clientSecret = config_1.default.get('mpta_client_secret');
    const username = config_1.default.get('mpta_username');
    const password = config_1.default.get('mpta_password');
    const payload = {
        "client_id": clientId,
        "client_secret": clientSecret,
        "username": username,
        "password": password,
        "grant_type": "password",
        "scope": "*"
    };
    const url = `${baseUrl}/oauth/token`;
    try {
        const response = await axios_1.default.post(url, payload);
        if (response.status != 200) {
            throw new Error(`Error: Received status code ${response.status}`);
        }
        const data = response.data;
        return data;
    }
    catch (error) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data.error_description || error.response.data.message || "Error occurred",
                error: error.response.data
            };
        }
        else if (error.request) {
            // The request was made, but no response was received
            return { message: "No response received from server", error: error.request };
        }
        else {
            // Something happened in setting up the request that triggered an Error
            return { message: "Request error", error: error.message };
        }
    }
};
exports.getAccessToken = getAccessToken;
// GROUP AND FORMAT BY LICENSE NO
const groupAndFormatByLicenseNo = (detailSales) => {
    const groupedSales = detailSales.reduce((acc, detailSale) => {
        const lienseNo = detailSale.stationDetailId?.lienseNo;
        if (lienseNo) {
            if (!acc[lienseNo]) {
                acc[lienseNo] = [];
            }
            const categoryId = (0, categories_1.getCategory)(detailSale.vehicleType);
            const fuelType = (0, categories_1.getFuelType)(detailSale.fuelType);
            acc[lienseNo].push({
                car_number: detailSale.carNo,
                amount: detailSale.amount,
                time: detailSale.createAt,
                liter: detailSale.saleLiter,
                category_type: categoryId,
                fuel_type: fuelType,
                invoice_id: detailSale.vocono,
                today_price: detailSale.totalPrice
            });
        }
        return acc;
    }, {});
    const formattedSales = Object.keys(groupedSales).map((licenseNo) => {
        const sales = groupedSales[licenseNo];
        return {
            shop_code: licenseNo,
            data_lists: JSON.stringify(sales)
        };
    });
    return formattedSales;
};
// GET Kyaw San Detail Sales
const getKsDetailSales = async (query) => {
    const ksDetailSales = await detailSale_model_1.ksDetailSaleModel.find(query)
        .populate({
        path: "stationDetailId",
        model: (0, helper_1.dbDistribution)({ accessDb: 'kyaw_san' })
    })
        .lean();
    return groupAndFormatByLicenseNo(ksDetailSales);
};
// GET Common Other Shop Detail Sales
const getCsDetailSales = async (query) => {
    const csDetailSales = await detailSale_model_1.csDetailSaleModel.find(query)
        .populate({
        path: "stationDetailId",
        model: (0, helper_1.dbDistribution)({ accessDb: 'common' })
    })
        .lean();
    return groupAndFormatByLicenseNo(csDetailSales);
};
const findByVoconoAndUpdate = async (detailSale, isSent) => {
    // Parse the data_lists to get the array of sales
    const parsedDetailSales = JSON.parse(detailSale);
    // map over each sale in the array
    await Promise.all(parsedDetailSales.map(async (sale) => {
        const query = {
            vocono: sale.invoice_id,
            dailyReportDate: (0, moment_1.default)(sale.time).format("YYYY-MM-DD"),
        };
        // Try to find and update the sale in ksDetailSaleModel
        const ksDetailSale = await detailSale_model_1.ksDetailSaleModel.findOne(query);
        if (ksDetailSale) {
            ksDetailSale.isSent = isSent;
            await ksDetailSale.save();
        }
        else {
            // If not found in ksDetailSaleModel, check csDetailSaleModel
            const csDetailSale = await detailSale_model_1.csDetailSaleModel.findOne(query);
            if (csDetailSale) {
                csDetailSale.isSent = isSent;
                await csDetailSale.save();
            }
        }
    }));
};
// GET FORMATTED DETAIL SALES
const getFormattedDetailSales = async () => {
    // const today = '2024-09-19';
    const query = {
        isSent: 0,
        stationDetailId: new mongoose_1.default.Types.ObjectId("65f4b0f64e0a38b089be6813")
    };
    const ksDetailSales = await getKsDetailSales(query);
    const csDetailSales = await getCsDetailSales(query);
    const detailSales = [...ksDetailSales, ...csDetailSales];
    return detailSales;
};
exports.getFormattedDetailSales = getFormattedDetailSales;
// SEND DETAIL SALES TO MPTA API
const sendDetailSalesToMpta = async (token, detailSales) => {
    const baseUrl = config_1.default.get('mpta_base_url');
    const url = `${baseUrl}/api/pos/sale/record`;
    const results = await detailSales.reduce(async (accPromise, detailSale) => {
        // Wait for the previous request to finish
        const acc = await accPromise;
        try {
            const response = await axios_1.default.post(url, detailSale, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.status == 200) {
                await findByVoconoAndUpdate(detailSale.data_lists, 1);
                acc.push(response.data);
            }
            else {
                acc.push({
                    status: response.data.status,
                    message: response.data.message
                });
            }
        }
        catch (error) {
            if (error.response) {
                acc.push({
                    status: error.response.status,
                    message: error.response.data.error_description || error.response.data.message || "Error occurred",
                    error: error.response.data
                });
            }
            else if (error.request) {
                acc.push({ message: "No response received from server", error: error.request });
            }
            else {
                acc.push({ message: "Request error", error: error.message });
            }
        }
        // Add 1 minute delay between each request
        console.log(acc);
        return acc;
    }, Promise.resolve([])); // Start with an empty array
    return results;
};
exports.sendDetailSalesToMpta = sendDetailSalesToMpta;
const resendErrorDetailSales = async (api_key, payload) => {
    const mpta_secret_key = config_1.default.get('mpta_secret_key');
    if (!(0, helper_1.compass)(mpta_secret_key, api_key)) {
        return { status: 400, message: 'Invalid API Key' };
    }
    await findByVoconoAndUpdate(payload.error_logs, 0);
    return { status: 200, message: 'Error log data will be resent in the next request, within one hour.' };
};
exports.resendErrorDetailSales = resendErrorDetailSales;