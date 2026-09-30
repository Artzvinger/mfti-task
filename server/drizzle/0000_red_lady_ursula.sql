CREATE TYPE "public"."sample_status" AS ENUM('received', 'processing', 'completed');--> statement-breakpoint
CREATE TABLE "laboratories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "samples" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_name" varchar(150) NOT NULL,
	"status" "sample_status" NOT NULL,
	"received_at" timestamp NOT NULL,
	"laboratory_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL,
	"laboratory_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
