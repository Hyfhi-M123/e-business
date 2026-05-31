import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS and perform admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Note: In a production enterprise app with many users, you should paginate.
    // listUsers() returns up to 50 users by default.
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }

    // Filter only admins to display in the dashboard
    const admins = users.filter(u => u.user_metadata?.role === "admin").map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || u.email?.split('@')[0],
      role: u.user_metadata?.role || "admin",
      last_sign_in_at: u.last_sign_in_at
    }));

    return NextResponse.json({ success: true, admins });
  } catch (error: any) {
    console.error("Fetch Admins Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Invite the user via email link (they will set their password or login via Magic Link)
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        role: "admin",
        name: name || email.split("@")[0]
      }
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Invitation sent successfully!" 
    });
  } catch (error: any) {
    console.error("Invite Admin Error:", error);
    return NextResponse.json({ error: error.message || "Failed to invite user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Revoke admin access by changing role back to 'user'
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role: "user" }
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: "Admin access revoked successfully!" 
    });
  } catch (error: any) {
    console.error("Revoke Admin Error:", error);
    return NextResponse.json({ error: error.message || "Failed to revoke admin" }, { status: 500 });
  }
}
