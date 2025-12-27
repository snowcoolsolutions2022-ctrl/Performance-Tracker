const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Create Technicians
    const technicians = [
        { name: 'EDAMALIYAN', designation: 'INSTALL TEAM' },
        { name: 'SUDHAN', designation: 'INSTALL TEAM' },
        { name: 'JERIN', designation: 'SERVICE TEAM' },
        { name: 'GOPINATH', designation: 'SERVICE TEAM' },
        { name: 'VISWAJITH', designation: 'SERVICE TEAM' },
        { name: 'SIVA', designation: 'MULTI' },
    ];

    for (const tech of technicians) {
        // Determine designation enum or string based on schema provided earlier
        // Schema was: designation String
        await prisma.technician.upsert({
            where: { id: 0 }, // This is a bit hacky for an auto-increment ID if we don't know it. 
            // Better to findFirst and then create if not exists, or just createMany if we wipe first.
            // But for safety let's use the find-first logic.
            update: {},
            create: tech,
        }).catch(async (e: any) => {
            // Fallback logic
            const existing = await prisma.technician.findFirst({ where: { name: tech.name } });
            if (!existing) {
                await prisma.technician.create({ data: tech });
            }
        });
    }

    // 2. Insert Sample Report for SUDHAN (Install) - OCT 2025
    const sudhan = await prisma.technician.findFirst({ where: { name: 'SUDHAN' } });
    if (sudhan) {
        // Check if report exists to avoid duplicates on re-run
        const existingReport = await prisma.monthlyReport.findFirst({
            where: {
                technicianId: sudhan.id,
                month: 'October',
                year: 2025
            }
        });

        if (!existingReport) {
            const report = await prisma.monthlyReport.create({
                data: {
                    technicianId: sudhan.id,
                    month: 'October',
                    year: 2025,
                    allocatedCalls: 19,
                    week1: 13,
                    week2: 5,
                    week3: 0,
                    week4: 0,
                    week5: 0,
                    totalCompleted: 18,
                    workingDays: 9,
                    completedAverage: 2.0,
                    attendedAverage: 2.1,
                    completedConversion: 5.0,
                    pendingCalls: 1.0,
                    installDetail: {
                        create: {
                            stand: 3,
                            standFixing: 4,
                            copperPipe: 4.25,
                            cottonRoll: 13,
                            stabilizer: 1,
                            amcTarget: 5,
                            amcAchieved: 0,
                            installCount: 113,
                        }
                    }
                }
            });
            console.log(`Created report for Sudhan: ${report.id}`);
        }
    }

    // 3. Insert Sample Report for JERIN (Service) - DEC 2025
    const jerin = await prisma.technician.findFirst({ where: { name: 'JERIN' } });
    if (jerin) {
        const existingReport = await prisma.monthlyReport.findFirst({
            where: {
                technicianId: jerin.id,
                month: 'December',
                year: 2025
            }
        });

        if (!existingReport) {
            const report = await prisma.monthlyReport.create({
                data: {
                    technicianId: jerin.id,
                    month: 'December',
                    year: 2025,
                    allocatedCalls: 103,
                    week1: 15,
                    week2: 44,
                    week3: 34,
                    totalCompleted: 93,
                    workingDays: 13,
                    completedAverage: 7.2,
                    attendedAverage: 7.9,
                    completedConversion: 7.2,
                    pendingCalls: 10.0,
                    serviceCategories: {
                        create: [
                            { categoryName: 'HOOPERWASH', inWarranty: 0, outWarranty: 1, total: 1 },
                            { categoryName: 'GAS LEAK', inWarranty: 6, outWarranty: 3, total: 9 },
                            { categoryName: 'SERVICE/BRK', inWarranty: 263, outWarranty: 38, total: 301 }
                        ]
                    }
                }
            });
            console.log(`Created report for Jerin: ${report.id}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e: any) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
