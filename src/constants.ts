import fs from 'fs';
import path from 'path';

export const ASM_FIF_CONTENT = fs.readFileSync(
  path.join(__dirname, '../lib/Asm.fif'),
);
export const DEBUG_MAGIC = 0xff4c;
