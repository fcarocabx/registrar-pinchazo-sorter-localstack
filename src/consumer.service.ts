import { Injectable, Logger } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    private readonly sqs: SQSClient,
    private readonly configService: ConfigService,
  ) {}
  async consumeMessages(): Promise<void> {
    while (true) {
      const params = {
        QueueUrl: this.configService.get<string>('QUEUE_URL'),
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 30,
        WaitTimeSeconds: 10,
      };

      const command = new ReceiveMessageCommand(params);
      try {
        const data = await this.sqs.send(command);
        const messages = data.Messages;
        if (messages && messages.length > 0) {
          await Promise.all(
            messages.map(async (message) => {
              this.logger.log(`Received message: ${message.Body}`);
              await this.ackMessage(message.ReceiptHandle);
              // Aquí puedes procesar el mensaje según tu lógica
              // Por ejemplo, almacenarlo en una base de datos, enviar una respuesta, etc.
              // Si es procesado correctamente, se da el ack de mensaje consumido a sqs
            }),
          );
        } else {
          this.logger.debug('No messages available');
        }
      } catch (error) {
        this.logger.error(`Error receiving messages: ${error.message}`);
      }
    }
  }

  private async ackMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.configService.get<string>('QUEUE_URL'),
        ReceiptHandle: receiptHandle,
      });
      const ackResponse = await this.sqs.send(command);
      this.logger.log(
        `Ack message succesful ${ackResponse.$metadata.httpStatusCode}`,
      );
    } catch (e) {
      // Manejar 3 intentos
      // Mientras no se pueda dar ack, se podria volver a consumir el mensaje?
      // Idempotencia
      this.logger.error(
        `Fail ack message ${receiptHandle}, error ${e}\nRetry number: n`,
      );
      await this.ackMessage(receiptHandle);
    }
  }
}
