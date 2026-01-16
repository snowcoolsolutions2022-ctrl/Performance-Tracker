'use server'

import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';

import {
    InstallDataEntry,
    ServiceDataEntry,
    CategoryData,
    InstallSummary,
    MonthlySummaryData
} from './types';

export async function saveInstallReport(
    month: string,
    year: number,
    data: InstallDataEntry[],
    summaryData?: MonthlySummaryData,
    metadata?: {
        table1Title: string;
        table2Title: string;
        table3Title: string;
        headers: any;
    }
) {
    try {
        // Filter out empty rows
        const validData = data.filter(d => d.techName && d.techName.trim() !== '');
        console.log(`Saving install report for ${month} ${year}`, { validRows: validData.length, total: data.length });

        for (const entry of validData) {
            let technician = await prisma.technician.findFirst({
                where: { name: entry.techName }
            });

            if (!technician) {
                technician = await prisma.technician.create({
                    data: {
                        name: entry.techName,
                        designation: entry.designation
                    }
                });
            } else if (technician.designation !== entry.designation) {
                // Update designation if it changed
                await prisma.technician.update({
                    where: { id: technician.id },
                    data: { designation: entry.designation }
                });
            }

            const report = await prisma.monthlyReport.upsert({
                where: {
                    technicianId_month_year: {
                        technicianId: technician.id,
                        month: month,
                        year: year
                    }
                },
                create: {
                    technicianId: technician.id,
                    month,
                    year,
                    allocatedCalls: entry.allocatedCalls,
                    week1: entry.week1,
                    week2: entry.week2,
                    week3: entry.week3,
                    week4: entry.week4,
                    week5: entry.week5,
                    totalCompleted: entry.totalCompleted,
                    workingDays: entry.workingDays,
                    completedAverage: entry.completedAverage,
                    pendingCalls: entry.pendingCalls,
                },
                update: {
                    allocatedCalls: entry.allocatedCalls,
                    week1: entry.week1,
                    week2: entry.week2,
                    week3: entry.week3,
                    week4: entry.week4,
                    week5: entry.week5,
                    totalCompleted: entry.totalCompleted,
                    workingDays: entry.workingDays,
                    completedAverage: entry.completedAverage,
                    pendingCalls: entry.pendingCalls,
                }
            });

            await prisma.installDetail.upsert({
                where: { reportId: report.id },
                create: {
                    reportId: report.id,
                    stand: entry.stand,
                    standFixing: entry.standFixing,
                    copperPipe: entry.copperPipe,
                    copperPipeFixing: entry.copperPipeFixing,
                    cottonRoll: entry.cottonRoll,
                    stabilizer: entry.stabilizer,
                    amcAchieved: entry.amc,
                    installCount: entry.noInstall,
                    dismantleCount: entry.dismantling
                },
                update: {
                    stand: entry.stand,
                    standFixing: entry.standFixing,
                    copperPipe: entry.copperPipe,
                    copperPipeFixing: entry.copperPipeFixing,
                    cottonRoll: entry.cottonRoll,
                    stabilizer: entry.stabilizer,
                    amcAchieved: entry.amc,
                    installCount: entry.noInstall,
                    dismantleCount: entry.dismantling
                }
            });
        }

        if (summaryData || metadata) {
            await prisma.installMonthlySummary.upsert({
                where: {
                    month_year: {
                        month: month,
                        year: year
                    }
                },
                create: {
                    month,
                    year,
                    installQty: summaryData?.install || 0,
                    reinstallQty: summaryData?.reinstall || 0,
                    dismantleQty: summaryData?.dismantling || 0,
                    table1Title: metadata?.table1Title,
                    table2Title: metadata?.table2Title,
                    table3Title: metadata?.table3Title,
                    headers: metadata?.headers
                },
                update: {
                    installQty: summaryData?.install,
                    reinstallQty: summaryData?.reinstall,
                    dismantleQty: summaryData?.dismantling,
                    table1Title: metadata?.table1Title,
                    table2Title: metadata?.table2Title,
                    table3Title: metadata?.table3Title,
                    headers: metadata?.headers
                }
            });
        }

        // Identify and Delete removed rows
        // Find all reports for this month/year for Install team
        const allMonthReports = await prisma.monthlyReport.findMany({
            where: {
                month,
                year,
                technician: {
                    designation: {
                        contains: 'INSTALL'
                    }
                }
            },
            include: { technician: true }
        });

        // Identify which reports correspond to technicians NOT in the submitted data
        // Use validData for this check to ensure we delete empty rows if they previously existed (unlikely but safe)
        const submittedTechNames = new Set(validData.map(d => d.techName));
        const reportsToDelete = allMonthReports.filter(r => !submittedTechNames.has(r.technician.name));

        if (reportsToDelete.length > 0) {
            const deleteIds = reportsToDelete.map(r => r.id);
            console.log(`Deleting ${deleteIds.length} removed reports`);

            // Delete child records first
            await prisma.installDetail.deleteMany({
                where: { reportId: { in: deleteIds } }
            });

            await prisma.monthlyReport.deleteMany({
                where: { id: { in: deleteIds } }
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("Failed to save install report:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return {
            success: false,
            error: `Database Error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`
        };
    }
}

export async function getInstallReport(month: string, year: number) {
    try {
        const reports = await prisma.monthlyReport.findMany({
            where: {
                month,
                year,
                technician: {
                    designation: {
                        contains: 'INSTALL'
                    }
                }
            },
            include: {
                technician: true,
                installDetail: true
            }
        });

        // Fetch Summary Data
        const summary = await prisma.installMonthlySummary.findUnique({
            where: {
                month_year: {
                    month: month,
                    year: year
                }
            }
        });

        if (reports.length === 0 && !summary) return { success: true, data: null, summary: null };

        const formattedData: InstallDataEntry[] = reports.map(r => ({
            techName: r.technician.name,
            designation: r.technician.designation,
            allocatedCalls: r.allocatedCalls,
            week1: r.week1,
            week2: r.week2,
            week3: r.week3,
            week4: r.week4,
            week5: r.week5,
            totalCompleted: r.totalCompleted,
            workingDays: r.workingDays,
            completedAverage: r.completedAverage,
            pendingCalls: r.pendingCalls,
            stand: r.installDetail?.stand || 0,
            standFixing: r.installDetail?.standFixing || 0,
            copperPipe: r.installDetail?.copperPipe || 0,
            copperPipeFixing: r.installDetail?.copperPipeFixing || 0,
            cottonRoll: r.installDetail?.cottonRoll || 0,
            stabilizer: r.installDetail?.stabilizer || 0,
            amc: r.installDetail?.amcAchieved || 0,
            noInstall: r.installDetail?.installCount || 0,
            dismantling: r.installDetail?.dismantleCount || 0,
        }));

        const summaryData: MonthlySummaryData = summary ? {
            install: summary.installQty,
            reinstall: summary.reinstallQty,
            dismantling: summary.dismantleQty
        } : { install: 0, reinstall: 0, dismantling: 0 };

        const metadata = summary ? {
            table1Title: summary.table1Title,
            table2Title: summary.table2Title,
            table3Title: summary.table3Title,
            headers: summary.headers
        } : null;

        return { success: true, data: formattedData, summary: summaryData, metadata };
    } catch (error) {
        console.error("Failed to get install report:", error);
        return { success: false, error: String(error) };
    }
}

// SERVICE ACTIONS



export async function saveServiceReport(
    month: string,
    year: number,
    data: ServiceDataEntry[],
    categories: CategoryData[],
    metadata?: {
        table1Title: string;
        categoryTitle: string;
        headers: any;
    }
) {
    try {
        // Filter out empty rows
        const validData = data.filter(d => d.techName && d.techName.trim() !== '');
        console.log(`Saving service report for ${month} ${year}`, { validRows: validData.length, total: data.length });

        let firstReportId: number | null = null;

        for (const entry of validData) {
            let technician = await prisma.technician.findFirst({
                where: { name: entry.techName }
            });

            if (!technician) {
                technician = await prisma.technician.create({
                    data: {
                        name: entry.techName,
                        designation: entry.designation
                    }
                });
            }

            const report = await prisma.monthlyReport.upsert({
                where: {
                    technicianId_month_year: {
                        technicianId: technician.id,
                        month: month,
                        year: year
                    }
                },
                create: {
                    technicianId: technician.id,
                    month,
                    year,
                    allocatedCalls: entry.allocatedCalls,
                    week1: entry.week1,
                    week2: entry.week2,
                    week3: entry.week3,
                    week4: entry.week4,
                    week5: entry.week5,
                    totalCompleted: entry.totalCompleted,
                    workingDays: entry.workingDays,
                    attendedAverage: entry.attendedAverage,
                },
                update: {
                    allocatedCalls: entry.allocatedCalls,
                    week1: entry.week1,
                    week2: entry.week2,
                    week3: entry.week3,
                    week4: entry.week4,
                    week5: entry.week5,
                    totalCompleted: entry.totalCompleted,
                    workingDays: entry.workingDays,
                    attendedAverage: entry.attendedAverage,
                }
            });

            if (!firstReportId) firstReportId = report.id;
        }

        // Handle categories (linked to the first report for this month/year)
        // If there are no valid rows, we try to find ANY existing report for this month/year to link categories to
        if (categories.length > 0) {
            if (!firstReportId) {
                const existingReport = await prisma.monthlyReport.findFirst({
                    where: { month, year }
                });
                if (existingReport) firstReportId = existingReport.id;
            }

            if (firstReportId) {
                // Delete existing categories for this month by finding all reports for this month/year
                const monthReports = await prisma.monthlyReport.findMany({
                    where: { month, year }
                });
                const reportIds = monthReports.map(r => r.id);

                await prisma.serviceCategoryBreakdown.deleteMany({
                    where: { reportId: { in: reportIds } }
                });

                for (const cat of categories) {
                    await prisma.serviceCategoryBreakdown.create({
                        data: {
                            reportId: firstReportId,
                            categoryName: cat.categoryName,
                            inWarranty: cat.inWarranty,
                            outWarranty: cat.outWarranty,
                            total: cat.total
                        }
                    });
                }
            } else {
                console.warn("No reports found to attach categories to.");
            }
        }

        // Save Service Monthly Summary (Metadata)
        if (metadata) {
            console.log('Upserting Service Monthly Summary:', {
                month,
                year,
                metadata
            });

            await prisma.serviceMonthlySummary.upsert({
                where: {
                    month_year: {
                        month: month,
                        year: year
                    }
                },
                create: {
                    month,
                    year,
                    table1Title: metadata.table1Title || null,
                    categoryTitle: metadata.categoryTitle || null,
                    headers: metadata.headers ? JSON.parse(JSON.stringify(metadata.headers)) : Prisma.JsonNull
                },
                update: {
                    table1Title: metadata.table1Title || null,
                    categoryTitle: metadata.categoryTitle || null,
                    headers: metadata.headers ? JSON.parse(JSON.stringify(metadata.headers)) : Prisma.JsonNull
                }
            });
        }

        // Handle Deleted Rows 
        // Find reports for this month/year but NOT in validData
        const allMonthReportsService = await prisma.monthlyReport.findMany({
            where: {
                month,
                year,
                technician: {
                    designation: {
                        not: { contains: 'INSTALL' }
                    }
                }
            },
            include: { technician: true }
        });

        const submittedServiceTechNames = new Set(validData.map(d => d.techName));
        const serviceReportsToDelete = allMonthReportsService.filter(r => !submittedServiceTechNames.has(r.technician.name));

        if (serviceReportsToDelete.length > 0) {
            const deleteIds = serviceReportsToDelete.map(r => r.id);
            // Caution: If we delete the report that holds the categories, we lose categories.
            // We need to re-link categories to another report if the one holding them is deleted.
            // But simpler: we just rebuilt categories above and attached to `firstReportId`. 
            // If `firstReportId` was one of the reports we are about to delete (because it was in `validData`), it's protected.
            // If `firstReportId` came from `existingReport` (outside validData), we might delete it?
            // Actually: `validData` creates/upserts reports. `firstReportId` comes from `validData` loop primarily.
            // If `validData` has entries, `firstReportId` is one of them. It WON'T be in `reportsToDelete`.
            // So safe to delete `reportsToDelete`.

            // Wait, if we use `existingReport` (fallback), it's possible that `existingReport` IS in `reportsToDelete` (e.g. user deleted all rows, but we found an old one before deleting it).
            // But `reportsToDelete` are those NOT in `validData`. 
            // If `validData` is empty, `firstReportId` is null. We search for `existingReport`.
            // If we find one, we attach categories.
            // THEN we calculate `reportsToDelete` -> which will be ALL reports.
            // We delete ALL reports.
            // Categories (attached to one of them) will be deleted (cascade) or orphaned?
            // Schema: `report       MonthlyReport @relation(fields: [reportId], references: [id])` -> NO Cascade defined explicitly in text I saw, but usually Prisma defaults strict or cascade if configured. 
            // In `actions.ts` usually we delete children manually.
            // If we delete the report, `ServiceCategoryBreakdown` will likely fail if no cascade.

            // To be safe: explicit delete of children of deleted reports.
            await prisma.serviceCategoryBreakdown.deleteMany({
                where: { reportId: { in: deleteIds } } // This might delete the categories we just saved if validData is empty!
            });

            // Issue: If `validData` is empty, and we saved categories to an existing report, then we delete that report... we lose categories.
            // Edge case: User clears all techs but keeps categories.
            // Current schema forces Categories to belong to a Report. If no Reports, no Categories.
            // So if user deletes all techs, they LOSE categories. This is a schema limitation.
            // Accepting this for now as reasonable behavior for "Performance Tracker" (no performers = no report).

            await prisma.monthlyReport.deleteMany({
                where: { id: { in: deleteIds } }
            });
        }


        return { success: true };
    } catch (error: any) {
        console.error("Failed to save service report:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        return {
            success: false,
            error: `Database Error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`
        };
    }
}

export async function getServiceReport(month: string, year: number) {
    try {
        const reports = await prisma.monthlyReport.findMany({
            where: {
                month,
                year,
                technician: {
                    designation: {
                        not: { contains: 'INSTALL' }
                    }
                }
            },
            include: {
                technician: true,
                serviceCategories: true
            }
        });

        if (reports.length === 0) return { success: true, data: null, categories: null };

        const formattedData: ServiceDataEntry[] = reports.map(r => ({
            techName: r.technician.name,
            designation: r.technician.designation,
            allocatedCalls: r.allocatedCalls,
            week1: r.week1,
            week2: r.week2,
            week3: r.week3,
            week4: r.week4,
            week5: r.week5,
            totalCompleted: r.totalCompleted,
            workingDays: r.workingDays,
            completedAverage: r.completedAverage,
            attendedAverage: r.attendedAverage,
        }));

        // Flatten categories from all reports (though they should be on one)
        const allCategories: CategoryData[] = [];
        const seenCats = new Set();
        reports.forEach(r => {
            r.serviceCategories.forEach(c => {
                if (!seenCats.has(c.categoryName)) {
                    allCategories.push({
                        categoryName: c.categoryName,
                        inWarranty: c.inWarranty,
                        outWarranty: c.outWarranty,
                        total: c.total
                    });
                    seenCats.add(c.categoryName);
                }
            });
        });

        const summary = await prisma.serviceMonthlySummary.findUnique({
            where: {
                month_year: {
                    month: month,
                    year: year
                }
            }
        });

        const metadata = summary ? {
            table1Title: summary.table1Title,
            categoryTitle: summary.categoryTitle,
            headers: summary.headers
        } : null;

        return { success: true, data: formattedData, categories: allCategories.length > 0 ? allCategories : null, metadata };
    } catch (error) {
        console.error("Failed to get service report:", error);
        return { success: false, error: String(error) };
    }
}

// CONSOLIDATED REPORTS

export async function getConsolidatedReport(monthYears: { month: string, year: number }[]) {
    try {
        console.log("Generating consolidated report for:", monthYears);

        // Build OR query for all requested month/years
        const orConditions = monthYears.map(my => ({
            month: my.month,
            year: my.year
        }));

        const reports = await prisma.monthlyReport.findMany({
            where: {
                OR: orConditions
            },
            include: {
                technician: true,
                installDetail: true,
                serviceCategories: true
            }
        });

        // Separate Install vs Service (Non-Install)
        const installReports = reports.filter(r => r.technician.designation.includes('INSTALL'));
        const serviceReports = reports.filter(r => !r.technician.designation.includes('INSTALL'));

        // Helper to aggregate data
        const aggregateData = (reportsList: typeof reports, type: 'INSTALL' | 'SERVICE') => {
            const map = new Map<string, any>(); // Key: TechName

            for (const r of reportsList) {
                const name = r.technician.name;
                if (!map.has(name)) {
                    map.set(name, {
                        techName: name,
                        designation: r.technician.designation,
                        allocatedCalls: 0,
                        week1: 0, week2: 0, week3: 0, week4: 0, week5: 0,
                        totalCompleted: 0,
                        workingDays: 0,
                        pendingCalls: 0,
                        // Install Specific
                        stand: 0, standFixing: 0, copperPipe: 0, copperPipeFixing: 0,
                        cottonRoll: 0, stabilizer: 0, amc: 0, noInstall: 0, dismantling: 0,
                        // Service Specific
                        attendedSum: 0, // temp for recalculating average
                    });
                }

                const entry = map.get(name);
                entry.allocatedCalls += r.allocatedCalls;
                entry.week1 += r.week1;
                entry.week2 += r.week2;
                entry.week3 += r.week3;
                entry.week4 += r.week4;
                entry.week5 += r.week5;
                entry.totalCompleted += r.totalCompleted;
                entry.workingDays += r.workingDays;
                entry.pendingCalls += r.pendingCalls;

                if (type === 'INSTALL' && r.installDetail) {
                    entry.stand += r.installDetail.stand;
                    entry.standFixing += r.installDetail.standFixing;
                    entry.copperPipe += r.installDetail.copperPipe;
                    entry.copperPipeFixing += r.installDetail.copperPipeFixing;
                    entry.cottonRoll += r.installDetail.cottonRoll;
                    entry.stabilizer += r.installDetail.stabilizer;
                    entry.amc += r.installDetail.amcAchieved;
                    entry.noInstall += r.installDetail.installCount;
                    entry.dismantling += r.installDetail.dismantleCount;
                }
            }

            return Array.from(map.values()).map(e => {
                // Recalculate Averages
                const completedAverage = e.workingDays > 0 ? parseFloat((e.totalCompleted / e.workingDays).toFixed(1)) : 0;

                const result: any = {
                    ...e,
                    completedAverage
                };

                if (type === 'SERVICE') {
                    // Recalculate Attended Average
                    // Logic from service/page.tsx: attendedAverage = results saved... 
                    // Standard: Allocated / Working Days
                    const attendedAverage = e.workingDays > 0 ? parseFloat((e.allocatedCalls / e.workingDays).toFixed(1)) : 0;
                    result.attendedAverage = attendedAverage;
                }

                return result;
            });
        };

        const installData = aggregateData(installReports, 'INSTALL');
        const serviceData = aggregateData(serviceReports, 'SERVICE');

        // Aggregate Service Categories
        const categoryMap = new Map<string, CategoryData>();

        for (const r of serviceReports) {
            if (r.serviceCategories) {
                for (const cat of r.serviceCategories) {
                    if (!categoryMap.has(cat.categoryName)) {
                        categoryMap.set(cat.categoryName, {
                            categoryName: cat.categoryName,
                            inWarranty: 0,
                            outWarranty: 0,
                            total: 0
                        });
                    }
                    const entry = categoryMap.get(cat.categoryName)!;
                    entry.inWarranty += cat.inWarranty;
                    entry.outWarranty += cat.outWarranty;
                    entry.total += cat.total;
                }
            }
        }

        const consolidatedCategories = Array.from(categoryMap.values());

        // Aggregate Install Summary
        const summaries = await prisma.installMonthlySummary.findMany({
            where: {
                OR: orConditions
            }
        });

        const installSummary: InstallSummary = {
            installQty: 0,
            reinstallQty: 0,
            dismantleQty: 0
        };

        summaries.forEach(s => {
            installSummary.installQty += s.installQty;
            installSummary.reinstallQty += s.reinstallQty;
            installSummary.dismantleQty += s.dismantleQty;
        });

        return { success: true, installData, serviceData, categories: consolidatedCategories, installSummary };

    } catch (error) {
        console.error("Failed to get consolidated report:", error);
        return { success: false, error: String(error) };
    }
}

export async function getDashboardStats(month: string, year: number) {
    try {
        const reports = await prisma.monthlyReport.findMany({
            where: { month, year },
            include: {
                technician: true,
                installDetail: true
            }
        });

        // Initialize Aggregates
        let totalInstallCalls = 0;
        let totalServiceCalls = 0;
        let totalPending = 0;
        let totalAllocated = 0;
        let totalCompleted = 0;

        // Material Stats
        let totalAMC = 0;
        let totalStabilizer = 0;
        let totalStand = 0;
        let totalCopperPipe = 0;

        // Chart Data
        const weeklyData = [
            { name: 'Week 1', install: 0, service: 0 },
            { name: 'Week 2', install: 0, service: 0 },
            { name: 'Week 3', install: 0, service: 0 },
            { name: 'Week 4', install: 0, service: 0 },
            { name: 'Week 5', install: 0, service: 0 },
        ];

        for (const r of reports) {
            const isInstall = r.technician.designation.includes('INSTALL');

            totalAllocated += r.allocatedCalls;
            totalCompleted += r.totalCompleted;
            totalPending += r.pendingCalls;

            if (isInstall) {
                totalInstallCalls += r.totalCompleted;
                weeklyData[0].install += r.week1;
                weeklyData[1].install += r.week2;
                weeklyData[2].install += r.week3;
                weeklyData[3].install += r.week4;
                weeklyData[4].install += r.week5;

                if (r.installDetail) {
                    totalAMC += r.installDetail.amcAchieved;
                    totalStabilizer += r.installDetail.stabilizer;
                    totalStand += r.installDetail.stand;
                    totalCopperPipe += r.installDetail.copperPipe;
                }
            } else {
                totalServiceCalls += r.totalCompleted;
                weeklyData[0].service += r.week1;
                weeklyData[1].service += r.week2;
                weeklyData[2].service += r.week3;
                weeklyData[3].service += r.week4;
                weeklyData[4].service += r.week5;
            }
        }

        const efficiency = totalAllocated > 0 ? (totalCompleted / totalAllocated) * 100 : 0;

        return {
            success: true,
            kpi: {
                totalInstallCalls,
                totalServiceCalls,
                totalPending,
                efficiency: efficiency.toFixed(1),
                totalAMC,
                totalStabilizer,
                totalStand,
                totalCopperPipe
            },
            charts: {
                weeklyData
            }
        };

    } catch (error: any) {
        console.error("Failed to get dashboard stats:", {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
        return {
            success: false,
            error: `Failed to load dashboard: ${error.message}`
        };
    }
}
