/*
  Warnings:

  - You are about to drop the column `category_id` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `genre_id` on the `books` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_category_id_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_genre_id_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "category_id",
DROP COLUMN "genre_id",
ADD COLUMN     "categories" "category",
ADD COLUMN     "genres" "genre";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "genres";
