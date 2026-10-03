"use client";

import { useState } from 'react';

// Match public/images exactly, including capitalization for Linux hosting.
const photoSources = [
  '/images/prana1.jpeg',
  '/images/Prana2.jpeg',
  '/images/Prana3.jpeg',
  '/images/Prana4.jpeg',
  '/images/Prana5.jpeg',
  '/images/Prana6.jpeg',
];

function PranaPhoto({ number, alt }: { number: number; alt: string }) {
  const [missing, setMissing] = useState(false);
  return <div className={`prana-photo prana-photo-${number % 3}`}>
    <div className="photo-placeholder" aria-hidden="true"><span>PRANA GURUKUL</span><strong>Little moments.<br/>Beautiful memories.</strong><span>{String(number).padStart(2, '0')}</span></div>
    {!missing && <img src={photoSources[number - 1]} alt={alt} loading="lazy" width={1000} height={1200} onError={() => setMissing(true)}/>}
    {missing && <span className="sr-only">{alt} — photo coming soon</span>}
  </div>;
}

export function LearningPhotos({ titles }: { titles: string[] }) {
  return <div className="learning-photos" aria-label="Learning at Prana Gurukul">
    {titles.map((title, index) => <figure className="learning-frame" key={title}>
      <PranaPhoto number={index + 1} alt={title}/>
      <figcaption><span>0{index + 1} / 0{titles.length}</span>{title}</figcaption>
    </figure>)}
  </div>;
}

export function StoryPhoto({ index, alt }: { index: number; alt: string }) {
  const [missing, setMissing] = useState(false);
  return <div className={`prana-photo prana-photo-${index % 3}`}>
    <div className="photo-placeholder" aria-hidden="true"><span>A PEEK INTO THEIR WORLD</span><strong>{['Room to explore.', 'Courage to try.', 'Space to grow.'][index]}</strong><span>0{index + 1} · PHOTO COMING SOON</span></div>
    {!missing && <img src={`/images/piw_prana${index + 1}.jpg`} alt={alt} width={960} height={1280} loading="lazy" onError={() => setMissing(true)}/>}
    {missing && <span className="sr-only">{alt} — photo coming soon</span>}
  </div>;
}

export function ParallaxGallery() {
  const captions = ['Room for curiosity', 'The joy of trying', 'Growing together', 'Little hands at work', 'Everyday discoveries', 'Memories in the making'];
  return <section className="gallery-section section" id="gallery" aria-labelledby="gallery-title">
    <div className="wrap">
      <div className="section-heading reveal"><div><div className="eyebrow">LITTLE MOMENTS, BIG MEMORIES</div><h2 id="gallery-title">A glimpse of<br/>our <em>everyday.</em></h2></div><p>A world of play, friendship<br/>and little discoveries.</p></div>
      <div className="parallax-gallery">{captions.map((caption, index) => <div className="gallery-slot" key={caption}><figure className="gallery-card">
        <div className="gallery-window"><div className="gallery-image"><PranaPhoto number={index + 1} alt={caption}/></div></div>
        <figcaption><span>0{index + 1}</span>{caption}</figcaption>
      </figure></div>)}</div>
    </div>
  </section>;
}
