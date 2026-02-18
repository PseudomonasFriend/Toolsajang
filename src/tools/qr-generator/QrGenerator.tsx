'use client';

import { useState, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RotateCcw, Download } from 'lucide-react';

const DEFAULT_SIZE = 200;

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(DEFAULT_SIZE);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleReset = useCallback(() => {
    setText('');
    setSize(DEFAULT_SIZE);
  }, []);

  const handleDownload = useCallback(() => {
    const container = svgRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = png;
      a.download = 'qrcode.png';
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [size]);

  const hasContent = text.trim().length > 0;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            URL 또는 텍스트 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="https://example.com 또는 입력할 내용"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="URL 또는 텍스트 입력"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            QR 크기 (px)
          </label>
          <input
            type="number"
            min={100}
            max={400}
            step={20}
            value={size}
            onChange={(e) => setSize(Math.min(400, Math.max(100, Number(e.target.value) || 200)))}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="QR 크기"
          />
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="초기화"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {hasContent && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">📱 QR코드</h3>
          <div className="flex flex-col items-center gap-4">
            <div ref={svgRef} className="rounded-lg border border-gray-200 bg-white p-3">
              <QRCodeSVG value={text.trim()} size={size} level="M" />
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              aria-label="PNG 다운로드"
            >
              <Download className="h-4 w-4" />
              PNG 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
