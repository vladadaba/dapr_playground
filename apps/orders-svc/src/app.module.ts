import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DaprClient, DaprWorkflowClient, WorkflowRuntime } from '@dapr/dapr';
import { OrderProcessingService } from './order-processing.service';
import { PrismaService } from './prisma.service';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClsModule.forRoot({
      // https://papooch.github.io/nestjs-cls/introduction/quick-start
      // we can use this to save some request context
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrderProcessingService,
    PrismaService,
    {
      provide: DaprClient,
      useValue: new DaprClient({
        actor: {
          actorIdleTimeout: '1h',
          actorScanInterval: '30s',
          drainOngoingCallTimeout: '1m',
          drainRebalancedActors: true,
          reentrancy: {
            enabled: true,
            maxStackDepth: 32,
          },
          remindersStoragePartitions: 0,
        },
      }),
    },
    {
      provide: DaprWorkflowClient,
      useValue: new DaprWorkflowClient(),
    },
    {
      provide: WorkflowRuntime,
      useValue: new WorkflowRuntime(),
    },
  ],
})
export class AppModule {}
