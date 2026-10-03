import type { ReactNode } from 'react';

export function PranaStatus({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <main className="prana-status">
    <div className="prana-status-card">
      <a href="/" aria-label="Prana Gurukul home"><img className="prana-status-logo" src="/Prana.png" width={162} height={102} alt="Prana Gurukul Preschool"/></a>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
      <p className="prana-status-signature">Little minds. Beautiful beginnings.</p>
    </div>
  </main>;
}
