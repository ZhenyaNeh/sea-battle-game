import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexDiskService } from './yandex-disk.service';

@Module({
  imports: [ConfigModule],
  providers: [YandexDiskService],
  exports: [YandexDiskService],
})
export class StorageModule {}
