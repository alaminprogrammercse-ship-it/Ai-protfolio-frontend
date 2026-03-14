document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("theme-toggle");
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const submitBtn = document.getElementById("submit-btn");
  const counters = document.querySelectorAll(".counter");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  // Local test
  // const BACKEND_URL = "http://localhost:5000/api/contact";

  // Live backend URL here when deployed
  const BACKEND_URL = "https://ai-protfolio-backend-2.onrender.com/api/contact";

  // Mobile menu
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      const icon = menuToggle.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    });
  });

  // Theme toggle
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");
    themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  });

  // Reveal animations
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");

          const bars = entry.target.querySelectorAll(".progress-bar");
          bars.forEach((bar) => {
            const width = bar.getAttribute("data-width");
            if (width) bar.style.width = width;
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Active nav on scroll
  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");
      const currentLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (currentLink) currentLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  // Counters
  let countersStarted = false;
  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 60));

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = `${target}+`;
        } else {
          counter.textContent = current;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  }

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCounters();
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(heroStats);
  }

  // Project filters
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  // Testimonials
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const dotsContainer = document.getElementById("slider-dots");
  let currentIndex = 0;
  let autoSlide;

  function createDots() {
    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        currentIndex = index;
        showTestimonial(currentIndex);
        resetAutoSlide();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function showTestimonial(index) {
    testimonials.forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".slider-dot").forEach((dot) => dot.classList.remove("active"));

    testimonials[index].classList.add("active");
    const activeDot = document.querySelectorAll(".slider-dot")[index];
    if (activeDot) activeDot.classList.add("active");
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextTestimonial, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  if (testimonials.length > 0) {
    createDots();
    showTestimonial(currentIndex);
    startAutoSlide();

    nextBtn.addEventListener("click", () => {
      nextTestimonial();
      resetAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
      prevTestimonial();
      resetAutoSlide();
    });
  }

  // Contact form with timeout
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formMessage.textContent = "সব ঘর পূরণ করুন।";
      formMessage.style.color = "#ff6b81";
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formMessage.textContent = "Sending...";
      formMessage.style.color = "#00d5ff";

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, message }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.success) {
        formMessage.textContent = data.message || "Message sent successfully.";
        formMessage.style.color = "#00ffb3";
        form.reset();
      } else {
        formMessage.textContent = data.message || "Submit failed.";
        formMessage.style.color = "#ff6b81";
      }
    } catch (error) {
      if (error.name === "AbortError") {
        formMessage.textContent = "Server response দিতে বেশি সময় নিচ্ছে। আবার চেষ্টা করুন।";
      } else {
        formMessage.textContent = "Connection timeout বা server error হয়েছে।";
      }
      formMessage.style.color = "#ff6b81";
      console.error("Fetch error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  // Particle background
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(90, Math.floor(window.innerWidth / 18));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 213, 255, 0.7)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(124, 92, 255, ${1 - distance / 120})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    animationFrameId = requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrameId);
  });
});
