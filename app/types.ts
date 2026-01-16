
export type InstallDataEntry = {
    techName: string;
    designation: string;
    // Completion Details
    allocatedCalls: number;
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
    totalCompleted: number;
    workingDays: number;
    completedAverage: number;
    pendingCalls: number;
    // Material Details
    stand: number;
    standFixing: number;
    copperPipe: number;
    copperPipeFixing: number;
    cottonRoll: number;
    stabilizer: number;
    amc: number;
    noInstall: number;
    dismantling: number;
}

export type ServiceDataEntry = {
    techName: string;
    designation: string;
    allocatedCalls: number;
    week1: number;
    week2: number;
    week3: number;
    week4: number;
    week5: number;
    totalCompleted: number;
    workingDays: number;
    completedAverage: number;
    attendedAverage: number;
}

export type CategoryData = {
    categoryName: string;
    inWarranty: number;
    outWarranty: number;
    total: number;
}

export type InstallSummary = {
    installQty: number;
    reinstallQty: number;
    dismantleQty: number;
}

export type MonthlySummaryData = {
    install: number;
    reinstall: number;
    dismantling: number;
}
