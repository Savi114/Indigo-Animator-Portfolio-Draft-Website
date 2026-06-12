const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const cursorGlow = document.querySelector('.cursor-glow');
const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const workGroups = document.querySelectorAll('.work-group');

const modal = document.querySelector('#projectModal');
const modalImage = document.querySelector('#modalImage');
const modalTitle = document.querySelector('#modalTitle');
const modalType = document.querySelector('#modalType');
const modalYear = document.querySelector('#modalYear');
const modalMedium = document.querySelector('#modalMedium');
const modalDescription = document.querySelector('#modalDescription');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');

const animationCards = document.querySelectorAll('.animation-card');
const videoModal = document.querySelector('#videoModal');
const modalVideo = document.querySelector('#modalVideo');
const modalVideoSource = document.querySelector('#modalVideoSource');
const videoModalTitle = document.querySelector('#videoModalTitle');
const videoModalType = document.querySelector('#videoModalType');
const videoModalYear = document.querySelector('#videoModalYear');
const videoModalDescription = document.querySelector('#videoModalDescription');
const closeVideoModalButtons = document.querySelectorAll('[data-close-video-modal]');

const autoplayVideos = document.querySelectorAll('.reel-video, .animation-preview');

if (autoplayVideos.length > 0) {
  autoplayVideos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = () => {
      video.play().catch(() => {
        console.log('Autoplay was blocked by the browser.');
      });
    };

    window.addEventListener('load', playVideo);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        playVideo();
      }
    });
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (cursorGlow) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealItems.forEach((item) => {
  observer.observe(item);
});

function updateVisibleGroups() {
  workGroups.forEach((group) => {
    const cardsInGroup = group.querySelectorAll('.project-card');
    const hasVisibleCard = Array.from(cardsInGroup).some((card) => {
      return !card.classList.contains('hidden');
    });

    group.classList.toggle('group-hidden', !hasVisibleCard);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
    });

    button.classList.add('active');

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !matches);
    });

    updateVisibleGroups();
  });
});

projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (!modal) return;

    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;

    modalTitle.textContent = card.dataset.title;
    modalType.textContent = card.dataset.type;
    modalYear.textContent = card.dataset.year;
    modalMedium.textContent = card.dataset.medium;
    modalDescription.textContent = card.dataset.description;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});

function closeProjectModal() {
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  modalImage.src = '';
  modalImage.alt = '';
}

closeModalButtons.forEach((button) => {
  button.addEventListener('click', closeProjectModal);
});

animationCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (!videoModal || !modalVideo || !modalVideoSource) return;

    modalVideoSource.src = card.dataset.video;
    modalVideo.load();

    videoModalTitle.textContent = card.dataset.title;
    videoModalType.textContent = card.dataset.type;
    videoModalYear.textContent = card.dataset.year;
    videoModalDescription.textContent = card.dataset.description;

    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    modalVideo.play().catch(() => {
      console.log('Video is ready, but autoplay in modal was blocked.');
    });
  });
});

function closeVideoModal() {
  if (!videoModal || !modalVideo || !modalVideoSource) return;

  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideoSource.src = '';
  modalVideo.load();

  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

closeVideoModalButtons.forEach((button) => {
  button.addEventListener('click', closeVideoModal);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (modal && modal.classList.contains('open')) {
      closeProjectModal();
    }

    if (videoModal && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  }
});
