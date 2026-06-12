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
const reelVideo = document.querySelector('.reel-video');

if (reelVideo) {
  reelVideo.muted = true;
  reelVideo.loop = true;
  reelVideo.playsInline = true;

  const playReel = () => {
    reelVideo.play().catch(() => {
      console.log('Autoplay was blocked by the browser.');
    });
  };

  window.addEventListener('load', playReel);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      playReel();
    }
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

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeProjectModal();
  }
});
