-- CreateTable
CREATE TABLE `Milestone` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT 'bg-blue-500',
    `bgColor` VARCHAR(191) NOT NULL DEFAULT 'bg-blue-50',
    `image` LONGBLOB NULL,
    `category` VARCHAR(191) NULL DEFAULT 'general',
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
