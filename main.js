// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
    });
});

// Hover effect for cursor
const hoverElements = document.querySelectorAll('a, button, .card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursorFollower, {
            scale: 1.5,
            borderColor: '#ff2a00',
            duration: 0.2
        });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursorFollower, {
            scale: 1,
            borderColor: '#ff6600',
            duration: 0.2
        });
    });
});

// =====================================
// GSAP Animations
// =====================================

// 1. Hero Parallax
gsap.to('.hero-bg', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

gsap.to('.hero-title', {
    y: 100,
    opacity: 0,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// 2. Car Design Reveals
const carParts = gsap.utils.toArray('.part-info');
carParts.forEach((part, i) => {
    gsap.fromTo(part, 
        { autoAlpha: 0, scale: 0.8, y: 50 },
        { 
            autoAlpha: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: part,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

gsap.from('.f1-car-img', {
    x: 200,
    autoAlpha: 0,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".car-design",
        start: "top 70%",
    }
});

// 3. Engineering Timeline
const timelineItems = gsap.utils.toArray('.timeline-content');
timelineItems.forEach((item, i) => {
    gsap.to(item, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // Dot pulse
    const dot = item.parentElement.querySelector('.timeline-dot');
    gsap.from(dot, {
        scale: 0,
        duration: 0.5,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// 4. Management Cards
gsap.from('.card', {
    y: 100,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".management",
        start: "top 70%",
    }
});

// 5. Team Reveal
gsap.to('.team-member', {
    opacity: 1,
    y: -20,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".team",
        start: "top 75%",
    }
});

// 6. Infinite Sponsor Scroll
gsap.to('.sponsor-track', {
    xPercent: -50,
    ease: "none",
    duration: 20,
    repeat: -1
});
