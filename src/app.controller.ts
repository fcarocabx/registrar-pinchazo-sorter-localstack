import { Controller, Get, Param } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
  ) {}

  @Get('/get-message')
  async getMessage() {
    await this.consumerService.consumeMessages();
    return;
  }
  @Get('/send-message/:msg')
  async sendMessage(@Param('msg') msg: string) {
    await this.producerService.sendMessage(msg);
    return;
  }
}
