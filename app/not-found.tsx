import { PranaStatus } from '@/components/prana-status';

export default function NotFound() {
  return <PranaStatus eyebrow="A LITTLE DETOUR · 404" title="Let’s find our way back.">
    <p>This page isn’t here, but there’s still so much to discover.</p><a className="button" href="/">Back to Prana</a>
  </PranaStatus>;
}
