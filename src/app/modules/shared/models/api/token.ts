import { Document } from './document';

export class Token {
  id: number;
  name: string;
  ticker: string;
  equity_percentage_to_tokenize: number;
  total_supply: number;
  status: string;
  stripe_token_id: string;
  token_creation_txnhash: string;
  token_assignment_txnhash: string;
  address: string;
  board_of_directors_agreement: Document;
  articles_of_incorporation: Document;
  corporate_by_laws: Document;
}
