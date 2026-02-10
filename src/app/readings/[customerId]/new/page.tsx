import ReadingForm from "@/components/ReadingForm";
import { getCustomerWithPreviousReading } from "@/app/readings/actions";
import { notFound } from "next/navigation";

export default async function NewReadingPage({
    params,
    searchParams
}: {
    params: { customerId: string };
    searchParams: { year?: string; month?: string };
}) {
    const customerId = parseInt(params.customerId);
    const now = new Date();
    const year = parseInt(searchParams.year || now.getFullYear().toString());
    const month = parseInt(searchParams.month || (now.getMonth() + 1).toString());

    const { customer, previousReading } = await getCustomerWithPreviousReading(customerId);

    if (!customer) {
        notFound();
    }

    return (
        <div>
            <div className="page-header">
                <h1>
                    <span>📷</span> 検針入力
                </h1>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <ReadingForm
                    customer={customer}
                    previousReading={previousReading}
                    year={year}
                    month={month}
                />
            </div>
        </div>
    );
}
