import { DustData } from "@/app/utils/recieve-data-helper";
import db from "@/db";

export const POST = async (request) => {
    try {
        const data = await request.json();
        let send = []
        const device_id = data.uplink_message.f_port;
        const humidity = data.uplink_message.decoded_payload.humidity;
        const temperature = data.uplink_message.decoded_payload.temperature;
        const pressure = data.uplink_message.decoded_payload.pressure;
        const altitude = data.uplink_message.decoded_payload.altitude;
        const dust = data.uplink_message.decoded_payload.dustDensity;

        if (!device_id){
            return new Response(JSON.stringify({ message: 'Device ID is required' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400
            });
        }

        if (dust){
            await send.push(DustData(device_id, dust));
        }

        return new Response(JSON.stringify(send), {
            status: 200
        });
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server Error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

export const GET = async () => {
    try {
        const data = await db.any('SELECT * FROM sensor_pressure');

        return new Response(JSON.stringify(data), {
            status: 200
        });
    } catch (err) {
        console.error(err);
        response.status(500).send('Server Error');
    }
}