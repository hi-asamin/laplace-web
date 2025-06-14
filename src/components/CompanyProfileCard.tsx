'use client';

import { ExternalLink, Building2, Globe, Tag } from 'lucide-react';
import Image from 'next/image';

interface CompanyProfileData {
  name: string;
  logoUrl?: string;
  website?: string;
  description: string;
  industry: string;
  sector?: string;
  employees?: number;
  founded?: string;
  headquarters?: string;
  marketCap?: string;
  ceo?: string;
  address?: string;
  phone?: string;
}

interface CompanyProfileCardProps {
  companyData: CompanyProfileData;
  className?: string;
}

export default function CompanyProfileCard({
  companyData,
  className = '',
}: CompanyProfileCardProps) {
  const handleWebsiteClick = () => {
    if (companyData.website) {
      window.open(companyData.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`bg-[var(--color-surface)] rounded-2xl p-6 shadow-lg dark:bg-[var(--color-surface-2)] dark:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)]">
          企業プロフィール (Company Profile)
        </h3>
        <Building2 className="w-5 h-5 text-[var(--color-lp-mint)]" />
      </div>

      {/* 企業ロゴと基本情報 */}
      <div className="flex items-start space-x-4 mb-6">
        {companyData.logoUrl && (
          <div className="flex-shrink-0">
            <Image
              src={companyData.logoUrl}
              alt={`${companyData.name} logo`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-contain bg-white dark:bg-[var(--color-surface-3)] p-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-xl font-bold text-[var(--color-lp-navy)] dark:text-[var(--color-text-primary)] mb-2">
            {companyData.name}
          </h4>
          {companyData.website && (
            <button
              onClick={handleWebsiteClick}
              className="flex items-center text-[var(--color-lp-mint)] hover:text-[var(--color-lp-mint)]/80 transition-colors text-sm mb-2"
            >
              <Globe className="w-4 h-4 mr-1" />
              公式サイト
              <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          )}
          {companyData.marketCap && (
            <div className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)]">
              時価総額: {companyData.marketCap}
            </div>
          )}
        </div>
      </div>

      {/* 事業内容 */}
      <div className="mb-6">
        <h5 className="text-sm font-medium text-[var(--color-gray-700)] dark:text-[var(--color-text-secondary)] mb-3">
          事業内容
        </h5>
        <p className="text-sm text-[var(--color-gray-600)] dark:text-[var(--color-text-muted)] leading-relaxed">
          {companyData.description}
        </p>
      </div>

      {/* 業種・セクター */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-[var(--color-lp-mint)]/10 dark:bg-[var(--color-lp-mint)]/15 px-3 py-1 rounded-full">
            <Tag className="w-3 h-3 text-[var(--color-lp-mint)] mr-1" />
            <span className="text-xs font-medium text-[var(--color-lp-mint)]">
              {companyData.industry}
            </span>
          </div>
          {companyData.sector && (
            <div className="flex items-center bg-[var(--color-lp-blue)]/10 dark:bg-[var(--color-lp-blue)]/15 px-3 py-1 rounded-full">
              <Tag className="w-3 h-3 text-[var(--color-lp-blue)] mr-1" />
              <span className="text-xs font-medium text-[var(--color-lp-blue)]">
                {companyData.sector}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {companyData.employees && (
          <div>
            <div className="text-[var(--color-gray-400)] mb-1">従業員数</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.employees.toLocaleString()}人
            </div>
          </div>
        )}
        {companyData.founded && (
          <div>
            <div className="text-[var(--color-gray-400)] mb-1">設立年</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.founded}年
            </div>
          </div>
        )}
        {companyData.ceo && (
          <div className="col-span-2">
            <div className="text-[var(--color-gray-400)] mb-1">CEO</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.ceo}
            </div>
          </div>
        )}
        {companyData.headquarters && (
          <div className="col-span-2">
            <div className="text-[var(--color-gray-400)] mb-1">本社所在地</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.headquarters}
            </div>
          </div>
        )}
        {companyData.address && !companyData.headquarters && (
          <div className="col-span-2">
            <div className="text-[var(--color-gray-400)] mb-1">住所</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.address}
            </div>
          </div>
        )}
        {companyData.phone && (
          <div className="col-span-2">
            <div className="text-[var(--color-gray-400)] mb-1">電話番号</div>
            <div className="font-medium text-[var(--color-gray-900)] dark:text-[var(--color-text-primary)]">
              {companyData.phone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
