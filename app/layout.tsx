import type { Metadata, Viewport } from 'next';
import './globals.css';
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#173e35' };
export const metadata: Metadata = {
 title:'Prana Gurukul Preschool | Little Minds, Beautiful Beginnings',
 description:'Discover Montessori-inspired, hands-on learning at Prana Gurukul Preschool in Banashankari 6th Stage, Bengaluru. Playgroup, Nursery, LKG and UKG.',
 icons:{icon:'/favicon.ico',shortcut:'/favicon.ico'},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
