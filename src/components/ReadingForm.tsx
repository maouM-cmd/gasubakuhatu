'use client';

import { useState } from 'react';
import { parseMeterImage } from '@/app/readings/ocrAction';
import { createReading } from '@/app/readings/actions';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={pending}>
            {pending ? '保存中...' : '登録する'}
        </button>
    );
}

export default function ReadingForm({
    customer,
    previousReading,
    year,
    month
}: {
    customer: any,
    previousReading: any,
    year: number,
    month: number
}) {
    const [reading, setReading] = useState<number | ''>('');
    const [usage, setUsage] = useState<number | ''>('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleCreateReading = createReading;

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setIsScanning(true);
        setScanError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const result = await parseMeterImage(formData);
            if (result.error) {
                setScanError(result.error);
            } else {
                if (typeof result.reading === 'number') {
                    setReading(result.reading);
                    calculateUsage(result.reading);
                }
            }
        } catch (err) {
            setScanError('読み取り中にエラーが発生しました');
        } finally {
            setIsScanning(false);
        }
    };

    const calculateUsage = (current: number) => {
        const prev = previousReading?.currentReading || 0;
        const items = current - prev;
        setUsage(items > 0 ? parseFloat(items.toFixed(2)) : 0);
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setReading(isNaN(val) ? '' : val);
        if (!isNaN(val)) {
            calculateUsage(val);
        }
    };

    const prevVal = previousReading?.currentReading || 0;

    return (
        <div className="card">
            <div className="card-header">
                <h2>検針入力</h2>
            </div>
            <div className="card-body">
                <div className="mb-lg">
                    <div className="text-sm text-muted">対象顧客</div>
                    <div className="text-xl font-bold">{customer.name} 様</div>
                    <div className="text-sm">{customer.address}</div>
                </div>

                <div className="grid grid-cols-2 gap-md mb-lg p-md bg-slate-50 rounded">
                    <div>
                        <div className="text-xs text-muted">前回検針 ({previousReading?.month || '--'}月)</div>
                        <div className="text-lg font-bold">{prevVal}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted">対象年月</div>
                        <div className="text-lg font-bold">{year}年 {month}月</div>
                    </div>
                </div>

                {/* Camera Input */}
                <div className="mb-xl">
                    <label className="block w-full p-lg border-2 border-dashed border-slate-300 rounded-lg text-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isScanning}
                        />
                        <div className="text-2xl mb-sm">📷</div>
                        <div className="font-bold text-primary">
                            {isScanning ? 'AIが読み取り中...' : 'カメラを起動 / 画像を選択'}
                        </div>
                        <div className="text-xs text-muted mt-xs">
                            Gemini Vision API で自動入力
                        </div>
                    </label>

                    {scanError && (
                        <div className="text-danger text-sm mt-sm text-center">{scanError}</div>
                    )}

                    {previewUrl && (
                        <div className="mt-md text-center">
                            <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '8px' }} />
                        </div>
                    )}
                </div>

                {/* Manual Form */}
                <form action={handleCreateReading}>
                    <input type="hidden" name="customerId" value={customer.id} />
                    <input type="hidden" name="year" value={year} />
                    <input type="hidden" name="month" value={month} />
                    <input type="hidden" name="readAt" value={new Date().toISOString()} />
                    <input type="hidden" name="previousReading" value={prevVal} />

                    <div className="form-group">
                        <label className="form-label" htmlFor="currentReading">今回指針</label>
                        <input
                            id="currentReading"
                            name="currentReading"
                            type="number"
                            step="0.01"
                            required
                            className="form-input text-lg font-bold"
                            value={reading}
                            onChange={handleManualChange}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">使用量 (自動計算)</label>
                        <div className="form-input bg-slate-100 text-lg">
                            {usage !== '' ? `${usage} m³` : '-'}
                        </div>
                        <input type="hidden" name="usage" value={usage} />
                    </div>

                    <div className="flex gap-md mt-xl">
                        <Link href="/readings" className="btn btn-secondary w-full">キャンセル</Link>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
