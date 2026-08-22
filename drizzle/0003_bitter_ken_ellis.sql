CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_name" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_line1" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_line2" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_city" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_state" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_country" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_phone" varchar(30);--> statement-breakpoint
ALTER TABLE "sub_orders" ADD COLUMN "tracking_number" varchar(255);--> statement-breakpoint
ALTER TABLE "sub_orders" ADD COLUMN "shipped_at" timestamp;