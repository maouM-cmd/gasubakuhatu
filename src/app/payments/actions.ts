'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getUnpaidInvoices() {
    return await prisma.invoice.findMany({
        where: { status: { in: ['unpaid', 'overdue'] } },
        include: {
            customer: true,
            meterReading: true,
        },
        orderBy: { issuedAt: 'desc' },
    });
}

export async function getPayments() {
    return await prisma.payment.findMany({
        include: {
            invoice: {
                include: { customer: true }
            }
        },
        orderBy: { paidAt: 'desc' },
        take: 50,
    });
}

export async function registerPayment(formData: FormData) {
    const invoiceId = parseInt(formData.get('invoiceId') as string);
    const amount = parseFloat(formData.get('amount') as string);
    const method = formData.get('method') as string;
    const note = formData.get('note') as string;
    const paidAt = new Date(formData.get('paidAt') as string || new Date());

    // Create payment record
    await prisma.payment.create({
        data: {
            invoiceId,
            amount,
            method,
            note,
            paidAt,
        },
    });

    // Update invoice status to 'paid'
    await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'paid' },
    });

    revalidatePath('/payments');
    revalidatePath('/invoices');
    revalidatePath(`/invoices/${invoiceId}`);
    redirect('/payments');
}
