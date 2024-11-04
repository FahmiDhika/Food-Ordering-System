-- CreateTable
CREATE TABLE `menu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `price` INTEGER NOT NULL DEFAULT 0,
    `category` ENUM('FOOD', 'DRINK', 'SNACK') NOT NULL DEFAULT 'FOOD',
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `menu_uid_key`(`uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `profile_picture` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('MANAGER', 'CASHIER') NOT NULL DEFAULT 'CASHIER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `idOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL DEFAULT '',
    `customer` VARCHAR(191) NOT NULL DEFAULT '',
    `table_number` VARCHAR(191) NOT NULL DEFAULT '',
    `total_price` INTEGER NOT NULL DEFAULT 0,
    `payment_met` ENUM('CASH', 'QRIS') NOT NULL DEFAULT 'CASH',
    `userId` INTEGER NULL,
    `status` ENUM('NEW', 'PAID', 'DONE') NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_list` (
    `idOrderList` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL DEFAULT '',
    `orderId` INTEGER NULL,
    `menuId` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `note` TEXT NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idOrderList`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_list` ADD CONSTRAINT `order_list_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order`(`idOrder`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_list` ADD CONSTRAINT `order_list_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
