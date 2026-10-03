"use client";

import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePageMotion(root: RefObject<HTMLElement | null>, setScene: (scene: number) => void) {
  useLayoutEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      gsap.fromTo('.reading-progress', { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const intro = gsap.timeline({ defaults: { duration: 0.85, ease: 'power3.out' } });
        intro.from('.hero-copy > *', { autoAlpha: 0, y: 26, stagger: 0.12, clearProps: 'all' })
          .from('.hero-visual', { autoAlpha: 0, y: 32, duration: 1.1, clearProps: 'all' }, 0.2)
          .from('.round-note', { scale: 0.7, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' }, 0.8)
          .from('.scroll-cue', { autoAlpha: 0, y: -8, clearProps: 'all' }, 1.1);

        gsap.utils.toArray<HTMLElement>('.reveal:not(.area-card)').forEach(element => {
          gsap.from(element, {
            autoAlpha: 0, y: 28, duration: 0.85, ease: 'power3.out', clearProps: 'all',
            scrollTrigger: { trigger: element, start: 'top 90%', once: true },
          });
        });
        const cards = gsap.utils.toArray<HTMLElement>('.learning-step');
        const frames = gsap.utils.toArray<HTMLElement>('.learning-frame');
        cards.forEach((card, index) => {
          if (index === 0) return;
          gsap.timeline({
            scrollTrigger: {
              trigger: card, start: 'top 85%', end: 'top 50%',
              scrub: 0.7, invalidateOnRefresh: true,
            },
          }).to(frames[index - 1], { opacity: 0, ease: 'none' }, 0)
            .fromTo(frames[index], { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
        });
        gsap.utils.toArray<HTMLElement>('.gallery-slot').forEach((slot, index) => {
          const card = slot.querySelector<HTMLElement>('.gallery-card');
          const image = slot.querySelector<HTMLElement>('.gallery-image');
          const window = slot.querySelector<HTMLElement>('.gallery-window');
          if (!card || !image || !window) return;
          // Measure the stationary slot, never the element being translated.
          // Image overscan is 25% per edge; keep travel inside that crop.
          const travel = () => window.clientHeight * 0.22;
          const drift = () => Math.min(80, window.clientHeight * 0.18);
          const direction = index % 2 ? 1 : -1;
          gsap.timeline({
            scrollTrigger: {
              trigger: slot, start: 'top bottom', end: 'bottom top',
              scrub: 0.6, invalidateOnRefresh: true,
            },
          }).fromTo(image, { y: () => -travel() }, {
            y: travel, ease: 'none', duration: 1,
          }, 0).fromTo(card, { y: () => direction * drift() }, {
            y: () => -direction * drift(), ease: 'none', duration: 1,
          }, 0);
        });
        gsap.from('.visit-inner > :not(.visit-sun)', {
          autoAlpha: 0, y: 22, stagger: 0.1, duration: 0.8, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: '.visit-inner', start: 'top 80%', once: true },
        });
      });
      media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
        const progress = { value: 0 };
        gsap.to(progress, {
          value: 1, ease: 'none',
          onUpdate: () => setScene(Math.min(2, Math.floor(progress.value * 3))),
          scrollTrigger: {
            trigger: '.story', start: 'top 90px', end: 'bottom bottom',
            scrub: 0.6, invalidateOnRefresh: true,
          },
        });
        return () => setScene(0);
      });
    }, root);
    // Refresh for image/font layout changes and expanding FAQ content.
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.revert();
      context.revert();
    };
  }, [root, setScene]);
}
