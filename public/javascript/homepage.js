
gsap.fromTo(".name", { x: -600, fill: 'black', duration: 2 }, { x: 2, fill: 'white', duration: 2 });
gsap.from(".full-stack", { opacity: 0, duration: 1, delay: 1 });
gsap.from(".btn1", { opacity: 0, duration: 1, delay: 3.5 });

gsap.from(".description", { opacity: 0, duration: 1, delay: 3 });
gsap.from(".image", { opacity: 0, duration: 1, delay: 4 });


gsap.to(".image2", {
    rotation: 360,
    duration: 1,
    ease: "bounce.out",
    scrollTrigger: {
        trigger: '.name',
        start: "300px bottom",
        end: "400px top",
        scrub: 2,

    }
});
const mm = window.matchMedia("(max-width: 768px)");

if (mm.matches) {
    // Apply animation for viewport widths <= 768px
    gsap.to(".about-title .h1", {
        x: '10vh',
        duration: 1,
        scrollTrigger: {
            trigger: '.name',
            start: "800px bottom",
            end: "900px top",
            scrub: true,
        }
    });
} else {
    // Apply animation for viewport widths > 768px
    gsap.to(".about-title .h1", {
        x: '100vh',
        duration: 1,
        scrollTrigger: {
            trigger: '.name',
            start: "800px bottom",
            end: "900px top",
            scrub: true,
        }
    });
}




gsap.to(".paragraph", {
    duration: 1,
    x: 100,
    xPercent: -20,

    attr: {
        fill: '#8d3dae',
        rx: 50,
    },
    scrollTrigger: {
        trigger: '.name',
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    }
});



gsap.fromTo(
    "#about",
    { y: 900 },
    {
        y: "100%",
        scrollTrigger: {
            trigger: "#about",
            start: "top top", // Stick when the top of the section reaches the top of the viewport
            end: "+=200", // Unstick after scrolling 200 pixels further
            // pin: true,
            pinSpacing: false
        }
    }
);

gsap.fromTo(
    ".portfolio",
    { y: "100%" },
    {
        y: "-40%",
        duration: 1,
        delay: 4,
        scrollTrigger: {
            trigger: ".portfolio",
            start: "900px 80%",
            end: "bottom top",
            scrub: true,
        },
    }
);



gsap.to(".att1", {
    opacity: .4,
    duration: 1,
    delay: 0,
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});

gsap.to(".att2", {
    opacity: .3,
    duration: 2,
    delay: 1,
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});
gsap.to(".att3", {
    opacity: .3,
    duration: 3,
    delay: 2,
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});
gsap.to(".att4", {
    opacity: .3,
    duration: 4,
    delay: 3,
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});
gsap.to(".att5", {
    opacity: .3,
    duration: 5,
    delay: 4,
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
    },
});

const projectSection = document.querySelector('.portfolio');
const knowSection = document.getElementById('know');

const projectAnim = gsap.timeline({
    scrollTrigger: {
        trigger: projectSection,
        toggleActions: "restart pause resume reset",
        start: 'top bottom',
        end: 'bottom top',
    }
});

projectAnim.from(".project", {
    duration: 2,
    scale: 0.5,
    opacity: 0,
    delay: 0.5,
    stagger: 0.2,
    ease: "elastic",
    force3D: true
});


