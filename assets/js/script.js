import './jquery-3.6.0.min.js';
import './jquery-ui.min.js';

$(function () {
    /**
     * Fixed Header
     */
    let $header = $('header');
    let $page = $('#page');
    let $menuContainer = $('.main-menu-container');
    let minScreenWidth = 992;

    function adjustPagePadding() {
        let headerHeight = $header.outerHeight();
        $page.css('padding-top', headerHeight + 'px');
    }

    function handleScroll() {
        if ($(window).width() >= minScreenWidth) {
            let scrollPosition = $(window).scrollTop();
            let triggerHeight = $menuContainer.outerHeight() - 34;

            if (scrollPosition > triggerHeight) {
                $header.addClass('fixed-header');
            } else {
                $header.removeClass('fixed-header');
            }
        } else {
            $header.removeClass('fixed-header');
        }
    }

    function onResizeOrScroll() {
        adjustPagePadding();
        handleScroll();
    }

    adjustPagePadding();
    $(window).on('scroll', handleScroll);
    $(window).on('resize', onResizeOrScroll);

    $('.hamburger-wrapper').on('click', function () {
        $('.hamburger-menu').toggleClass('animate');
        $('.main-menu-container').toggleClass('focus');
    })
    $('.main-menu-container a').on('click', function () {
        $('.hamburger-menu').removeClass('animate');
        $('.main-menu-container').removeClass('focus');
    })
    $('main, footer, .footer-colls-section').on('click', function () {
        if ($('.hamburger-menu').hasClass('animate')) {
            $('.hamburger-menu').toggleClass('animate');
        }
        if ($(".main-menu-container").hasClass('focus')) {
            $('.main-menu-container').toggleClass('focus');
        }
    })

    /**
     * Events Sections
     */
    let currentDate = $.datepicker.formatDate('yy-mm-dd', new Date());
    let activeCategory = 'all';
    let eventsData = [];

    $.getJSON('/assets/js/data.json', function (data) {
        eventsData = data;
        loadEvents();
        updateCategoryButtons();
        initializeDatepicker();
    });

    function loadEvents() {
        let filteredEvents = eventsData.filter(event => {
            return event.date === currentDate && (activeCategory === 'all' || event.category === activeCategory);
        });

        if (filteredEvents.length === 0) {
            const hasEventsForDate = eventsData.some(event => event.date === currentDate);
            if (!hasEventsForDate) {
                const availableDates = [...new Set(eventsData.map(event => event.date))].sort();
                const previousDate = availableDates.filter(date => date < currentDate).pop();
                if (previousDate) {
                    currentDate = previousDate;
                }
            }
            activeCategory = 'all';
            $('.filter-buttons button').removeClass('active');
            $('button[data-category="all"]').addClass('active');
            filteredEvents = eventsData.filter(event => event.date === currentDate);
        }
        displayEvents(filteredEvents);
    }

    function displayEvents(events) {
        $('#events-list').empty();
        events.forEach(event => {
            $('#events-list').append(`<div class="event-card">
                    <a href="#">
                        <figure>
                            <img src="${event.thumb}" alt="${event.title}">
                            <figcaption>
                                <span>${event.date}</span>
                                <h4>${event.title}</h4>
                            </figcaption>
                        </figure>
                    </a>
                </div>
            `);
        });
    }

    function updateCategoryButtons() {
        const currentEvents = eventsData.filter(event => event.date === currentDate);
        $('.filter-buttons button').each(function () {
            const category = $(this).data('category');
            const hasCategory = currentEvents.some(event => category === 'all' || event.category === category);
            if (hasCategory) {
                $(this).prop('disabled', false);
            } else {
                $(this).prop('disabled', true);
            }
        });
    }

    function initializeDatepicker() {
        $('#datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            firstDay: 0,
            prevText: '',
            nextText: '',
            beforeShowDay: function (date) {
                const formattedDate = $.datepicker.formatDate('yy-mm-dd', date)
                const hasEvents = eventsData.some(event => event.date === formattedDate);

                if (hasEvents) {
                    return [true, 'has-content'];
                } else {
                    return [false, ''];
                }
            },
            onSelect: function (dateText) {
                currentDate = dateText;
                loadEvents();
                updateCategoryButtons();
            },
        });
    }

    $('.filter-buttons button').on('click', function () {
        if ($(this).is(':disabled')) return;
        $('.filter-buttons button').removeClass('active');
        $(this).addClass('active');
        activeCategory = $(this).data('category');
        loadEvents();
    });

    $.datepicker.setDefaults($.datepicker.regional['lt'] = {
        closeText: 'Uždaryti',
        prevText: '',
        nextText: '',
        currentText: 'Šiandien',
        monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
            'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
        monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
            'Lie', 'Rgp', 'Rgs', 'Spa', 'Lap', 'Grd'],
        dayNames: ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Trečiadienis', 'Ketvirtadienis', 'Penktadienis', 'Šeštadienis'],
        dayNamesShort: ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'],
        dayNamesMin: ['Pr', 'An', 'Tr', 'Ke', 'Pn', 'Še', 'Sk'],  // Custom short day names
        weekHeader: 'SAV',
        dateFormat: 'yy-mm-dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    });
});

/**
 * Swiper Sliders
 */
const initializeSwipers = () => {
	const swipers = document.querySelectorAll('.swiper');
	swipers.forEach((swiperContainer) => {
	  let options = {
		navigation: {
		  nextEl: '.swiper-button-next',
		  prevEl: '.swiper-button-prev',
		},
		loop: true,
		speed: 600,
	  };
  
	  if (swiperContainer.classList.contains('hero-slider')) {
		options = {
		  ...options,
		  slidesPerView: 1,
		  effect: 'slide',
		  loop: true,
		};
  
	  } else if (swiperContainer.classList.contains('publications-swiper')) {
		options = {
		  ...options,
		  slidesPerView: 4,
		  spaceBetween: 30,
		  loop: true,
		  breakpoints: {
			320: { slidesPerView: 2, spaceBetween: 20 },
			768: { slidesPerView: 3, spaceBetween: 25 },
			1024: { slidesPerView: 4, spaceBetween: 30 },
		  },
		};
  
	  } else if (swiperContainer.classList.contains('partners-swiper')) {
		options = {
		  ...options,
		  slidesPerView: 5,
		  spaceBetween: 0,
		  drag: false,
		  loop: true,
          breakpoints: {
			320: { slidesPerView: 2, spaceBetween: 15 },
			768: { slidesPerView: 3, spaceBetween: 20 },
			992: { slidesPerView: 4, spaceBetween: 30 },
			1200: { slidesPerView: 5, spaceBetween: 30 },
		  },
		};
	  }
  
	  new Swiper(swiperContainer, options);
	});
};

initializeSwipers();