'use client';

import { createCustomer, updateCustomer } from '@/app/customers/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton({ isEdit }: { isEdit: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn btn-primary" aria-disabled={pending}>
            {pending ? '保存中...' : (isEdit ? '更新する' : '登録する')}
        </button>
    );
}

export default function CustomerForm({ customer }: { customer?: any }) {
    const isEdit = !!customer;
    const action = isEdit ? updateCustomer.bind(null, customer.id) : createCustomer;

    return (
        <form action={action} className="card">
            <div className="card-header">
                <h2>{isEdit ? '顧客情報の編集' : '新規顧客登録'}</h2>
            </div>
            <div className="card-body">
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">氏名 <span className="text-danger">*</span></label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="form-input"
                            defaultValue={customer?.name}
                            placeholder="例: 山田 太郎"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">電話番号</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="form-input"
                            defaultValue={customer?.phone}
                            placeholder="例: 090-1234-5678"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="address">住所</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className="form-input"
                        defaultValue={customer?.address}
                        placeholder="例: 東京都..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="planName">契約プラン</label>
                        <input
                            id="planName"
                            name="planName"
                            type="text"
                            className="form-input"
                            defaultValue={customer?.planName || '標準プラン'}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="basePrice">基本料金 (円)</label>
                        <input
                            id="basePrice"
                            name="basePrice"
                            type="number"
                            className="form-input"
                            defaultValue={customer?.basePrice || 1980}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="unitPrice">従量単価 (円/m³)</label>
                        <input
                            id="unitPrice"
                            name="unitPrice"
                            type="number"
                            className="form-input"
                            defaultValue={customer?.unitPrice || 580}
                        />
                    </div>
                </div>

                {isEdit && (
                    <div className="form-group">
                        <label className="form-label" htmlFor="status">ステータス</label>
                        <select
                            id="status"
                            name="status"
                            className="form-select"
                            defaultValue={customer?.status}
                        >
                            <option value="active">契約中 (Active)</option>
                            <option value="inactive">解約済 (Inactive)</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end gap-md mt-lg">
                    <a href="/customers" className="btn btn-secondary">キャンセル</a>
                    <SubmitButton isEdit={isEdit} />
                </div>
            </div>
        </form>
    );
}
