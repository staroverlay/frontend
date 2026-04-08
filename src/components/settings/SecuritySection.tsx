import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SectionCard } from './SectionCard';
import { cn, getError } from '../../lib/utils';
import { authService } from '../../services/auth-service';

interface SecuritySectionProps {
  logout: () => void;
}

export function SecuritySection({ logout }: SecuritySectionProps) {
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPassMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    setPassMessage(null);
    setIsChangingPass(true);
    try {
      await authService.changePassword({
        oldPassword: passwords.old,
        newPassword: passwords.new
      });
      setPassMessage({ text: 'Password secured. Initializing logout...', type: 'success' });
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setPassMessage({ text: getError(err, 'Failed to change password'), type: 'error' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <SectionCard
      title="Security"
      subtitle="Manage your password and security settings"
      icon={ShieldCheck}
    >
      <form className="space-y-6" onSubmit={handleChangePassword}>
        <div className="grid grid-cols-1 gap-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={passwords.old}
            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="password"
              label="New Password"
              placeholder="Minimum 8 characters"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              placeholder="Repeat new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
          </div>
        </div>

        {passMessage && (
          <div className={cn(
            "p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in duration-300 flex items-center justify-center gap-2 border",
            passMessage.type === 'success' ? "bg-status-success/10 text-status-success border-status-success/20" : "bg-status-error/10 text-status-error border-status-error/20"
          )}>
            {passMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {passMessage.text}
          </div>
        )}

        <Button
          variant="secondary"
          className="w-full h-12"
          disabled={isChangingPass}
        >
          {isChangingPass ? 'Saving...' : 'Change Password'}
        </Button>
      </form>
    </SectionCard>
  );
}
