import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const stripe = getStripe();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create Stripe customer
  let customerId = user.stripeCustomerId;
  if (customerId) {
    // Verify the customer still exists in the current Stripe environment
    try {
      await stripe.customers.retrieve(customerId);
    } catch {
      customerId = null;
    }
  }
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const origin = (await headers()).get("origin") || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["promptpay"],
    line_items: [
      {
        price_data: {
          currency: "thb",
          product_data: {
            name: "SmartSpend Premium",
            description: "ปลดล็อกฟีเจอร์พรีเมี่ยมทั้งหมด",
          },
          unit_amount: 350 * 100, // 350 THB (~$10)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/premium?success=true`,
    cancel_url: `${origin}/premium?canceled=true`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
