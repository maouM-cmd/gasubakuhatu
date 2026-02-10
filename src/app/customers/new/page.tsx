import CustomerForm from "@/components/CustomerForm";

export default function NewCustomerPage() {
    return (
        <div>
            <div className="page-header">
                <h1>
                    <span>👤</span> 新規顧客登録
                </h1>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <CustomerForm />
            </div>
        </div>
    );
}
