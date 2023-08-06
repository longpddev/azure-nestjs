import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AppService {
  public indexFile = readFile(
    join(__dirname, '..', 'frontend/dist/index.html'),
    { encoding: 'utf-8' },
  );
  async getHello() {
    return await this.indexFile;
  }
}
