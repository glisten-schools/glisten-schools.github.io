(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
  const backToTop = document.querySelector('.back-to-top');

  const closeDropdowns = (except = null) => {
    dropdowns.forEach(drop => {
      if (drop === except) return;
      drop.classList.remove('open');
      drop.querySelector('.nav-parent')?.setAttribute('aria-expanded', 'false');
    });
  };

  navToggle?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', String(open));
    if (!open) closeDropdowns();
  });

  const desktopHoverNavigation = window.matchMedia('(min-width: 1050px)');
  const dropdownCloseTimers = new WeakMap();

  const clearDropdownCloseTimer = drop => {
    const timer = dropdownCloseTimers.get(drop);
    if (timer) window.clearTimeout(timer);
    dropdownCloseTimers.delete(drop);
  };

  dropdowns.forEach(drop => {
    const button = drop.querySelector('.nav-parent');
    button?.addEventListener('click', event => {
      event.stopPropagation();
      clearDropdownCloseTimer(drop);
      const willOpen = !drop.classList.contains('open');
      closeDropdowns(drop);
      drop.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });

    // Desktop hover intent: keep the submenu open while the pointer travels
    // from the parent button into the dropdown panel. The short close delay
    // prevents accidental disappearance without affecting mobile click use.
    drop.addEventListener('mouseenter', () => {
      if (!desktopHoverNavigation.matches) return;
      clearDropdownCloseTimer(drop);
      closeDropdowns(drop);
      drop.classList.add('open');
      button?.setAttribute('aria-expanded', 'true');
    });

    const menu = drop.querySelector('.dropdown-menu');

    // Keep the menu open even on hybrid/touch-capable laptops where the
    // browser may not report a fine hover pointer. Entering either the parent
    // control or the panel immediately cancels any pending close.
    [button, menu].forEach(target => {
      target?.addEventListener('pointerenter', event => {
        if (!desktopHoverNavigation.matches || event.pointerType === 'touch') return;
        clearDropdownCloseTimer(drop);
        closeDropdowns(drop);
        drop.classList.add('open');
        button?.setAttribute('aria-expanded', 'true');
      });
    });

    drop.addEventListener('pointerleave', event => {
      if (!desktopHoverNavigation.matches || event.pointerType === 'touch') return;
      clearDropdownCloseTimer(drop);
      const timer = window.setTimeout(() => {
        if (drop.matches(':hover') || drop.matches(':focus-within')) return;
        drop.classList.remove('open');
        button?.setAttribute('aria-expanded', 'false');
        dropdownCloseTimers.delete(drop);
      }, 850);
      dropdownCloseTimers.set(drop, timer);
    });

    menu?.addEventListener('pointerleave', event => {
      if (!desktopHoverNavigation.matches || event.pointerType === 'touch') return;
      clearDropdownCloseTimer(drop);
      const timer = window.setTimeout(() => {
        if (drop.matches(':hover') || drop.matches(':focus-within')) return;
        drop.classList.remove('open');
        button?.setAttribute('aria-expanded', 'false');
        dropdownCloseTimers.delete(drop);
      }, 850);
      dropdownCloseTimers.set(drop, timer);
    });
  });

  desktopHoverNavigation.addEventListener?.('change', () => {
    dropdowns.forEach(clearDropdownCloseTimer);
    closeDropdowns();
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) closeDropdowns();
    if (navMenu?.classList.contains('show') && !event.target.closest('.nav-wrap')) {
      navMenu.classList.remove('show');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('show');
      navToggle?.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    });
  });

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const pageLinks = [...document.querySelectorAll('[data-page]')];
  pageLinks.forEach(link => link.classList.remove('active'));
  dropdowns.forEach(drop => drop.querySelector('.nav-parent')?.classList.remove('active'));

  // Prefer a direct top-level page link when duplicate destinations exist.
  // This keeps only Home active on index.html instead of also activating Our Schools.
  const directPageLink = [...document.querySelectorAll('.nav-menu > li:not(.nav-dropdown) > a[data-page]')]
    .find(link => link.dataset.page === currentPage);

  if (directPageLink) {
    directPageLink.classList.add('active');
  } else {
    pageLinks.filter(link => link.dataset.page === currentPage).forEach(link => link.classList.add('active'));
    dropdowns.forEach(drop => {
      if (drop.querySelector('a.active')) drop.querySelector('.nav-parent')?.classList.add('active');
    });
  }

  // Keep the separate desktop Contact action synchronized with the page.
  if (currentPage === 'contact.html') {
    document.querySelectorAll('.nav-premium-contact[data-page="contact.html"], .nav-mobile-cta a[data-page="contact.html"]')
      .forEach(link => link.classList.add('active'));
  }

  let scrollFrame = 0;
  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const y = window.scrollY;
      header?.classList.toggle('scrolled', y > 48);
      backToTop?.classList.toggle('show', y > 520);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const revealItems = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: '0px 0px -25px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Universal full-screen image viewer.
  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Full image view');
  lightbox.innerHTML = `
    <div class="lightbox-shell">
      <div class="lightbox-topbar">
        <button class="lightbox-back" type="button" aria-label="Return to the page"><span aria-hidden="true">←</span><strong>Back</strong></button>
        <span class="lightbox-counter" aria-live="polite"></span>
        <div class="lightbox-actions">
          <button class="lightbox-size" type="button" aria-label="View image at actual size" aria-pressed="false"><span aria-hidden="true">⛶</span><strong>Actual Size</strong></button>
          <button class="lightbox-close" type="button" aria-label="Close image"><span aria-hidden="true">×</span><strong>Close</strong></button>
        </div>
      </div>
      <div class="lightbox-stage">
        <div class="lightbox-media is-loading">
          <span class="lightbox-image-loader" aria-hidden="true"><i></i></span>
          <img alt="" draggable="false">
          <p class="lightbox-error" role="status">This image could not be loaded. Please close it and try again.</p>
        </div>
        <p class="lightbox-caption" aria-live="polite"></p>
      </div>
      <div class="lightbox-bottom-controls">
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="View previous image"><span aria-hidden="true">←</span><strong>Previous</strong></button>
        <span class="lightbox-help">Full image shown · Use arrow keys or swipe</span>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="View next image"><strong>Next</strong><span aria-hidden="true">→</span></button>
      </div>
    </div>`;
  document.body.appendChild(lightbox);

  const image = lightbox.querySelector('img');
  const media = lightbox.querySelector('.lightbox-media');
  const caption = lightbox.querySelector('.lightbox-caption');
  const counter = lightbox.querySelector('.lightbox-counter');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const backButton = lightbox.querySelector('.lightbox-back');
  const sizeButton = lightbox.querySelector('.lightbox-size');
  const sizeButtonText = sizeButton.querySelector('strong');
  const previousButton = lightbox.querySelector('.lightbox-prev');
  const nextButton = lightbox.querySelector('.lightbox-next');
  let lastTrigger = null;
  let currentItems = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let pageNodes = [];

  const fullSource = img => {
    const explicit = img.dataset.fullSrc;
    if (explicit) return explicit;
    const shown = img.currentSrc || img.getAttribute('src') || '';
    return shown.replace('/thumbs/', '/');
  };

  let standaloneGroupSeed = 0;
  const shouldSkipStandaloneViewer = img => {
    const alt = (img.getAttribute('alt') || '').trim().toLowerCase();
    if (alt.includes('logo')) return true;
    return Boolean(img.closest('[data-lightbox], a, .hero-identity, .school-logo-box, .admission-tab, .contact-hub-logo, .route-campus, .prep-logo-card, .contact-card-head, .path-school, .brand, .footer-brand-duo, .location-point, .contact-hub-head'));
  };

  const standaloneGroup = img => {
    const explicit = img.closest('[data-viewer-group]')?.dataset.viewerGroup;
    if (explicit) return explicit;

    const scope = img.closest('section[id], article[id], section, article, .section-pad, .page-hero, .hero, .prep-hero, .split, .image-stack, .image-frame, .portrait-frame');
    if (!scope) return 'standalone';

    if (!scope.dataset.viewerGroup) {
      standaloneGroupSeed += 1;
      scope.dataset.viewerGroup = scope.id || `standalone-${standaloneGroupSeed}`;
    }
    return scope.dataset.viewerGroup;
  };

  const standaloneImages = () => [...document.querySelectorAll('main img[data-viewer-image="page"]')];
  document.querySelectorAll('main img').forEach(img => {
    if (shouldSkipStandaloneViewer(img)) return;
    img.dataset.viewerImage = 'page';
    img.dataset.viewerGroup = standaloneGroup(img);
    if (!img.dataset.fullSrc && (img.currentSrc || img.src).includes('/thumbs/')) {
      img.dataset.fullSrc = (img.currentSrc || img.getAttribute('src')).replace('/thumbs/', '/');
    }
    img.classList.add('viewer-ready');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Open full image: ${img.alt || 'Glisten Schools image'}`);
  });

  const allViewerTriggers = () => [...document.querySelectorAll('[data-lightbox]'), ...standaloneImages()];
  const itemGroup = item => item.matches('[data-lightbox]') ? `lightbox:${item.dataset.lightbox || 'default'}` : `page:${item.dataset.viewerGroup || 'standalone'}`;
  const groupItems = trigger => {
    const group = itemGroup(trigger);
    return allViewerTriggers().filter(item => {
      if (itemGroup(item) !== group) return false;
      if (item.classList.contains('hidden') || item.closest('.hidden,[hidden]')) return false;
      return true;
    });
  };

  const itemDetails = item => {
    if (item.matches('[data-lightbox]')) {
      const itemImage = item.querySelector('img');
      return {
        src: item.getAttribute('href'),
        alt: itemImage?.alt || 'Glisten Schools image',
        caption: item.dataset.caption || itemImage?.alt || 'Glisten Schools image'
      };
    }
    return {
      src: fullSource(item),
      alt: item.alt || 'Glisten Schools image',
      caption: item.dataset.caption || item.alt || 'Glisten Schools image'
    };
  };

  const setActualSize = active => {
    media.classList.toggle('actual-size', active);
    sizeButton.setAttribute('aria-pressed', String(active));
    sizeButton.dataset.mode = active ? 'actual' : 'fit';
    sizeButton.setAttribute('aria-label', active ? 'Switch to fit image' : 'Switch to actual size');
    sizeButtonText.textContent = active ? 'Actual Size' : 'Fit Image';
    if (active) {
      requestAnimationFrame(() => {
        media.scrollLeft = Math.max(0, (media.scrollWidth - media.clientWidth) / 2);
        media.scrollTop = Math.max(0, (media.scrollHeight - media.clientHeight) / 2);
      });
    } else {
      media.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    }
  };

  const preloadNeighbours = () => {
    if (currentItems.length < 2) return;
    [-1, 1].forEach(offset => {
      const item = currentItems[(currentIndex + offset + currentItems.length) % currentItems.length];
      const src = itemDetails(item).src;
      if (src) {
        const preloader = new Image();
        preloader.src = src;
      }
    });
  };

  const renderItem = (trigger, direction = 0) => {
    if (!trigger) return;
    setActualSize(false);
    media.classList.remove('has-error', 'is-portrait');
    media.classList.add('is-loading');
    const details = itemDetails(trigger);
    caption.textContent = details.caption;
    counter.textContent = `${currentIndex + 1} of ${currentItems.length}`;
    const hasMultiple = currentItems.length > 1;
    previousButton.disabled = !hasMultiple;
    nextButton.disabled = !hasMultiple;

    image.onload = () => {
      media.classList.remove('is-loading');
      media.classList.toggle('is-portrait', image.naturalHeight > image.naturalWidth * 1.05);
      preloadNeighbours();
    };
    image.onerror = () => {
      media.classList.remove('is-loading');
      media.classList.remove('is-portrait');
      media.classList.add('has-error');
    };
    image.alt = details.alt;
    image.src = details.src;

    if (typeof image.animate === 'function') {
      const x = direction < 0 ? '-18px' : direction > 0 ? '18px' : '0';
      image.animate(
        [{ opacity: .3, transform: `translateX(${x}) scale(.985)` }, { opacity: 1, transform: 'none' }],
        { duration: 250, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    }
  };

  const lockPage = () => {
    pageNodes = [...document.body.children]
      .filter(node => node !== lightbox)
      .map(node => ({ node, inert: node.inert }));
    pageNodes.forEach(({ node }) => { node.inert = true; });
  };

  const unlockPage = () => {
    pageNodes.forEach(({ node, inert }) => { node.inert = inert; });
    pageNodes = [];
  };

  const openLightbox = trigger => {
    lastTrigger = trigger;
    currentItems = groupItems(trigger);
    currentIndex = Math.max(0, currentItems.indexOf(trigger));
    renderItem(currentItems[currentIndex]);
    lockPage();
    lightbox.classList.add('show');
    document.body.classList.add('lightbox-open');
    backButton.focus();
  };

  const moveLightbox = direction => {
    if (currentItems.length < 2) return;
    currentIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
    renderItem(currentItems[currentIndex], direction);
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains('show')) return;
    lightbox.classList.remove('show');
    document.body.classList.remove('lightbox-open');
    setActualSize(false);
    image.removeAttribute('src');
    media.classList.remove('is-loading', 'has-error', 'is-portrait');
    unlockPage();
    lastTrigger?.focus();
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-lightbox]');
    const standalone = !link && event.target.closest('img[data-viewer-image]');
    const trigger = link || standalone;
    if (!trigger) return;
    event.preventDefault();
    openLightbox(trigger);
  });

  document.addEventListener('keydown', event => {
    const standalone = event.target.closest?.('img[data-viewer-image]');
    if (!standalone || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    openLightbox(standalone);
  });

  previousButton.addEventListener('click', () => moveLightbox(-1));
  nextButton.addEventListener('click', () => moveLightbox(1));
  closeButton.addEventListener('click', closeLightbox);
  backButton.addEventListener('click', closeLightbox);
  sizeButton.addEventListener('click', () => setActualSize(!media.classList.contains('actual-size')));
  image.addEventListener('dblclick', () => setActualSize(!media.classList.contains('actual-size')));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('touchstart', event => {
    if (media.classList.contains('actual-size')) return;
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });
  lightbox.addEventListener('touchend', event => {
    if (media.classList.contains('actual-size')) return;
    const distance = (event.changedTouches[0]?.clientX || 0) - touchStartX;
    if (Math.abs(distance) > 55) moveLightbox(distance > 0 ? -1 : 1);
  }, { passive: true });

  document.addEventListener('keydown', event => {
    if (lightbox.classList.contains('show')) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
      if (event.key === 'Tab') {
        const focusable = [...lightbox.querySelectorAll('button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])')]
          .filter(el => !el.hidden && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    } else if (event.key === 'Escape') {
      closeDropdowns();
    }
  });

  // Glisten Preparatory hero slider with pause and accessibility controls.
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = [...slider.querySelectorAll('.prep-slide')];
    const dotsWrap = slider.querySelector('.slider-dots');
    const previous = slider.querySelector('.slider-arrow.prev');
    const next = slider.querySelector('.slider-arrow.next');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pauseButton = document.createElement('button');
    pauseButton.type = 'button';
    pauseButton.className = 'slider-pause';
    pauseButton.setAttribute('aria-label', 'Pause slideshow');
    pauseButton.textContent = 'Pause';
    dotsWrap?.insertAdjacentElement('afterend', pauseButton);
    let index = 0;
    let timer = null;
    let manuallyPaused = false;

    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show image ${i + 1}`);
      dot.addEventListener('click', () => { show(i); restart(); });
      dotsWrap?.appendChild(dot);
    });
    const dots = [...(dotsWrap?.children || [])];
    const loadSlide = slide => {
      const background = window.innerWidth <= 720 && slide?.dataset.bgMobile
        ? slide.dataset.bgMobile
        : slide?.dataset.bg;
      if (!background || slide.dataset.bgLoaded === 'true') return;
      slide.style.backgroundImage = `url('${background}')`;
      slide.dataset.bgLoaded = 'true';
    };
    const show = newIndex => {
      index = (newIndex + slides.length) % slides.length;
      loadSlide(slides[index]);
      slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
      window.setTimeout(() => loadSlide(slides[(index + 1) % slides.length]), 700);
    };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    const start = () => {
      if (!reduceMotion && !manuallyPaused && slides.length > 1 && !timer) {
        timer = setInterval(() => show(index + 1), 5000);
      }
    };
    const restart = () => { stop(); start(); };
    previous?.addEventListener('click', () => { show(index - 1); restart(); });
    next?.addEventListener('click', () => { show(index + 1); restart(); });
    pauseButton.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      pauseButton.textContent = manuallyPaused ? 'Play' : 'Pause';
      pauseButton.setAttribute('aria-label', manuallyPaused ? 'Play slideshow' : 'Pause slideshow');
      manuallyPaused ? stop() : start();
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    show(0);
    start();
  }

  // Gallery filters.
  const filters = [...document.querySelectorAll('[data-filter]')];
  const galleryItems = [...document.querySelectorAll('.gallery-item[data-category]')];
  const galleryEmpty = document.querySelector('.gallery-empty');
  let galleryStatus = null;
  if (filters.length) {
    galleryStatus = document.createElement('p');
    galleryStatus.className = 'sr-only';
    galleryStatus.setAttribute('aria-live', 'polite');
    filters.at(-1)?.parentElement?.insertAdjacentElement('afterend', galleryStatus);
  }
  filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach(btn => {
        const active = btn === button;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
      let visible = 0;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
        if (show) visible += 1;
      });
      if (galleryEmpty) galleryEmpty.hidden = visible !== 0;
      if (galleryStatus) galleryStatus.textContent = `${visible} photo${visible === 1 ? '' : 's'} shown.`;
    });
  });

  // Admissions selectable panels with arrow-key support.
  const admissionTabs = [...document.querySelectorAll('.admission-tab[data-tab]')];
  const activateAdmissionTab = tab => {
    const targetId = tab.dataset.tab;
    admissionTabs.forEach(btn => {
      const active = btn === tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('.admission-panel').forEach(panel => {
      const active = panel.id === targetId;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  };
  admissionTabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => activateAdmissionTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = tabIndex;
      if (event.key === 'ArrowLeft') nextIndex = (tabIndex - 1 + admissionTabs.length) % admissionTabs.length;
      if (event.key === 'ArrowRight') nextIndex = (tabIndex + 1) % admissionTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = admissionTabs.length - 1;
      activateAdmissionTab(admissionTabs[nextIndex]);
      admissionTabs[nextIndex].focus();
    });
  });

  // Reading progress inside the navbar.
  const progressBar = document.querySelector('.scroll-progress span');
  let progressFrame = 0;
  const updateProgress = () => {
    if (!progressBar || progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      progressFrame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
      progressBar.style.transform = `scaleX(${progress / 100})`;
    });
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Progressive image loading.
  document.querySelectorAll('img').forEach(currentImage => {
    currentImage.classList.add('media-loading');
    const markReady = () => {
      currentImage.classList.remove('media-loading');
      currentImage.classList.add('media-ready');
    };
    if (currentImage.complete) markReady();
    else {
      currentImage.addEventListener('load', markReady, { once: true });
      currentImage.addEventListener('error', markReady, { once: true });
    }
  });

  // Lightweight button ripple.
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointerdown', event => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
      button.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
      button.classList.remove('is-rippling');
      void button.offsetWidth;
      button.classList.add('is-rippling');
      window.setTimeout(() => button.classList.remove('is-rippling'), 620);
    });
  });
})();
