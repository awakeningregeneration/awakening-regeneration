import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

if (!mapboxToken) {
  throw new Error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type ListingPayload = {
  title: string;
  description?: string;
  website?: string;
  categories?: string[];
  address: string;
  city: string;
  state: string;
};

async function geocodeAddress(address: string, city: string, state: string) {
  const query = `${address}, ${city}, ${state}`;

  const url =
    `https://api.mapbox.com/search/geocode/v6/forward` +
    `?q=${encodeURIComponent(query)}` +
    `&access_token=${encodeURIComponent(mapboxToken)}` +
    `&limit=1` +
    `&country=US` +
    `&autocomplete=false` +
    `&permanent=true`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mapbox geocoding failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const feature = data?.features?.[0];

  if (!feature) {
    throw new Error("Address could not be geocoded.");
  }

  const coords = feature?.geometry?.coordinates;

  if (!Array.isArray(coords) || coords.length < 2) {
    throw new Error("No valid coordinates returned from Mapbox.");
  }

  const lng = coords[0];
  const lat = coords[1];

  const context = feature?.properties?.context ?? {};

  const normalizedState = context.region?.name || state || null;
  const county = context.district?.name || null;
  const normalizedCity =
    context.place?.name ||
    context.locality?.name ||
    city ||
    null;

  return {
    lat,
    lng,
    state: normalizedState,
    county,
    city: normalizedCity,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: ListingPayload = await request.json();

    const {
      title,
      description,
      website,
      categories,
      address,
      city,
      state,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    if (!address?.trim() || !city?.trim() || !state?.trim()) {
      return NextResponse.json(
        { error: "Address, city, and state are required." },
        { status: 400 }
      );
    }

    const geo = await geocodeAddress(address, city, state);

    const row = {
      title: title.trim(),
      description: description?.trim() || null,
      website: website?.trim() || null,
      category:
        Array.isArray(categories) && categories.length > 0
          ? categories.join(", ")
          : null,
      address: address.trim(),
      city: geo.city,
      state: geo.state,
      county: geo.county,
      lat: geo.lat,
      lng: geo.lng,
      status: "active",
    };

    const { data, error } = await supabase
      .from("listings")
      .insert([row])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}