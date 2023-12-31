import { CompilerConfig } from '@ton-community/func-js';
import { collectDebugSymbols } from './collectDebugSymbols';

describe('collectDebugSymbols', () => {
  it('collects information about procedures and globals', async () => {
    const config: CompilerConfig = {
      targets: ['main.fc'],
      sources: {
        'main.fc': `
          global int a;
          global cell b;
          global slice c;

          () throw_inline() impure inline { throw(1); }
          () throw_inline_ref() impure inline_ref { throw(2); }
          () throw_get() method_id(88) { throw(3); }
          () recv_internal() { throw(4); }
        `,
      },
    };

    const debugSymbols = await collectDebugSymbols(config);
    expect(debugSymbols).toMatchSnapshot();
  });

  it('collects information about constants', async () => {
    const config: CompilerConfig = {
      targets: ['main.fc'],
      sources: {
        'main.fc': `
          const int h = 0xBEEF;
          const int i = -0xCAFE;
          const int j = -1000;
          const int k = 1000;
          const slice l = "hello";
          const slice m = "cafe"s;
          const slice n = "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF"a;
          const int o = "ping"u;
          const int p = "tranfser"h;
          const int q = "tranfser"H;
          const int r = "tranfser"c;
          
          _ get_consts() method_id {
            return (h, i, j, k, l, m, n, o, p, q, r);
          }

          () recv_internal(slice in_msg_body) {
            return ();
          }
        `,
      },
    };

    const debugSymbols = await collectDebugSymbols(config);
    expect(debugSymbols).toMatchSnapshot();
  });
});
