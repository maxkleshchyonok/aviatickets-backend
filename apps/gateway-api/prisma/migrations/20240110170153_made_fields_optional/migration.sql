-- DropForeignKey
ALTER TABLE "flights" DROP CONSTRAINT "flights_plane_id_fkey";

-- AlterTable
ALTER TABLE "flights" ALTER COLUMN "plane_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_plane_id_fkey" FOREIGN KEY ("plane_id") REFERENCES "planes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
