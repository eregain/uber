import { neon } from "@neondatabase/serverless";

// Pagination constants
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    // Parse query parameters for pagination
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || `${DEFAULT_LIMIT}`), MAX_LIMIT);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Query to fetch drivers with pagination
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
      SELECT 
        id, 
        first_name, 
        last_name, 
        profile_image_url, 
        car_image_url, 
        car_seats, 
        rating, 
        created_at, 
        updated_at
      FROM 
        drivers
      ORDER BY 
        created_at DESC
      LIMIT 
        ${limit} OFFSET ${offset};
    `;

    // Return the fetched data along with pagination metadata
    return Response.json({
      data: response,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
