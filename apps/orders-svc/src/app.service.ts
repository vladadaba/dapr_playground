import { DaprClient, HttpMethod } from '@dapr/dapr';
import { Injectable } from '@nestjs/common';
import { OrderProcessingService } from './order-processing.service';
import { PrismaService } from './prisma.service';
import { PublishMessageDto } from './requests.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly daprClient: DaprClient,
    private readonly orderProcessingWorkflow: OrderProcessingService,
    private readonly prisma: PrismaService,
  ) {}

  async hello(): Promise<{
    service: string;
    response: Record<string, any>;
  }> {
    const response = await this.daprClient.invoker.invoke(
      'inventory-svc',
      'hello',
      HttpMethod.GET,
    );

    return {
      service: 'orders-svc',
      response: response,
    };
  }

  async helloWithFailures(): Promise<{
    service: string;
    response: Record<string, any>;
  }> {
    const response = await this.daprClient.invoker.invoke(
      'inventory-svc',
      'hello_with_failures',
      HttpMethod.GET,
    );

    return {
      service: 'orders-svc',
      response: response,
    };
  }

  async redisPublish(body: PublishMessageDto): Promise<void> {
    await this.daprClient.pubsub.publish('redisbus', 'my_topic', body);
  }

  async rabbitmqPublish(body: PublishMessageDto): Promise<void> {
    await this.daprClient.pubsub.publish('rabbitmqbus', 'my_topic', body);
  }

  setState(key: string, value: string) {
    return this.daprClient.state.save('statestore', [
      {
        key,
        value,
      },
    ]);
  }

  getState(key: string) {
    return this.daprClient.state.get('statestore', key);
  }

  async startWorkflow(productId: string, quantity: number) {
    const { cost } = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
      select: {
        cost: true,
      },
    });

    const order = await this.prisma.order.create({
      data: {
        quantity,
        status: 'WAITING_FOR_APPROVAL',
        productId,
        totalCost: cost.mul(quantity),
      },
    });

    return this.orderProcessingWorkflow.start(order);
  }

  approve(orderId: string, isApproved: boolean) {
    return this.orderProcessingWorkflow.approve(orderId, isApproved);
  }

  async getOrders() {
    const orders = await this.prisma.order.findMany({
      where: {
        status: 'WAITING_FOR_APPROVAL',
      },
      include: {
        product: true,
      },
    });

    return orders.map((o) => ({
      id: o.id,
      name: o.product.name,
      quantity: o.quantity,
      total: o.totalCost,
    }));
  }

  async getProducts() {
    const products = await this.prisma.product.findMany();

    return products.map((o) => ({
      id: o.id,
      name: o.name,
      cost: o.cost,
      quantity: o.quantity,
    }));
  }
}
