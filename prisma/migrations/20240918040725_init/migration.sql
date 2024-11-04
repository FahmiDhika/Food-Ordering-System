/*
  Warnings:

  - You are about to drop the column `uid` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `order_list` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `menu` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `menu_uid_key` ON `menu`;

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `uid`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `order` DROP COLUMN `uid`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `order_list` DROP COLUMN `uid`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `uid`,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `menu_uuid_key` ON `menu`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);
