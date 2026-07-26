export const normalizePhoneNumber = (raw: string): string => {
  const value = (raw || '').trim().replace(/[\s\-().]/g, '');
  if (!value) return '';

  if (value.startsWith('+')) return value;
  if (value.startsWith('00')) return `+${value.slice(2)}`;
  if (value.length === 11 && value.startsWith('0')) return `+91${value.slice(1)}`;
  if (value.length === 10 && /^[6-9]/.test(value)) return `+91${value}`;

  return `+${value.replace(/\D/g, '')}`;
};

export const isValidE164PhoneNumber = (phone: string): boolean => {
  return /^\+[1-9]\d{7,14}$/.test(phone);
};
