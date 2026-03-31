import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ themeMode: "light", themeColor: "#2563eb" });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { themeMode: true, themeColor: true },
  });

  return NextResponse.json({
    themeMode: user?.themeMode || "light",
    themeColor: user?.themeColor || "#2563eb",
  });
}
