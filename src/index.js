import './style/main.scss';
import './swiper.min.js';
import './slider.js';
import './dynamic_adapt.js';
import catalogFile from './json/products.json';

const check = function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
};

lightGallery(document.getElementById('lightgallery'), {
  selector: '.row-furinture__item',
  speed: 500,
});

const burger = document.querySelector('.menu__icon');

burger.addEventListener('click', function () {
  const menu = document.querySelector('.menu__body');
  menu.classList.toggle('_active');
});

function removeClasses(arr, parameter) {
  arr.forEach((el) => {
    el.classList.remove(parameter);
  });
}

window.onload = function () {
  document.addEventListener('click', documentActions);

  function documentActions(e) {
    const target = e.target;

    if (window.innerWidth > 768 && check) {
      if (target.classList.contains('menu__arrow')) {
        target.closest('.menu__item').classList.toggle('_hover');
      }
      if (!target.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
        const arr = document.querySelectorAll('.menu__item._hover');
        removeClasses(arr, '_hover');
      }
    }
    if (target.classList.contains('search-form__icon')) {
      document.querySelector('.search-form').classList.toggle('search-form_active');
    } else if (!target.closest('.search-form')) {
      document.querySelector('.search-form').classList.remove('search-form_active');
    }
    if (target.classList.contains('products__more')) {
      getProducts(target);
      e.preventDefault();
    }
    if (target.classList.contains('actions-product__button')) {
      const productId = target.closest('.item-product').dataset.pid;
      addToCart(target, productId);
      e.preventDefault();
    }
    if (target.classList.contains('cart-header__icon') || target.closest('.cart-header__icon')) {
      if (document.querySelector('.cart-header__list').children.length > 0) {
        document.querySelector('.cart-header').classList.toggle('_active');
      }
      e.preventDefault();
    } else if (!target.classList.contains('actions-product__button') && !target.closest('cart-header')) {
      document.querySelector('.cart-header').classList.remove('_active');
    }
    if (target.classList.contains('cart-list__delete')) {
      const productId = target.closest('.cart-list__item').dataset.cartPid;
      updateCart(target, productId, false);
      e.preventDefault();
    }
  }
};

function getProducts(btn) {
  if (!btn.classList.contains('_hold')) {
    btn.classList.add('_hold');
    const file = catalogFile;

    loadProducts(file);
    btn.classList.remove('_hold');
    btn.remove();
  } else {
    alert('Ошибка');
  }
}

function loadProducts(data) {
  const productsItems = document.querySelector('.products__items');
  data.products.forEach((item) => {
    const id = item.id;
    const url = item.url;
    const img = item.image;
    const title = item.title;
    const text = item.text;
    const price = item.price;
    const oldPrice = item.priceOld;
    const share = item.shareUrl;
    const like = item.likeUrl;
    const labels = item.labels;

    let productTemplateStart = `<article class="products__item item-product" data-pid="${id}">`;
    let productTemplateEnd = `</article>`;

    let productTemplateLabels = '';

    if (labels) {
      let productTemplateLabelStart = `<div class="item-product__labels">`;
      let productTemplateLabelEnd = `</div>`;
      let productTemplateLabelContent = '';
      labels.forEach((el) => {
        productTemplateLabelContent += `<div class="item-product__label item-product__label_${el.type}">${el.value}</div>`;
      });
      productTemplateLabels += productTemplateLabelStart;
      productTemplateLabels += productTemplateLabelContent;
      productTemplateLabels += productTemplateLabelEnd;
    }

    let priductTemplateImage = ` <a href="${url}" class="item-product__image _ibg">
      <img src="/images/${img}" alt="${title}" />
        </a>`;

    let productTemplateBodyStart = `<div class="item-product__body">`;
    let productTemplateBodyEnd = `</div>`;
    let productTemplateContent = `<div class="item-product__content">
      <h5 class="item-product__title">${title}</h5>
      <div class="item-product__text">${text}</div>
       </div>`;

    let prductTemplatePrice = ``;
    let prductTemplatePriceStart = ` <div class="item-product__prices">`;
    let prductTemplatePriceCurrent = `  <div class="item-product__price">${price}</div>`;
    let prductTemplatePriceOld = `<div class="item-product__price item-product__price_old">${oldPrice}</div>`;
    let prductTemplatePriceEnd = `</div>`;

    prductTemplatePrice = prductTemplatePriceStart;
    prductTemplatePrice += prductTemplatePriceCurrent;
    if (prductTemplatePriceOld) {
      prductTemplatePrice += prductTemplatePriceOld;
    }

    prductTemplatePrice += prductTemplatePriceEnd;

    let productTemplateActions = `
      <div class="item-product__actions actions-product">
        <div class="actions-product__body">
          <a href="#" class="actions-product__button btn btn_white">Add to cart</a>
          <a href="${share}" class="actions-product__link _icon-share">Share</a>
          <a href="${like}" class="actions-product__link _icon-favorite">Like</a>
        </div>
      </div>`;

    let productTemplateBody = '';
    productTemplateBody += productTemplateBodyStart;
    productTemplateBody += productTemplateContent;
    productTemplateBody += prductTemplatePrice;
    productTemplateBody += productTemplateActions;
    productTemplateBody += productTemplateBodyEnd;

    let productTemplate = '';

    productTemplate += productTemplateStart;
    productTemplate += productTemplateLabels;
    productTemplate += priductTemplateImage;
    productTemplate += productTemplateBody;
    productTemplate += productTemplateEnd;

    productsItems.insertAdjacentHTML('beforeend', productTemplate);
  });
}

function addToCart(productButton, productId) {
  if (!productButton.classList.contains('_hold')) {
    productButton.classList.add('_hold');
    productButton.classList.add('_fly');

    const cart = document.querySelector('.cart-header__icon');
    const product = document.querySelector(`[data-pid="${productId}"]`);
    const productImage = product.querySelector('.item-product__image');

    const productImgFly = productImage.cloneNode(true);

    const productImgFlyWidth = productImage.offsetWidth;
    const productImgFlyHeight = productImage.offsetHeight;
    const productImgFlyTop = productImage.getBoundingClientRect().top;
    const productImgFlyLeft = productImage.getBoundingClientRect().left;

    productImgFly.setAttribute('class', '_flyimg _ibg');
    productImgFly.style.cssText = `
    left: ${productImgFlyLeft}px;
    top: ${productImgFlyTop}px;
    width: ${productImgFlyWidth}px;
    height: ${productImgFlyHeight}px;
    `;

    document.body.append(productImgFly);

    const cartTop = cart.getBoundingClientRect().top;
    const cartLeft = cart.getBoundingClientRect().left;

    productImgFly.style.cssText = `
    left: ${cartLeft}px;
    top: ${cartTop}px;
    width: 0px;
    height: 0px;
    opacity: 0;
    `;

    productImgFly.addEventListener('transitionend', function () {
      if (productButton.classList.contains('_fly')) {
        productImgFly.remove();
        updateCart(productButton, productId);
        productButton.classList.remove('_fly');
      }
    });
  }
}

function updateCart(productButton, productId, productAdd = true) {
  const cart = document.querySelector('.cart-header');
  const cartIcon = cart.querySelector('.cart-header__icon');
  const cartQuantity = cartIcon.querySelector('span');
  const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
  const cartList = document.querySelector('.cart-header__list');

  if (productAdd) {
    if (cartQuantity) {
      cartQuantity.innerHTML = ++cartQuantity.innerHTML;
    } else {
      cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
    }
    if (!cartProduct) {
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const cartProductImg = product.querySelector('.item-product__image').innerHTML;
      const cartProductTitle = product.querySelector('.item-product__title').innerHTML;

      const cartProductContent = `
      <a href="" class="cart-list__image _ibg">${cartProductImg}</a>
      <div class="cart-list__body">
        <a href="" class="cart-list__title">${cartProductTitle}</a>
        <div class="cart-list__quantity">Quantity: <span>1</span></div>
        <a href="" class="cart-list__delete">Delete</a>
      </div>
      `;
      cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
    } else {
      const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');

      cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
    }

    productButton.classList.remove('_hold');
  } else {
    const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
    cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
    if (!parseInt(cartProductQuantity.innerHTML)) {
      cartProduct.remove();
    }
    const cartQuantityValue = --cartQuantity.innerHTML;

    if (cartQuantityValue) {
      cartQuantity.innerHTML = cartQuantityValue;
    } else {
      cartQuantity.remove();
      cart.classList.remove('_active');
    }
  }
}

const header = document.querySelector('.header');

const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    header.classList.remove('_scroll');
  } else {
    header.classList.add('_scroll');
  }
};
const headerObserver = new IntersectionObserver(callback);

headerObserver.observe(header);

//SlideToggle
let _slideUp = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = true;
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
    }, duration);
  }
};
let _slideDown = (target, duration = 500) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    if (target.hidden) {
      target.hidden = false;
    }
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
    }, duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};

// SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');

if (spollersArray.length > 0) {
  // Получение обычных слойлеров
  const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
    return !item.dataset.spollers.split(',')[0];
  });
  // Инициализация обычных слойлеров
  if (spollersRegular.length > 0) {
    initSpollers(spollersRegular);
  }

  // Получение слойлеров с медиа запросами
  const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
    return item.dataset.spollers.split(',')[0];
  });

  // Инициализация слойлеров с медиа запросами
  if (spollersMedia.length > 0) {
    const breakpointsArray = [];
    spollersMedia.forEach((item) => {
      const params = item.dataset.spollers;
      const breakpoint = {};
      const paramsArray = params.split(',');
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });

    // Получаем уникальные брейкпоинты
    let mediaQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
    });
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });

    // Работаем с каждым брейкпоинтом
    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(',');
      const mediaBreakpoint = paramsArray[1];
      const mediaType = paramsArray[2];
      const matchMedia = window.matchMedia(paramsArray[0]);

      // Объекты с нужными условиями
      const spollersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.type === mediaType) {
          return true;
        }
      });
      // Событие
      matchMedia.addListener(function () {
        initSpollers(spollersArray, matchMedia);
      });
      initSpollers(spollersArray, matchMedia);
    });
  }
  // Инициализация
  function initSpollers(spollersArray, matchMedia = false) {
    spollersArray.forEach((spollersBlock) => {
      spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
      if (matchMedia.matches || !matchMedia) {
        spollersBlock.classList.add('_init');
        initSpollerBody(spollersBlock);
        spollersBlock.addEventListener('click', setSpollerAction);
      } else {
        spollersBlock.classList.remove('_init');
        initSpollerBody(spollersBlock, false);
        spollersBlock.removeEventListener('click', setSpollerAction);
      }
    });
  }
  // Работа с контентом
  function initSpollerBody(spollersBlock, hideSpollerBody = true) {
    const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
    if (spollerTitles.length > 0) {
      spollerTitles.forEach((spollerTitle) => {
        if (hideSpollerBody) {
          spollerTitle.removeAttribute('tabindex');
          if (!spollerTitle.classList.contains('_active')) {
            spollerTitle.nextElementSibling.hidden = true;
          }
        } else {
          spollerTitle.setAttribute('tabindex', '-1');
          spollerTitle.nextElementSibling.hidden = false;
        }
      });
    }
  }
  function setSpollerAction(e) {
    const el = e.target;
    if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
      const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
      const spollersBlock = spollerTitle.closest('[data-spollers]');
      const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
      if (!spollersBlock.querySelectorAll('._slide').length) {
        if (oneSpoller && !spollerTitle.classList.contains('_active')) {
          hideSpollersBody(spollersBlock);
        }
        spollerTitle.classList.toggle('_active');
        _slideToggle(spollerTitle.nextElementSibling, 500);
      }
      e.preventDefault();
    }
  }
  function hideSpollersBody(spollersBlock) {
    const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
    if (spollerActiveTitle) {
      spollerActiveTitle.classList.remove('_active');
      _slideUp(spollerActiveTitle.nextElementSibling, 500);
    }
  }
}
//========================================================================================================================================================

//========================================================================================================================================================
/*
Для родителя слойлеров пишем атрибут data-spollers
Для заголовков слойлеров пишем атрибут data-spoller
Если нужно включать\выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например:
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно что бы в блоке открывался болько один слойлер добавляем атрибут data-one-spoller
*/

const input = document.querySelector('.subscribe__input');

function email_test(input) {
  return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

let forms = document.querySelectorAll('form');
if (forms.length > 0) {
  for (let index = 0; index < forms.length; index++) {
    const el = forms[index];
    el.addEventListener('submit', form_submit);
  }
}
async function form_submit(e) {
  let btn = e.target;
  let form = btn.closest('form');
  let error = form_validate(form);
  if (form.hasAttribute('data-test') && !form.classList.contains('_error')) {
    e.preventDefault();
    form_add_error(input);
    form_clean(form);
  } else {
    form_remove_error(input);
  }
}

function form_validate(form) {
  let error = 0;
  let form_req = form.querySelectorAll('._req');
  if (form_req.length > 0) {
    for (let index = 0; index < form_req.length; index++) {
      const el = form_req[index];
    }
  }
  return error;
}

function form_add_error(input) {
  input.classList.add('_error');
  input.parentElement.classList.add('_error');

  let input_error = input.parentElement.querySelector('.form__error');
  if (input_error) {
    input.parentElement.removeChild(input_error);
  }
  let input_error_text = input.getAttribute('data-error');
  if (input_error_text && input_error_text != '') {
    input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
  }
}
function form_remove_error(input) {
  input.classList.remove('_error');
  input.parentElement.classList.remove('_error');

  let input_error = input.parentElement.querySelector('.form__error');
  if (input_error) {
    input.parentElement.removeChild(input_error);
  }
}
function form_clean(form) {
  let inputs = form.querySelectorAll('input,textarea');
  for (let index = 0; index < inputs.length; index++) {
    const el = inputs[index];
    el.parentElement.classList.remove('_focus');
    el.classList.remove('_focus');
    el.value = el.getAttribute('data-value');
  }
  let checkboxes = form.querySelectorAll('.checkbox__input');
  if (checkboxes.length > 0) {
    for (let index = 0; index < checkboxes.length; index++) {
      const checkbox = checkboxes[index];
      checkbox.checked = false;
    }
  }
}
