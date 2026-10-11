import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { productImages } from "@/lib/local-images";

import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

/* =====================================================
   Types
===================================================== */

type CartItem = {
  id: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

type Delivery = "Standard" | "Express" | "Pickup";

type Payment = "Card" | "PayPal" | "Bank transfer" | "Cash on delivery";

/* =====================================================
   Initial Data
===================================================== */

const baseItems: CartItem[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    variant: "Black",
    price: 129,
    quantity: 1,
    image: productImages.wirelessHeadphonesPro,
  },
  {
    id: 2,
    name: "Portable Speaker Mini",
    variant: "Graphite",
    price: 69,
    quantity: 2,
    image: productImages.portableSpeakerMini,
  },
];

/* =====================================================
   Delivery Information
===================================================== */

const deliveryInfo: Record<
  Delivery,
  {
    description: string;
    price: number;
  }
> = {
  Standard: {
    description: "3-5 business days",
    price: 8,
  },

  Express: {
    description: "1-2 business days",
    price: 18,
  },

  Pickup: {
    description: "Ready tomorrow",
    price: 0,
  },
};

/* =====================================================
   Initial Contact
===================================================== */

const initialContact = {
  first: "Sophia",
  last: "Carter",
  email: "sophia@example.com",
  phone: "+1 212 555 0184",
  company: "Carter Studio",
};

/* =====================================================
   Initial Address
===================================================== */

const initialAddress = {
  line1: "24 Madison Avenue",
  line2: "",
  city: "New York",
  state: "NY",
  postal: "10010",
  country: "United States",
};

/* =====================================================
   Address Fields
===================================================== */

function AddressFields({
  value,
  onChange,
  prefix,
}: {
  value: typeof initialAddress;
  onChange: (value: typeof initialAddress) => void;
  prefix: string;
}) {
  const field = (key: keyof typeof initialAddress, label: string) => (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium">{label}</span>

      <input
        id={`${prefix}-${key}`}
        value={value[key]}
        onChange={(event) =>
          onChange({
            ...value,
            [key]: event.target.value,
          })
        }
        className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Address Line 1 */}

      <label className="grid gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium">Address line 1</span>

        <input
          id={`${prefix}-line1`}
          value={value.line1}
          onChange={(event) =>
            onChange({
              ...value,
              line1: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      {/* Address Line 2 */}

      <label className="grid gap-1.5 text-sm sm:col-span-2">
        <span className="font-medium">
          Address line 2 <em className="font-normal text-muted-foreground">(optional)</em>
        </span>

        <input
          id={`${prefix}-line2`}
          value={value.line2}
          onChange={(event) =>
            onChange({
              ...value,
              line2: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      {/* City */}

      {field("city", "City")}

      {/* State */}

      {field("state", "State / Province")}

      {/* Postal Code */}

      {field("postal", "Postal code")}

      {/* Country */}

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Country</span>

        <select
          id={`${prefix}-country`}
          value={value.country}
          onChange={(event) =>
            onChange({
              ...value,
              country: event.target.value,
            })
          }
          className="h-10 rounded-md border bg-background px-3"
        >
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Canada</option>
          <option>Germany</option>
          <option>India</option>
          <option>Australia</option>
        </select>
      </label>
    </div>
  );
}

/* =====================================================
   Choice Card
===================================================== */

function ChoiceCard({
  active,
  title,
  detail,
  onClick,
  price,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
  price?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-start transition ${
        active ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted/40"
      }`}
    >
      <span
        className={`grid size-4 place-items-center rounded-full border ${
          active ? "border-primary" : "border-muted-foreground"
        }`}
      >
        {active && <span className="size-2 rounded-full bg-primary" />}
      </span>

      <span className="flex-1">
        <b className="block text-sm">{title}</b>

        <small className="text-muted-foreground">{detail}</small>
      </span>

      {price && <b className="text-sm">{price}</b>}
    </button>
  );
}

/* =====================================================
   Checkout App
===================================================== */

export function CheckoutApp() {
  /* ---------------------------------------------------
     State
  --------------------------------------------------- */

  const [items, setItems] = useState(baseItems);

  const [contact, setContact] = useState(initialContact);

  const [shipping, setShipping] = useState(initialAddress);

  const [billing, setBilling] = useState(initialAddress);

  const [sameBilling, setSameBilling] = useState(true);

  const [delivery, setDelivery] = useState<Delivery>("Standard");

  const [payment, setPayment] = useState<Payment>("Card");

  const [card, setCard] = useState({
    holder: "Sophia Carter",
    number: "4242 4242 4242 4242",
    expiry: "08/29",
    cvv: "123",
  });

  const [coupon, setCoupon] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState("");

  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<string[]>([]);

  const [success, setSuccess] = useState<string | null>(null);

  /* ===================================================
     Calculate Totals
  =================================================== */

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shippingFee = appliedCoupon === "FREESHIP" ? 0 : deliveryInfo[delivery].price;

    const discount =
      appliedCoupon === "SAVE10"
        ? subtotal * 0.1
        : appliedCoupon === "WELCOME15"
          ? subtotal * 0.15
          : 0;

    const tax = (subtotal - discount + shippingFee) * 0.08;

    const total = subtotal - discount + shippingFee + tax;

    return {
      subtotal,
      shipping: shippingFee,
      discount,
      tax,
      total,
    };
  }, [items, delivery, appliedCoupon]);

  /* ===================================================
     Update Product Quantity
  =================================================== */

  const updateQuantity = (id: number, delta: number) => {
    setItems((all) =>
      all.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    );
  };

  /* ===================================================
     Apply Coupon
  =================================================== */

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    const validCoupons = ["SAVE10", "WELCOME15", "FREESHIP"];

    if (validCoupons.includes(code)) {
      setAppliedCoupon(code);

      toast.success(`${code} promo applied`);
    } else {
      toast.error("Try SAVE10, WELCOME15, or FREESHIP");
    }
  };

  /* ===================================================
     Place Order
  =================================================== */

  const placeOrder = () => {
    const nextErrors: string[] = [];

    /* Contact Validation */

    if (!contact.first || !contact.last) {
      nextErrors.push("Enter first and last name.");
    }

    if (!/^\S+@\S+\.\S+$/.test(contact.email)) {
      nextErrors.push("Enter a valid email address.");
    }

    if (contact.phone && contact.phone.replace(/\D/g, "").length < 7) {
      nextErrors.push("Enter a valid phone number.");
    }

    /* Shipping Validation */

    if (!shipping.line1 || !shipping.city || !shipping.postal) {
      nextErrors.push("Complete your shipping address.");
    }

    /* Card Validation */

    if (
      payment === "Card" &&
      (!card.holder ||
        card.number.replace(/\s/g, "").length < 12 ||
        !/^\d{2}\/\d{2}$/.test(card.expiry) ||
        card.cvv.length < 3)
    ) {
      nextErrors.push("Complete valid card details.");
    }

    /* Cart Validation */

    if (!items.length) {
      nextErrors.push("Your cart is empty.");
    }

    /* Store Errors */

    setErrors(nextErrors);

    if (nextErrors.length) {
      toast.error("Please complete the required checkout information");

      return;
    }

    /* Generate Order Number */

    const order = `#ORD-${10500 + Math.floor(Math.random() * 400)}`;

    setSuccess(order);

    toast.success(`Order ${order} placed successfully`);
  };

  /* ===================================================
     Order Success Screen
  =================================================== */

  if (success) {
    return (
      <>
        <PageHeader
          title="Checkout"
          subtitle="Order confirmation"
          breadcrumb={["Cart", "Checkout"]}
        />

        <Card className="mx-auto max-w-2xl" bodyClassName="p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success">
            <Icons.CheckCircle2 className="size-7" />
          </span>

          <h2 className="mt-4 text-2xl font-semibold">Order placed successfully</h2>

          <p className="mt-2 text-muted-foreground">
            Thank you, {contact.first}. Your order has been created and is being processed.
          </p>

          {/* Order Details */}

          <div className="my-6 grid gap-3 rounded-lg border bg-muted/20 p-4 text-start sm:grid-cols-2">
            <p>
              <small className="block text-muted-foreground">Order number</small>

              <b>{success}</b>
            </p>

            <p>
              <small className="block text-muted-foreground">Order total</small>

              <b>${totals.total.toFixed(2)}</b>
            </p>

            <p>
              <small className="block text-muted-foreground">Delivery</small>

              <b>{delivery} delivery</b>
            </p>

            <p>
              <small className="block text-muted-foreground">Payment</small>

              <b>{payment}</b>
            </p>
          </div>

          {/* Shipping Address */}

          <p className="mb-6 text-sm text-muted-foreground">
            Shipping to {shipping.line1}, {shipping.city}, {shipping.country}
          </p>

          {/* Actions */}

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast.success("Order details are available in Orders")}
            >
              View order
            </Button>

            <Button onClick={() => setSuccess(null)}>Continue shopping</Button>
          </div>
        </Card>
      </>
    );
  }

  /* ===================================================
     Checkout Screen
  =================================================== */

  return (
    <>
      <PageHeader
        title="Checkout"
        subtitle="Complete customer, shipping and payment information before placing the order."
        breadcrumb={["Cart", "Checkout"]}
        actions={
          <Button variant="outline" onClick={() => history.back()}>
            <Icons.ArrowLeft className="size-4" />
            Back to cart
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-12">
        {/* =================================================
            Checkout Form
        ================================================= */}

        <main className="space-y-4 xl:col-span-8">
          {/* -----------------------------------------------
              1. Contact Information
          ----------------------------------------------- */}

          <Card title="1. Contact information" bodyClassName="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["first", "last", "email", "phone", "company"] as const).map((key) => {
                const label =
                  key === "first"
                    ? "First name"
                    : key === "last"
                      ? "Last name"
                      : key === "email"
                        ? "Email"
                        : key === "phone"
                          ? "Phone"
                          : "Company (optional)";

                return (
                  <label
                    key={key}
                    className={`grid gap-1.5 text-sm ${key === "company" ? "sm:col-span-2" : ""}`}
                  >
                    <span className="font-medium">{label}</span>

                    <input
                      type={key === "email" ? "email" : "text"}
                      value={contact[key]}
                      onChange={(event) =>
                        setContact({
                          ...contact,
                          [key]: event.target.value,
                        })
                      }
                      className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                );
              })}
            </div>
          </Card>

          {/* -----------------------------------------------
              2. Shipping Address
          ----------------------------------------------- */}

          <Card title="2. Shipping address" bodyClassName="p-5">
            <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
              <b>Home</b>

              <p className="mt-1 text-muted-foreground">
                Sophia Carter 24 Madison Avenue New York, NY 10010
              </p>
            </div>

            <AddressFields value={shipping} onChange={setShipping} prefix="shipping" />

            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="size-4 accent-primary" />
              Save this address
            </label>
          </Card>

          {/* -----------------------------------------------
              3. Delivery Method
          ----------------------------------------------- */}

          <Card title="3. Delivery method" bodyClassName="space-y-2 p-5">
            <ChoiceCard
              active={delivery === "Standard"}
              title="Standard Delivery"
              detail="3-5 business days"
              price="$8.00"
              onClick={() => setDelivery("Standard")}
            />

            <ChoiceCard
              active={delivery === "Express"}
              title="Express Delivery"
              detail="1-2 business days"
              price="$18.00"
              onClick={() => setDelivery("Express")}
            />

            <ChoiceCard
              active={delivery === "Pickup"}
              title="Free Pickup"
              detail="Ready tomorrow"
              price="Free"
              onClick={() => setDelivery("Pickup")}
            />
          </Card>

          {/* -----------------------------------------------
              4. Payment Method
          ----------------------------------------------- */}

          <Card title="4. Payment method" bodyClassName="space-y-3 p-5">
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["Card", "Credit or debit card"],
                  ["PayPal", "Pay securely with PayPal"],
                  ["Bank transfer", "Pay from your bank"],
                  ["Cash on delivery", "Pay when delivered"],
                ] as [Payment, string][]
              ).map(([method, detail]) => (
                <ChoiceCard
                  key={method}
                  active={payment === method}
                  title={method}
                  detail={detail}
                  onClick={() => setPayment(method)}
                />
              ))}
            </div>

            {/* Card Payment */}

            {payment === "Card" && (
              <div className="mt-4 grid gap-3 rounded-lg border bg-muted/15 p-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium">Cardholder name</span>

                  <input
                    value={card.holder}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        holder: event.target.value,
                      })
                    }
                    className="h-10 rounded-md border bg-background px-3"
                  />
                </label>

                <label className="grid gap-1.5 text-sm sm:col-span-2">
                  <span className="font-medium">Card number</span>

                  <input
                    inputMode="numeric"
                    value={card.number}
                    onChange={(event) =>
                      setCard({
                        ...card,

                        number: event.target.value.replace(/[^\d ]/g, ""),
                      })
                    }
                    className="h-10 rounded-md border bg-background px-3"
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">Expiry</span>

                  <input
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        expiry: event.target.value,
                      })
                    }
                    className="h-10 rounded-md border bg-background px-3"
                  />
                </label>

                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">CVV</span>

                  <input
                    type="password"
                    inputMode="numeric"
                    value={card.cvv}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        cvv: event.target.value,
                      })
                    }
                    className="h-10 rounded-md border bg-background px-3"
                  />
                </label>
              </div>
            )}

            {/* Other Payment Methods */}

            {payment !== "Card" && (
              <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
                {payment === "PayPal"
                  ? "You will continue securely with PayPal after placing this demo order."
                  : payment === "Bank transfer"
                    ? "Bank transfer details will be included with your order confirmation."
                    : "Payment will be collected at delivery."}
              </div>
            )}
          </Card>

          {/* -----------------------------------------------
              5. Billing Address
          ----------------------------------------------- */}

          <Card title="5. Billing address" bodyClassName="p-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sameBilling}
                onChange={(event) => setSameBilling(event.target.checked)}
                className="size-4 accent-primary"
              />
              Billing address is the same as shipping
            </label>

            {!sameBilling && (
              <div className="mt-4">
                <AddressFields value={billing} onChange={setBilling} prefix="billing" />
              </div>
            )}
          </Card>

          {/* -----------------------------------------------
              6. Order Notes
          ----------------------------------------------- */}

          <Card title="6. Order notes" bodyClassName="p-5">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add delivery instructions or order notes..."
              rows={3}
              className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Card>
        </main>

        {/* =================================================
            Order Summary
        ================================================= */}

        <aside className="xl:col-span-4">
          <Card title="Order summary" className="xl:sticky xl:top-5" bodyClassName="p-5">
            <div className="space-y-4">
              {/* Cart Items */}

              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-14 rounded-md border object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{item.name}</b>

                    <small className="text-muted-foreground">{item.variant}</small>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity */}

                      <div className="flex items-center rounded-md border">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name}`}
                          className="px-2 py-1"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Icons.Minus className="size-3" />
                        </button>

                        <span className="px-2 text-xs">{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name}`}
                          className="px-2 py-1"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Icons.Plus className="size-3" />
                        </button>
                      </div>

                      {/* Item Price */}

                      <b className="text-sm">${(item.price * item.quantity).toFixed(2)}</b>
                    </div>
                  </div>

                  {/* Remove */}

                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() =>
                      setItems((all) => all.filter((product) => product.id !== item.id))
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Icons.X className="size-4" />
                  </button>
                </div>
              ))}

              {/* -------------------------------------------
                  Promo Code
              ------------------------------------------- */}

              <div className="border-t pt-4">
                <label className="mb-2 block text-xs font-medium">Promo code</label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-md bg-success/10 p-2 text-sm text-success">
                    <span>
                      <Icons.Check className="me-1 inline size-3" />
                      {appliedCoupon} applied
                    </span>

                    <button
                      type="button"
                      onClick={() => setAppliedCoupon("")}
                      className="underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(event) => setCoupon(event.target.value)}
                      placeholder="SAVE10"
                      className="h-9 min-w-0 flex-1 rounded-md border bg-background px-2 text-sm"
                    />

                    <Button size="sm" variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* -------------------------------------------
                  Price Summary
              ------------------------------------------- */}

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>

                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>

                  <span>{totals.shipping ? `$${totals.shipping.toFixed(2)}` : "Free"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>

                  <span>${totals.tax.toFixed(2)}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>

                    <span>
                      -$
                      {totals.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-3 text-base">
                  <b>Total</b>

                  <b>${totals.total.toFixed(2)}</b>
                </div>
              </div>

              {/* -------------------------------------------
                  Validation Errors
              ------------------------------------------- */}

              {errors.length > 0 && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  <b>Please review:</b>

                  <ul className="mt-1 list-disc ps-4">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------
                  Place Order
              ------------------------------------------- */}

              <Button className="w-full" size="lg" onClick={placeOrder}>
                <Icons.LockKeyhole className="size-4" />
                Place order
              </Button>

              {/* Security Message */}

              <p className="text-center text-xs text-muted-foreground">
                <Icons.ShieldCheck className="me-1 inline size-3" />
                Secure demo checkout. Card details are not stored.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
