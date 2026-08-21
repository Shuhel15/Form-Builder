-- DropForeignKey
ALTER TABLE `Form` DROP FOREIGN KEY `Form_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_formId_fkey`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_formId_fkey`;

-- DropIndex
DROP INDEX `Form_userId_fkey` ON `Form`;

-- AlterTable
ALTER TABLE `Question`
ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
MODIFY `type` ENUM('SHORT_TEXT', 'LONG_TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX', 'DROPDOWN', 'NUMBER', 'EMAIL', 'DATE') NOT NULL;

-- AddForeignKey
ALTER TABLE `Form`
ADD CONSTRAINT `Form_userId_fkey`
FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question`
ADD CONSTRAINT `Question_formId_fkey`
FOREIGN KEY (`formId`) REFERENCES `Form`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission`
ADD CONSTRAINT `Submission_formId_fkey`
FOREIGN KEY (`formId`) REFERENCES `Form`(`id`)
ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Question`
RENAME INDEX `Question_formId_fkey` TO `Question_formId_idx`;

-- RenameIndex
ALTER TABLE `Submission`
RENAME INDEX `Submission_formId_fkey` TO `Submission_formId_idx`;