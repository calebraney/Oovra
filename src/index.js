import SplitType from 'split-type';
import Lenis from '@studio-freight/lenis';
const { random } = require('gsap');

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script Loaded');

  //////////////////////////////
  //LENIS Smoothscroll
  gsap.registerPlugin(ScrollTrigger);

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
    };
    return tween;
  };

  const horizHeading = function (props) {
    const tween = {
      x: props?.x ?? '24px',
      rotateZ: props?.rotateZ ?? -1.5,
      duration: props?.duration ?? 1,
      delay: props?.delay ?? 0,
      opacity: props?.opacity ?? 0,
      stagger: { each: 0.2, from: 'start' },
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
      .from('[h-name-title] .line', horizHeading(), '<.5');

    // color panel
    // console.log(document.querySelector('[h-color-image'));
    // gsap
    //   .timeline({
    //     scrollTrigger: {
    //       trigger: '[h-color-panel]',
    //       containerAnimation: tlMain,
    //       start: 'left left',
    //       end: 'right left',
    //       scrub: true,
    //     },
    //   })
    //   .to('[h-color-image]', { xPercent: 0 }, 0);

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
      .from('[h-feature-1-title] .line', horizHeading())
      .from('[h-feature-1-image]', horizElement({ delay: 0.75 }))
      //Ampersand
      .from('[h-feature-and]', { scale: 0.05, delay: 0.5, opacity: 0 }, '<.5')
      //Feature 2
      .from('[h-feature-2-number]', horizElement(), '<.5')
      .from('[h-feature-2-title] .line', horizHeading())
      .from('[h-feature-2-image]', horizElement({ delay: 0.75 }));
  };

  const graphScroll = function (isMobile) {
    const section = document.querySelector('[graph-section]');
    const component = document.querySelector('[graph-component]');
    const h2 = document.querySelector('[graph-h2]');
    const bars = gsap.utils.toArray('.graph_bar-wrap');
    const barsInner = gsap.utils.toArray('.graph_bar');
    if (!section || bars.length === 0 || !component) return;

    const componentHeight = component.offsetHeight;
    //animate bars from 0 to set height in Webflow
    let tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        end: 'top 0%',
        scrub: 0.5,
      },
    });
    //animate bars from height in webflow to fill screen
    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top -2%',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });
    const sizes = ['22vh', '40vh', '30vh', '15vh', '24vh', '60vh', '50vh', '70vh'];
    bars.forEach((item, index) => {
      // const startHeight = item.offsetHeight;
      //animation 1
      tl1.fromTo(
        item,
        {
          height: '0vh',
        },
        {
          height: sizes[index],
          ease: 'power1.out',
          duration: 1 + gsap.utils.random(0, 0.5, 0.1),
          delay: gsap.utils.random(0, 0.5, 0.1),
        },
        0
      );
      // aniation 2
      tl2.fromTo(
        item,
        { height: sizes[index] },
        {
          height: componentHeight,
          duration: 1 + gsap.utils.random(0, 0.5, 0.1),
          delay: gsap.utils.random(0, 0.5, 0.1),
          ease: 'power1.out',
        },
        0
      );
    });

    let tl3 = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom 101%',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
      .to(barsInner, {
        height: '35%',
        duration: 1,
        ease: 'power1.out',
        stagger: { each: 0.05, from: 'random' },
      });
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
        graphScroll();
      }
    );
  };
  gsapInit();
  window.addEventListener('resize', function () {
    setTrackHeights();
    ScrollTrigger.refresh();
  });
  refreshScrollTriggerItems.forEach(function (item) {
    item.addEventListener('click', function () {
      ScrollTrigger.refresh();
    });
  });
});
