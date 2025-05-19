import { Injectable } from '@nestjs/common';
import { createClient, WebDAVClient } from 'webdav';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from '../interfaces/multerFile.interface';
import { Response } from 'express';

@Injectable()
export class YandexDiskService {
  private client: WebDAVClient;

  constructor(private configService: ConfigService) {
    this.client = createClient('https://webdav.yandex.ru', {
      username: this.configService.get<string>('YANDEX_DISK_USERNAME'),
      password: this.configService.get<string>('YANDEX_DISK_PASSWORD'),
    });
  }

  async uploadFile(
    userId: string,
    file: MulterFile,
    path = 'avatars',
  ): Promise<string> {
    try {
      const fileExtension = file.originalname.includes('.')
        ? file.originalname.split('.').pop()
        : 'jpg';

      const remotePath = `/${path}/${userId}-${Date.now()}.${fileExtension}`;

      if (!file.buffer) {
        throw new Error('File buffer is empty');
      }

      try {
        const oldFilesResponse = await this.client.getDirectoryContents(
          `/${path}`,
        );

        const oldFiles =
          'data' in oldFilesResponse
            ? oldFilesResponse.data // Если это ResponseDataDetailed
            : oldFilesResponse; // Если это FileStat[]

        const oldAvatar = oldFiles.find((item) => {
          const oldIdName = item.basename.split('-')[0];
          return (
            item.basename.startsWith(`${userId}.`) ||
            item.basename === userId ||
            oldIdName === userId
          );
        });

        if (oldAvatar) {
          await this.deleteFile(oldAvatar.filename);
          console.log(`Deleted old avatar: ${oldAvatar.filename}`);
        }
      } catch (error) {
        console.warn('Error while checking/deleting old avatar:', error);
      }

      await this.client.putFileContents(remotePath, file.buffer);

      return `https://webdav.yandex.ru${remotePath}`;
    } catch (error) {
      throw new Error(
        `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getFileUrl(remotePath: string): Promise<string> {
    return `https://webdav.yandex.ru${remotePath}`;
  }

  async getPhoto(filename: string, res: Response) {
    try {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const fileExtension = filename.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        res.status(400).send('Invalid file extension');
        return;
      }

      const remotePath = `/avatars/${filename}`;

      try {
        await this.client.stat(remotePath);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        res.status(404).send('File not found');
        return;
      }

      // const fileStats = (await this.client.stat(remotePath)) as FileStat;

      // const fileBuffer = await this.client.getFileContents(remotePath, {
      //   format: 'binary',
      // });
      // const hash = createHash('md5')
      //   .update(Buffer.from(fileBuffer as ArrayBuffer))
      //   .digest('hex');

      // const etag = `"${hash}"`;

      // const clientEtag = res.req.headers['if-none-match'];
      // if (clientEtag === etag) {
      //   res.status(304).end(); // Not Modified
      //   return;
      // }

      const readStream = this.client.createReadStream(remotePath);

      readStream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).send('Error reading file');
        }
      });

      // res.set(
      //   'Content-Type',
      //   `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      // );
      // if (fileStats) {
      //   res.set({
      //     'Content-Type': `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      //     'Cache-Control': 'public, max-age=604800, must-revalidate', // 1 неделя
      //     ETag: etag,
      //     'Last-Modified': fileStats.lastmod.toString(),
      //     'Content-Length': fileStats.size,
      //   });
      // } else {
      //   res.set({
      //     'Content-Type': `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
      //     'Cache-Control': 'public, max-age=604800, must-revalidate', // 1 неделя
      //     // ETag: etag,
      //   });
      // }
      res.set({
        'Content-Type': `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
        'Cache-Control': 'public, max-age=604800, must-revalidate', // 1 неделя
        // ETag: etag,
      });

      readStream.pipe(res);
    } catch (error) {
      console.error('Error in getPhoto:', error);
      if (!res.headersSent) {
        res.status(500).send('Internal server error');
      }
    }
  }

  async deleteFile(remotePath: string): Promise<void> {
    try {
      await this.client.deleteFile(remotePath);
    } catch (error) {
      throw new Error(
        `Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
