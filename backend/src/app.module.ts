import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './infrastructure/web/transaction.controller';
import { ProcessPaymentUseCase } from './core/use-cases/process-payment.use-case';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/product.repository';
import { TypeOrmTransactionRepository } from './infrastructure/persistence/typeorm/transaction.repository';
import { ProductOrmEntity } from './infrastructure/persistence/typeorm/product.orm-entity';
import { TransactionOrmEntity } from './infrastructure/persistence/typeorm/transaction.orm-entity';
import { ConfigModule } from '@nestjs/config';
import { PaymentAdapter } from './infrastructure/adapters/payment.adapter';
import { ProductController } from '@infrastructure/web/product.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ProductOrmEntity, TransactionOrmEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProductOrmEntity, TransactionOrmEntity]),
  ],
  controllers: [TransactionController, ProductController],
  providers: [
    ProcessPaymentUseCase,
    {
      provide: 'ProductRepository',
      useClass: TypeOrmProductRepository,
    },
    {
      provide: 'TransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: 'PaymentService',
      useClass: PaymentAdapter,
    },
  ],
})
export class AppModule {}
