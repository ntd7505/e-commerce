import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AccountSidebar from './AccountSidebar';

interface AccountPageLayoutProps {
  breadcrumbCurrent: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
  useCustomContent?: boolean;
  headerRight?: React.ReactNode;
}

export default function AccountPageLayout({
  breadcrumbCurrent,
  title,
  description,
  children,
  contentClassName = '',
  useCustomContent = false,
  headerRight,
}: AccountPageLayoutProps) {
  return (
    <div className="bg-gradient-to-b from-primary-soft/40 to-surface min-h-screen py-8">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-muted" />
          <Link to="/account" className="hover:text-primary transition-colors">
            Tài khoản
          </Link>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-text font-medium">{breadcrumbCurrent}</span>
        </nav>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <AccountSidebar />

          {useCustomContent ? (
            <div className={`flex-1 w-full ${contentClassName}`}>
              {children}
            </div>
          ) : (
            <div className="flex-1 w-full bg-surface rounded-2xl shadow-sm shadow-primary/5 border border-primary/10 overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-wrap-balance text-2xl font-bold text-text">{title}</h1>
                  {description && (
                    <p className="text-muted text-sm mt-2">{description}</p>
                  )}
                </div>
                {headerRight && (
                  <div className="shrink-0">
                    {headerRight}
                  </div>
                )}
              </div>
              <div className={`p-6 lg:p-8 ${contentClassName}`}>
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
