/**
 * Removes Vietnamese accents from a string and converts to lowercase/kebab-case for slugs
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export const generateSlug = (name) => {
  if (!name) return '';
  return removeAccents(name)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};
