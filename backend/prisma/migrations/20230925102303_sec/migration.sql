/*
  Warnings:

  - You are about to drop the column `companyCompany_id` on the `employees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_companyCompany_id_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "companyCompany_id",
ADD COLUMN     "company_id" INTEGER;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;
