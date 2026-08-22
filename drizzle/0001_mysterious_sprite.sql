CREATE TABLE "store_follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "store_follows_store_id_user_id_unique" UNIQUE("store_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "store_follows" ADD CONSTRAINT "store_follows_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_follows" ADD CONSTRAINT "store_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;