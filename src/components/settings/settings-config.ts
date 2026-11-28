import { UserRound, Palette, Bell, Users, ShieldCheck, AlertTriangle } from "lucide-react";

export const settingsSections = [
  {
    id: "account",
    label: "My Account",
    description: "Manage your profile information",
    icon: UserRound,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Customize how Orbit looks",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage notification preferences",
    icon: Bell,
  },
  {
    id: "community",
    label: "Community Preferences",
    description: "Manage your community experience",
    icon: Users,
  },
  {
    id: "security",
    label: "Privacy & Security",
    description: "Manage your password and security",
    icon: ShieldCheck,
  },
  {
    id: "management",
    label: "Account Management",
    description: "Deactivate or delete your account",
    icon: AlertTriangle,
  },
] as const;

export type SettingsSection = (typeof settingsSections)[number];
export type SettingsSectionId = SettingsSection["id"];
