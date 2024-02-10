import { unlink } from 'fs-extra';

export const removeTmpFiles = async (tmpFiles: string[]): Promise<void> => {
  for (const file of tmpFiles) {
    await unlink(file);
  }
};
