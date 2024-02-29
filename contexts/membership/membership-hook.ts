import IMembership from '@/services/memberships/membership';

export interface MembershipHook {
  membership: IMembership | null;
}
