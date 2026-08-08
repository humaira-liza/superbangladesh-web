import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LanguageService } from '../../services/language.service';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';
import {
  RewardsService,
  RewardsSummary
} from '../../services/rewards.service';


@Component({
  selector: 'app-rewards',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    BnNumberPipe
  ],

  templateUrl: './rewards.html',

  styleUrls: ['./rewards.css']
})
export class Rewards implements OnInit {

  loading = true;

  loggedIn = false;

  summary: RewardsSummary | null = null;

  // Bronze → Silver → Gold, for the tier ladder UI
  readonly tiers = [
    { key: 'BRONZE', threshold: 0,   icon: '🥉' },
    { key: 'SILVER', threshold: 250, icon: '🥈' },
    { key: 'GOLD',   threshold: 700, icon: '🥇' }
  ];

  constructor(
    public languageService: LanguageService,
    private rewardsService: RewardsService
  ) {}

  ngOnInit(): void {

    this.loggedIn = !!localStorage.getItem('token');

    if (!this.loggedIn) {
      this.loading = false;
      return;
    }

    this.rewardsService.getMyRewards().subscribe({

      next: (res) => {

        this.summary = res && !res.error ? res : null;

        this.loading = false;
      },

      error: () => {

        this.summary = null;

        this.loading = false;
      }
    });
  }

  tierLabel(tier: string | undefined): string {

    const bn = this.languageService.language() === 'bn';

    switch (tier) {
      case 'GOLD':   return bn ? 'গোল্ড' : 'Gold';
      case 'SILVER': return bn ? 'সিলভার' : 'Silver';
      default:       return bn ? 'ব্রোঞ্জ' : 'Bronze';
    }
  }

  // percentage across the WHOLE ladder (0 → gold threshold), used for the
  // progress bar under the tier badges
  progressPercent(): number {

    if (!this.summary) {
      return 0;
    }

    const goldThreshold =
      this.tiers[this.tiers.length - 1].threshold;

    if (this.summary.tier === 'GOLD') {
      return 100;
    }

    return Math.min(
      100,
      Math.round((this.summary.points / goldThreshold) * 100)
    );
  }

  isTierReached(threshold: number): boolean {

    return !!this.summary && this.summary.points >= threshold;
  }
}
