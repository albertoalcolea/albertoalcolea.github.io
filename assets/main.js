$(document).ready(function() {
  // Navbar menu toggle
  $('#navbar-toggle-button').click(function(e) {
    e.preventDefault();
    $('#navbar-menu').toggleClass('active');
  });

  $('#navbar-menu a').click(function(e) {
    $('#navbar-menu').removeClass('active');
  });

  $(window).resize(function(e) {
    $('#navbar-menu').removeClass('active');
  });

  // Header shrink
  $(window).scroll(function () {
    headerShrink();
  });
  headerShrink();

  // Contact me animation
  $('#nav-contact').click(function(e) {
    e.preventDefault();
    this.blur();
    $('#greeting').animate({top: '35px', opacity: '0'});
    $('html, body').animate({scrollTop: $(this.hash).offset().top}, 300, function() {
      $('#greeting').show();
      $('#greeting').animate({top: '10px', opacity: '1'}, 300, function() {
        $('#greeting').delay(1500).animate({top: '-85px', opacity: '0'}, 300);
      });
    });
  });
});

function headerShrink() {
  if ($(document).scrollTop() < 100) {
    $('header').removeClass('shrink');
  } else {
    $('header').addClass('shrink');
  }
}
