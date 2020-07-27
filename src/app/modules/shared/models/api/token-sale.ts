import { HttpParams } from "@angular/common/http";
import { UtilsService } from "../../services/utils.service";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateStruct } from "../../formatters/ngb-date-parser-formatters";
import * as moment from 'moment';

export class TokenSale {
  id: number;
  token_sale_params: TokenSaleParams;
  token_sale_behavior: TokenSaleBehavior;
  status: string; // ‘creation in progress’, ‘needs tokens’, ‘token assignment in progress’, ‘ready’, ‘in progress’, ‘completed’
  company_id: number;
  token_sale_creation_txnhash: string;
  finalize_txnhash: string;
  token_transfer_txnhash: string;
  address: string;
  current_price: number;
  current_price_usd: number;
  remaining_tokens: number;
  total_raised: number;
  total_raised_usd: number;
  get tokensSold(): number {
    return this.token_sale_params.num_tokens_for_sale - this.remaining_tokens;
  }
  get setupComplete(): boolean {
    return this.status != 'creation in progress' && this.status != 'needs tokens' && this.status != 'token assignment in progress';
  }
}

export class TokenSaleStatus {
  public static CREATION_IN_PROGRESS = "creation in progress";
  public static NEEDS_TOKENS = "needs tokens";
  public static ASSIGNMENT_IN_PROGRESS = "token assignment in progress";
  public static READY = "ready";
  public static FINALIZE_IN_PROGRESS = "finalize in progress";
  public static FINALIZED = "finalized";
  public static COMPLETED = "completed";
}

export class TokenSaleParamsView {
  amount_to_raise: number;
  num_tokens_for_sale: number;
  start_date: CustomDateStruct;
  end_date: CustomDateStruct;
  token_sale_type: string; //'constant', 'geometric', 'tiered'
  token_price?: number;
  num_rounds?: number;
  token_sale_tiers?: TokenSaleTierView[];
  sale_rounds?: TokenSaleRoundView[];
  toTokenSaleParams() {
    var res: TokenSaleParams = {
      amount_to_raise: this.amount_to_raise,
      num_tokens_for_sale: this.num_tokens_for_sale,
      start_date: UtilsService.toISODateString(this.start_date),
      end_date: UtilsService.toISODateString(this.end_date),
      token_sale_type: this.token_sale_type,
      token_price: this.token_price
    };
    if (this.num_rounds)
      res.num_rounds = this.num_rounds;
    if (this.token_sale_tiers) {
      res.token_sale_tiers = new Array<TokenSaleTier>();
      this.token_sale_tiers.forEach(element => {
        res.token_sale_tiers.push(TokenSaleTierView.toTokenSaleTier(element))
      });
    }
    if (this.sale_rounds) {
      res.sale_rounds = new Array<TokenSaleRound>();
      this.sale_rounds.forEach(element => {
        res.sale_rounds.push(element.toTokenSaleRound())
      });
    }
    return res;
  }
}

export class TokenSaleParams {
  amount_to_raise: number;
  num_tokens_for_sale: number;
  start_date: string;
  end_date: string;
  token_sale_type: string; //'constant', 'geometric', 'tiered'
  token_price?: number;
  //recomMult: number;
  num_rounds?: number;
  token_sale_tiers?: TokenSaleTier[];
  sale_rounds?: TokenSaleRound[];
}

export class TokenSaleTier {
  start_date: string;
  token_allocation: number;
  token_discount: number;
  public static toTokenSaleTierView(source: TokenSaleTier): TokenSaleTierView {
    var res = new TokenSaleTierView;
    const d = moment(source.start_date, "YYYY-MM-DD");
    res.start_date = CustomDateStruct.FromMoment(d);
    res.token_allocation = source.token_allocation;
    res.token_discount = source.token_discount;
    return res;
  }
}

export class TokenSaleTierView {
  start_date: CustomDateStruct;
  token_allocation: number;
  token_discount: number;
  public static toTokenSaleTier(source: TokenSaleTierView): TokenSaleTier {
    var res = new TokenSaleTier;
    res.start_date = UtilsService.toISODateString(source.start_date);
    res.token_allocation = source.token_allocation;
    res.token_discount = source.token_discount;
    return res;
  }
}

export class TokenSaleRound {
  start_date: string;
  end_date: string;
  token_price: number;
  token_supply: number;
}

export class TokenSaleRoundView {
  start_date: CustomDateStruct;
  end_date: CustomDateStruct;
  token_price: number;
  token_supply: number;
  toTokenSaleRound() {
    var res: TokenSaleRound = {
      start_date: UtilsService.toISODateString(this.start_date),
      end_date: UtilsService.toISODateString(this.end_date),
      token_price: this.token_price,
      token_supply: this.token_supply
    };
    return res;
  }
}

export class TokenSaleBehavior {
  estimated_raise: number;
  max_raise: number;
  pricing_points: TokenSalePricePoint[];
}

export class TokenSalePricePoint {
  token_supply: number;
  token_price: number;
}