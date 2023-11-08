import fs from 'fs';

export class FileHandle {
  #filePath: string;

  get filePath() {
    return this.#filePath;
  }

  constructor(filePath: string) {
    this.#filePath = filePath;
  }

  async read(): Promise<Buffer> {
    return fs.promises.readFile(this.#filePath);
  }

  async write(data: Buffer | string): Promise<void> {
    return fs.promises.writeFile(this.#filePath, data);
  }
}
