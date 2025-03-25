import { DaprClient } from '@dapr/dapr';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly daprClient: DaprClient) {}

  async hello(): Promise<{
    service: string;
    response: string;
  }> {
    return {
      service: 'inventory-svc',
      response: 'Hello from inventory-svc',
    };
  }
}
