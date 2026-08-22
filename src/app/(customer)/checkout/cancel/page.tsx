import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-7 h-7 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your order was not completed. You can try again or continue browsing.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/cart">Back to cart</Link>
            </Button>
            <Button asChild>
              <Link href="/">Browse products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
