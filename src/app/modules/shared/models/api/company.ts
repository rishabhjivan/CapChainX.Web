import { Token } from './token';

export class Company {
  id: number;
  name: string;
  website: string;
  country: string;
  incorporation_date: string;
  corporate_wallet_public_address: string;
  token: Token;
  token_sale_id: number;
}
