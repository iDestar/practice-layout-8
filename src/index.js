import './style/main.scss';

const check = function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
};

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
  }
};
