"use client";

// Self-contained: the root layout and its stylesheet may be unavailable.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{margin:0,background:'#faf8f0',color:'#173e35',fontFamily:'Arial, Helvetica, sans-serif'}}>
    <main style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:24,textAlign:'center',boxSizing:'border-box'}}>
      <div style={{maxWidth:560}}><img src="/Prana.png" width={162} height={102} alt="Prana Gurukul Preschool" style={{objectFit:'contain'}}/>
        <p style={{fontSize:12,letterSpacing:2}}>A LITTLE PAUSE</p>
        <h1 style={{fontFamily:'Georgia, serif',fontSize:'clamp(32px, 6vw, 52px)',fontWeight:400}}>A fresh beginning is just a step away.</h1>
        <p style={{lineHeight:1.8}}>We couldn’t open the page. Please try again in a moment.</p>
        <button onClick={reset} style={{background:'#173e35',color:'#faf8f0',border:0,borderRadius:30,padding:'16px 28px',fontSize:16,cursor:'pointer'}}>Try again</button>
        <p><a href="/" style={{color:'#b95232'}}>Back to Prana</a></p>
      </div>
    </main>
  </body></html>;
}
