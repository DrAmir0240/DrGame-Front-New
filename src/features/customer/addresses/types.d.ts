export interface Address {
  id: number;
  title: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

export interface AddressFormData {
  title: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default?: boolean;
}

export interface PaginatedAddresses {
  count: number;
  next: string | null;
  previous: string | null;
  results: Address[];
}
