'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCompany() {
    let company = await prisma.company.findFirst();
    if (!company) {
        company = await prisma.company.create({
            data: {
                name: 'サンプルガス株式会社',
                address: '',
                phone: '',
                invoiceNumber: '',
                taxRate: 0.10,
            }
        });
    }
    return company!;
}

export async function updateCompany(formData: FormData) {
    const company = await getCompany();

    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const invoiceNumber = formData.get('invoiceNumber') as string;
    const taxRate = parseFloat(formData.get('taxRate') as string);

    await prisma.company.update({
        where: { id: company.id },
        data: {
            name,
            address,
            phone,
            invoiceNumber,
            taxRate,
        },
    });

    revalidatePath('/');
    revalidatePath('/settings');
    revalidatePath('/invoices/[id]', 'page');
}
