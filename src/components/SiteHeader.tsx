import { Link } from 'react-router-dom';
import ProfileSwitcher from '@/components/ProfileSwitcher';

interface Props {
  /** Optional right-aligned slot (e.g. editor toolbar actions). */
  right?: React.ReactNode;
}

export default function SiteHeader({ right }: Props) {
  return (
    <header className="no-print border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <circle cx="17.5" cy="17.5" r="3.5" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-lg font-extrabold text-foreground leading-tight">OTsheet.ai</h1>
            <p className="text-[11px] text-muted-foreground leading-none">Printable worksheets for kids</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ProfileSwitcher />
          {right}
        </div>
      </div>
    </header>
  );
}
