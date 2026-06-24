const mediaItems = [
  {
    type: "Foto",
    title: "Portrait Quente",
    meta: "Retrato / luz quente",
    label: "Portrait",
    kind: "image",
    src: "assets/portfolio/IMG_5631.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Street Cut",
    meta: "Reel vertical / impacto",
    label: "Street Cut",
    kind: "video",
    src: "assets/portfolio/IMG_3448.MP4",
    mime: "video/mp4",
  },
  {
    type: "Foto",
    title: "Lifestyle",
    meta: "Foto / marca pessoal",
    label: "Lifestyle",
    kind: "image",
    src: "assets/portfolio/IMG_5618.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Evento Noturno",
    meta: "Vídeo / cobertura",
    label: "Evento",
    kind: "video",
    src: "assets/portfolio/IMG_3446.MP4",
    mime: "video/mp4",
  },
  {
    type: "Foto",
    title: "Direção Visual",
    meta: "Frame / composição",
    label: "Direção",
    kind: "image",
    src: "assets/portfolio/IMG_2014.PNG",
  },
  {
    type: "Vídeo",
    title: "Motion Detail",
    meta: "Vídeo / detalhe em movimento",
    label: "Motion",
    kind: "video",
    src: "assets/portfolio/IMG_2919.MOV",
    mime: "video/quicktime",
  },
  {
    type: "Foto",
    title: "Still de Campanha",
    meta: "Foto / campanha",
    label: "Still",
    kind: "image",
    src: "assets/portfolio/IMG_6856.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Bastidor",
    meta: "Vídeo / set e processo",
    label: "Bastidor",
    kind: "video",
    src: "assets/portfolio/IMG_2439.MOV",
    mime: "video/quicktime",
  },
  {
    type: "Foto",
    title: "Outdoor Frame",
    meta: "Foto / ambiente",
    label: "Outdoor",
    kind: "image",
    src: "assets/portfolio/IMG_2455.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Cena Rápida",
    meta: "Vídeo / corte curto",
    label: "Cena",
    kind: "video",
    src: "assets/portfolio/IMG_2451.MOV",
    mime: "video/quicktime",
  },
  {
    type: "Foto",
    title: "Frame Urbano",
    meta: "Foto / contraste",
    label: "Urbano",
    kind: "image",
    src: "assets/portfolio/IMG_3099.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Teaser",
    meta: "Vídeo / teaser social",
    label: "Teaser",
    kind: "video",
    src: "assets/portfolio/IMG_3447.MP4",
    mime: "video/mp4",
  },
  {
    type: "Foto",
    title: "Close Visual",
    meta: "Foto / detalhe",
    label: "Close",
    kind: "image",
    src: "assets/portfolio/IMG_6855.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Take Vertical",
    meta: "Vídeo / vertical",
    label: "Vertical",
    kind: "video",
    src: "assets/portfolio/IMG_2911.MOV",
    mime: "video/quicktime",
  },
  {
    type: "Foto",
    title: "Editorial",
    meta: "Foto / editorial",
    label: "Editorial",
    kind: "image",
    src: "assets/portfolio/IMG_0200.JPG.jpeg",
  },
  {
    type: "Vídeo",
    title: "Micro Reel",
    meta: "Vídeo / social cut",
    label: "Micro Reel",
    kind: "video",
    src: "assets/portfolio/IMG_2915.MOV",
    mime: "video/quicktime",
  },
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLowPowerViewport = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
const globeItems = isLowPowerViewport ? mediaItems.slice(0, 8) : mediaItems;

if (isLowPowerViewport) {
  document.documentElement.classList.add("low-power-mobile");
}
const globe = document.querySelector("#mediaGlobe");
const stage = document.querySelector("#globeStage");
const featuredType = document.querySelector("#featuredType");
const featuredTitle = document.querySelector("#featuredTitle");
const featuredMeta = document.querySelector("#featuredMeta");
const pauseButton = document.querySelector('[data-spin="toggle"]');
const nextButton = document.querySelector('[data-spin="next"]');
const lightbox = document.querySelector("#mediaLightbox");
const lightboxViewport = document.querySelector("#lightboxViewport");
const lightboxCaption = document.querySelector("#lightboxCaption");
const closeLightboxButton = document.querySelector("[data-close-lightbox]");

let rotationX = -9;
let rotationY = 0;
let targetX = rotationX;
let targetY = rotationY;
let activeIndex = 0;
let isDragging = false;
let isPaused = prefersReducedMotion || isLowPowerViewport;
let dragStart = { x: 0, y: 0, rx: 0, ry: 0 };
let lastFrame = performance.now();

function createMediaElement(item, options = {}) {
  if (item.kind === "video") {
    const video = document.createElement("video");
    video.muted = options.muted ?? true;
    video.loop = options.loop ?? true;
    video.playsInline = true;
    video.preload = options.preload ?? "metadata";
    if (options.controls) video.controls = true;

    const source = document.createElement("source");
    source.src = item.src;
    source.type = item.mime || "video/mp4";
    video.append(source);
    return video;
  }

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.title;
  image.loading = options.loading || "lazy";
  return image;
}

function createVideoPlaceholder(index) {
  const frame = document.createElement("div");
  const variants = ["frame-street", "frame-event", "frame-brand"];
  frame.className = `generated-frame ${variants[index % variants.length]}`;
  frame.setAttribute("aria-hidden", "true");
  return frame;
}

function createGlobeCards() {
  const fragment = document.createDocumentFragment();

  globeItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.className = `globe-card ${item.kind === "video" ? "is-video" : ""}`;
    card.type = "button";
    card.setAttribute("aria-label", `${item.type}: ${item.title}`);
    card.dataset.index = String(index);
    card.append(isLowPowerViewport && item.kind === "video" ? createVideoPlaceholder(index) : createMediaElement(item));

    const label = document.createElement("span");
    label.textContent = item.label;
    card.append(label);

    card.addEventListener("click", () => {
      const isAlreadyActive = activeIndex === index;
      setActive(index, true);
      if (isAlreadyActive) openLightbox(item);
    });

    fragment.append(card);
  });

  stage.append(fragment);
}

function positionCards() {
  const cards = [...stage.querySelectorAll(".globe-card")];
  const radius = globe.offsetWidth * (isLowPowerViewport ? 0.31 : 0.35);

  cards.forEach((card, index) => {
    const phi = Math.acos(-1 + (2 * index + 1) / cards.length);
    const theta = Math.sqrt(cards.length * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const depth = (z + radius) / (radius * 2);
    const opacity = 0.48 + depth * 0.52;
    const scale = 0.78 + depth * 0.26;

    card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${-rotationY}deg) rotateX(${-rotationX}deg) scale(${scale})`;
    card.style.opacity = opacity.toFixed(2);
    card.style.zIndex = String(Math.round(depth * 100));
    card.style.filter = isLowPowerViewport ? "none" : `brightness(${0.78 + depth * 0.42})`;
  });

  stage.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function playActiveGlobeMedia() {
  stage.querySelectorAll("video").forEach((video) => {
    video.pause();
  });

  if (isLowPowerViewport) return;

  const activeCard = stage.querySelector(`.globe-card[data-index="${activeIndex}"]`);
  const activeVideo = activeCard?.querySelector("video");
  if (activeVideo && !prefersReducedMotion) {
    activeVideo.play().catch(() => {});
  }
}

function setActive(index, snapGlobe = false) {
  activeIndex = (index + globeItems.length) % globeItems.length;
  const item = globeItems[activeIndex];

  featuredType.textContent = item.type;
  featuredTitle.textContent = item.title;
  featuredMeta.textContent = item.meta;

  stage.querySelectorAll(".globe-card").forEach((card) => {
    card.classList.toggle("is-active", Number(card.dataset.index) === activeIndex);
  });

  playActiveGlobeMedia();

  if (snapGlobe) {
    targetY += 28;
    isPaused = true;
    pauseButton.textContent = "Retomar giro";
  }

  if (isLowPowerViewport) {
    rotationX = targetX;
    rotationY = targetY;
    positionCards();
  }
}

function animate(now) {
  const delta = Math.min((now - lastFrame) / 16.67, 2);
  lastFrame = now;

  if (!isPaused && !isDragging) {
    targetY += 0.22 * delta;
  }

  rotationX += (targetX - rotationX) * 0.08;
  rotationY += (targetY - rotationY) * 0.08;
  positionCards();

  const nextActive = Math.abs(Math.round(rotationY / 28)) % globeItems.length;
  if (!isDragging && !isPaused && nextActive !== activeIndex) {
    setActive(nextActive);
  }

  requestAnimationFrame(animate);
}

function handlePointerDown(event) {
  isDragging = true;
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    rx: targetX,
    ry: targetY,
  };
  if (!isLowPowerViewport) globe.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  if (!isDragging) return;

  const dx = event.clientX - dragStart.x;
  const dy = event.clientY - dragStart.y;
  targetY = dragStart.ry + dx * 0.34;
  targetX = Math.max(-34, Math.min(28, dragStart.rx - dy * 0.24));

  if (isLowPowerViewport) {
    rotationX = targetX;
    rotationY = targetY;
    positionCards();
  }
}

function handlePointerUp(event) {
  isDragging = false;
  if (globe.hasPointerCapture(event.pointerId)) globe.releasePointerCapture(event.pointerId);
}

function openLightbox(item) {
  lightboxViewport.replaceChildren();
  const media = createMediaElement(item, {
    controls: item.kind === "video",
    muted: false,
    loop: false,
    preload: "metadata",
    loading: "eager",
  });

  lightboxViewport.append(media);
  lightboxCaption.textContent = `${item.title} - ${item.meta}`;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";

  if (item.kind === "video") {
    media.play().catch(() => {});
  }
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxViewport.querySelectorAll("video").forEach((video) => video.pause());
  lightboxViewport.replaceChildren();
}

function initGallery() {
  document.querySelectorAll(".media-card[data-open]").forEach((card) => {
    const item = {
      src: card.dataset.open,
      title: card.dataset.title || "Mídia Isac.Productions",
      meta: card.dataset.kind === "video" ? "Vídeo do portfólio" : "Foto do portfólio",
      kind: card.dataset.kind,
      mime: card.dataset.open?.toLowerCase().endsWith(".mov") ? "video/quicktime" : "video/mp4",
    };

    const video = card.querySelector("video");
    if (video && isLowPowerViewport) {
      video.pause();
      video.preload = "none";
      video.querySelectorAll("source").forEach((source) => {
        source.dataset.src = source.src;
        source.removeAttribute("src");
      });
      video.load();
    }

    if (video && !prefersReducedMotion && !isLowPowerViewport) {
      card.addEventListener("mouseenter", () => video.play().catch(() => {}));
      card.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });
      card.addEventListener("focus", () => video.play().catch(() => {}));
      card.addEventListener("blur", () => video.pause());
    }

    card.addEventListener("click", () => openLightbox(item));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((element) => observer.observe(element));
}

createGlobeCards();
setActive(0);
positionCards();
initGallery();
initReveal();
if (!isLowPowerViewport) {
  requestAnimationFrame(animate);
}

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(positionCards, 120);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
closeLightboxButton.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

globe.addEventListener("pointerdown", handlePointerDown);
globe.addEventListener("pointermove", handlePointerMove);
globe.addEventListener("pointerup", handlePointerUp);
globe.addEventListener("pointercancel", handlePointerUp);

globe.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    targetY += 18;
    setActive(activeIndex + 1);
  }

  if (event.key === "ArrowLeft") {
    targetY -= 18;
    setActive(activeIndex - 1);
  }

  if (event.key === "ArrowUp") {
    targetX = Math.max(-34, targetX - 8);
  }

  if (event.key === "ArrowDown") {
    targetX = Math.min(28, targetX + 8);
  }

  if (event.key === "Enter") {
    openLightbox(globeItems[activeIndex]);
  }
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseButton.textContent = isPaused ? "Retomar giro" : "Pausar giro";
});

nextButton.addEventListener("click", () => {
  setActive(activeIndex + 1, true);
});