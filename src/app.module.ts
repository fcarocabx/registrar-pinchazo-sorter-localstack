import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { SQSClient } from '@aws-sdk/client-sqs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    {
      provide: SQSClient,
      useFactory: () => {
        const sqsConfig = {
          endpoint: process.env.AWS_ENDPOINT,
          region: process.env.AWS_DEFAULT_REGION,
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
        };
        return new SQSClient(sqsConfig);
      },
    },
    ConsumerService,
    ProducerService,
  ],
})
export class AppModule {}
