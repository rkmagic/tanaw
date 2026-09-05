-- Initial schema (profiles + candidate_documents)
-- user_id is TEXT (Firebase UID)

CREATE TABLE IF NOT EXISTS "profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "full_name" TEXT,
  "birthday" DATE,
  "gender" TEXT,
  "mobile_number" TEXT,
  "past_work_experience" TEXT,
  "educational_background" TEXT,
  "desired_job" TEXT,
  "desired_country" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "candidate_documents" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "document_type" TEXT NOT NULL CHECK ("document_type" IN (
    'government_id',
    'resume', 
    'nbi_clearance',
    'educational_documents',
    'skills_tesda_certification',
    'medical_exam_results'
  )),
  "file_name" TEXT NOT NULL,
  "file_path" TEXT NOT NULL,
  "file_size" INTEGER,
  "uploaded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE("user_id", "document_type")
);

CREATE OR REPLACE FUNCTION "update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "update_profiles_updated_at" ON "profiles";
CREATE TRIGGER "update_profiles_updated_at"
BEFORE UPDATE ON "profiles"
FOR EACH ROW
EXECUTE FUNCTION "update_updated_at_column"();

CREATE OR REPLACE FUNCTION "validate_profile_data"()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."full_name" IS NOT NULL AND length(NEW."full_name") > 200 THEN
    RAISE EXCEPTION 'Full name must be 200 characters or less';
  END IF;

  IF NEW."mobile_number" IS NOT NULL AND NEW."mobile_number" !~ '^\+?[0-9]{10,15}$' THEN
    RAISE EXCEPTION 'Mobile number must be 10-15 digits, optionally starting with +';
  END IF;

  IF NEW."birthday" IS NOT NULL THEN
    IF NEW."birthday" > CURRENT_DATE THEN
      RAISE EXCEPTION 'Birthday cannot be in the future';
    END IF;
    IF NEW."birthday" < '1900-01-01'::date THEN
      RAISE EXCEPTION 'Birthday must be after 1900-01-01';
    END IF;
  END IF;

  IF NEW."past_work_experience" IS NOT NULL AND length(NEW."past_work_experience") > 5000 THEN
    RAISE EXCEPTION 'Past work experience must be 5000 characters or less';
  END IF;

  IF NEW."educational_background" IS NOT NULL AND length(NEW."educational_background") > 5000 THEN
    RAISE EXCEPTION 'Educational background must be 5000 characters or less';
  END IF;

  IF NEW."desired_job" IS NOT NULL AND length(NEW."desired_job") > 200 THEN
    RAISE EXCEPTION 'Desired job must be 200 characters or less';
  END IF;

  IF NEW."desired_country" IS NOT NULL AND length(NEW."desired_country") > 100 THEN
    RAISE EXCEPTION 'Desired country must be 100 characters or less';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "validate_profile_before_insert_update" ON "profiles";
CREATE TRIGGER "validate_profile_before_insert_update"
BEFORE INSERT OR UPDATE ON "profiles"
FOR EACH ROW
EXECUTE FUNCTION "validate_profile_data"();

CREATE INDEX IF NOT EXISTS "idx_profiles_user_id" ON "profiles"("user_id");
CREATE INDEX IF NOT EXISTS "idx_candidate_documents_user_id" ON "candidate_documents"("user_id");
CREATE INDEX IF NOT EXISTS "idx_candidate_documents_document_type" ON "candidate_documents"("document_type");
