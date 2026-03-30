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
            className="h-12 rounded-2xl bg-zinc-950/50 border-zinc-800 focus:border-violet-500/50 transition-all text-white placeholder:text-zinc-700"
          />

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-500 mb-0.5">Primary Email</p>
              <p className="text-sm font-bold text-white truncate">{user?.email}</p>
            </div>
            {user?.emailVerified && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>
        </div>

        {(success || error) && (
          <div className={cn(
            "p-4 rounded-2xl text-xs font-bold text-center animate-in zoom-in duration-300 flex items-center justify-center gap-2",
            success ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}>
            {success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {success ? 'Profile updated successfully' : error}
          </div>
        )}

        <Button 
          className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </SectionCard>
  );
}
