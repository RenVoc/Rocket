
$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 10) {
        $(".header").addClass("fixed");
    } else {
        $(".header").removeClass("fixed");
    }
});