import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerId = session.customer as string;

    if (customerId && session.payment_status === "paid") {
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: "PRO" },
      });
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const customerId = session.customer as string;

    if (customerId) {
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: "PRO" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
