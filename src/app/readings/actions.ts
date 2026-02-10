'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getReadings(year: number, month: number) {
    return await prisma.meterReading.findMany({
        where: { year, month },
        include: { customer: true },
        orderBy: { customerId: 'asc' },
    });
}

export async function getCustomerWithPreviousReading(customerId: number) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
    });

    const previousReading = await prisma.meterReading.findFirst({
        where: { customerId },
        orderBy: { readAt: 'desc' },
    });

    return { customer, previousReading };
}

export async function createReading(formData: FormData) {
    const customerId = parseInt(formData.get('customerId') as string);
    const currentReading = parseFloat(formData.get('currentReading') as string);
    const year = parseInt(formData.get('year') as string);
    const month = parseInt(formData.get('month') as string);
    const readAt = new Date(formData.get('readAt') as string);

    // Get previous reading to calculate usage
    const previousRecord = await prisma.meterReading.findFirst({
        where: {
            customerId,
            // Ideally check for the previous month, but simply taking the latest before this one works for now
            readAt: { lt: readAt }
        },
        orderBy: { readAt: 'desc' },
    });

    const previousReading = previousRecord ? previousRecord.currentReading : 0;

    // Usage cannot be negative usually, but meter replacement might cause reset. 
    // For MVP, assuming normal increment.
    let usage = currentReading - previousReading;
    if (usage < 0) usage = 0; // Prevent negative usage for now

    await prisma.meterReading.create({
        data: {
            customerId,
            year,
            month,
            currentReading,
            previousReading,
            usage,
            readAt,
        },
    });

    revalidatePath('/readings');
    redirect('/readings');
}
