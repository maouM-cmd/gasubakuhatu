import { getCompany, updateCompany } from "./actions";

function SubmitButton() {
    return (
        <button type="submit" className="btn btn-primary">
            保存する
        </button>
    );
}

export default async function SettingsPage() {
    const company = await getCompany();

    return (
        <div>
            <div className="page-header">
                <h1>
                    <span>⚙️</span> 設定
                </h1>
                <p>会社情報や消費税率の設定を行います。</p>
            </div>

            <div className="card max-w-2xl">
                <div className="card-header">
                    <h2>会社情報</h2>
                </div>
                <div className="card-body">
                    <form action={updateCompany}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">会社名</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-input"
                                defaultValue={company.name}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="address">住所</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                className="form-input"
                                defaultValue={company.address}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">電話番号</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                className="form-input"
                                defaultValue={company.phone}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="invoiceNumber">登録番号 (T + 13桁)</label>
                            <input
                                id="invoiceNumber"
                                name="invoiceNumber"
                                type="text"
                                className="form-input"
                                defaultValue={company.invoiceNumber}
                                placeholder="T1234567890123"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="taxRate">消費税率 (0.10 &gt; 10%)</label>
                            <input
                                id="taxRate"
                                name="taxRate"
                                type="number"
                                step="0.01"
                                className="form-input"
                                defaultValue={company.taxRate}
                            />
                            <p className="form-hint">※特に理由がなければ変更しないでください</p>
                        </div>

                        <div className="text-right mt-xl">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
