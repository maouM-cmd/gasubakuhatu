'use server';

import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function parseMeterImage(formData: FormData) {
    const file = formData.get('image') as File;

    if (!file) {
        return { error: '画像がありません' };
    }

    if (!genAI) {
        console.warn('GEMINI_API_KEY is not set. Returning mock data.');
        // Mock response for development without API key
        return {
            reading: 123.4,
            confidence: 'low',
            type: 'mock',
            note: 'APIキー未設定のためモック値を返しました'
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const prompt = `
      あなたはガスメーターの数値を読み取る専門家です。
      以下の画像にはプロパンガスのメーターが写っています。
      メーターの表示値（指針）を読み取ってください。

      【注意事項】
      - アナログ式（回転ダイヤル）の場合：各桁のダイヤル位置を読み取り、数値を返す
      - デジタル式（液晶/7セグメント）の場合：表示されている数字をそのまま読み取る
      - 小数点がある場合は小数点以下も含めて返す
      - 単位（m³）は不要、数値のみを返す

      【出力フォーマット】
      JSONのみを返してください:
      {"reading": 数値, "type": "analog" or "digital", "confidence": "high/medium/low"}
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Simple JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            return { error: 'AIからの応答を解析できませんでした', raw: text };
        }

    } catch (error) {
        console.error('OCR Error:', error);
        return { error: '画像の読み取りに失敗しました' };
    }
}
