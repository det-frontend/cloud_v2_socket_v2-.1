import axios from "axios";
import config from "config";
import { csDetailSaleModel, ksDetailSaleModel } from "../model/detailSale.model";
import moment from "moment";
import { compass, dbDistribution } from "./helper";
import { getCategory, getFuelType } from "./categories";
import mongoose from "mongoose";

// Request access token from MPTA API
export const getAccessToken = async () => {
    const baseUrl = config.get<string>('mpta_base_url');
    const clientId = config.get<number>('mpta_client_id');
    const clientSecret = config.get<string>('mpta_client_secret');
    const username = config.get<string>('mpta_username');
    const password = config.get<string>('mpta_password');

    const payload = {
        "client_id": clientId,
        "client_secret": clientSecret,
        "username": username,
        "password": password,
        "grant_type": "password",
        "scope": "*"
    }

    const url = `${baseUrl}/oauth/token`;

    try{
        const response = await axios.post(url, payload);

        if(response.status != 200) {
            throw new Error(`Error: Received status code ${response.status}`);
        }

        const data = response.data;

        return data;

    } catch(error: any) {
        if(error.response) {
            return {
                status: error.response.status,
                message: error.response.data.error_description || error.response.data.message || "Error occurred",
                error: error.response.data
            };
        } else if (error.request) {
            // The request was made, but no response was received
            return { message: "No response received from server", error: error.request };
        } else {
            // Something happened in setting up the request that triggered an Error
            return { message: "Request error", error: error.message };
        }
    }
}

// GROUP AND FORMAT BY LICENSE NO
const groupAndFormatByLicenseNo = (detailSales: any[]) => {
    const groupedSales = detailSales.reduce((acc, detailSale) => {
        const lienseNo = detailSale.stationDetailId?.lienseNo;

        if (lienseNo) {
            if (!acc[lienseNo]) {
                acc[lienseNo] = [];
            }

            const categoryId = getCategory(detailSale.vehicleType);
            const fuelType = getFuelType(detailSale.fuelType);

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
const getKsDetailSales = async (query: any) => {
    const ksDetailSales = await ksDetailSaleModel.find(query)
        .populate({
            path: "stationDetailId",
            model: dbDistribution({ accessDb: 'kyaw_san' })
        })
    .lean();

    return groupAndFormatByLicenseNo(ksDetailSales);
}

// GET Common Other Shop Detail Sales
const getCsDetailSales = async (query: any) => {
    const csDetailSales = await csDetailSaleModel.find(query)
        .populate({
            path: "stationDetailId",
            model: dbDistribution({ accessDb: 'common' })
        })
    .lean();

    return groupAndFormatByLicenseNo(csDetailSales);
}
const findByVoconoAndUpdate = async (detailSale: any , isSent: number) => {
    // Parse the data_lists to get the array of sales
    const parsedDetailSales = JSON.parse(detailSale);

    // map over each sale in the array
    await Promise.all(parsedDetailSales.map(async (sale: any) => {
        const query = {
            vocono: sale.invoice_id,
            dailyReportDate: moment(sale.time).format("YYYY-MM-DD"),
        };

        // Try to find and update the sale in ksDetailSaleModel
        const ksDetailSale = await ksDetailSaleModel.findOne(query);

        if (ksDetailSale) {
            ksDetailSale.isSent = isSent;
            await ksDetailSale.save();
        } else {
            // If not found in ksDetailSaleModel, check csDetailSaleModel
            const csDetailSale = await csDetailSaleModel.findOne(query);
            if (csDetailSale) {
                csDetailSale.isSent = isSent;
                await csDetailSale.save();
            }
        }
    }));
};

// GET FORMATTED DETAIL SALES
export const getFormattedDetailSales = async () => {
    // const today = '2024-09-19';
    const query = {
        isSent: 0,
        stationDetailId: new mongoose.Types.ObjectId("65f4b0f64e0a38b089be6813")
    }

    const ksDetailSales = await getKsDetailSales(query);
    const csDetailSales = await getCsDetailSales(query);

    const detailSales = [...ksDetailSales, ...csDetailSales];

    return detailSales
}

// SEND DETAIL SALES TO MPTA API
export const sendDetailSalesToMpta = async (
    token: string,
    detailSales: any
) => {
    const baseUrl = config.get<string>('mpta_base_url');
    const url = `${baseUrl}/api/pos/sale/record`;

    const results = await detailSales.reduce(async (accPromise: any, detailSale: any) => {
        // Wait for the previous request to finish
        const acc = await accPromise;

        try {
            const response = await axios.post(url, detailSale, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if(response.data.status == 200) {
                await findByVoconoAndUpdate(detailSale.data_lists, 1);
                acc.push(response.data);
            } else {
                acc.push({ 
                    status: response.data.status, 
                    message: response.data.message }
                );
            }
            
        } catch (error: any) {
            if (error.response) {
                acc.push({
                    status: error.response.status,
                    message: error.response.data.error_description || error.response.data.message || "Error occurred",
                    error: error.response.data
                });
            } else if (error.request) {
                acc.push({ message: "No response received from server", error: error.request });
            } else {
                acc.push({ message: "Request error", error: error.message });
            }
        }

        // Add 1 minute delay between each request
        console.log(acc);
        return acc;
    }, Promise.resolve([])); // Start with an empty array

    return results;
};

export const resendErrorDetailSales = async (api_key: any, payload: any) => {
    const mpta_secret_key = config.get<string>('mpta_secret_key');

    if(!compass(mpta_secret_key, api_key)) {
        return { status: 400, message: 'Invalid API Key' };
    }

    await findByVoconoAndUpdate(payload.error_logs, 0);

    return { status: 200, message: 'Error log data will be resent in the next request, within one hour.' };
}



