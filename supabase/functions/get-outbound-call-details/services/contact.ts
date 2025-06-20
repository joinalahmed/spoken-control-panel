
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { normalizePhoneNumber } from '../utils/phone.ts';

export const findContactByPhone = async (
  supabase: SupabaseClient, 
  phoneNumber: string
) => {
  console.log(`Looking up outbound call details for phone: ${phoneNumber}`);
  
  const normalizedInputPhone = normalizePhoneNumber(phoneNumber);
  console.log(`Normalized input phone: ${normalizedInputPhone}`);

  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*');

  if (contactsError) {
    console.log('Error fetching contacts:', contactsError);
    throw new Error('Error fetching contacts');
  }

  const contact = contacts?.find(c => 
    c.phone && normalizePhoneNumber(c.phone) === normalizedInputPhone
  );

  if (!contact) {
    console.log('Contact not found for normalized phone:', normalizedInputPhone);
    throw new Error('Contact not found');
  }

  console.log(`Found contact: ${contact.name}`);
  return contact;
};
