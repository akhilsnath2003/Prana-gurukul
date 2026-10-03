"use client";

import { PranaStatus } from '@/components/prana-status';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PranaStatus eyebrow="A LITTLE PAUSE" title="Let’s try that little step again.">
    <p>Something went wrong while opening this page. Please try again, or return to our little world.</p>
    <div className="prana-status-actions"><button className="button" onClick={reset}>Try again</button><a className="text-link" href="/">Back to Prana</a></div>
  </PranaStatus>;
}
