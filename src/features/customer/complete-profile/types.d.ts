export interface CompleteProfileFormData {
  first_name: string;
  last_name: string;
  profile_pic?: File | string | null;
  title: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
}
