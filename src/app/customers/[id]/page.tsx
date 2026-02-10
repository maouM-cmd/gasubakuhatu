import CustomerForm from "@/components/CustomerForm";
import { getCustomer } from "@/app/customers/actions";
import { notFound } from "next/navigation";

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
    const customer = await getCustomer(parseInt(params.id));

    if (!customer) {
        notFound();
    }

    return (
        <div>
            <div className="page-header">
                <h1>
                    <span>👤</span> 顧客詳細 / 編集
                </h1>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <CustomerForm customer={customer} />
            </div>
        </div>
    );
}
