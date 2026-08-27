-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(254) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `avatarPath` VARCHAR(255) NULL,
    `emailVerifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tokenHash` VARCHAR(128) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `lastSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Session_tokenHash_key`(`tokenHash`),
    INDEX `Session_userId_expiresAt_idx`(`userId`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kind` ENUM('VERIFY_EMAIL', 'RESET_PASSWORD', 'CHANGE_EMAIL') NOT NULL,
    `tokenHash` VARCHAR(128) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `AuthToken_tokenHash_key`(`tokenHash`),
    INDEX `AuthToken_userId_kind_idx`(`userId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarketProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `kind` ENUM('GOLD', 'SILVER', 'CRYPTO', 'CURRENCY') NOT NULL,
    `displayName` VARCHAR(160) NOT NULL,
    `karat` INTEGER NULL,
    `currency` VARCHAR(8) NULL,
    `source` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `MarketProduct_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarketPrice` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `buy` DECIMAL(18, 6) NULL,
    `sell` DECIMAL(18, 6) NULL,
    `price` DECIMAL(18, 6) NULL,
    `raw` JSON NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MarketPrice_productId_recordedAt_idx`(`productId`, `recordedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IngestionRun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(100) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `records` INTEGER NOT NULL DEFAULT 0,
    `error` TEXT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `IngestionRun_source_startedAt_idx`(`source`, `startedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PortfolioItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `kind` ENUM('GOLD', 'SILVER', 'CRYPTO', 'CURRENCY') NOT NULL,
    `productKey` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(18, 6) NOT NULL,
    `buyPrice` DECIMAL(18, 6) NOT NULL,
    `currency` VARCHAR(8) NOT NULL DEFAULT 'EGP',
    `purchasedAt` DATETIME(3) NOT NULL,
    `notes` VARCHAR(1000) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PortfolioItem_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceAlert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productKey` VARCHAR(100) NOT NULL,
    `direction` VARCHAR(8) NOT NULL,
    `target` DECIMAL(18, 6) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `triggeredAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PriceAlert_userId_active_idx`(`userId`, `active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `NewsCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `sourceUrl` TEXT NOT NULL,
    `sourceHash` CHAR(64) NOT NULL,
    `sourceName` VARCHAR(191) NOT NULL,
    `originalTitle` TEXT NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `body` LONGTEXT NULL,
    `keyPoints` JSON NULL,
    `imageUrl` TEXT NULL,
    `publishedAt` DATETIME(3) NULL,
    `categoryId` INTEGER NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsArticle_slug_key`(`slug`),
    UNIQUE INDEX `NewsArticle_sourceHash_key`(`sourceHash`),
    INDEX `NewsArticle_published_publishedAt_idx`(`published`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsBookmark` (
    `userId` INTEGER NOT NULL,
    `articleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `articleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuthToken` ADD CONSTRAINT `AuthToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarketPrice` ADD CONSTRAINT `MarketPrice_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `MarketProduct`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortfolioItem` ADD CONSTRAINT `PortfolioItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceAlert` ADD CONSTRAINT `PriceAlert_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `NewsCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsBookmark` ADD CONSTRAINT `NewsBookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsBookmark` ADD CONSTRAINT `NewsBookmark_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
