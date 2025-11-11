export const escapeMarkdownV2 = (text: string): string => text.replace(/([.!-#+])/g, '\\$1');
