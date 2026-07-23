import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ClientsModule } from './modules/clients/clients.module';
import { DevisModule } from './modules/devis/devis.module';
import { FacturesModule } from './modules/factures/factures.module';
import { PaiementsModule } from './modules/paiements/paiements.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ExportModule } from './modules/export/export.module';
import { ContactModule } from './modules/contact/contact.module';
import { AdminModule } from './modules/admin/admin.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { CatalogueModule } from './modules/catalogue/catalogue.module';
import { RelancesModule } from './modules/relances/relances.module';
import { PortalModule } from './modules/portal/portal.module';
import { LogsModule } from './modules/logs/logs.module';
import { DeclarationsTVAModule } from './modules/declarations-tva/declarations-tva.module';
import { BonsLivraisonModule } from './modules/bons-livraison/bons-livraison.module';
import { GraphModule } from './modules/graph/graph.module';
import { ExpensesModule } from './modules/expenses/expenses.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 60_000, max: 500 }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ClientsModule,
    DevisModule,
    FacturesModule,
    PaiementsModule,
    NotificationsModule,
    SettingsModule,
    DashboardModule,
    ExportModule,
    ContactModule,
    AdminModule,
    WebhooksModule,
    CatalogueModule,
    RelancesModule,
    PortalModule,
    LogsModule,
    DeclarationsTVAModule,
    BonsLivraisonModule,
    GraphModule,
    ExpensesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
