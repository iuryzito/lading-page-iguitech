document.body.classList.add("js-ready");

const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...params,
  });
};

const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sequenceItems = document.querySelectorAll("[data-sequence]");

const sequenceObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.28 }
);

sequenceItems.forEach((item) => sequenceObserver.observe(item));

const sectionViewObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.trackedView === "true") return;
      entry.target.dataset.trackedView = "true";
      trackEvent("section_view", {
        section_id: entry.target.id || entry.target.className || entry.target.tagName.toLowerCase(),
      });
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("main > section").forEach((section) => sectionViewObserver.observe(section));

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href") || "";
    const isSignup = href.includes("app.iguitech.com") && href.includes("signup");
    const isAnchor = href.startsWith("#");
    trackEvent(isSignup ? "cta_signup_click" : "link_click", {
      link_text: link.textContent.trim(),
      link_url: link.href,
      link_type: isAnchor ? "anchor" : "external",
    });
  });
});

document.querySelectorAll("[data-tilt]").forEach((element) => {
  const target = element.querySelector(".platform-window") || element;

  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    target.style.transform = `rotateX(${3 - y * 6}deg) rotateY(${-5 + x * 8}deg) translateY(${y * 6}px) scale(0.92)`;
  });

  element.addEventListener("mouseleave", () => {
    target.style.transform = "";
  });
});

const heroConversations = {
  mix: [
    { type: "typing", side: "client", text: "Cliente digitando..." },
    { type: "bubble", side: "client", name: "Cliente", text: "Olá, vocês tem martelo bola?", time: "10:22" },
    { type: "typing", side: "ai", text: "I.A consultando estoque..." },
    {
      type: "bubble",
      side: "ai",
      name: "I.A",
      text: "Oii, temos sim. Separei 3 opções com preço e todas estão disponíveis em estoque.",
      time: "10:22",
    },
    {
      type: "products",
      items: [
        ["Martelo bola 500g", "R$ 39,90"],
        ["Martelo bola 700g", "R$ 49,90"],
        ["Martelo bola 1kg", "R$ 64,90"],
      ],
    },
    { type: "bubble", side: "client", name: "Cliente", text: "Nossa, que resposta rápida, vou querer comprar!", time: "10:22" },
    { type: "bubble", side: "ai", name: "I.A", text: "Que bom que gostou. Já estou te encaminhando para vendas.", time: "10:22" },
  ],
  planner: [
    { type: "typing", side: "client", text: "Cliente digitando..." },
    { type: "bubble", side: "client", name: "Cliente", text: "Preciso falar com suporte sobre abertura de empresa.", time: "10:23" },
    { type: "typing", side: "ai", text: "I.A classificando setor..." },
    {
      type: "bubble",
      side: "ai",
      name: "I.A",
      text: "Claro. Já identifiquei que seu atendimento é contábil e vou te encaminhar para o setor responsável.",
      time: "10:23",
    },
    { type: "bubble", side: "client", name: "Cliente", text: "Perfeito, obrigado pela rapidez.", time: "10:23" },
    { type: "bubble", side: "ai", name: "I.A", text: "Enquanto isso, deixei seu contato e demanda registrados no histórico da empresa.", time: "10:23" },
  ],
  redacao: [
    { type: "typing", side: "client", text: "Cliente digitando..." },
    { type: "bubble", side: "client", name: "Cliente", text: "Quero automatizar os leads que chegam pelo Instagram.", time: "10:24" },
    { type: "typing", side: "ai", text: "I.A entendendo demanda..." },
    {
      type: "bubble",
      side: "ai",
      name: "I.A",
      text: "Consigo te ajudar. A IGUITECH centraliza esses contatos, responde primeiro e encaminha os leads para o funil.",
      time: "10:24",
    },
    {
      type: "products",
      items: [
        ["Captação", "Instagram"],
        ["Pré-venda", "IA"],
        ["Follow-up", "Funil"],
      ],
    },
    { type: "bubble", side: "client", name: "Cliente", text: "Era exatamente isso que eu precisava.", time: "10:24" },
  ],
};

const heroChat = document.querySelector(".chat-bubbles");
const heroLeadCards = document.querySelectorAll(".lead-card[data-conversation]");

const renderHeroConversation = (conversationId) => {
  const conversation = heroConversations[conversationId] || heroConversations.mix;
  if (!heroChat) return;

  heroChat.innerHTML = "";

  conversation.forEach((message, index) => {
    if (message.type === "typing") {
      const typing = document.createElement("p");
      typing.className = `typing-bubble ${message.side === "ai" ? "ai-typing" : "client-typing"}`;
      typing.style.animationDelay = `${index * 260}ms`;
      const [name, ...rest] = message.text.split(" ");
      typing.innerHTML = `<strong>${name}</strong> ${rest.join(" ")}`;
      heroChat.appendChild(typing);
      return;
    }

    if (message.type === "products") {
      const row = document.createElement("div");
      row.className = "product-row";
      row.style.animationDelay = `${index * 260}ms`;
      row.innerHTML = message.items
        .map(([label, value]) => `<article>${label}<strong>${value}</strong></article>`)
        .join("");
      heroChat.appendChild(row);
      return;
    }

    const bubble = document.createElement("p");
    bubble.className = `bubble ${message.side}`;
    bubble.style.animationDelay = `${index * 260}ms`;
    bubble.innerHTML = `<strong>${message.name}</strong>${message.text}<span>${message.time}</span>`;
    heroChat.appendChild(bubble);
  });
};

heroLeadCards.forEach((card) => {
  const activate = () => {
    heroLeadCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    renderHeroConversation(card.dataset.conversation);
    trackEvent("hero_conversation_select", {
      conversation: card.dataset.conversation || "unknown",
      card_title: card.querySelector("strong")?.textContent?.trim() || "",
    });
  };

  card.addEventListener("click", activate);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

renderHeroConversation("mix");

const floatingRobot = document.querySelector("#floatingRobot");
const robotStops = [
  { selector: ".hero", desktop: { x: 0.34, y: 0.16 }, mobile: { x: 0.88, y: 0.76 } },
  { selector: ".proof-carousel", desktop: { x: 0.22, y: 0.46 }, mobile: { x: 0.12, y: 0.78 } },
  { selector: ".delivery", desktop: { x: 0.78, y: 0.18 }, mobile: { x: 0.88, y: 0.78 } },
  { selector: ".ai-section", desktop: { x: 0.24, y: 0.22 }, mobile: { x: 0.12, y: 0.78 } },
  { selector: ".founder", desktop: { x: 0.78, y: 0.2 }, mobile: { x: 0.88, y: 0.78 } },
  { selector: ".clients", desktop: { x: 0.26, y: 0.25 }, mobile: { x: 0.12, y: 0.78 } },
  { selector: ".pricing", desktop: { x: 0.78, y: 0.2 }, mobile: { x: 0.88, y: 0.78 } },
  { selector: ".faq", desktop: { x: 0.28, y: 0.2 }, mobile: { x: 0.12, y: 0.78 } },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const mobileRobotSafeSelectors = [
  "h1",
  "h2",
  "h3",
  "p",
  ".button",
  ".tweet-card",
  ".feature-card",
  ".whatsapp-panel",
  ".founder-photo img",
  ".logo-marquee",
  ".price-card",
  ".faq-item",
];

const rectOverlapArea = (a, b) => {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
};

const getMobileSafeRobotTarget = (target, size) => {
  if (window.innerWidth >= 760) return target;

  const safePad = 12;
  const maxX = window.innerWidth - size - safePad;
  const maxY = window.innerHeight - size * 1.22 - safePad;
  const candidatePoints = [
    { x: target.x, y: target.y },
    { x: safePad, y: safePad + 72 },
    { x: maxX, y: safePad + 72 },
    { x: safePad, y: window.innerHeight * 0.48 },
    { x: maxX, y: window.innerHeight * 0.48 },
    { x: safePad, y: maxY },
    { x: maxX, y: maxY },
  ];
  const blockers = mobileRobotSafeSelectors
    .flatMap((selector) => [...document.querySelectorAll(selector)])
    .map((element) => element.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);

  const best = candidatePoints
    .map((point) => {
      const x = clamp(point.x, safePad, maxX);
      const y = clamp(point.y, safePad, maxY);
      const rect = { left: x, top: y, right: x + size, bottom: y + size * 1.22 };
      const overlap = blockers.reduce((sum, blocker) => sum + rectOverlapArea(rect, blocker), 0);
      const travel = Math.abs(x - target.x) + Math.abs(y - target.y);
      return { x, y, overlap, score: overlap * 100 + travel };
    })
    .sort((a, b) => a.score - b.score)[0];

  floatingRobot?.classList.toggle("is-low-profile", (best?.overlap || 0) > 120);

  return {
    ...target,
    x: best?.x ?? target.x,
    y: best?.y ?? target.y,
    scale: Math.min(target.scale, (best?.overlap || 0) > 120 ? 0.68 : 0.86),
  };
};

const getRobotTargets = () => {
  const isMobile = window.innerWidth < 760;
  const robotSize = floatingRobot?.getBoundingClientRect().width || 90;
  const safePad = isMobile ? 16 : 28;
  const maxX = window.innerWidth - robotSize - safePad;
  const maxY = window.innerHeight - robotSize * 1.22 - safePad;

  return robotStops
    .map((stop) => {
      const section = document.querySelector(stop.selector);
      if (!section) return null;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionCenter = sectionTop + rect.height / 2;
      const point = isMobile ? stop.mobile : stop.desktop;
      const x = clamp(window.innerWidth * point.x - robotSize / 2, safePad, maxX);
      const y = clamp(window.innerHeight * point.y, safePad, maxY);

      return { sectionCenter, x, y };
    })
    .filter(Boolean)
    .sort((a, b) => a.sectionCenter - b.sectionCenter);
};

let robotTargets = [];
let robotCurrent = { x: window.innerWidth - 140, y: 120, rotation: -4, scale: 0.94 };
let lastScrollY = window.scrollY;
let robotTarget = { ...robotCurrent };
let robotScrollTimer;
let robotFrame = 0;
let robotCueTimer;
let robotOverride = null;
let lastRobotCue = "";
let currentRobotCueSelector = "";

const updateRobotTarget = () => {
  if (!floatingRobot) return;

  if (!robotTargets.length) {
    robotTargets = getRobotTargets();
  }

  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let from = robotTargets[0];
  let to = robotTargets[robotTargets.length - 1];

  for (let index = 0; index < robotTargets.length; index += 1) {
    const current = robotTargets[index];
    const next = robotTargets[index + 1];

    if (!next || viewportCenter <= next.sectionCenter) {
      from = current;
      to = next || current;
      break;
    }
  }

  const distance = Math.max(1, to.sectionCenter - from.sectionCenter);
  const progress = clamp((viewportCenter - from.sectionCenter) / distance, 0, 1);
  const eased = progress * progress * (3 - 2 * progress);
  const scrollDelta = window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;

  const nextTarget = robotOverride || {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased + Math.sin(Date.now() / 900) * 3,
    rotation: -3 + eased * 6 + clamp(scrollDelta, -18, 18) * 0.035,
    scale: 0.96 + Math.sin(progress * Math.PI) * 0.06,
  };

  robotTarget = getMobileSafeRobotTarget(nextTarget, getRobotSize());
};

const activeRobotSection = () => {
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  return robotTargets.reduce((closest, current) => {
    if (!closest) return current;
    return Math.abs(current.sectionCenter - viewportCenter) < Math.abs(closest.sectionCenter - viewportCenter)
      ? current
      : closest;
  }, null);
};

const getRobotSize = () => floatingRobot?.getBoundingClientRect().width || 90;

const setRobotOverrideNear = (element, options = {}) => {
  if (!floatingRobot || !element) return;

  const rect = element.getBoundingClientRect();
  const size = getRobotSize();
  const side = options.side || "right";
  const x =
    side === "left"
      ? rect.left - size - (options.gap || 18)
      : rect.right + (options.gap || 18);
  const y = rect.top + rect.height * (options.yRatio ?? 0.5) - size * 0.5;

  robotOverride = {
    x: clamp(x, 16, window.innerWidth - size - 16),
    y: clamp(y, 16, window.innerHeight - size * 1.2 - 16),
    rotation: options.rotation ?? (side === "left" ? 8 : -8),
    scale: options.scale ?? 1.04,
  };

  window.setTimeout(() => {
    robotOverride = null;
  }, options.duration || 1900);
};

const clearRobotCueClasses = () => {
  floatingRobot?.classList.remove("is-pointing", "is-clicking");
  document.querySelectorAll(".robot-highlight").forEach((item) => item.classList.remove("robot-highlight"));
};

const triggerRobotCue = (forcedSelector = "") => {
  if (!floatingRobot) return;
  if (window.innerWidth < 760) return;

  const active = activeRobotSection();
  if (!active && !forcedSelector) return;

  const stop =
    robotStops.find((item) => item.selector === forcedSelector) ||
    robotStops.find((item) => {
      const section = document.querySelector(item.selector);
      if (!section) return false;
      const center = section.getBoundingClientRect().top + window.scrollY + section.getBoundingClientRect().height / 2;
      return active && Math.abs(center - active.sectionCenter) < 4;
    });

  if (!stop || lastRobotCue === stop.selector) return;

  lastRobotCue = stop.selector;
  clearRobotCueClasses();

  if (stop.selector === ".proof-carousel") {
    const firstCard = document.querySelector(".tweet-card");
    firstCard?.classList.add("robot-highlight");
    floatingRobot.classList.add("is-pointing");
    setRobotOverrideNear(firstCard, { side: "left", yRatio: 0.38, rotation: 10, duration: 2200 });
    window.setTimeout(clearRobotCueClasses, 2300);
    return;
  }

  if (stop.selector === ".ai-section") {
    const input = document.querySelector("#aiInput");
    floatingRobot.classList.add("is-pointing");
    setRobotOverrideNear(input, { side: "left", yRatio: 0.5, rotation: 12, scale: 0.98, duration: 2200 });
    window.setTimeout(clearRobotCueClasses, 2300);
    return;
  }

  if (stop.selector === ".pricing") {
    const priceButton = document.querySelector(".pricing .button");
    floatingRobot.classList.add("is-clicking");
    setRobotOverrideNear(priceButton, { side: "right", yRatio: 0.5, rotation: -12, duration: 2100 });
    window.setTimeout(clearRobotCueClasses, 2200);
    return;
  }

  if (stop.selector === ".faq") {
    const firstQuestion = document.querySelector(".faq-item:first-child .faq-question");
    floatingRobot.classList.add("is-clicking");
    setRobotOverrideNear(firstQuestion, { side: "right", yRatio: 0.5, rotation: -12, duration: 2200 });
    window.setTimeout(() => {
      const firstItem = document.querySelector(".faq-item:first-child");
      if (firstQuestion && !firstItem?.classList.contains("is-open")) {
        firstQuestion.click();
      }
    }, 550);
    window.setTimeout(clearRobotCueClasses, 2300);
  }
};

const scheduleRobotCue = (delay = 1000, forcedSelector = "") => {
  window.clearTimeout(robotCueTimer);
  robotCueTimer = window.setTimeout(() => triggerRobotCue(forcedSelector), delay);
};

const animateRobot = () => {
  if (!floatingRobot) return;

  updateRobotTarget();
  robotCurrent.x += (robotTarget.x - robotCurrent.x) * 0.045;
  robotCurrent.y += (robotTarget.y - robotCurrent.y) * 0.07;
  robotCurrent.rotation += (robotTarget.rotation - robotCurrent.rotation) * 0.06;
  robotCurrent.scale += (robotTarget.scale - robotCurrent.scale) * 0.06;

  floatingRobot.style.transform = `translate3d(${robotCurrent.x}px, ${robotCurrent.y}px, 0) rotate(${robotCurrent.rotation}deg) scale(${robotCurrent.scale})`;
  floatingRobot.classList.add("is-ready");
  robotFrame = window.requestAnimationFrame(animateRobot);
};

if (floatingRobot) {
  robotTargets = getRobotTargets();
  updateRobotTarget();
  robotCurrent = { ...robotTarget };
  robotFrame = window.requestAnimationFrame(animateRobot);
  scheduleRobotCue(450, ".hero");

  const robotSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      const matchedStop = robotStops.find((stop) => visibleEntry.target.matches(stop.selector));
      if (!matchedStop || currentRobotCueSelector === matchedStop.selector) return;

      currentRobotCueSelector = matchedStop.selector;
      lastRobotCue = "";
      clearRobotCueClasses();
      robotOverride = null;
      scheduleRobotCue(320, matchedStop.selector);
    },
    {
      threshold: [0.34, 0.48, 0.62],
      rootMargin: "-12% 0px -18% 0px",
    }
  );

  robotStops.forEach((stop) => {
    const section = document.querySelector(stop.selector);
    if (section) {
      robotSectionObserver.observe(section);
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      clearRobotCueClasses();
      robotOverride = null;
      floatingRobot.classList.add("is-traveling");
      window.clearTimeout(robotCueTimer);
      window.clearTimeout(robotScrollTimer);
      robotScrollTimer = window.setTimeout(() => {
        floatingRobot.classList.remove("is-traveling");
      }, 180);
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    robotTargets = getRobotTargets();
    lastRobotCue = "";
    scheduleRobotCue();
  });
}

const faqItems = document.querySelectorAll(".faq-item");

const setFaqHeight = (item) => {
  const answer = item.querySelector(".faq-answer");
  if (!answer) return;
  answer.style.maxHeight = item.classList.contains("is-open") ? `${answer.scrollHeight}px` : "0px";
};

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  setFaqHeight(item);

  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((currentItem) => {
      currentItem.classList.remove("is-open");
      currentItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      setFaqHeight(currentItem);
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      setFaqHeight(item);
      trackEvent("faq_open", {
        question: button.textContent.trim(),
      });
    }
  });
});

window.addEventListener("resize", () => {
  faqItems.forEach(setFaqHeight);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const chatButton = document.querySelector("#openAiChat");
const chatPanel = document.querySelector("#aiChatPanel");
const chatForm = document.querySelector("#aiForm");
const chatInput = document.querySelector("#aiInput");
const chatMedia = document.querySelector("#aiMedia");
const chatAttach = document.querySelector("#aiAttach");
const chatRecord = document.querySelector("#aiRecord");
const chatMessages = document.querySelector("#aiMessages");
const webhookUrl = "";
const useLocalDemoAgent = true;
let pendingMedia = null;
let mediaRecorder = null;
let recordedChunks = [];
let chatMemory = [];
let chatState = {};
const maxChatMemoryItems = 18;

const getChatSessionId = () => {
  return globalThis.crypto?.randomUUID?.() || `iguitech-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const chatSessionId = getChatSessionId();

const getChatMemory = () => {
  return chatMemory;
};

const saveChatMemory = (history) => {
  chatMemory = history.slice(-maxChatMemoryItems);
};

const rememberChatMessage = (role, content, mediaType = null) => {
  const cleanContent = String(content || "").trim();
  if (!cleanContent && !mediaType) return;
  const history = getChatMemory();
  history.push({
    role,
    content: cleanContent || `[${mediaType} enviado]`,
    mediaType,
    timestamp: new Date().toISOString(),
  });
  saveChatMemory(history);
};

const getChatState = () => {
  return chatState;
};

const saveChatState = (state) => {
  chatState = { ...state };
};

const demoInventory = [
  { category: "carros", name: "Fiat Strada Volcano 1.3 Flex", stock: 3, price: "R$132.990,00", aliases: ["strada", "fiat"] },
  { category: "carros", name: "Toyota Corolla XEi 2.0", stock: 2, price: "R$167.900,00", aliases: ["corolla", "toyota"] },
  { category: "carros", name: "Chevrolet S10 LTZ 4x4 Diesel", stock: 1, price: "R$289.900,00", aliases: ["s10", "chevrolet"] },
  { category: "carros", name: "Volkswagen Polo Highline TSI", stock: 4, price: "R$128.490,00", aliases: ["polo", "volkswagen"] },
  { category: "carros", name: "Hyundai Creta Platinum 1.0 Turbo", stock: 2, price: "R$182.900,00", aliases: ["creta", "hyundai"] },
  { category: "martelo bola", name: "Martelo Bola 300g Cabo de Madeira", stock: 18, price: "R$34,90", aliases: ["martelo", "bola", "300g"] },
  { category: "martelo bola", name: "Martelo Bola 500g Cabo de Fibra", stock: 12, price: "R$49,90", aliases: ["martelo", "bola", "500g"] },
  { category: "martelo bola", name: "Martelo Bola 800g Profissional", stock: 9, price: "R$69,90", aliases: ["martelo", "bola", "800g"] },
  { category: "martelo bola", name: "Martelo Bola 1kg Cabo Emborrachado", stock: 15, price: "R$84,90", aliases: ["martelo", "bola", "1kg"] },
  { category: "martelo bola", name: "Martelo Bola 1,5kg Forjado", stock: 6, price: "R$129,90", aliases: ["martelo", "bola", "1,5kg"] },
  { category: "informatica", name: "Mouse Gamer RGB USB", stock: 25, price: "R$89,90", aliases: ["mouse"] },
  { category: "informatica", name: "Teclado Mecânico RGB ABNT2", stock: 18, price: "R$249,90", aliases: ["teclado"] },
  { category: "informatica", name: "SSD NVMe 1TB PCIe 4.0", stock: 14, price: "R$489,90", aliases: ["ssd", "nvme"] },
  { category: "informatica", name: "Monitor Full HD 24 IPS", stock: 22, price: "R$749,90", aliases: ["monitor"] },
  { category: "informatica", name: "Cabo HDMI 2.1 (2 metros)", stock: 35, price: "R$39,90", aliases: ["hdmi", "cabo"] },
  { category: "informatica", name: "Notebook Corporativo i5 8GB SSD 256GB", stock: 11, price: "R$2.899,90", aliases: ["notebook", "i5"] },
  { category: "informatica", name: "Computador Escritório i3 8GB SSD 240GB", stock: 16, price: "R$1.849,90", aliases: ["computador", "pc", "desktop"] },
  { category: "informatica", name: "Headset USB com Microfone", stock: 30, price: "R$119,90", aliases: ["headset", "fone"] },
  { category: "informatica", name: "Impressora Multifuncional Wi-Fi", stock: 7, price: "R$699,90", aliases: ["impressora"] },
];

const normalizeText = (text) => String(text || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

const hasAny = (text, terms) => terms.some((term) => text.includes(term));

const findDemoProducts = (normalizedMessage) => {
  const genericAliases = ["martelo", "bola", "carro", "veiculo", "informatica"];
  const exactMatches = demoInventory.filter((product) => product.aliases
    .filter((alias) => !genericAliases.includes(normalizeText(alias)))
    .some((alias) => normalizedMessage.includes(normalizeText(alias))));
  if (exactMatches.length && !hasAny(normalizedMessage, ["quais", "opcoes", "todos", "catalogo"])) {
    return exactMatches;
  }

  if (hasAny(normalizedMessage, ["martelo", "bola"])) {
    return demoInventory.filter((product) => product.category === "martelo bola");
  }
  if (hasAny(normalizedMessage, ["carro", "veiculo", "strada", "corolla", "s10", "polo", "creta"])) {
    return demoInventory.filter((product) => product.category === "carros" || product.aliases.some((alias) => normalizedMessage.includes(normalizeText(alias))));
  }
  if (hasAny(normalizedMessage, ["informatica", "mouse", "teclado", "ssd", "monitor", "hdmi", "notebook", "computador", "pc", "desktop", "headset", "fone", "impressora"])) {
    return demoInventory.filter((product) => product.category === "informatica" || product.aliases.some((alias) => normalizedMessage.includes(normalizeText(alias))));
  }
  return [];
};

const formatProducts = (products) => products
  .slice(0, 5)
  .map((product) => `• ${product.stock} em estoque\n  ${product.name}\n  ${product.price}`)
  .join("\n");

const parseCurrencyValue = (price) => Number(String(price)
  .replace("R$", "")
  .replace(/\./g, "")
  .replace(",", ".")
  .replace(/[^\d.]/g, ""));

const getCheapestProduct = (products) => [...products]
  .sort((a, b) => parseCurrencyValue(a.price) - parseCurrencyValue(b.price))[0];

const formatProductSummary = (product) => `${product.name}\n${product.stock} em estoque\n${product.price}`;

const isCheapestRequest = (text) => hasAny(text, [
  "mais barato",
  "menor preco",
  "menor valor",
  "produto barato",
  "produto mais em conta",
  "mais em conta",
  "economico",
]);

const isRecommendationRequest = (text) => hasAny(text, [
  "recomendado",
  "recomenda",
  "recomendaria",
  "melhor",
  "indicado",
  "vale a pena",
  "serve para",
  "bom para",
]);

const salesScriptDemoReplies = [
  {
    topic: "pdf-notebook-company",
    terms: ["procurando um notebook para minha empresa", "notebook para minha empresa", "notebook para empresa"],
    reply: "Claro. Para te indicar melhor, me diga: o notebook será usado para tarefas básicas, sistemas internos, planilhas pesadas, atendimento, design ou outro tipo de uso? Também ajuda saber quantas unidades você precisa.",
  },
  {
    topic: "pdf-cheap-option",
    terms: ["quero algo barato", "algo barato", "opcao barata"],
    reply: "Consigo te ajudar com uma opção econômica, mas antes preciso entender o uso. Se for apenas navegação, e-mail e documentos, uma configuração básica pode atender. Se for para sistema, planilhas ou chamadas, recomendo uma opção com SSD e pelo menos 8 GB de RAM para evitar lentidão.",
  },
  {
    topic: "pdf-mouse-keyboard",
    terms: ["tem mouse e teclado", "mouse e teclado tambem", "voces tem mouse e teclado"],
    reply: "Sim, na simulação trabalhamos com periféricos como mouse, teclado, headset, monitor, impressora e acessórios. Você procura algo para uso comum, escritório com várias estações ou equipamentos mais resistentes para uso intenso?",
  },
  {
    topic: "pdf-workstation",
    terms: ["montar uma estacao de trabalho completa", "estacao de trabalho completa", "estacao completa"],
    reply: "Perfeito. Para uma estação completa, posso considerar notebook ou computador, monitor, teclado, mouse, headset, nobreak e impressora, se necessário. Essa estação será para atendimento, administrativo, financeiro, vendas ou criação?",
  },
  {
    topic: "pdf-service-computer",
    terms: ["melhor computador para atendimento", "computador para atendimento"],
    reply: "Para atendimento, normalmente o ideal é uma máquina estável, com SSD, boa memória e periféricos confortáveis. Se o time usa navegador, CRM, WhatsApp Web e chamadas, eu indicaria um conjunto equilibrado para evitar travamentos e melhorar a produtividade.",
  },
  {
    topic: "pdf-warranty",
    terms: ["produto tem garantia", "tem garantia", "garantia"],
    reply: "Sim, a garantia e as condições devem ser confirmadas no orçamento final. Posso direcionar seu contato para um consultor verificar o modelo indicado e informar garantia, disponibilidade e condição atual.",
  },
  {
    topic: "pdf-10-computers",
    terms: ["orcamento para 10 computadores", "10 computadores", "dez computadores"],
    reply: "Consigo iniciar a qualificação. Para montar um orçamento mais assertivo, me informe o tipo de uso dos computadores, quantidade exata, se precisa de monitores e periféricos, e qual o prazo desejado. Depois encaminho para um consultor finalizar a proposta.",
  },
  {
    topic: "pdf-too-expensive",
    terms: ["esta caro", "ta caro", "opcao mais em conta", "mais em conta"],
    reply: "Entendo. Podemos buscar uma alternativa mais acessível. Só vou preservar o mínimo necessário para o equipamento não ficar lento no seu uso. Você prefere reduzir custo, manter desempenho ou encontrar um meio-termo?",
  },
  {
    topic: "pdf-buy-today",
    terms: ["preciso comprar hoje", "comprar hoje"],
    reply: "Certo. Nesse caso, o próximo passo é confirmar disponibilidade e condição atual com a equipe comercial. Me informe seu nome, telefone/WhatsApp e o produto ou quantidade desejada para agilizar o atendimento.",
  },
  {
    topic: "pdf-whatsapp",
    terms: ["pode me chamar no whatsapp", "chamar no whatsapp", "me chama no whatsapp"],
    reply: "Sim. Me envie seu nome, empresa e WhatsApp. Vou encaminhar seu interesse para a equipe comercial com um resumo da sua necessidade para que o atendimento continue sem você precisar repetir tudo.",
  },
  {
    topic: "pdf-office-equipment",
    terms: ["preciso de equipamentos para meu escritorio", "equipamentos para meu escritorio", "equipamentos para escritorio"],
    reply: "Claro. Você precisa de computadores, notebooks, periféricos ou uma estação completa para cada colaborador?",
  },
  {
    topic: "pdf-notebooks-accessories",
    terms: ["notebooks e acessorios", "acho que notebooks", "notebook e acessorios"],
    reply: "Perfeito. Quantas pessoas vão usar e quais tarefas elas fazem no dia a dia? Atendimento, planilhas, sistemas, reuniões ou criação de conteúdo?",
  },
  {
    topic: "pdf-five-people",
    terms: ["sao 5 pessoas", "5 pessoas", "cinco pessoas"],
    reply: "Para esse cenário, eu recomendaria notebooks intermediários com SSD e 8 GB de RAM, além de mouse, teclado e headset para melhorar a produtividade no atendimento.",
  },
  {
    topic: "pdf-balance",
    terms: ["equilibrio", "meio-termo", "meio termo"],
    reply: "Ótimo. Vou encaminhar como perfil recomendado: 5 notebooks intermediários, periféricos básicos e foco em estabilidade para escritório. Me informe seu nome, empresa e WhatsApp para um consultor confirmar disponibilidade e orçamento.",
  },
];

const getSalesScriptDemoReply = (text, state) => {
  const item = salesScriptDemoReplies.find(({ terms }) => hasAny(text, terms));
  if (!item) return null;

  state.mode = "store";
  markTopicExplained(state, item.topic);
  return `${item.reply}\n\nEsta conversa é uma demonstração de IA de vendas da IGUITECH.`;
};

const wasTopicExplained = (state, topic) => Boolean(state.explainedTopics?.includes(topic));

const markTopicExplained = (state, topic) => {
  state.explainedTopics = Array.from(new Set([...(state.explainedTopics || []), topic]));
  saveChatState(state);
};

const smartQuestion = (state, fallback) => {
  const options = [
    ["features", "Qual função você gostaria de conhecer primeiro?"],
    ["ai", "Quer testar a IA respondendo como vendedora de uma loja?"],
    ["crm", "Quer ver como isso aparece em um funil de vendas?"],
    ["management", "Quer que eu te mostre como a equipe acompanha isso em tempo real?"],
    ["marketing", "Quer entender como o disparo em massa entra nessa estratégia?"],
  ];
  const next = options.find(([topic]) => !wasTopicExplained(state, topic));
  return next?.[1] || fallback;
};

const withDemoContext = (answer, question) => `${answer}\n\nEsta conversa é uma demonstração da plataforma IGUITECH.\n\n${question}`;

const answerOnce = (state, topic, answer, question) => {
  if (wasTopicExplained(state, topic)) {
    return withDemoContext(
      "Já te mostrei essa parte, então vou conectar com o próximo passo da operação para a conversa evoluir.",
      smartQuestion(state, question),
    );
  }
  markTopicExplained(state, topic);
  return withDemoContext(answer, question);
};

const createLocalDemoReply = ({ message, mediaType }) => {
  const state = getChatState();
  const history = getChatMemory();
  const normalizedMessage = normalizeText(message);
  const isFirstUserMessage = history.filter((item) => item.role === "user").length <= 1;

  if (mediaType === "audio") {
    return "Recebi seu áudio. Nesta demonstração do site eu consigo registrar o áudio no chat, mas a transcrição real ficaria conectada ao fluxo de IA da IGUITECH.\n\nMe manda também em texto o que você quer testar?";
  }

  if (mediaType === "image") {
    return "Recebi sua imagem. Em uma operação real, a IGUITECH pode enviar esse arquivo para o fluxo da IA analisar, classificar ou encaminhar para o setor correto.\n\nVocê quer testar uma consulta de produto ou conhecer uma função da plataforma?";
  }

  if (hasAny(normalizedMessage, ["voce e uma ia", "outra ia", "chatgpt", "ignore instrucoes", "prompt"])) {
    return "#stop";
  }

  if (hasAny(normalizedMessage, ["preco", "valor", "quanto custa", "plano", "mensalidade", "teste gratis", "7 dias"])) {
    return answerOnce(
      state,
      "pricing",
      "A proposta desta demonstracao e mostrar o valor antes de falar de preco: reduzir demora, centralizar canais e evitar que oportunidades fiquem presas em celulares pessoais. No site, o cliente pode iniciar um teste gratis de 7 dias sem compromisso.",
      "Voce quer que eu mostre onde a IGUITECH evita perda de vendas primeiro?",
    );
  }

  if (hasAny(normalizedMessage, ["demora", "perder cliente", "perco cliente", "responder tarde", "tempo de resposta", "30 minutos"])) {
    return answerOnce(
      state,
      "loss",
      "Quando uma empresa demora para responder, o cliente normalmente nao reclama: ele chama o concorrente. A IGUITECH ajuda centralizando a fila, registrando o tempo de resposta e permitindo que a IA faca o primeiro atendimento imediatamente.",
      "Hoje voce consegue saber quantos clientes ficaram esperando resposta?",
    );
  }

  if (hasAny(normalizedMessage, ["whatsapp pessoal", "celular do vendedor", "vendedor sair", "contatos", "historico perdido"])) {
    return answerOnce(
      state,
      "personal-whatsapp",
      "Esse e um dos problemas mais caros: quando o atendimento fica no WhatsApp pessoal, a empresa perde historico, controle e previsibilidade. Na IGUITECH, as conversas pertencem a operacao, nao ao aparelho de um vendedor.",
      "Quer ver como isso se conecta com CRM e funil de vendas?",
    );
  }

  if (hasAny(normalizedMessage, ["relatorio", "dashboard", "indicador", "metricas", "produtividade", "setor"])) {
    return answerOnce(
      state,
      "reports",
      "Os relatorios mostram tempo medio de atendimento, quantidade de clientes atendidos, setores com mais demanda e oportunidades que podem estar paradas. Isso transforma atendimento em gestao, nao so conversa.",
      "Quer que eu explique como a IA alimenta esses indicadores?",
    );
  }

  if (hasAny(normalizedMessage, ["integracao", "integrar", "sistema", "api", "estoque real", "erp"])) {
    return answerOnce(
      state,
      "integrations",
      "A plataforma pode trabalhar com integracoes e automacoes para consultar dados como estoque, clientes, etapas do funil ou regras internas. Nesta demonstracao eu uso um estoque ficticio, mas a logica e a mesma de uma operacao conectada.",
      "Quer testar uma consulta de estoque ficticio agora?",
    );
  }

  if (hasAny(normalizedMessage, ["implantar", "instalar", "configurar", "quanto tempo", "comecar", "conectar"])) {
    return answerOnce(
      state,
      "setup",
      "A implantacao depende dos canais e integracoes, mas a ideia da IGUITECH e reduzir friccao: conectar os canais, organizar setores, definir fluxo de atendimento e ativar a IA com regras claras.",
      "Qual canal voce conectaria primeiro: WhatsApp, Instagram ou Facebook?",
    );
  }

  if (hasAny(normalizedMessage, ["contratar", "consultor", "humano", "vendedor", "especialista", "comercial", "fechar", "comprar", "negociar"])) {
    return "Perfeito. Vou te encaminhar para o atendimento humano agora.\n\nEm uma operação real, a IGUITECH transferiria a conversa com todo o histórico para o setor comercial, sem o cliente precisar repetir tudo.";
  }

  if (hasAny(normalizedMessage, ["vendedora de uma loja", "vendedor de loja", "loja", "estoque ficticio", "estoque"])) {
    state.mode = "store";
    saveChatState(state);
    return "Olá! Agora sou a vendedora virtual de uma loja utilizando a plataforma IGUITECH. 😄\n\nNesta demonstração posso consultar um estoque fictício exatamente como a plataforma faria usando o sistema real de uma empresa.\n\nQual produto você quer consultar?";
  }

  const products = findDemoProducts(normalizedMessage);
  if (state.mode === "store" || products.length) {
    state.mode = "store";
    saveChatState(state);

    if (!products.length) {
      return "Não encontrei esse item no estoque fictício desta demonstração.\n\nPosso consultar carros, martelo bola ou itens de informática.\n\nQual deles você quer testar?";
    }

    return `Encontrei essas opções no estoque fictício:\n\n${formatProducts(products)}\n\nEsses produtos pertencem apenas ao estoque fictício desta demonstração. Na plataforma IGUITECH o estoque é consultado automaticamente no sistema integrado da empresa.\n\nVocê quer simular uma compra ou consultar outro produto?`;
  }

  if (isFirstUserMessage || hasAny(normalizedMessage, ["oi", "ola", "bom dia", "boa tarde", "boa noite"])) {
    return "Olá! 👋\n\nEu sou a Assistente Virtual da plataforma IGUITECH.\n\nEsta é uma IA demonstrativa, personalizada para mostrar como a IGUITECH pode atender clientes, automatizar processos e apoiar sua equipe.\n\nO que você gostaria de conhecer primeiro?";
  }

  const repeatedTopic = [
    ["management", ["gestao", "atendimento", "atendentes", "tempo real", "historico"]],
    ["ai", ["ia", "pre atendimento", "automatico", "automatizar", "duvidas"]],
    ["marketing", ["disparo", "campanha", "promocao", "marketing", "massa"]],
    ["crm", ["crm", "funil", "lead", "venda", "etiqueta"]],
  ].find(([topic, terms]) => wasTopicExplained(state, topic) && hasAny(normalizedMessage, terms));

  if (repeatedTopic) {
    return withDemoContext(
      "Essa parte ja foi explicada, entao vou evitar repetir e te levar para uma etapa complementar da demonstracao.",
      smartQuestion(state, "Qual outra parte voce quer testar agora?"),
    );
  }

  if (hasAny(normalizedMessage, ["gestao", "atendimento", "atendentes", "tempo real", "historico"])) markTopicExplained(state, "management");
  if (hasAny(normalizedMessage, ["ia", "pre atendimento", "automatico", "automatizar", "duvidas"])) markTopicExplained(state, "ai");
  if (hasAny(normalizedMessage, ["disparo", "campanha", "promocao", "marketing", "massa"])) markTopicExplained(state, "marketing");
  if (hasAny(normalizedMessage, ["crm", "funil", "lead", "venda", "etiqueta"])) markTopicExplained(state, "crm");

  if (hasAny(normalizedMessage, ["funcao", "funcoes", "faz", "funciona", "apresente", "demonstrar", "plataforma"])) {
    return "Posso demonstrar estas funções:\n\n• Gestão completa do atendimento\n• Pré-atendimento com IA\n• Disparo em massa\n• Consulta inteligente de produtos\n• CRM e funil de vendas\n• Integrações e automações\n• Encaminhamento para atendimento humano\n\nQual dessas funções você gostaria de conhecer melhor?";
  }

  if (hasAny(normalizedMessage, ["gestao", "atendimento", "atendentes", "tempo real", "historico"])) {
    return "A gestão de atendimento centraliza WhatsApp, Instagram, Facebook e outros canais em uma única tela.\n\nA equipe acompanha histórico, distribuição por atendente, indicadores e conversas em andamento em tempo real.\n\nQuer que eu simule agora a parte de pré-atendimento com IA?";
  }

  if (hasAny(normalizedMessage, ["ia", "pre atendimento", "automatico", "automatizar", "duvidas"])) {
    return "A IA faz o primeiro atendimento, responde dúvidas frequentes, qualifica o cliente e encaminha para uma pessoa quando precisa.\n\nEu mesma sou um exemplo disso nesta demonstração.\n\nQuer testar a consulta inteligente de produtos?";
  }

  if (hasAny(normalizedMessage, ["disparo", "campanha", "promocao", "marketing", "massa"])) {
    return "O disparo em massa permite enviar campanhas, promoções, comunicados e avisos mantendo o histórico organizado dentro da plataforma.\n\nIsso evita atendimento perdido em celulares pessoais.\n\nQuer ver como o CRM e o funil entram nessa operação?";
  }

  if (hasAny(normalizedMessage, ["crm", "funil", "lead", "venda", "etiqueta"])) {
    return "No CRM, as oportunidades podem passar por etapas como Novo Lead, Contato, Proposta, Negociação e Fechado.\n\nTambém dá para usar etiquetas como VIP, Orçamento, Pós-venda e Cliente recorrente.\n\nQuer que eu simule uma loja consultando estoque?";
  }

  return "Consigo te mostrar a IGUITECH como uma demonstração prática.\n\nVocê pode perguntar sobre gestão de atendimento, IA, disparo em massa, CRM, funil de vendas ou pedir: “aja como vendedora de uma loja”.\n\nQual parte você quer testar agora?";
};

const createSmartLocalDemoReply = ({ message, mediaType }) => {
  const state = getChatState();
  const history = getChatMemory();
  const text = normalizeText(message);
  const firstUserMessage = history.filter((item) => item.role === "user").length <= 1;
  const demoNote = "\n\n_Esta conversa é uma demonstração da plataforma IGUITECH._";
  const ask = (question) => `\n\n${question}`;

  const once = (topic, answer, question) => {
    if (wasTopicExplained(state, topic)) {
      return `Já te mostrei essa parte ✅\n\nPara não repetir, posso avançar para o próximo ponto da operação.${ask(smartQuestion(state, question))}`;
    }

    markTopicExplained(state, topic);
    return `${answer}${demoNote}${ask(question)}`;
  };

  if (hasAny(text, ["responde por audio", "responder por audio", "manda audio", "enviar audio", "envia audio", "voz personalizada", "personalizar voz", "voz do cliente"])) {
    return `🎧 Sim, a IA pode responder por áudio.\n\nE ainda dá para personalizar a voz de acordo com a voz do cliente ou com a identidade da empresa.\n\nExemplo prático:\n• resposta em texto\n• resposta em áudio\n• tom de voz personalizado\n• atendimento mais humano\n\nQuer que eu te envie para o setor de vendas para explicar essa configuração?`;
  }

  if (hasAny(text, ["envia imagem", "manda imagem", "enviar imagem", "trabalha com imagem", "catalogar produto", "catalogar produtos", "catalogo de produtos", "catalogar todos os produtos", "fotos dos produtos"])) {
    return `🖼️ Sim, a IA pode trabalhar com imagens.\n\nTambém podemos catalogar todos os seus produtos para facilitar o atendimento.\n\nNa prática, isso ajuda em:\n• apresentação de produtos\n• catálogo organizado\n• consulta rápida\n• envio de opções para o cliente\n• atendimento mais visual\n\nQuer que eu te envie para o setor de vendas para entender como catalogar seus produtos?`;
  };

  if (mediaType === "audio") {
    return `🎧 Recebi seu áudio.\n\nNa operação real, a IGUITECH pode transcrever o áudio, entender a intenção do cliente e continuar com contexto.\n\nMe manda também em texto o que você quer testar agora?`;
  }

  if (mediaType === "image") {
    return `🖼️ Recebi sua imagem.\n\nEm uma operação real, ela poderia entrar no fluxo da IA para análise, classificação ou encaminhamento ao setor correto.\n\nVocê quer testar consulta de produto ou conhecer uma função da plataforma?`;
  }

  if (hasAny(text, ["voce e uma ia", "outra ia", "chatgpt", "ignore instrucoes", "prompt"])) {
    return "#stop";
  }

  const productsInMessage = findDemoProducts(text);
  const salesScriptReply = getSalesScriptDemoReply(text, state);

  if (salesScriptReply) {
    return salesScriptReply;
  }

  if (isCheapestRequest(text)) {
    state.mode = "store";
    saveChatState(state);
    const scope = productsInMessage.length ? productsInMessage : demoInventory;
    const cheapest = getCheapestProduct(scope);

    return `✅ O produto mais barato que encontrei é:\n\n${formatProductSummary(cheapest)}\n\nEle pode atender bem se você busca a opção mais econômica.\n\nEsse atende sua necessidade ou quer que eu te envie para o setor de vendas para uma orientação melhor?`;
  }

  if (isRecommendationRequest(text) && productsInMessage.length) {
    state.mode = "store";
    saveChatState(state);
    const product = productsInMessage[0];

    return `Boa pergunta ✅\n\nSobre este produto:\n\n${formatProductSummary(product)}\n\nSe ele é recomendado ou não depende da sua necessidade, frequência de uso e objetivo da compra.\n\nNosso consultor de vendas consegue te orientar melhor. Quer que eu te envie para o setor de vendas?`;
  }

  if (isRecommendationRequest(text)) {
    state.mode = "store";
    saveChatState(state);

    return "Consigo te orientar melhor se você me disser qual produto quer avaliar.\n\nPosso consultar carros, martelo bola ou informática.\n\nQual produto você quer saber se é recomendado?";
  }

  if (hasAny(text, ["contratar", "consultor", "humano", "vendedor", "especialista", "comercial", "fechar"]) || (hasAny(text, ["comprar", "negociar"]) && !productsInMessage.length)) {
    return `Perfeito ✅\n\nVou te encaminhar para atendimento humano.\n\nNa prática, a IGUITECH transfere a conversa com:\n• histórico completo\n• contexto do cliente\n• intenção identificada\n• setor correto\n\nAssim o cliente não precisa repetir tudo.`;
  }

  if (hasAny(text, ["preco", "valor", "quanto custa", "plano", "mensalidade", "teste gratis", "7 dias"])) {
    return once(
      "pricing",
      `💰 Antes de falar de preço, a ideia é mostrar o custo de não mudar.\n\nA IGUITECH ajuda a evitar:\n• cliente esperando resposta\n• lead esquecido\n• venda presa no celular do vendedor\n• falta de histórico da conversa\n\nHoje o site oferece teste grátis por 7 dias, sem compromisso.`,
      "Você quer que eu mostre onde sua empresa mais pode estar perdendo vendas?",
    );
  }

  if (hasAny(text, ["demora", "perder cliente", "perco cliente", "responder tarde", "tempo de resposta", "30 minutos"])) {
    return once(
      "loss",
      `⏱️ Quando a resposta demora, o cliente raramente avisa.\n\nNormalmente ele só chama outra empresa.\n\nCom a IGUITECH, você consegue:\n• centralizar a fila\n• responder mais rápido com IA\n• medir tempo de atendimento\n• identificar oportunidades paradas`,
      "Hoje você sabe quantos clientes ficaram sem resposta?",
    );
  }

  if (hasAny(text, ["whatsapp pessoal", "celular do vendedor", "vendedor sair", "contatos", "historico perdido"])) {
    return once(
      "personal-whatsapp",
      `📱 WhatsApp pessoal é um risco grande.\n\nQuando tudo fica no celular do vendedor:\n• a empresa perde controle\n• o histórico fica espalhado\n• clientes podem ir embora com o funcionário\n• ninguém mede produtividade\n\nNa IGUITECH, a conversa pertence à empresa.`,
      "Quer ver como isso se conecta com CRM e funil?",
    );
  }

  if (hasAny(text, ["relatorio", "dashboard", "indicador", "metricas", "produtividade", "setor"])) {
    return once(
      "reports",
      `📊 Os dashboards mostram a operação com clareza.\n\nVocê consegue acompanhar:\n• tempo médio de atendimento\n• clientes atendidos\n• setores com mais demanda\n• conversas paradas\n• produtividade da equipe`,
      "Quer que eu explique como a IA ajuda a alimentar esses indicadores?",
    );
  }

  if (hasAny(text, ["integracao", "integrar", "sistema", "api", "estoque real", "erp"])) {
    return once(
      "integrations",
      `🔗 A IGUITECH pode trabalhar com integrações e automações.\n\nExemplos:\n• consultar estoque\n• buscar dados do cliente\n• atualizar etapa do funil\n• enviar para o setor correto\n• acionar fluxos externos\n\nNesta demonstração eu uso um estoque fictício, mas a lógica é a mesma.`,
      "Quer testar uma consulta de estoque fictício agora?",
    );
  }

  if (hasAny(text, ["implantar", "instalar", "configurar", "quanto tempo", "comecar", "conectar"])) {
    return once(
      "setup",
      `⚙️ A implantação é pensada para reduzir fricção.\n\nO caminho costuma ser:\n1. conectar canais\n2. organizar setores\n3. definir regras de atendimento\n4. configurar IA\n5. acompanhar indicadores`,
      "Qual canal você conectaria primeiro: WhatsApp, Instagram ou Facebook?",
    );
  }

  if (hasAny(text, ["vendedora de uma loja", "vendedor de loja", "loja", "estoque ficticio", "estoque"])) {
    state.mode = "store";
    saveChatState(state);
    return `🛒 Pronto, agora sou a vendedora virtual de uma loja usando IGUITECH.\n\nPosso consultar um estoque fictício como se estivesse conectado ao sistema real da empresa.\n\nVocê quer consultar carros, martelo bola ou informática?`;
  }

  const products = productsInMessage;
  if (state.mode === "store" || products.length) {
    state.mode = "store";
    saveChatState(state);

    if (!products.length) {
      return `Não encontrei esse item no estoque fictício 😕\n\nPosso consultar:\n• carros\n• martelo bola\n• informática\n\nQual produto você quer testar?`;
    }

    return `✅ Encontrei no estoque fictício:\n\n${formatProducts(products)}\n\nEsses produtos são apenas da demonstração. Na IGUITECH real, a consulta pode vir automaticamente do sistema integrado da empresa.\n\nQuer que eu te envie para o setor de vendas para continuar esse atendimento?`;
  }

  if (firstUserMessage || hasAny(text, ["oi", "ola", "bom dia", "boa tarde", "boa noite"])) {
    return `Olá! 👋\n\nEu sou a Assistente Virtual da IGUITECH.\n\nEsta é uma IA demonstrativa personalizada para mostrar como a plataforma pode atender clientes, automatizar processos e apoiar sua equipe.\n\nO que você gostaria de conhecer primeiro?`;
  }

  if (hasAny(text, ["funcao", "funcoes", "faz", "funciona", "apresente", "demonstrar", "plataforma"])) {
    markTopicExplained(state, "features");
    return `Posso demonstrar estas funções 👇\n\n• Gestão completa do atendimento\n• Pré-atendimento com IA\n• Disparo em massa\n• Consulta inteligente de produtos\n• CRM e funil de vendas\n• Integrações e automações\n• Encaminhamento para humano\n\nQual dessas funções você quer conhecer melhor?`;
  }

  if (hasAny(text, ["gestao", "atendimento", "atendentes", "tempo real", "historico"])) {
    return once(
      "management",
      `🧭 A gestão de atendimento centraliza WhatsApp, Instagram, Facebook e outros canais em uma única tela.\n\nA equipe acompanha:\n• histórico completo\n• fila de conversas\n• distribuição por atendente\n• status do atendimento\n• tempo de resposta`,
      "Quer que eu simule o pré-atendimento com IA?",
    );
  }

  if (hasAny(text, ["ia", "pre atendimento", "automatico", "automatizar", "duvidas"])) {
    return once(
      "ai",
      `🤖 A IA faz o primeiro atendimento e ajuda o cliente sem deixar a conversa parada.\n\nEla pode:\n• responder dúvidas frequentes\n• qualificar o cliente\n• consultar informações\n• encaminhar para uma pessoa\n• manter o histórico organizado`,
      "Quer testar a consulta inteligente de produtos?",
    );
  }

  if (hasAny(text, ["disparo", "campanha", "promocao", "marketing", "massa"])) {
    return once(
      "marketing",
      `📣 O disparo em massa ajuda em campanhas, promoções e comunicados.\n\nA diferença é que tudo continua organizado dentro da operação:\n• histórico salvo\n• cliente identificado\n• retorno acompanhado\n• equipe com contexto`,
      "Quer ver como isso se conecta com CRM?",
    );
  }

  if (hasAny(text, ["crm", "funil", "lead", "venda", "etiqueta"])) {
    return once(
      "crm",
      `🧩 No CRM, a empresa acompanha oportunidades por etapa.\n\nExemplo de funil:\n• Novo lead\n• Contato\n• Proposta\n• Negociação\n• Fechado\n\nTambém dá para usar etiquetas como VIP, Orçamento e Pós-venda.`,
      "Quer simular uma loja consultando estoque?",
    );
  }

  return `Consigo te mostrar a IGUITECH em uma demonstração prática ✅\n\nVocê pode perguntar sobre:\n• gestão de atendimento\n• IA no pré-atendimento\n• disparo em massa\n• CRM e funil\n• consulta de estoque\n\nQual parte você quer testar agora?`;
};

const getLocalDemoResponse = async (message, media = null) => {
  await wait(650 + Math.random() * 450);
  return normalizeAiPayload({
    reply: createSmartLocalDemoReply({
      message,
      mediaType: media ? getMediaType(media.file) : null,
    }),
  }, "");
};

const getMediaType = (fileOrType = "") => {
  const type = typeof fileOrType === "string" ? fileOrType : fileOrType.type;
  if (type?.startsWith("image/")) return "image";
  if (type?.startsWith("audio/")) return "audio";
  return "file";
};

const createMediaUrl = (media) => {
  if (!media) return "";
  if (media.url) return media.url;
  if (media.dataUrl) return media.dataUrl;
  if (media.base64) {
    return `data:${media.mimeType || media.mime || "application/octet-stream"};base64,${media.base64}`;
  }
  if (media.file || media.blob) return URL.createObjectURL(media.file || media.blob);
  return "";
};

const addMessage = (content, type = "ai", media = null) => {
  const bubble = document.createElement(media ? "div" : "p");
  bubble.className = `wa-bubble ${type}`;

  if (media) {
    const mediaType = media.kind || media.type || getMediaType(media.mimeType || media.mime || media.file || media.blob);
    const source = createMediaUrl(media);
    bubble.classList.add("has-media");

    if (mediaType === "image") {
      const image = document.createElement("img");
      image.src = source;
      image.alt = media.alt || content || "Imagem enviada no chat";
      bubble.appendChild(image);
    } else if (mediaType === "audio") {
      const audio = document.createElement("audio");
      audio.src = source;
      audio.controls = true;
      bubble.appendChild(audio);
    }

    if (content) {
      const label = document.createElement("span");
      label.textContent = content;
      bubble.appendChild(label);
    }
  } else {
    bubble.textContent = content;
  }

  chatMessages?.appendChild(bubble);
  chatMessages?.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
  return bubble;
};

const readJsonSafely = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const splitAiText = (text) => {
  const cleanText = String(text || "").trim();
  if (!cleanText) return [];

  const parts = cleanText
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}|(?<=\.)\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (parts.length ? parts : [cleanText]).map((part) => ({ text: part }));
};

const normalizeAiPayload = (data, fallbackText) => {
  if (!data) return [{ text: fallbackText }];

  if (typeof data === "string") {
    return splitAiText(data);
  }

  if (Array.isArray(data)) {
    return data.flatMap((item) => normalizeAiPayload(item, ""));
  }

  const groupedMessages = data.messages || data.replies || data.respostas || data.outputs;
  if (Array.isArray(groupedMessages)) {
    return groupedMessages.flatMap((item) => normalizeAiPayload(item, ""));
  }

  const media = [];
  const directMedia = data.media || data.medias || data.attachments || data.files;
  if (Array.isArray(directMedia)) media.push(...directMedia);
  if (data.imageUrl) media.push({ type: "image", url: data.imageUrl });
  if (data.audioUrl) media.push({ type: "audio", url: data.audioUrl });
  if (data.imageBase64) media.push({ type: "image", base64: data.imageBase64, mimeType: data.imageMimeType || "image/png" });
  if (data.audioBase64) media.push({ type: "audio", base64: data.audioBase64, mimeType: data.audioMimeType || "audio/webm" });

  const text = data.reply || data.resposta || data.message || data.text || data.output || data.content || "";
  if (!media.length) return splitAiText(text || fallbackText);
  return media.map((item, index) => ({ text: index === 0 ? text : "", media: item }));
};

const parseAiReply = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.startsWith("image/") || contentType.startsWith("audio/")) {
    const blob = await response.blob();
    return [
      {
        text: contentType.startsWith("audio/") ? "Audio recebido" : "Imagem recebida",
        media: { blob, type: getMediaType(contentType), mimeType: contentType },
      },
    ];
  }

  const text = await response.text();
  return normalizeAiPayload(readJsonSafely(text), text);
};

const buildJsonPayload = (message, inputType = "text") => ({
  message,
  inputType,
  conversationId: chatSessionId,
  history: getChatMemory(),
  source: "iguitech-site",
  page: window.location.href,
  timestamp: new Date().toISOString(),
});

const buildFormPayload = (message, media) => {
  const formData = new FormData();
  const payload = buildJsonPayload(message, getMediaType(media.file));
  formData.append("payload", JSON.stringify(payload));
  formData.append("message", message);
  formData.append("conversationId", payload.conversationId);
  formData.append("history", JSON.stringify(payload.history));
  formData.append("source", "iguitech-site");
  formData.append("page", window.location.href);
  formData.append("timestamp", new Date().toISOString());
  formData.append("mediaType", getMediaType(media.file));
  formData.append("file", media.file, media.file.name || `iguitech-${Date.now()}.webm`);
  return formData;
};

const sendToWebhook = (message, media = null) => {
  if (media?.file) {
    return fetch(webhookUrl, {
      method: "POST",
      body: buildFormPayload(message, media),
    });
  }

  return fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildJsonPayload(message)),
  });
};

const wait = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const renderAiResponse = async (loading, replies) => {
  loading.remove();
  for (const reply of replies) {
    addMessage(reply.text, "ai", reply.media);
    rememberChatMessage("assistant", reply.text, reply.media?.type || reply.media?.kind || null);
    if (replies.length > 1) await wait(520);
  }
};

const setChatDisabled = (isDisabled) => {
  if (chatInput) chatInput.disabled = isDisabled;
  if (chatAttach) chatAttach.disabled = isDisabled;
  if (chatRecord) chatRecord.disabled = isDisabled;
  chatForm?.querySelector('button[type="submit"]')?.toggleAttribute("disabled", isDisabled);
};

const sendChatMessage = async (message, media = null) => {
  const mediaType = media ? getMediaType(media.file) : null;
  trackEvent("ai_chat_message_send", {
    input_type: mediaType || "text",
    has_text: Boolean(message),
    message_length: String(message || "").length,
  });
  const fallbackLabel = media ? (mediaType === "audio" ? "Audio enviado" : "Imagem enviada") : message;
  addMessage(fallbackLabel, "user", media);
  rememberChatMessage("user", message || fallbackLabel, mediaType);
  if (chatInput) chatInput.value = "";
  pendingMedia = null;
  if (chatMedia) chatMedia.value = "";
  setChatDisabled(true);

  const loading = addMessage("Digitando...", "ai loading");

  try {
    if (useLocalDemoAgent) {
      const replies = await getLocalDemoResponse(message, media);
      await renderAiResponse(loading, replies);
      return;
    }

    const response = await sendToWebhook(message, media);

    if (!response.ok) {
      throw new Error(`Webhook respondeu com status ${response.status}`);
    }

    const replies = await parseAiReply(response);
    await renderAiResponse(loading, replies);
  } catch (error) {
    loading.textContent =
      "A conexao com a IA ainda nao retornou uma resposta. No n8n, finalize o fluxo com o no Respond to Webhook retornando JSON.";
    loading.classList.remove("loading");
    console.error(error);
  } finally {
    setChatDisabled(false);
    chatInput?.focus();
  }
};

const openAiChatPanel = () => {
  trackEvent("ai_chat_open", {
    source: "button_or_header",
  });
  chatPanel?.classList.add("is-open");
  chatPanel?.classList.remove("is-shaking");
  document.body.classList.add("chat-open");
  chatPanel?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => chatPanel?.classList.add("is-shaking"), 80);
  window.setTimeout(() => chatPanel?.classList.remove("is-shaking"), 850);
  setTimeout(() => chatInput?.focus(), 500);
};

if (window.matchMedia("(max-width: 640px)").matches) {
  chatPanel?.classList.remove("is-open");
}

chatButton?.addEventListener("click", openAiChatPanel);

chatPanel?.querySelector(".wa-header")?.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 640px)").matches && !chatPanel.classList.contains("is-open")) {
    openAiChatPanel();
  }
});

chatAttach?.addEventListener("click", () => {
  trackEvent("ai_chat_attach_click");
  chatMedia?.click();
});

chatMedia?.addEventListener("change", () => {
  const file = chatMedia.files?.[0];
  if (!file) return;
  pendingMedia = { file };
  trackEvent("ai_chat_media_selected", {
    input_type: getMediaType(file),
  });
  chatInput?.focus();
});

chatRecord?.addEventListener("click", async () => {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    addMessage("Seu navegador nao liberou gravacao de audio aqui.", "ai");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", () => {
      stream.getTracks().forEach((track) => track.stop());
      chatRecord.classList.remove("is-recording");
      const blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || "audio/webm" });
      const file = new File([blob], `audio-iguitech-${Date.now()}.webm`, { type: blob.type });
      sendChatMessage("", { file });
    });
    mediaRecorder.start();
    chatRecord.classList.add("is-recording");
    trackEvent("ai_chat_audio_record_start");
  } catch (error) {
    addMessage("Nao consegui acessar o microfone. Verifique a permissao do navegador.", "ai");
    console.error(error);
  }
});

chatForm?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const message = chatInput?.value.trim();
    if (!message && !pendingMedia) return;
    sendChatMessage(message, pendingMedia);
  },
  true,
);
