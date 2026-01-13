-- CreateTable
CREATE TABLE "Technician" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyReport" (
    "id" SERIAL NOT NULL,
    "technicianId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "allocatedCalls" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "week1" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "week2" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "week3" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "week4" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "week5" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalCompleted" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "workingDays" INTEGER NOT NULL DEFAULT 0,
    "completedAverage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attendedAverage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "completedConversion" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pendingCalls" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallDetail" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "stand" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "standFixing" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "copperPipe" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "copperPipeFixing" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "cottonRoll" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "stabilizer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "amcTarget" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "amcAchieved" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "reinstallCount" INTEGER NOT NULL DEFAULT 0,
    "dismantleCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InstallDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategoryBreakdown" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "categoryName" TEXT NOT NULL,
    "inWarranty" INTEGER NOT NULL DEFAULT 0,
    "outWarranty" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ServiceCategoryBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallMonthlySummary" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "installQty" INTEGER NOT NULL DEFAULT 0,
    "reinstallQty" INTEGER NOT NULL DEFAULT 0,
    "dismantleQty" INTEGER NOT NULL DEFAULT 0,
    "table1Title" TEXT,
    "table2Title" TEXT,
    "table3Title" TEXT,
    "headers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallMonthlySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceMonthlySummary" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "table1Title" TEXT,
    "categoryTitle" TEXT,
    "headers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceMonthlySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReport_technicianId_month_year_key" ON "MonthlyReport"("technicianId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "InstallDetail_reportId_key" ON "InstallDetail"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallMonthlySummary_month_year_key" ON "InstallMonthlySummary"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceMonthlySummary_month_year_key" ON "ServiceMonthlySummary"("month", "year");

-- AddForeignKey
ALTER TABLE "MonthlyReport" ADD CONSTRAINT "MonthlyReport_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallDetail" ADD CONSTRAINT "InstallDetail_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MonthlyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategoryBreakdown" ADD CONSTRAINT "ServiceCategoryBreakdown_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MonthlyReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
