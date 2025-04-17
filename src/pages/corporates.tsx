import { CONFIG } from 'src/config-global';

import { CorporateView } from 'src/sections/corporate/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Corporates - ${CONFIG.appName}`}</title>

      <CorporateView />
    </>
  );
}
