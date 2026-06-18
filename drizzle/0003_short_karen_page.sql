ALTER TABLE "productos" DROP CONSTRAINT "productos_id_talle_x_categoria_talles_x_categoria_id_fk";
--> statement-breakpoint
ALTER TABLE "productos" ALTER COLUMN "id_talle_x_categoria" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "destacado_pos" integer;--> statement-breakpoint
ALTER TABLE "productos" ADD COLUMN "precio" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_talle_x_categoria_talles_x_categoria_id_fk" FOREIGN KEY ("id_talle_x_categoria") REFERENCES "public"."talles_x_categoria"("id") ON DELETE set null ON UPDATE no action;