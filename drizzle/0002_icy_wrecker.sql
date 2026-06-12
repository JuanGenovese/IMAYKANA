CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"rol" varchar(50) NOT NULL,
	CONSTRAINT "roles_rol_unique" UNIQUE("rol")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"n_dni" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"id_rol" integer NOT NULL,
	"solicitud_vendedor" boolean DEFAULT false NOT NULL,
	CONSTRAINT "usuarios_n_dni_unique" UNIQUE("n_dni"),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoria" varchar(100) NOT NULL,
	CONSTRAINT "categorias_categoria_unique" UNIQUE("categoria")
);
--> statement-breakpoint
CREATE TABLE "talles" (
	"id" serial PRIMARY KEY NOT NULL,
	"talle" varchar(10) NOT NULL,
	CONSTRAINT "talles_talle_unique" UNIQUE("talle")
);
--> statement-breakpoint
CREATE TABLE "talles_x_categoria" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_talle" integer NOT NULL,
	"id_categoria" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metodos_pago" (
	"id" serial PRIMARY KEY NOT NULL,
	"metodo" varchar(100) NOT NULL,
	CONSTRAINT "metodos_pago_metodo_unique" UNIQUE("metodo")
);
--> statement-breakpoint
CREATE TABLE "estados" (
	"id" serial PRIMARY KEY NOT NULL,
	"estado" varchar(50) NOT NULL,
	CONSTRAINT "estados_estado_unique" UNIQUE("estado")
);
--> statement-breakpoint
CREATE TABLE "transacciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_metodo_pago" integer NOT NULL,
	"id_usuario" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"destacado" boolean DEFAULT false NOT NULL,
	"id_talle_x_categoria" integer NOT NULL,
	"cantidad" integer DEFAULT 1 NOT NULL,
	"id_transaccion" integer,
	"id_estado" integer NOT NULL,
	"color" varchar(100) NOT NULL,
	"descripcion" text DEFAULT '' NOT NULL,
	"medidas_especificas" varchar(500) DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imagenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar(500) NOT NULL,
	"id_producto" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "admins" CASCADE;--> statement-breakpoint
DROP TABLE "products" CASCADE;--> statement-breakpoint
DROP TABLE "transactions" CASCADE;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_roles_id_fk" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talles_x_categoria" ADD CONSTRAINT "talles_x_categoria_id_talle_talles_id_fk" FOREIGN KEY ("id_talle") REFERENCES "public"."talles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talles_x_categoria" ADD CONSTRAINT "talles_x_categoria_id_categoria_categorias_id_fk" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_metodo_pago_metodos_pago_id_fk" FOREIGN KEY ("id_metodo_pago") REFERENCES "public"."metodos_pago"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_talle_x_categoria_talles_x_categoria_id_fk" FOREIGN KEY ("id_talle_x_categoria") REFERENCES "public"."talles_x_categoria"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_transaccion_transacciones_id_fk" FOREIGN KEY ("id_transaccion") REFERENCES "public"."transacciones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_estado_estados_id_fk" FOREIGN KEY ("id_estado") REFERENCES "public"."estados"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imagenes" ADD CONSTRAINT "imagenes_id_producto_productos_id_fk" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id") ON DELETE cascade ON UPDATE no action;