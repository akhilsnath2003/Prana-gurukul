import { PranaStatus } from '@/components/prana-status';

export default function Loading() {
  return <PranaStatus eyebrow="A LITTLE MOMENT" title="A little wonder is on its way.">
    <div role="status" aria-live="polite"><p>Opening our world of discovery…</p><span className="prana-loading-dots" aria-hidden="true"><i/><i/><i/></span></div>
  </PranaStatus>;
}
