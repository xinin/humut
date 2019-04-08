(function ($) {
  $(document).on('click', 'a.nav-link', function (event) {
    const $anchor = $(this);

    $([document.documentElement, document.body]).stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - 50),
    }, 1000);

    event.preventDefault();
  });
}(jQuery)); // End of use strict
