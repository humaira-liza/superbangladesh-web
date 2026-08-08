import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface RewardsHistoryRow {
  orderId: number;
  invoiceNumber: string;
  date: string;
  amount: number;
  pointsEarned: number;
}

export interface RewardsSummary {
  points: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  redeemableValue: number;
  pointsToNextTier: number;
  nextTierThreshold: number;
  currentTierFloor: number;
  takaPerPoint: number;
  pointValueTaka: number;
  ordersCompleted: number;
  history: RewardsHistoryRow[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  baseUrl = '/api/rewards';

  constructor(private http: HttpClient) {}

  getMyRewards() {
    const token = localStorage.getItem('token');

    return this.http.get<RewardsSummary>(
      this.baseUrl + '/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
