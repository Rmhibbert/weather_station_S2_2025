/**
 * @file This file is the route for the recieve-data API
 * @module app/api/recieve-data
 * @description This file is the route for the recieve-data API
 * - The POST method is used to recieve data from the webhook
 * - The data is then seperated into different tables based on the data type
 * - The data is then sent to the database which have been functioned to keep code readable
 * and will be found in the receive-data-helper.js utils file
 */
import { DustData } from "@/app/utils/recieve-data-helper";

export const POST = async (request) => {
    try {
        const data = await request.json();
        let send = []

        /**
         * Since the webhook will send all data we will seperate the data
         * into different tables based on there data type
         */
        const device_id = data.data.uplink_message.f_port;
        const humidity = data.data.uplink_message.decoded_payload.humidity;
        const temperature = data.data.uplink_message.decoded_payload.temperature;
        const pressure = data.data.uplink_message.decoded_payload.pressure;
        const altitude = data.data.uplink_message.decoded_payload.altitude;
        const dust = data.data.uplink_message.decoded_payload.dustDensity;

        if (!device_id){
            return new Response(JSON.stringify({ message: 'Device ID is required' }), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*', // Allow all origins
                    'Access-Control-Allow-Methods': 'POST', // Allow POST method
                },
                status: 400
            });
        }

        if (dust){
            const dustResults = await DustData(device_id, dust);
            send.push(dustResults)
        }

        return new Response(JSON.stringify(send), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'POST', // Allow POST method
            },
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow all origins
                'Access-Control-Allow-Methods': 'POST', // Allow POST method
            },
            status: 500
        });
    }
}