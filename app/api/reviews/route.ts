import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    let query = supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    } else {
      // If no product ID, fetch top 5-star reviews for testimonials
      query = query.eq("rating", 5).limit(10);
    }

    const { data: reviews, error } = await query;

    if (error) {
      // If table doesn't exist yet, just return empty so UI doesn't crash
      if (error.code === '42P01') {
        return NextResponse.json({ reviews: [], averageRating: 0, totalReviews: 0 });
      }
      throw error;
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? Number((reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1))
      : 0;

    return NextResponse.json({
      reviews,
      averageRating,
      totalReviews
    });
  } catch (err: any) {
    console.error("API Reviews GET Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, user_email, user_name, rating, comment } = body;

    if (!product_id || !user_email || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("product_reviews")
      .insert([{
        product_id,
        user_email,
        user_name: user_name || "Guest",
        rating,
        comment: comment || ""
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, review: data });
  } catch (err: any) {
    console.error("API Reviews POST Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
