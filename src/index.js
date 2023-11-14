import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
const { random } = require('gsap');

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script Loaded');

  //////////////////////////////
  //LENIS Smoothscroll
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Flip);

  const lenis = new Lenis({
    duration: 1,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
    touchMultiplier: 1.5,
  });
  // lenis request animation from
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // anchor links
  function anchorLinks() {
    const anchorLinks = document.querySelectorAll('[scroll-to]');
    if (anchorLinks == null) {
      return;
    }
    anchorLinks.forEach((item) => {
      const targetID = item.getAttribute('scroll-to');
      const target = document.getElementById(targetID);
      if (!target) return;
      item.addEventListener('click', (event) => {
        lenis.scrollTo(target, {
          duration: 1.85,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
      });
    });
  }
  anchorLinks();

  // stop page scrolling
  function stopScroll() {
    const stopScrollLinks = document.querySelectorAll('[scroll="stop"]');
    if (stopScrollLinks == null) {
      return;
    }
    stopScrollLinks.forEach((item) => {
      item.addEventListener('click', (event) => {
        lenis.stop();
      });
    });
  }
  stopScroll();

  // start page scrolling
  function startScroll() {
    const startScrollLinks = document.querySelectorAll('[scroll="start"]');
    if (startScrollLinks == null) {
      return;
    }
    startScrollLinks.forEach((item) => {
      item.addEventListener('click', (event) => {
        lenis.start();
      });
    });
  }
  startScroll();

  // toggle page scrolling
  function toggleScroll() {
    const toggleScrollLinks = document.querySelectorAll('[scroll="toggle"]');
    if (toggleScrollLinks == null) {
      return;
    }
    toggleScrollLinks.forEach((item) => {
      let stopScroll = false;
      item.addEventListener('click', (event) => {
        stopScroll = !stopScroll;
        if (stopScroll) lenis.stop();
        else lenis.start();
      });
    });
  }
  toggleScroll();

  // Keep lenis and scrolltrigger in sync
  lenis.on('scroll', () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  //////////////////////////////
  //Global Variables
  const horizontalSection = '[horizontal-el="section"]';
  const horizontalTrack = '[horizontal-el="track"]';
  const horizontalStickyEl = '[horizontal-el="sticky"]';
  const refreshScrollTriggerItems = gsap.utils.toArray('[refresh-scroll]');

  //////////////////////////////
  //Reusable tweens

  const horizElement = function (props) {
    const tween = {
      x: props?.x ?? '24px',
      rotateZ: props?.rotateZ ?? -1.5,
      duration: props?.duration ?? 1,
      delay: props?.delay ?? 0,
      opacity: props?.opacity ?? 0,
      ease: props?.opacity ?? 'power1.out',
    };
    return tween;
  };

  const headingFade = function (props) {
    const tween = {
      x: props?.x ?? '24px',
      rotateZ: props?.rotateZ ?? -1.5,
      duration: props?.duration ?? 1,
      delay: props?.delay ?? 0,
      opacity: props?.opacity ?? 0,
      ease: props?.opacity ?? 'power1.out',
      stagger: { each: 0.3, from: 'start' },
    };
    return tween;
  };

  const horizStaggerElements = function (props) {
    const tween = {
      x: props?.x ?? '24px',
      rotateZ: props?.rotateZ ?? 0,
      duration: props?.duration ?? 1,
      delay: props?.delay ?? 0,
      opacity: props?.opacity ?? 0,
      ease: props?.opacity ?? 'power1.out',
      stagger: { each: props?.stagger ?? 0.2, from: 'start' },
    };
    return tween;
  };

  const vertStaggerElements = function (props) {
    const tween = {
      y: props?.y ?? '32px',
      rotateZ: props?.rotateZ ?? -1.5,
      duration: props?.duration ?? 1,
      delay: props?.delay ?? 0,
      opacity: props?.opacity ?? 0,
      ease: props?.opacity ?? 'power1.out',
      stagger: { each: props?.stagger ?? 0.2, from: 'start' },
    };
    return tween;
  };

  //////////////////////////////
  //Utility Functions
  const splitText = function (text) {
    typeSplit = new SplitType(text, {
      types: 'lines, words',
    });
    return typeSplit;
  };

  const setTrackHeights = function () {
    const sectionHeights = gsap.utils.toArray(horizontalSection);
    sectionHeights.forEach(function (section) {
      let track = section.querySelector(horizontalTrack);
      let trackWidth = track.offsetWidth;
      section.style.height = trackWidth + 'px';
    });
  };

  //////////////////////////////
  //GSAP Animations
  const horizontalScroll = function () {
    const section = document.querySelector(horizontalSection);
    const track = document.querySelector(horizontalTrack);
    const stickyEl = document.querySelector(horizontalStickyEl);
    if (!section || !track || !stickyEl) return;
    //main timeline
    let tlMain = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '98% bottom',
          scrub: 0.5,
        },
        defaults: {
          duration: 1,
          ease: 'power1.out',
        },
      })
      .set(stickyEl, {
        overflow: 'hidden',
      })
      .to(track, {
        xPercent: -100,
        ease: 'none',
      });

    // hero panel
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '[h-hero-panel]',
          containerAnimation: tlMain,
          start: 'left left',
          end: 'right left',
          scrub: true,
        },
      })
      .to('[h-hero-image]', { x: '25%' }, 0);

    // name panel
    splitText(document.querySelector('[h-name-title]'));
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '[h-name-panel]',
          containerAnimation: tlMain,
          start: 'left right',
          end: '+=75%',
          scrub: true,
        },
      })
      .from('[h-name-large]', { x: '200px,', delay: 2, duration: 3, opacity: 0 })
      .from('[h-name-name], [h-name-pronounce] ', horizStaggerElements(), '<.5')
      .from('[h-name-title] .line', headingFade(), '<.5');

    // color panel
    // console.log(document.querySelector('[h-color-image'));
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '[h-color-panel]',
          containerAnimation: tlMain,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      })
      .to('[h-color-image]', { xPercent: -25 }, 0);

    // feature panel
    splitText(document.querySelector('[h-feature-1-title]'));
    splitText(document.querySelector('[h-feature-2-title]'));
    gsap
      .timeline({
        scrollTrigger: {
          trigger: '[h-feature-panel]',
          containerAnimation: tlMain,
          start: 'left right',
          end: '+=150%',
          scrub: true,
        },
      })
      //Feature 1
      .from('[h-feature-1-number] ', horizElement({ delay: 1 }))
      .from('[h-feature-1-title] .line', headingFade())
      .from('[h-feature-1-image]', horizElement({ delay: 0.75 }))
      //Ampersand
      .from('[h-feature-and]', { scale: 0.05, delay: 0.5, opacity: 0 }, '<.5')
      //Feature 2
      .from('[h-feature-2-number]', horizElement(), '<.5')
      .from('[h-feature-2-title] .line', headingFade())
      .from('[h-feature-2-image]', horizElement({ delay: 0.75 }));
  };

  const graphScroll = function (isMobile) {
    const section = document.querySelector('[graph-section]');
    const component = document.querySelector('[graph-component]');
    const h2 = document.querySelector('[graph-h2]');
    const bars = gsap.utils.toArray('.graph_bar-wrap');
    const barsInner = gsap.utils.toArray('.graph_bar');
    if (!section || bars.length === 0 || !component) return;

    //animate bars from 0 to set height in array
    splitText(document.querySelector('[feature-3-title]'));
    let tl1 = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'top 5%',
          scrub: true,
        },
      })
      .from('[feature-3-number] ', horizElement())
      .from('[feature-3-title] .line', headingFade(), '<.5');
    //animate bars from height in webflow to fill screen
    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 0%',
        end: 'bottom 95%',
        scrub: true,
      },
    });
    const sizes = ['22vh', '40vh', '30vh', '15vh', '24vh', '60vh', '50vh', '70vh'];
    bars.forEach((item, index) => {
      // const startHeight = item.offsetHeight;
      //animation 1
      tl1.set(
        item,
        {
          height: '0vh',
        },
        0
      );
      tl1.fromTo(
        item,
        {
          height: '0vh',
        },
        {
          height: sizes[index],
          ease: 'power1.out',
          duration: 1.5 + gsap.utils.random(0, 0.5, 0.1),
          delay: gsap.utils.random(0, 0.5, 0.1),
        },
        1.5
      );
    });

    let tl3 = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom 100%',
          end: 'bottom 0%',
          scrub: true,
        },
      })
      .to(barsInner, {
        height: '35%',
        duration: 1,
        ease: 'power1.out',
        stagger: { each: 0.05, from: 'random' },
      });
  };

  const artTypeScroll = function () {
    const trigger = document.querySelector('[art-type-trigger]');
    const title = document.querySelector('[art-type-title]');
    const line = document.querySelector('[art-type-line]');
    const spans = gsap.utils.toArray('.art-types_h3-span-wrap');

    if (!trigger || !line || !title || spans.length === 0) return;
    //animate spans from 0 to set height in Webflow
    splitText(title);
    let tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom 95%',
          scrub: 0.5,
        },
      })
      .from(title, headingFade())
      .from(line, { width: 0, duration: 1, ease: 'power1.out' }, '<.5')
      .from(
        spans,
        {
          y: '32px',
          duration: 1,
          opacity: 0,
          ease: 'power1.out',
          stagger: { each: 0.2, from: 'start' },
        },
        '<.5'
      );
  };

  const artistLedScroll = function () {
    const section = document.querySelector('[artist-led-section]');
    const marquee = document.querySelector('[artist-led-marquee]');
    const stickers = gsap.utils.toArray('[artist-led-sticker]');

    if (!section || !marquee || stickers.length === 0) return;

    let textTL = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'center top',
        end: 'bottom 95%',
        scrub: 0.5,
      },
    });
    //marquee animations
    textTL.to(marquee, { yPercent: -100, ease: 'power2.inOut', duration: 1 });
    textTL.to(marquee, { yPercent: -200, ease: 'power2.inOut', duration: 1 });

    ///////////
    // Stickers TL

    // create the final state
    stickers.forEach((item) => item.classList.add('is-final'));
    // save that final state
    const state = Flip.getState([stickers], {
      props: 'opacity,borderRadius',
    });
    // revert to original state
    stickers.forEach((item) => item.classList.remove('is-final'));

    // animate with Flip
    const tl = Flip.to(state, {
      ease: 'none',
      absolute: true,
      scale: true,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        ease: 'power3.in',
      },
    });
  };

  const fadeHeadingsIn = function () {
    const headings = document.querySelectorAll('[heading-fade]');
    headings.forEach((item, index) => {
      if (!item) return;
      text = splitText(item);
      let tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom 95%',
            scrub: 0.5,
          },
        })
        .from(text.lines, headingFade(), '<.5');
    });
  };

  const moveSpacer = function () {
    const section = document.querySelector('.spacer_wrap');
    const item = document.querySelector('.spacer_image');
    if (!item || !section) return;
    let tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
      .from(item, { yPercent: -25 });
  };

  //////////////////////////////
  //Control Functions on page load
  const gsapInit = function () {
    let mm = gsap.matchMedia();
    mm.add(
      {
        //This is the conditions object
        isMobile: '(max-width: 767px)',
        isTablet: '(min-width: 768px)  and (max-width: 991px)',
        isDesktop: '(min-width: 992px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        let { isMobile, isTablet, isDesktop, reduceMotion } = context.conditions;
        // run animation functions
        if (isDesktop || isTablet) {
          setTrackHeights();
          horizontalScroll();
        }

        artTypeScroll();

        artistLedScroll();
        if (!reduceMotion) {
          fadeHeadingsIn();
          graphScroll();
          moveSpacer();
        }
      }
    );
  };
  gsapInit();
  window.addEventListener('resize', function () {
    gsapInit();
  });
  refreshScrollTriggerItems.forEach(function (item) {
    item.addEventListener('click', function () {
      ScrollTrigger.refresh();
    });
  });
});
