import React from 'react';
import { User, Mail, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SectionCard } from './SectionCard';
import { cn } from '../../lib/utils';
import { type User as UserType } from '../../lib/types';

interface ProfileSectionProps {
  user: UserType | null;
  displayName: string;
  setDisplayName: (val: string) => void;
  isSaving: boolean;
  success: boolean;
  error: string | null;
  onUpdate: (e: React.FormEvent) => Promise<void>;
}

export function ProfileSection({
  user,
  displayName,
  setDisplayName,
  isSaving,
  success,
  error,
  onUpdate,
}: ProfileSectionProps) {
  return (
    <SectionCard
      title="Profile Settings"
      subtitle="Manage your public identity and personal details"
      icon={User}
    >
      <form className="space-y-6" onSubmit={onUpdate}>
        <div className="space-y-4">
          <Input
            label="Display Name"
            placeholder="Your public name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="h-12"
          />

          <div className="p-4 bg-surface-card border border-border-subtle rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-content-dimmed mb-0.5">Primary Email</p>
              <p className="text-sm font-bold text-content-primary truncate">{user?.email}</p>
            </div>
            {user?.emailVerified && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-success/10 border border-status-success/20 text-status-success text-[10px] font-black uppercase tracking-widest">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>
        </div>

        {(success || error) && (
          <div className={cn(
            "p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in duration-300 flex items-center justify-center gap-2 border",
            success ? "bg-status-success/10 text-status-success border-status-success/20" : "bg-status-error/10 text-status-error border-status-error/20"
          )}>
            {success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {success ? 'Profile updated successfully' : error}
          </div>
        )}

        <Button
          className="w-full h-12 flex items-center gap-2"
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </SectionCard>
  );
}
