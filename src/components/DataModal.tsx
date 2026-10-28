/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Data Management Modal (Export, Import, Backup & Recovery)
 * Fulfills DoD item 9: "Có export dữ liệu ra JSON và khôi phục (Import) kiểm thử thành công."
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { Download, Upload, RotateCcw, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({ isOpen, onClose }) => {
  const { exportDataToJson, importDataFromJson, resetToDefaultData } = useLifeOS();
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage({
      type: 'success',
      text: 'Đã xuất file sao lưu JSON thành công!'
    });
  };

  const handleImport = () => {
    if (!importJsonText.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng dán chuỗi JSON hợp lệ.' });
      return;
    }
    const res = importDataFromJson(importJsonText.trim());
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Đã khôi phục dữ liệu Life OS thành công!' });
      setImportJsonText('');
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Dữ liệu JSON không hợp lệ.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn đặt lại dữ liệu về mẫu chuẩn ban đầu không?")) {
      resetToDefaultData();
      setStatusMessage({ type: 'success', text: 'Đã thiết lập lại dữ liệu mẫu thành công.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Quản lý & Sao lưu Dữ liệu Life OS
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' 
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Export */}
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2">
          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            1. Xuất file dữ liệu (Export JSON)
          </h3>
          <p className="text-xs text-stone-500">
            Tải toàn bộ định hướng, mục tiêu, chỉ số KPI, review tuần và nhật ký quyết định về máy.
          </p>
          <button
            onClick={handleDownload}
            className="mt-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Tải file backup JSON</span>
          </button>
        </div>

        {/* Import */}
        <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 space-y-2">
          <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">
            2. Khôi phục dữ liệu (Import JSON)
          </h3>
          <p className="text-xs text-stone-500">
            Tải lên file JSON hoặc dán nội dung văn bản sao lưu vào bên dưới.
          </p>
          
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-xs text-stone-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300"
          />

          <textarea
            rows={3}
            placeholder="Hoặc dán chuỗi JSON vào đây..."
            value={importJsonText}
            onChange={e => setImportJsonText(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
          />

          <button
            onClick={handleImport}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-100 dark:bg-emerald-950/60 rounded-lg flex items-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Xác nhận nạp dữ liệu</span>
          </button>
        </div>

        {/* Reset */}
        <div className="pt-2 flex justify-between items-center text-xs">
          <button
            onClick={handleReset}
            className="text-stone-500 hover:text-rose-600 flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Đặt lại dữ liệu mẫu gốc</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
