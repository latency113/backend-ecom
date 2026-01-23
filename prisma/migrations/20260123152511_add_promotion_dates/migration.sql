-- AlterTable
ALTER TABLE `Product` ADD COLUMN `promotionEnd` DATETIME(3) NULL,
    ADD COLUMN `promotionStart` DATETIME(3) NULL;
