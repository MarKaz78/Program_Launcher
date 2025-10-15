import type React from 'react';

export type LocalizedString = {
  pl: string;
  en: string;
  es: string;
};

export interface Program {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  url: string;
  icon: string;
  created_at: string;
  is_new: boolean;
}