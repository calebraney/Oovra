const { random } = require('gsap');

document.addEventListener('DOMContentLoaded', function () {
  // Comment out for production
  console.log('Local Script Loaded');

  //////////////////////////////
  //Global Variables
  const horizontalSection = '[horizontal-el="section"]';
  const horizontalTrack = '[horizontal-el="track"]';
  const horizontalStickyEl = '[horizontal-el="sticky"]';

  const setTrackHeights = function () {
    const sectionHeights = document.querySelectorAll(horizontalSection);
    sectionHeights.forEach(function (section) {
      let track = section.querySelector(horizontalTrack);
      let trackWidth = track.offsetWidth;
      section.style.height = trackWidth + 'px';
    });
  };

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
      })
      .set(stickyEl, {
        overflow: 'hidden',
      })
      .to(track, {
        xPercent: -100,
        ease: 'none',
      });
  };

  const graphScroll = function () {
    const section = document.querySelector('[graph-section]');
    const component = document.querySelector('[graph-component]');
    const h2 = document.querySelector('[graph-h2]');
    const bars = document.querySelectorAll('.graph_bar-wrap');
    const barsInner = document.querySelectorAll('.graph_bar');
    if (!section || bars.length === 0 || !component) return;

    const compHeight = component.offsetHeight;
    //main timeline
    let tl1 = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'top 0%',
          scrub: 0.5,
        },
      })
      .from(bars, {
        height: '0rem',
        ease: 'power1.out',
        duration: 1,
        stagger: { each: 0.05, from: 'random' },
      });
    let tl2 = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top -2%',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      .to(bars, {
        height: compHeight,
        duration: 1,
        ease: 'power1.out',
        stagger: { each: 0.05, from: 'random' },
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
        setTrackHeights();
        horizontalScroll();
        graphScroll();
      }
    );
  };
  gsapInit();
  window.addEventListener('resize', function () {
    setTrackHeights();
  });
});

// let tlMain = gsap
//   .timeline({
//     scrollTrigger: {
//       trigger: ".section-height",
//       start: "top top",
//       end: "98% bottom",
//       scrub: 1
//     }
//   })
//   .to(".track", {
//     xPercent: -100,
//     ease: "none"
//   });

// // hero photo
// gsap
//   .timeline({
//     scrollTrigger: {
//       trigger: ".hero-panel",
//       containerAnimation: tlMain,
//       start: "left left",
//       end: "right left",
//       scrub: true
//     }
//   })
//   .from(".hero-panel_img", { scale: 1.6 }, 0);

// // note
// gsap
//   .timeline({
//     scrollTrigger: {
//       trigger: ".note-panel",
//       containerAnimation: tlMain,
//       start: "left right",
//       end: "left left",
//       scrub: true
//     }
//   })
//   .from(".note-panel_img", { rotate: 45, scale: 0.3 });

// // thanks
// gsap
//   .timeline({
//     scrollTrigger: {
//       trigger: ".thanks-panel_wrap",
//       containerAnimation: tlMain,
//       start: "left left",
//       end: "right right",
//       scrub: true
//     }
//   })
//   .to(".thanks-panel", { xPercent: 100, ease: "none" })
//   .to(".thanks-panel_photo", { scale: 1 }, 0)
//   .fromTo(
//     ".thanks-panel_contain.is-2",
//     {
//       clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
//     },
//     { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none" },
//     0
//   );

// // stagger photos
// gsap
//   .timeline({
//     scrollTrigger: {
//       trigger: ".stagger-panel",
//       containerAnimation: tlMain,
//       start: "left right",
//       end: "right left",
//       scrub: true
//     }
//   })
//   .from(".stagger-panel_img", { x: "100vw", stagger: { each: 0.05 } })
//   .to(".stagger-panel_img", { scale: 0.5, stagger: { each: 0.05 } });
