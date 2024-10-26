/**
 * @file This file is the route for the receive-data API
 * @module app/api/receive-data
 * @description This file is the route for the receive-data API
 * - The POST method is used to receive data from the webhook
 * - The data is then seperated into different tables based on the data type
 * - The data is then sent to the database which have been functioned to keep code readable
 * and will be found in the receive-data-helper.js utils file
 */
import { DustData, HumidityData, TemperatureData, PressureData, CO2Data, GasData, WindData } from "@/app/utils/receive-data-helper";

export const POST = async (request) => {
    try {
        const authHeader = request.headers.get('authorization');
        const data = await request.json();
        let send = []
        /**
         * Since the webhook will send all data we will seperate the data
         * into different tables based on there data type
         */
        const device_id = data.end_device_ids.device_id;
        const humidity = data.uplink_message.decoded_payload.humidity ? data.uplink_message.decoded_payload.humidity : null;
        const temperature = data.uplink_message.decoded_payload.temperature ? data.uplink_message.decoded_payload.temperature : null;
        const pressure = data.uplink_message.decoded_payload.pressure ? data.uplink_message.decoded_payload.pressure : null;
        const co2_level = data.uplink_message.decoded_payload.co2 ? data.uplink_message.decoded_payload.co2 : null;
        const gas_level = data.uplink_message.decoded_payload.tvoc ? data.uplink_message.decoded_payload.tvoc : null;
        const dust = data.uplink_message.decoded_payload.dustDensity ? data.uplink_message.decoded_payload.dustDensity : null;
        const wind_speed = data.uplink_message.decoded_payload.wind_speed ? data.uplink_message.decoded_payload.wind_speed : null;
        const wind_direction = data.uplink_message.decoded_payload.wind_direction ? data.uplink_message.decoded_payload.wind_direction : null;

        const sensorData = [
            { condition: dust, fetchData: DustData },
            { condition: humidity, fetchData: HumidityData },
            { condition: temperature, fetchData: TemperatureData },
            { condition: pressure, fetchData: PressureData },
            { condition: co2_level, fetchData: CO2Data },
            { condition: gas_level, fetchData: GasData },
            { condition: wind_direction && wind_speed, fetchData: WindData }
        ];

        if (!authHeader) return new Response("Authentication Required")
        
        const splitAuth = authHeader.split(" ")[1]

        if (splitAuth !== process.env.PASSWORD) return new Response("You are not authorized to post")


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

        for (const { condition, fetchData } of sensorData) {
            if (condition) {
                const results = await fetchData(device_id, ...(Array.isArray(condition) ? condition : [condition]));
                send.push(results);
            }
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
