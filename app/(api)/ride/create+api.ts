import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        // Parse the request body
        const body = await request.json();
        const {
            origin_address,
            destination_address,
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            ride_time,
            fare_price,
            payment_status,
            driver_id,
            user_id,
        } = body;

        // Validate required fields
        if (
            !origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            fare_price === undefined || // Ensure fare_price can be 0 but not undefined
            payment_status === undefined || // Ensure payment_status can be false but not undefined
            !driver_id ||
            !user_id
        ) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Initialize Neon database client
        const sql = neon(`${process.env.DATABASE_URL}`);

        // Insert the data into the "rides" table
        const response = await sql`
      INSERT INTO rides ( 
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
      ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${ride_time},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${user_id}
      )
      RETURNING *;
    `;

        // Return the newly created ride details
        return new Response(
            JSON.stringify({ data: response[0] }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        // Handle any errors during the request
        console.error("Error inserting data into rides:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
