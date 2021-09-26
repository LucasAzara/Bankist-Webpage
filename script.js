'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ------------------------------------------------------------------------------------------------------------
//
// Smooth Scroll
//

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ------------------------------------------------------------------------------------------------------------
//
// Page Navigation
//

// Event delegation, used to make sure only one function is needed for all children

// 1.First add an event listener to common parent element
// 2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Where the event happened
  e.preventDefault();
  // console.log(e.target);

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// ------------------------------------------------------------------------------------------------------------
//
// Tabbed Component
//

// tabs.forEach(tab => tab.addEventListener('click', () => console.log('Tab')));

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // Get closest with that class, a user can click on span or the actual button
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause, return if conditions match
  if (!clicked) return;

  // Remove all active tabs from all tabs
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // Add active class to tab
  clicked.classList.add('operations__tab--active');

  // Remove all active content area
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ------------------------------------------------------------------------------------------------------------
//
// Link fades
//

const handleHover = function (e) {
  // //Due to binding, this is not different than currentTarget, and instead is the value that was put into parameter

  // Check if contains link class
  if (e.target.classList.contains('nav__link')) {
    const hover = e.target;
    // Get all of the elements with that class
    const siblings = hover
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = hover.closest('.nav').querySelector('img');

    // all of the links except the current one is affected
    siblings.forEach(el => {
      if (el !== hover) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

// Mouseover bubbles to parents
// due to how javascript works, cannot call function with parameters in even listener, only exception being using bind, in a singular parameter or in a array
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// ------------------------------------------------------------------------------------------------------------
//
// Sticky Nav
//

// Get current height of navigation in relation to webpage
const navHeight = nav.getBoundingClientRect().height;

// When to toggle "sticky" class
const stickyNav = function (entries, _) {
  const [entry] = entries;
  // Is intersecting === is it on the screen?
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // add a margin so the intersection happens later
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// ------------------------------------------------------------------------------------------------------------
//
// Revealing Elements on Scroll
//

// Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  // deconstruction
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // Stops observing the element and won't execute any more unnecessary JS
  observer.unobserve(entry.target);
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(revealSection, revealOptions);

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// ------------------------------------------------------------------------------------------------------------
//
// Lazy Loading Images
//

// The selector works like css in every way ( parameter )
const imgTargets = document.querySelectorAll('img[data-src]');

const loadingImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  // Replacing image
  entry.target.src = entry.target.dataset.src;

  // Execute only after loading larget
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// ------------------------------------------------------------------------------------------------------------
//
// Slider in Javascript
//

// Html Variables
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLft = document.querySelector('.slider__btn--left');
  const btnRht = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');

  // Javascript Variables
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  // Creating dots under slider
  const createDots = function () {
    slides.forEach((s, i) => {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Position of the slides
  const goToSlide = function (slide) {
    currentSlide = slide;
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
    activateDots(currentSlide);
  };
  // Next Btn
  const nextSlide = function () {
    if (maxSlide === currentSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
  };
  // Prev btn
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
  };

  // iniciate slider
  createDots();
  goToSlide(currentSlide);

  // Event Handlers

  btnRht.addEventListener('click', nextSlide);

  btnLft.addEventListener('click', prevSlide);

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
    }
  });
};

slider();
