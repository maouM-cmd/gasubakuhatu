'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getCustomers(query?: string) {
    if (query) {
        return await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { address: { contains: query } },
                    { phone: { contains: query } },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    return await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function getCustomer(id: number) {
    return await prisma.customer.findUnique({
        where: { id },
    });
}

export async function createCustomer(formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const basePrice = parseFloat(formData.get('basePrice') as string) || 1980;
    const unitPrice = parseFloat(formData.get('unitPrice') as string) || 580;

    await prisma.customer.create({
        data: {
            name,
            address,
            phone,
            basePrice,
            unitPrice,
            status: 'active',
        },
    });

    revalidatePath('/customers');
    redirect('/customers');
}

export async function updateCustomer(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const basePrice = parseFloat(formData.get('basePrice') as string);
    const unitPrice = parseFloat(formData.get('unitPrice') as string);
    const status = formData.get('status') as string;

    await prisma.customer.update({
        where: { id },
        data: {
            name,
            address,
            phone,
            basePrice,
            unitPrice,
            status,
        },
    });

    revalidatePath('/customers');
    revalidatePath(`/customers/${id}`);
    redirect('/customers');
}

export async function deleteCustomer(id: number) {
    await prisma.customer.delete({
        where: { id },
    });
    revalidatePath('/customers');
}
