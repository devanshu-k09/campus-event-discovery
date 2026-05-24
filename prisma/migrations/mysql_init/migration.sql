-- ═══════════════════════════════════════════════════════════════
-- Campus Event Discovery Platform — MySQL 8.x Schema
-- Generated from Prisma schema (reference copy)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ═══════════════════════════════════════════════════════════════

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS campus_events
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campus_events;

-- ─── Users Table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `User` (
  `id`            VARCHAR(30) NOT NULL,
  `name`          VARCHAR(100) DEFAULT NULL,
  `email`         VARCHAR(150) NOT NULL,
  `emailVerified` DATETIME DEFAULT NULL,
  `password`      VARCHAR(255) DEFAULT NULL,
  `image`         VARCHAR(500) DEFAULT NULL,
  `collegeName`   VARCHAR(150) DEFAULT NULL,
  `year`          INT DEFAULT NULL,
  `department`    VARCHAR(100) DEFAULT NULL,
  `interests`     JSON NOT NULL DEFAULT ('[]'),
  `points`        INT NOT NULL DEFAULT 0,
  `role`          ENUM('student','organizer','admin') NOT NULL DEFAULT 'student',
  `createdAt`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  INDEX `User_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── NextAuth: Account Table ─────────────────────────────────

CREATE TABLE IF NOT EXISTS `Account` (
  `id`                VARCHAR(30) NOT NULL,
  `userId`            VARCHAR(30) NOT NULL,
  `type`              VARCHAR(50) NOT NULL,
  `provider`          VARCHAR(50) NOT NULL,
  `providerAccountId` VARCHAR(100) NOT NULL,
  `refresh_token`     TEXT DEFAULT NULL,
  `access_token`      TEXT DEFAULT NULL,
  `expires_at`        INT DEFAULT NULL,
  `token_type`        VARCHAR(50) DEFAULT NULL,
  `scope`             VARCHAR(255) DEFAULT NULL,
  `id_token`          TEXT DEFAULT NULL,
  `session_state`     VARCHAR(255) DEFAULT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`, `providerAccountId`),
  INDEX `Account_userId_idx` (`userId`),
  CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── NextAuth: Session Table ─────────────────────────────────

CREATE TABLE IF NOT EXISTS `Session` (
  `id`           VARCHAR(30) NOT NULL,
  `sessionToken` VARCHAR(255) NOT NULL,
  `userId`       VARCHAR(30) NOT NULL,
  `expires`      DATETIME NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  INDEX `Session_userId_idx` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── NextAuth: VerificationToken Table ───────────────────────

CREATE TABLE IF NOT EXISTS `VerificationToken` (
  `identifier` VARCHAR(255) NOT NULL,
  `token`      VARCHAR(255) NOT NULL,
  `expires`    DATETIME NOT NULL,

  UNIQUE KEY `VerificationToken_token_key` (`token`),
  UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Events Table ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Event` (
  `id`               VARCHAR(30) NOT NULL,
  `title`            VARCHAR(200) NOT NULL,
  `description`      TEXT NOT NULL,
  `image`            VARCHAR(500) NOT NULL,
  `eventQR`          VARCHAR(500) DEFAULT NULL,
  `category`         VARCHAR(50) NOT NULL,
  `date`             DATETIME NOT NULL,
  `time`             VARCHAR(20) NOT NULL,
  `duration`         INT NOT NULL,
  `location`         VARCHAR(255) NOT NULL,
  `coordinates`      VARCHAR(100) DEFAULT NULL,
  `price`            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `capacity`         INT NOT NULL,
  `tags`             JSON NOT NULL DEFAULT ('[]'),
  `popularityScore`  INT NOT NULL DEFAULT 0,
  `viewCount`        INT NOT NULL DEFAULT 0,
  `status`           ENUM('draft','published','cancelled','completed') NOT NULL DEFAULT 'draft',
  `isFeatured`       TINYINT(1) NOT NULL DEFAULT 0,
  `isPrivate`        TINYINT(1) NOT NULL DEFAULT 0,
  `requiresApproval` TINYINT(1) NOT NULL DEFAULT 1,
  `showAttendeeList` TINYINT(1) NOT NULL DEFAULT 0,
  `organizerId`      VARCHAR(30) NOT NULL,
  `createdAt`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  INDEX `Event_organizerId_idx` (`organizerId`),
  INDEX `Event_status_idx` (`status`),
  INDEX `Event_date_idx` (`date`),
  INDEX `Event_isFeatured_idx` (`isFeatured`),
  CONSTRAINT `Event_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `User`(`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Registration Table ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Registration` (
  `id`           VARCHAR(30) NOT NULL,
  `status`       VARCHAR(30) NOT NULL DEFAULT 'registered',
  `attended`     TINYINT(1) NOT NULL DEFAULT 0,
  `qrCode`       VARCHAR(500) DEFAULT NULL,
  `paymentQR`    VARCHAR(500) DEFAULT NULL,
  `reminderSent` TINYINT(1) NOT NULL DEFAULT 0,
  `userId`       VARCHAR(30) NOT NULL,
  `eventId`      VARCHAR(30) NOT NULL,
  `registeredAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `Registration_userId_eventId_key` (`userId`, `eventId`),
  INDEX `Registration_userId_idx` (`userId`),
  INDEX `Registration_eventId_idx` (`eventId`),
  CONSTRAINT `Registration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Registration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Review Table ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `Review` (
  `id`        VARCHAR(30) NOT NULL,
  `rating`    INT NOT NULL,
  `comment`   TEXT NOT NULL,
  `helpful`   INT NOT NULL DEFAULT 0,
  `userId`    VARCHAR(30) NOT NULL,
  `eventId`   VARCHAR(30) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `Review_userId_eventId_key` (`userId`, `eventId`),
  INDEX `Review_userId_idx` (`userId`),
  INDEX `Review_eventId_idx` (`eventId`),
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: 2 users + 4 events (mix of draft/published/featured)
-- Prices in INR (₹) — NEVER USD
-- ═══════════════════════════════════════════════════════════════

-- Password hash for 'Password@123' (bcrypt)
-- $2a$10$YourHashHere — use Prisma seed for actual inserts

-- NOTE: Use `npx prisma db seed` for actual seed data insertion.
-- The Prisma seed script (prisma/seed.ts) handles password hashing
-- and proper cuid() ID generation automatically.
