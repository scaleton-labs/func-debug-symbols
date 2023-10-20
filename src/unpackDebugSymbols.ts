import { Cell, Dictionary, Slice } from '@ton/core';
import { DebugSymbols, GlobalDescriptor, ProcedureDescriptor } from './types';
import { DEBUG_MAGIC } from './constants';

export function unpackDebugSymbols(rootCell: Cell): DebugSymbols {
  const root = rootCell.beginParse();

  if (root.loadUint(16) !== DEBUG_MAGIC) {
    throw new Error('Debug symbols malformed.');
  }

  const proceduresDict = root
    .loadRef()
    .asSlice()
    .loadDictDirect(Dictionary.Keys.Int(32), {
      serialize: () => {},
      parse: (src: Slice): Pick<ProcedureDescriptor, 'cellHash' | 'name'> => ({
        cellHash: src.loadUintBig(256).toString(16),
        name: src.loadStringTail(),
      }),
    });

  const procedures = [...proceduresDict].map(
    ([methodId, descriptor]): ProcedureDescriptor => ({
      methodId,
      ...descriptor,
    }),
  );

  const globalsDict = root
    .loadRef()
    .beginParse()
    .loadDictDirect(Dictionary.Keys.Uint(32), {
      serialize: () => {},
      parse: (src: Slice): string => src.loadStringTail(),
    });

  const globals = [...globalsDict].map(
    ([index, name]): GlobalDescriptor => ({
      index,
      name,
    }),
  );

  return {
    procedures,
    globals,
  };
}
