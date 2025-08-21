import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, 
    });

    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return new Response(
      JSON.stringify({ error: "Server error during logout" }),
      { status: 500 }
    );
  }
}
