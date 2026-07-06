const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const faqItems = document.querySelectorAll(".landing-faq-item");

const setFaqHeight = (item) => {
  const answer = item.querySelector(".landing-faq-answer");

  if (!answer) {
    return;
  }

  answer.style.maxHeight = item.classList.contains("is-open")
    ? `${answer.scrollHeight}px`
    : "0px";
};

faqItems.forEach((item) => {
  const button = item.querySelector(".landing-faq-question");

  setFaqHeight(item);

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((currentItem) => {
      currentItem.classList.remove("is-open");
      currentItem.querySelector(".landing-faq-question")?.setAttribute("aria-expanded", "false");
      setFaqHeight(currentItem);
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      setFaqHeight(item);
    }
  });
});

window.addEventListener("resize", () => {
  faqItems.forEach(setFaqHeight);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
