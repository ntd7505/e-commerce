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
    <div className="bg-[#f5f7fb] min-h-screen py-8">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link to="/account" className="hover:text-blue-600 transition-colors">
            Tài khoản
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{breadcrumbCurrent}</span>
        </nav>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <AccountSidebar />

          {useCustomContent ? (
            <div className={`flex-1 w-full ${contentClassName}`}>
              {children}
            </div>
          ) : (
            <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  {description && (
                    <p className="text-gray-500 text-sm mt-2">{description}</p>
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
