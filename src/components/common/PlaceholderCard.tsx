/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reusable Clearly Labelled Placeholder Card
 * Enforces:
 * - Professional analytical clarity
 * - Explicit operational labels
 * - Empty state guidance without fake mock metrics
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderCardProps {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  statusText?: string;
  children?: React.ReactNode;
}

export const PlaceholderCard: React.FC<PlaceholderCardProps> = ({
  title,
  category,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  statusText = 'Sẵn sàng ghi nhận',
  children
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {category}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {title}
              </h3>
            </div>
          </div>

          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            {statusText}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          {description}
        </p>

        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline flex items-center gap-1"
          >
            <span>{actionLabel}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
