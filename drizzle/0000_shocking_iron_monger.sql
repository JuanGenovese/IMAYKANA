CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" varchar NOT NULL,
	"photo_urls" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"description_summary" text DEFAULT '' NOT NULL,
	"size" varchar NOT NULL,
	"color" varchar NOT NULL,
	"specific_measurements" varchar DEFAULT '' NOT NULL,
	"status" varchar DEFAULT 'AVAILABLE' NOT NULL
);

CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" serial NOT NULL,
	"transaction_type" varchar NOT NULL,
	"whatsapp_contact" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;