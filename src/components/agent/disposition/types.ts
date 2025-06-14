
export interface Disposition {
  id: string;
  name: string;
  category: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface DispositionField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  label: string;
  required: boolean;
  options?: string[]; // for select type
  placeholder?: string;
}

export interface ChatResolution {
  chatId: number;
  dispositionId: string;
  fields: Record<string, string | number>;
  notes: string;
  resolvedBy: string;
  resolvedAt: string;
}
