import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No token found" }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return new Response(
      JSON.stringify({
        user: {
          id: decoded.id,
          role: decoded.role,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Token verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid token" }),
      { status: 401 }
    );
  }
}
