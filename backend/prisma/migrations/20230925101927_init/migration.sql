-- CreateTable
CREATE TABLE "employees" (
    "employee_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "position" TEXT,
    "inner_phone" TEXT,
    "mobile_phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "department" TEXT,
    "supervisor_id" INTEGER,
    "companyCompany_id" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "companies" (
    "company_id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_name_key" ON "companies"("company_name");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyCompany_id_fkey" FOREIGN KEY ("companyCompany_id") REFERENCES "companies"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;
