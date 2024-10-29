import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    // Parse incoming JSON body
    const { name, email, clerkId } = await request.json();

    // Validate required fields
    if (!name || !email || !clerkId) {
      return Response.json(
          { error: "Missing required fields" },
          { status: 400 }
      );
    }

    // Initialize the database connection
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Query to insert a new user into the 'users' table
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
      )
      RETURNING id, name, email, clerk_id, created_at;
    `;

    // Return the response with the created user data
    return new Response(JSON.stringify({ data: response[0] }), {
      status: 201,
    });
  } catch (error) {
    // Log the error and return a 500 server error response
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
