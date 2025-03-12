-- AlterTable
CREATE SEQUENCE folder_id_seq;
ALTER TABLE "Folder" ALTER COLUMN "id" SET DEFAULT nextval('folder_id_seq');
ALTER SEQUENCE folder_id_seq OWNED BY "Folder"."id";
