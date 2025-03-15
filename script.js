'use strict';
///////////////////////////////////////
// Модальное окно
const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);

const openModalWindow = function (event) {
  event.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button => button.addEventListener('click', openModalWindow));

for (let i = 0; i < btnsOpenModalWindow.length; i++)
  btnsOpenModalWindow[i].addEventListener('click', openModalWindow);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

///////////////////////////////////////
// Информирование о том, что используем куки.
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = 'Мы используем cookie для улучшения функциональности. <button class="btn btn--close-cookie">Хорошо</button>'

const header = document.querySelector('.header');
header.prepend(message);

document.querySelector('.btn--close-cookie')
.addEventListener('click', function() {
  message.remove();
});

///////////////////////////////////////
// Плавная прокрутка для кнопки "Узнать больше"
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(){
  section1.scrollIntoView({behavior: 'smooth'});
});

///////////////////////////////////////
// Плавная навигация по странице
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({behavior: 'smooth'});
  }
});

///////////////////////////////////////
// Перемещение по вкладкам
const tabs = document.querySelectorAll('.operations__tab');
const tabConteiner = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabConteiner.addEventListener('click', function(e){
  const clickedButton = e.target.closest('.operations__tab');
  if(!clickedButton) return;
  //Активна вкладка
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');
  //Активный конетент-
  tabContents.forEach(content => content.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
});

///////////////////////////////////////
// Анимация потускнения на панели навигации
const navListHoverAnimation = function(e){
  if(e.target.classList.contains('nav__link')){
    const linkOver = e.target;
    const siblingLinks = linkOver.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(el => {
      if(el !== linkOver) el.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
}

const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', navListHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navListHoverAnimation.bind(1));

///////////////////////////////////////
// Sticky navigation
const navHeight = nav.getBoundingClientRect().height;

const getStickyNav = function(entries){
  const entry = entries[0];
  if(!entry.isIntersecting){
    nav.classList.add('sticky');
  }else{
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// Проявление частей сайта

const allSections = document.querySelectorAll('.section');

const apperanceSection = function(entries, observer){
  const entry = entries[0];
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(apperanceSection, {
  root: null,
  threshold: 0.10,
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading
const lazyImages = document.querySelectorAll('img[data-src]');

const loadImages = function(entries, observer){
  const entry = entries[0];
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7,
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

///////////////////////////////////////
// Слайдер
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotConteiner = document.querySelector('.dots');
const slidesNumber = slides.length;
let currentSlide = 0;

const createDots = function(){
  slides.forEach(function(_, index){
    dotConteiner.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${index}"></button>`);
  });
};
const moveToSlide = function(slide){
  slides.forEach((s, index) => s.style.transform = `translateX(${(index - slide) * 100}%)`);
};
const nextSlide = function(){
  currentSlide == slidesNumber - 1 ? currentSlide = 0 : currentSlide++;
  moveToSlide(currentSlide);
  activateCurrentDot(currentSlide);
};
const previousSlide = function(){
  currentSlide === 0 ? currentSlide = slidesNumber - 1 : currentSlide--;
  activateCurrentDot(currentSlide);
  moveToSlide(currentSlide);
};
const activateCurrentDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

createDots();
moveToSlide(0);
activateCurrentDot(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight') nextSlide();
  if(e.key === 'ArrowLeft') previousSlide();
});
dotConteiner.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});