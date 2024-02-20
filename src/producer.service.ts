import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService {
  constructor(
    private readonly sqs: SQSClient,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(messageBody: string): Promise<void> {
    const params = {
      QueueUrl: this.configService.get<string>('QUEUE_URL'),
      MessageBody: messageBody,
    };

    const command = new SendMessageCommand(params);
    try {
      await this.sqs.send(command);
      console.log(`Message sent: ${messageBody}`);
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
    }
  }
}
