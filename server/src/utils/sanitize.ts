/**
 * Escapes regex special characters to prevent Regular Expression Denial of Service (ReDoS)
 * and Mongo query injection vulnerabilities.
 */
export const escapeRegex = (str?: string): string => {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
