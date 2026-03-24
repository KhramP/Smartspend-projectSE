import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

async function getUserAccountInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true, email: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: userId,
      name: user.name,
      image: user.image,
      email: user.email,
    };
  } catch (error) {
    console.error("Failed to fetch user account info:", error);
    throw new Error("Failed to fetch user account information");
  }
}

export async function GET() {
  try {
    const authResult = await auth.api.getSession({ headers: await headers() });
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.user.id;
    const accountInfo = await getUserAccountInfo(userId);

    return NextResponse.json(accountInfo);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
