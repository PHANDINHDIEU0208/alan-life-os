/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Module 2: Strategy & Identity
 * Features:
 * - Principles (5 Foundational & Custom)
 * - Identity Architecture (Aspiring, Anchor, Anti-identity)
 * - Purpose and North Star
 * - Life Dimensions & Strategic Themes
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { 
  Shield, 
  UserCheck, 
  Compass, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  AlertTriangle,
  Briefcase,
  Coins,
  Activity,
  Users,
  BookOpen
} from 'lucide-react';
import { DimensionKey, Principle } from '../types/lifeos';

export const StrategyIdentity: React.FC = () => {
  const { 
    data, 
    updateNorthStar, 
    addPrinciple, 
    updatePrinciple, 
    deletePrinciple,
    addIdentityAnchor,
    deleteIdentityAnchor,
    updateDimension
  } = useLifeOS();

  // North Star edit mode
  const [editingNorthStar, setEditingNorthStar] = useState(false);
  const [nsPurpose, setNsPurpose] = useState(data.northStar.purpose);
  const [nsVision, setNsVision] = useState(data.northStar.vision);
  const [nsMotto, setNsMotto] = useState(data.northStar.coreMotto);

  // New Principle form
  const [isAddingPrinciple, setIsAddingPrinciple] = useState(false);
  const [newPTitle, setNewPTitle] = useState('');
  const [newPDesc, setNewPDesc] = useState('');
  const [newPCat, setNewPCat] = useState('Nhận thức');

  // Edit principle
  const [editingPId, setEditingPId] = useState<string | null>(null);
  const [editPTitle, setEditPTitle] = useState('');
  const [editPDesc, setEditPDesc] = useState('');

  // New Identity Anchor form
  const [isAddingAnchor, setIsAddingAnchor] = useState(false);
  const [newAnchorStatement, setNewAnchorStatement] = useState('');
  const [newAnchorType, setNewAnchorType] = useState<'aspiring' | 'anchor' | 'anti_identity'>('aspiring');

  const handleSaveNorthStar = () => {
    updateNorthStar({
      purpose: nsPurpose,
      vision: nsVision,
      coreMotto: nsMotto,
      lastUpdated: new Date().toISOString()
    });
    setEditingNorthStar(false);
  };

  const handleCreatePrinciple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPTitle.trim()) return;
    addPrinciple({
      title: newPTitle.trim(),
      description: newPDesc.trim(),
      category: newPCat,
      isCore: false
    });
    setNewPTitle('');
    setNewPDesc('');
    setIsAddingPrinciple(false);
  };

  const handleStartEditPrinciple = (p: Principle) => {
    setEditingPId(p.id);
    setEditPTitle(p.title);
    setEditPDesc(p.description);
  };

  const handleSaveEditPrinciple = (id: string) => {
    updatePrinciple(id, {
      title: editPTitle,
      description: editPDesc
    });
    setEditingPId(null);
  };

  const handleCreateAnchor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnchorStatement.trim()) return;
    addIdentityAnchor({
      statement: newAnchorStatement.trim(),
      type: newAnchorType
    });
    setNewAnchorStatement('');
    setIsAddingAnchor(false);
  };

  const renderDimensionIcon = (dimId: DimensionKey) => {
    switch (dimId) {
      case 'career': return <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'wealth': return <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'health': return <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case 'relationships': return <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
      case 'intelligence': return <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case 'spirituality': return <Compass className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header & Overview */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
          <Shield className="h-4 w-4" />
          <span>Module 2: Định hướng & Căn tính cá nhân</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          Chiến lược & Bản sắc (Strategy & Identity)
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Nền tảng định hình mọi quyết định: Từ nguyên tắc đạo đức cốt lõi đến cấu trúc căn tính và bản đồ chiến lược cuộc đời.
        </p>
      </div>

      {/* 2. Purpose & North Star Editor */}
      <section className="rounded-xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Tuyên ngôn Sứ mệnh & Kim chỉ nam (North Star)
            </h2>
          </div>
          <button
            onClick={() => setEditingNorthStar(!editingNorthStar)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            {editingNorthStar ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span>Hủy</span>
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </>
            )}
          </button>
        </div>

        {editingNorthStar ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Khẩu hiệu kim chỉ nam (Core Motto)
              </label>
              <input
                type="text"
                value={nsMotto}
                onChange={e => setNsMotto(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Mục đích tối hậu (Purpose)
              </label>
              <textarea
                rows={3}
                value={nsPurpose}
                onChange={e => setNsPurpose(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Tầm nhìn dài hạn 5–10 năm (Vision)
              </label>
              <textarea
                rows={2}
                value={nsVision}
                onChange={e => setNsVision(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveNorthStar}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                Khẩu hiệu (Motto)
              </span>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100">
                "{data.northStar.coreMotto}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                  Mục đích (Purpose)
                </span>
                <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {data.northStar.purpose}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                  Tầm nhìn (Vision)
                </span>
                <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {data.northStar.vision}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Principles (5 Foundational & Custom) */}
      <section className="rounded-xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Nguyên tắc bất biến (Principles)
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              5 nguyên tắc khởi tạo: Truth, Integrity, Growth, Contribution, Stewardship hoặc bản tùy chỉnh của bạn.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPrinciple(!isAddingPrinciple)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 rounded-lg flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm nguyên tắc</span>
          </button>
        </div>

        {isAddingPrinciple && (
          <form onSubmit={handleCreatePrinciple} className="mt-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100">Thêm nguyên tắc mới</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tên nguyên tắc (ví dụ: Chân thực)"
                value={newPTitle}
                onChange={e => setNewPTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                required
              />
              <select
                value={newPCat}
                onChange={e => setNewPCat(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              >
                <option value="Nhận thức">Nhận thức</option>
                <option value="Đạo đức">Đạo đức</option>
                <option value="Năng lực">Năng lực</option>
                <option value="Xã hội">Xã hội</option>
                <option value="Vận hành">Vận hành</option>
              </select>
            </div>
            <textarea
              placeholder="Mô tả ý nghĩa và cách nguyên tắc này chi phối hành vi..."
              rows={2}
              value={newPDesc}
              onChange={e => setNewPDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingPrinciple(false)}
                className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400 hover:underline"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
              >
                Thêm nguyên tắc
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.principles.map(principle => {
            const isEditing = editingPId === principle.id;
            return (
              <div 
                key={principle.id} 
                className="p-4 rounded-lg border border-stone-200/70 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/30 flex flex-col justify-between"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editPTitle}
                      onChange={e => setEditPTitle(e.target.value)}
                      className="w-full px-2 py-1 text-sm font-semibold rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <textarea
                      rows={2}
                      value={editPDesc}
                      onChange={e => setEditPDesc(e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingPId(null)}
                        className="px-2 py-1 text-xs text-stone-500 hover:underline"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveEditPrinciple(principle.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 rounded"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          {principle.category}
                        </span>
                        <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {principle.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditPrinciple(principle)}
                          className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                          title="Sửa nguyên tắc"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {!principle.isCore && (
                          <button
                            onClick={() => deletePrinciple(principle.id)}
                            className="p-1 text-stone-400 hover:text-rose-600"
                            title="Xóa nguyên tắc"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Identity Architecture */}
      <section className="rounded-xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Kiến trúc Căn tính (Identity Architecture)
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Xác định rõ: Con người muốn trở thành (Aspiring), Giá trị neo (Anchor), và Cạm bẫy bản sắc cần tránh (Anti-identity).
            </p>
          </div>

          <button
            onClick={() => setIsAddingAnchor(!isAddingAnchor)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 rounded-lg flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm tuyên ngôn căn tính</span>
          </button>
        </div>

        {isAddingAnchor && (
          <form onSubmit={handleCreateAnchor} className="mt-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="anchorType"
                  value="aspiring"
                  checked={newAnchorType === 'aspiring'}
                  onChange={() => setNewAnchorType('aspiring')}
                  className="accent-emerald-700"
                />
                <span>Bản sắc hướng tới (Aspiring)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="anchorType"
                  value="anchor"
                  checked={newAnchorType === 'anchor'}
                  onChange={() => setNewAnchorType('anchor')}
                  className="accent-emerald-700"
                />
                <span>Giá trị neo hiện tại (Anchor)</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="anchorType"
                  value="anti_identity"
                  checked={newAnchorType === 'anti_identity'}
                  onChange={() => setNewAnchorType('anti_identity')}
                  className="accent-rose-700"
                />
                <span className="text-rose-700 dark:text-rose-400 font-semibold">Phản bản sắc (Anti-identity)</span>
              </label>
            </div>

            <textarea
              placeholder="Tuyên ngôn căn tính (ví dụ: 'Tôi là người thiết kế hệ thống suy nghĩ từ nguyên lý đầu tiên...')"
              rows={2}
              value={newAnchorStatement}
              onChange={e => setNewAnchorStatement(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingAnchor(false)}
                className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400 hover:underline"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
              >
                Lưu căn tính
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Aspiring */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-200 dark:border-stone-800">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Bản sắc hướng tới (Aspiring)</span>
            </div>
            {data.identityAnchors.filter(a => a.type === 'aspiring').map(anchor => (
              <div key={anchor.id} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900 text-xs text-stone-800 dark:text-stone-200 flex items-start justify-between gap-2">
                <span>{anchor.statement}</span>
                <button onClick={() => deleteIdentityAnchor(anchor.id)} className="text-stone-400 hover:text-rose-600 shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Anchor */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-400 pb-2 border-b border-stone-200 dark:border-stone-800">
              <Shield className="h-3.5 w-3.5" />
              <span>Giá trị neo giữ (Anchor)</span>
            </div>
            {data.identityAnchors.filter(a => a.type === 'anchor').map(anchor => (
              <div key={anchor.id} className="p-3 rounded-lg bg-sky-50/50 border border-sky-100 dark:bg-sky-950/20 dark:border-sky-900 text-xs text-stone-800 dark:text-stone-200 flex items-start justify-between gap-2">
                <span>{anchor.statement}</span>
                <button onClick={() => deleteIdentityAnchor(anchor.id)} className="text-stone-400 hover:text-rose-600 shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Anti-identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-400 pb-2 border-b border-stone-200 dark:border-stone-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Phản bản sắc (Anti-Identity)</span>
            </div>
            {data.identityAnchors.filter(a => a.type === 'anti_identity').map(anchor => (
              <div key={anchor.id} className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900 text-xs text-stone-800 dark:text-stone-200 flex items-start justify-between gap-2">
                <span>"{anchor.statement}"</span>
                <button onClick={() => deleteIdentityAnchor(anchor.id)} className="text-stone-400 hover:text-rose-600 shrink-0">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. 6 Life Dimensions */}
      <section className="rounded-xl border border-stone-200/80 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-xs">
        <div className="pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              6 Khía cạnh Cuộc sống (Life Dimensions)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Đánh giá mức độ hài lòng hiện tại (1-10) và mục tiêu để phân bổ trọng tâm hợp lý.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.dimensions.map(dim => {
            const linkedGoalsCount = data.goals.filter(g => g.dimensionId === dim.id).length;
            return (
              <div 
                key={dim.id}
                className="p-4 rounded-lg border border-stone-200/70 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-800/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderDimensionIcon(dim.id)}
                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {dim.nameVi}
                      </h3>
                    </div>
                    <span className="text-xs capitalize font-medium text-stone-500 bg-stone-200/60 dark:bg-stone-700/60 px-2 py-0.5 rounded">
                      {dim.focusWeight}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
                    {dim.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-700/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-stone-500">Mức độ hài lòng:</span>
                    <span className="font-mono font-bold tabular-nums">
                      {dim.currentRating} / 10 <span className="text-stone-400 font-normal">→ {dim.targetRating}</span>
                    </span>
                  </div>

                  {/* Rating range input */}
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dim.currentRating}
                    onChange={e => updateDimension(dim.id, { currentRating: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-700 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
                  />

                  <div className="mt-2 text-xs text-stone-400 flex justify-between">
                    <span>{linkedGoalsCount} mục tiêu liên kết</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
