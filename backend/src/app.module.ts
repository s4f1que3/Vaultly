import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { CardsModule } from '../cards/cards.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
import { GoalsModule } from '../goals/goals.module';
import { SettingsModule } from '../settings/settings.module';
import { CategoriesModule } from '../categories/categories.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { IntelligenceModule } from '../intelligence/intelligence.module';
import { SummariesModule } from '../summaries/summaries.module';
import { SavingsPotsModule } from '../savings-pots/savings-pots.module';
import { GeneralLimiter } from '../rate-limit/general.limiter';
import { BankAccountModule } from '../bank_accounts/bank.module';
import { EmailModule } from '../emailing/email.module';

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    TransactionsModule,
    CardsModule,
    BudgetsModule,
    GoalsModule,
    SettingsModule,
    SubscriptionsModule,
    IntelligenceModule,
    SummariesModule,
    BankAccountModule,
    SavingsPotsModule,
    EmailModule,
  ],
  providers: [
    { 
      provide: APP_GUARD, 
      useClass: GeneralLimiter
    },
    { 
      provide: APP_FILTER, 
      useClass: SentryGlobalFilter
    },
  ],
})
export class AppModule {}
