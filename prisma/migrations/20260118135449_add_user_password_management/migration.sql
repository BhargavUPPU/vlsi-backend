/*
  Warnings:

  - You are about to drop the column `coreMemberId` on the `clubmembers` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `coremembers` table. All the data in the column will be lost.
  - The primary key for the `event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `eventfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projectimages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageData` on the `teamphoto` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clubmembers` DROP FOREIGN KEY `clubMembers_coreMemberId_fkey`;

-- DropForeignKey
ALTER TABLE `eventfile` DROP FOREIGN KEY `EventFile_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `projectimages` DROP FOREIGN KEY `ProjectImages_projectId_fkey`;

-- DropIndex
DROP INDEX `clubMembers_coreMemberId_fkey` ON `clubmembers`;

-- DropIndex
DROP INDEX `EventFile_eventId_fkey` ON `eventfile`;

-- DropIndex
DROP INDEX `ProjectImages_projectId_fkey` ON `projectimages`;

-- AlterTable
ALTER TABLE `clubmembers` DROP COLUMN `coreMemberId`;

-- AlterTable
ALTER TABLE `coremembers` DROP COLUMN `imageUrl`,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `image` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `event` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `eventfile` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `eventId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `gatepyqs` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General',
    ADD COLUMN `image` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `magazine` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE `nptellecture` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE `placementprep` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE `projectimages` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `projectId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `projects` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `questionbank` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General',
    ADD COLUMN `image` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `teamphoto` DROP COLUMN `imageData`;

-- AlterTable
ALTER TABLE `textbook` ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `lastPasswordChange` DATETIME(3) NULL,
    ADD COLUMN `requirePasswordChange` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `TeamPhotoImage` (
    `id` VARCHAR(191) NOT NULL,
    `teamPhotoId` VARCHAR(191) NOT NULL,
    `imageData` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `venue` VARCHAR(191) NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Achievement` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('HERO_CAROUSEL', 'CLUB_MILESTONE', 'SUMMARY_STAT', 'PROUD_MOMENT', 'AWARD_HIGHLIGHT', 'GALLERY_IMAGE') NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `value` VARCHAR(191) NULL,
    `mainImage` LONGBLOB NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AchievementImage` (
    `id` VARCHAR(191) NOT NULL,
    `achievementId` VARCHAR(191) NOT NULL,
    `imageData` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoGallery` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `category` ENUM('CLUB_HIGHLIGHTS', 'PHOTO_GALLERY', 'BOTH') NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhotoGalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `photoGalleryId` VARCHAR(191) NOT NULL,
    `imageData` LONGBLOB NOT NULL,
    `caption` VARCHAR(191) NULL,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectImages` ADD CONSTRAINT `ProjectImages_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventFile` ADD CONSTRAINT `EventFile_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamPhotoImage` ADD CONSTRAINT `TeamPhotoImage_teamPhotoId_fkey` FOREIGN KEY (`teamPhotoId`) REFERENCES `TeamPhoto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AchievementImage` ADD CONSTRAINT `AchievementImage_achievementId_fkey` FOREIGN KEY (`achievementId`) REFERENCES `Achievement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhotoGalleryImage` ADD CONSTRAINT `PhotoGalleryImage_photoGalleryId_fkey` FOREIGN KEY (`photoGalleryId`) REFERENCES `PhotoGallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
