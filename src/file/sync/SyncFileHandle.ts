import fs from 'fs';

export class SyncFileHandle {
  #filePath: string;

  get filePath() {
    return this.#filePath;
  }

  constructor(filePath: string) {
    this.#filePath = filePath;
  }

  read(): Buffer {
    return fs.readFileSync(this.#filePath);
  }

  write(data: Buffer | string): void {
    fs.writeFileSync(this.#filePath, data);
  }
}
