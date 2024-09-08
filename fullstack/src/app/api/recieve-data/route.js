import db from "@/db";

export const POST = async (request) => {
    try {
        const data = await request.json();

        const device_id = data.end_device_ids.device_id;
        const humidity = data.uplink_message.decoded_payload.humidity;
        const temperature = data.uplink_message.decoded_payload.temperature;
        const pressure = data.uplink_message.decoded_payload.pressure;
        const altitude = data.uplink_message.decoded_payload.altitude;

        console.log(device_id, pressure, altitude, temperature);

        const send = await db.one(
            'INSERT INTO sensor_pressure (device_id, pressure) VALUES ($1, $2) RETURNING *',
            [device_id, pressure]
        )


        return new Response(JSON.stringify(send), {
            status: 200
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server Error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

export const GET = async () => {
    try {
        return new Response(JSON.stringify({ message: 'Data received' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (err) {
        console.error(err);
        response.status(500).send('Server Error');
    }
}