'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getCompany() {
    let company = await prisma.company.findFirst();
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'サンプルガス株式会社',
                taxRate: 0.10,
            }
        });
    }
    return company;
}

export async function getInvoices(year: number, month: number) {
    return await prisma.invoice.findMany({
        where: { year, month },
        include: {
            customer: true,
            meterReading: true,
        },
        orderBy: { customerId: 'asc' },
    });
}

export async function getInvoice(id: number) {
    return await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: true,
            meterReading: true,
            payments: true,
        },
    });
}

export async function generateInvoicesForMonth(year: number, month: number) {
    const company = await getCompany();

    // Find all readings for this month that don't have an invoice yet
    const readings = await prisma.meterReading.findMany({
        where: {
            year,
            month,
            invoice: { is: null } // Only those without invoice
        },
        include: {
            customer: true
        }
    });

    if (readings.length === 0) {
        return { count: 0, message: '作成対象の検針データがありません' };
    }

    let count = 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days by default

    for (const reading of readings) {
        const customer = reading.customer;
        if (customer.status !== 'active') continue;

        const baseAmount = customer.basePrice;
        const usageAmount = Math.floor(reading.usage * customer.unitPrice);
        const subtotal = baseAmount + usageAmount;
        const tax = Math.floor(subtotal * company.taxRate);
        const total = subtotal + tax;

        await prisma.invoice.create({
            data: {
                customerId: customer.id,
                meterReadingId: reading.id,
                year,
                month,
                baseAmount,
                usageAmount,
                subtotal,
                tax,
                total,
                dueDate,
                status: 'unpaid',
            },
        });
        count++;
    }

    revalidatePath('/invoices');
    return { count, message: `${count}件の請求書を作成しました` };
}

export async function deleteInvoice(id: number) {
    await prisma.invoice.delete({ where: { id } });
    revalidatePath('/invoices');
}
