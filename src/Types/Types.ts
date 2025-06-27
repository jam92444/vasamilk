export interface UserViewData {
  username: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  created_by: string;
  user_type: string;
  customer_type: string;
  line_name: string;
  status_text: string;
  price_tag_name: string;
}
export type PriceTag = {
  price_tag_name: string;
  price_tag_value: number | string;
};
