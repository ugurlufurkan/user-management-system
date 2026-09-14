CREATE TABLE "user_girlfriend_family_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"girlfriend_id" uuid NOT NULL,
	"father_name" varchar(100) NOT NULL,
	"mother_name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_girlfriend_family_information" ADD CONSTRAINT "user_girlfriend_family_information_girlfriend_id_user_girlfriend_information_id_fk" FOREIGN KEY ("girlfriend_id") REFERENCES "public"."user_girlfriend_information"("id") ON DELETE cascade ON UPDATE no action;