/* =========================
   GET ELEMENTS
========================= */

const cards = document.querySelectorAll(".testimonial-card");

const dots = document.querySelectorAll(".dot");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");


/* =========================
   CURRENT SLIDE
========================= */

let currentSlide = 0;


/* =========================
   SHOW SLIDE FUNCTION
========================= */

function showSlide(index) {

    /*
       If index becomes smaller than 0,
       go to the last card.
    */

    if (index < 0) {
        currentSlide = cards.length - 1;
    }

    /*
       If index becomes greater than
       the number of cards, go to first.
    */

    else if (index >= cards.length) {
        currentSlide = 0;
    }

    else {
        currentSlide = index;
    }


    /* Remove active class from all cards */

    cards.forEach((card) => {
        card.classList.remove("active");
    });


    /* Remove active class from all dots */

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });


    /* Show current card */

    cards[currentSlide].classList.add("active");


    /* Activate current dot */

    dots[currentSlide].classList.add("active");
}


/* =========================
   NEXT BUTTON
========================= */

nextBtn.addEventListener("click", () => {

    showSlide(currentSlide + 1);

});


/* =========================
   PREVIOUS BUTTON
========================= */

prevBtn.addEventListener("click", () => {

    showSlide(currentSlide - 1);

});


/* =========================
   DOT BUTTONS
========================= */

dots.forEach((dot) => {

    dot.addEventListener("click", () => {

        const slideNumber =
            Number(dot.dataset.slide);

        showSlide(slideNumber);

    });

});


/* =========================
   AUTO SLIDER
========================= */

let autoSlide = setInterval(() => {

    showSlide(currentSlide + 1);

}, 5000);


/* =========================
   STOP AUTO SLIDER WHEN
   USER INTERACTS
========================= */

const buttons = [
    prevBtn,
    nextBtn,
    ...dots
];


buttons.forEach((button) => {

    button.addEventListener("click", () => {

        clearInterval(autoSlide);

        autoSlide = setInterval(() => {

            showSlide(currentSlide + 1);

        }, 5000);

    });

});