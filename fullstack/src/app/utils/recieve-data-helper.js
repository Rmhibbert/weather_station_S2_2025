import db from "@/db"

export const BarometricPressureData = async () => {
    const send = await db.one(
        'INSERT INTO sensor_pressure (device_id, pressure) VALUES ($1, $2) RETURNING *',
        [device_id, pressure]
    )

    return send;
}

export const DustData = async (device_id, dust) => {
    const send = await db.one(
        'INSERT INTO dust (device_id, dust) VALUES ($1, $2) RETURNING *',
        [device_id, dust]
    )

    return send;
}

