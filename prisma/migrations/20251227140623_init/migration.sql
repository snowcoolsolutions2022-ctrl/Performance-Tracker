-- CreateTable
CREATE TABLE "Technician" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MonthlyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "technicianId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "allocatedCalls" INTEGER NOT NULL DEFAULT 0,
    "week1" INTEGER NOT NULL DEFAULT 0,
    "week2" INTEGER NOT NULL DEFAULT 0,
    "week3" INTEGER NOT NULL DEFAULT 0,
    "week4" INTEGER NOT NULL DEFAULT 0,
    "week5" INTEGER NOT NULL DEFAULT 0,
    "totalCompleted" INTEGER NOT NULL DEFAULT 0,
    "workingDays" INTEGER NOT NULL DEFAULT 0,
    "completedAverage" REAL NOT NULL DEFAULT 0.0,
    "attendedAverage" REAL NOT NULL DEFAULT 0.0,
    "completedConversion" REAL NOT NULL DEFAULT 0.0,
    "pendingCalls" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyReport_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstallDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "stand" INTEGER NOT NULL DEFAULT 0,
    "standFixing" INTEGER NOT NULL DEFAULT 0,
    "copperPipe" REAL NOT NULL DEFAULT 0.0,
    "copperPipeFixing" REAL NOT NULL DEFAULT 0.0,
    "cottonRoll" INTEGER NOT NULL DEFAULT 0,
    "stabilizer" INTEGER NOT NULL DEFAULT 0,
    "amcTarget" INTEGER NOT NULL DEFAULT 0,
    "amcAchieved" INTEGER NOT NULL DEFAULT 0,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "reinstallCount" INTEGER NOT NULL DEFAULT 0,
    "dismantleCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "InstallDetail_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MonthlyReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceCategoryBreakdown" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "categoryName" TEXT NOT NULL,
    "inWarranty" INTEGER NOT NULL DEFAULT 0,
    "outWarranty" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServiceCategoryBreakdown_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "MonthlyReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReport_technicianId_month_year_key" ON "MonthlyReport"("technicianId", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "InstallDetail_reportId_key" ON "InstallDetail"("reportId");
