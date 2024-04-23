$(function () {

  /* 오류 설계 쉽게 하기 위해 user strict */
  "use strict";

  /* 마우스 올리면 툴팁 표시 */
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });


  $(document).ready(function () {
    $(".main-menu ul li.megamenu").mouseover(function () {
      if (!$(this).parent().hasClass("#wrapper")) {
        $("#wrapper").addClass('overlay');
      }
    });
    $(".main-menu ul li.megamenu").mouseleave(function () {
      $("#wrapper").removeClass('overlay');
    });
  });


  $(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
      $(this).toggleClass('active');
    });
  });

  $('#blogCarousel').carousel({
    interval: 5000
  });


});

function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}


(function ($) {
  function doAnimations(elems) {
    var animEndEv = "webkitAnimationEnd animationend";

    elems.each(function () {
      var $this = $(this),
        $animationType = $this.data("animation");
      $this.addClass($animationType).one(animEndEv, function () {
        $this.removeClass($animationType);
      });
    });
  }

  var $myCarousel = $("#carouselExampleIndicators"),
    $firstAnimatingElems = $myCarousel
    .find(".carousel-item:first")
    .find("[data-animation ^= 'animated']");

  $myCarousel.carousel();

  doAnimations($firstAnimatingElems);

  $myCarousel.on("slide.bs.carousel", function (e) {
    var $animatingElems = $(e.relatedTarget).find(
      "[data-animation ^= 'animated']"
    );
    doAnimations($animatingElems);
  });
})(jQuery);



$(document).ready(function () {
  $(".collapse.show").each(function () {
    $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
  });

  $(".collapse").on('show.bs.collapse', function () {
    $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
  }).on('hide.bs.collapse', function () {
    $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
  });
});

function onChangeCallback(ctr) {
  console.log("The country was changed: " + ctr);
}

$(document).ready(function () {
  $(".niceCountryInputSelector").each(function (i, e) {
    new NiceCountryInput(e).init();
  });
});



$('.owl-carousel').owlCarousel({
  loop: true,
  margin: 15,
  nav: true,

  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 3
    },
    1000: {
      items: 3
    }
  }
})


const navToggler = document.querySelector('.nav-toggler');
const navMenu = document.querySelector('.site-navbar ul');
const navLinks = document.querySelectorAll('.site-navbar a');

allEventListners();

function allEventListners() {
  navToggler.addEventListener('click', togglerClick);
  navLinks.forEach( elem => elem.addEventListener('click', navLinkClick));
}

function togglerClick() {
  navToggler.classList.toggle('toggler-open');
  navMenu.classList.toggle('open');
}

function navLinkClick() {
  if(navMenu.classList.contains('open')) {
    navToggler.click();
  }
}
