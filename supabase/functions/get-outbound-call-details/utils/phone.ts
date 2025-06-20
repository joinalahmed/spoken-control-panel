
// Function to normalize phone numbers for comparison
export const normalizePhoneNumber = (phone: string): string => {
  // Remove all spaces, dashes, parentheses, and other non-digit characters except +
  return phone.replace(/[\s\-\(\)\.]/g, '');
};
