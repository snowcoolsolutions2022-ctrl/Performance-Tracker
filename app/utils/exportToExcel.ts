
import * as XLSX from 'xlsx';
import { InstallDataEntry, ServiceDataEntry, CategoryData, InstallSummary } from '../types';

interface ExportData {
    serviceData: ServiceDataEntry[];
    installData: InstallDataEntry[];
    categoryData: CategoryData[];
    installSummary: InstallSummary | null;
    fileName: string;
}

export const exportToExcel = ({ serviceData, installData, categoryData, installSummary, fileName }: ExportData) => {
    const workbook = XLSX.utils.book_new();

    // 1. Service Sheet
    if (serviceData.length > 0) {
        // Transform data for better column headers
        const serviceSheetData = serviceData.map(item => ({
            'Tech Name': item.techName,
            'Allocated': item.allocatedCalls,
            'Week 1 (1-7)': item.week1,
            'Week 2 (8-14)': item.week2,
            'Week 3 (15-21)': item.week3,
            'Week 4 (22-29)': item.week4,
            'Week 5 (30-31)': item.week5,
            'Total Completed': item.totalCompleted,
            'Working Days': item.workingDays,
            'Avg Comp': item.completedAverage,
            'Designation': item.designation
        }));
        const serviceSheet = XLSX.utils.json_to_sheet(serviceSheetData);
        XLSX.utils.book_append_sheet(workbook, serviceSheet, 'Service Team');
    }

    // 2. Call Type Summary Sheet
    if (categoryData.length > 0) {
        const categorySheetData = categoryData.map(item => ({
            'Category': item.categoryName,
            'In Warranty': item.inWarranty,
            'Out Warranty': item.outWarranty,
            'Total': item.total
        }));
        const categorySheet = XLSX.utils.json_to_sheet(categorySheetData);
        XLSX.utils.book_append_sheet(workbook, categorySheet, 'Call Types');
    }

    // 3. Install Team Sheet
    if (installData.length > 0) {
        const installSheetData = installData.map(item => ({
            'Tech Name': item.techName,
            'Allocated Calls': item.allocatedCalls,
            'Week 1 (1-7)': item.week1,
            'Week 2 (8-14)': item.week2,
            'Week 3 (15-21)': item.week3,
            'Week 4 (22-29)': item.week4,
            'Week 5 (30-31)': item.week5,
            'Total Completed': item.totalCompleted,
            'Working Days': item.workingDays,
            'Avg Comp': item.completedAverage,
            'Pending Calls': item.pendingCalls,
            'Designation': item.designation,
            // Materials
            'Stand': item.stand,
            'Stand Fixing': item.standFixing,
            'Copper Pipe': item.copperPipe,
            'Copper Pipe Fixing': item.copperPipeFixing,
            'Cotton Roll': item.cottonRoll,
            'Stabilizer': item.stabilizer,
            'AMC': item.amc,
            'No Install': item.noInstall,
            'Dismantling': item.dismantling
        }));
        const installSheet = XLSX.utils.json_to_sheet(installSheetData);
        XLSX.utils.book_append_sheet(workbook, installSheet, 'Install Team');
    }

    // 4. Call Completion Details Sheet
    if (installSummary) {
        const summarySheetData = [
            { 'S.NO': 1, 'CALL COMPLETION DETAILS': 'INSTALLATION', 'QTY': installSummary.installQty },
            { 'S.NO': 2, 'CALL COMPLETION DETAILS': 'RE-INSTALL', 'QTY': installSummary.reinstallQty },
            { 'S.NO': 3, 'CALL COMPLETION DETAILS': 'DISMANTLING', 'QTY': installSummary.dismantleQty }
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summarySheetData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Call Completion Details');
    }

    // Write file
    XLSX.writeFile(workbook, fileName);
};
