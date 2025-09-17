import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) console.warn("⚠️ JWT_SECRET is not set!");

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Log incoming attempt
    console.log("🔑 Login attempt:", { email, password });

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      console.log("❌ No admin found with email:", email);
      return NextResponse.json({ error: "Admin not found" }, { status: 400 });
    }

    console.log("✅ Found admin:", admin.email);
    console.log("Stored hash:", admin.password);

    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      console.log("❌ Password mismatch for:", email);
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("✅ Login success for:", email);
    return response;
  } catch (err) {
    console.error("🔥 Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
