import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApproveOrderDto,
  OrderDto,
  PublishMessageDto,
  PurchaseDto,
  SetStateDto,
} from './requests.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  hello() {
    return this.appService.hello();
  }

  @Get('hello_with_failures')
  helloWithFailures() {
    return this.appService.helloWithFailures();
  }

  @Post('publish_redis')
  async redisPublish(@Body() body: PublishMessageDto) {
    await this.appService.redisPublish(body);
  }

  @Post('publish_rabbitmq')
  async rabbitmqPublish(@Body() body: PublishMessageDto) {
    await this.appService.rabbitmqPublish(body);
  }

  @Post('state')
  async setState(@Body() { key, value }: SetStateDto) {
    await this.appService.setState(key, value);
  }

  @Get('state')
  getState(@Query('key') key: string) {
    return this.appService.getState(key);
  }

  @Patch('orders/:id/approved')
  approveOrder(
    @Param('id') id: string,
    @Body() { isApproved }: ApproveOrderDto,
  ) {
    return this.appService.approve(id, isApproved);
  }

  @Get('orders')
  getOrders() {
    return this.appService.getOrders();
  }

  @Get('products')
  getProducts() {
    return this.appService.getProducts();
  }

  @Post('purchase')
  purchase(@Body() { productId, quantity }: PurchaseDto) {
    return this.appService.startWorkflow(productId, quantity);
  }
}
