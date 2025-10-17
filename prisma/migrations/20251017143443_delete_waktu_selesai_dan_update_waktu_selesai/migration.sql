/*
  Warnings:

  - You are about to drop the column `waktu_selesai_aktual` on the `pemesanan` table. All the data in the column will be lost.
  - You are about to drop the column `waktu_selesai_est` on the `pemesanan` table. All the data in the column will be lost.
  - Added the required column `waktu_selesai` to the `pemesanan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pemesanan` DROP COLUMN `waktu_selesai_aktual`,
    DROP COLUMN `waktu_selesai_est`,
    ADD COLUMN `waktu_selesai` DECIMAL(65, 30) NOT NULL;
