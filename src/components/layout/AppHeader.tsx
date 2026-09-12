"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Search, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/forms/Input";
import { useState } from "react";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useState(() => {
    setMounted(true);
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 backdrop-blur px-6">
      {/* Right side - Menu button and page title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-2 lg:flex">
          <Search className="h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="بحث..."
            className="w-64"
          />
        </div>
      </div>

      {/* Left side - Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile search */}
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="بحث">
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="تبديل السمة"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="الإشعارات">
          <span className="relative">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-white">
              2
            </span>
          </span>
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-2 border-r border-border pr-3">
          <Avatar fallback="أ" size="sm" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text">أحمد محمد</p>
            <p className="text-xs text-text-muted">مدير النظام</p>
          </div>
        </div>
      </div>
    </header>
  );
}
