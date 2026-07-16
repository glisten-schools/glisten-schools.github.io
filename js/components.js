(() => {
  const content = window.GLISTEN_CONTENT;
  if (!content) return;

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const thumbSrc = src => String(src)
    .replace("assets/images/", "assets/images/thumbs/")
    .replace(/\.(?:jpe?g|png|webp)$/i, ".webp");

  const mobileThumbSrc = src => thumbSrc(src).replace("assets/images/thumbs/", "assets/images/thumbs/mobile/");
  const responsiveThumb = src => `src="${escapeHtml(thumbSrc(src))}" srcset="${escapeHtml(mobileThumbSrc(src))} 420w, ${escapeHtml(thumbSrc(src))} 720w" sizes="(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 720px"`;

  const currentPage = location.pathname.split("/").pop() || "index.html";

  const iconFor = label => {
    const icons = {
      "Home": "⌂",
      "Our Schools": "◇",
      "About Us": "◎",
      "Academics": "✦",
      "Results": "★",
      "Admissions": "✓",
      "School Life": "◈",
      "Calendar": "▣",
      "Contact Us": "↗"
    };
    return icons[label] || "•";
  };


  const socialIcon = key => {
    const icons = {
      instagram: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"></rect><circle cx="12" cy="12" r="4.15"></circle><circle class="social-icon-dot" cx="17.45" cy="6.75" r="1.05"></circle></svg>`,
      facebook: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.4 21v-8h2.75l.42-3.2H14.4V7.75c0-.93.26-1.56 1.6-1.56h1.7V3.34c-.29-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.25V9.8H8.32V13h2.77v8h3.31Z"></path></svg>`,
      youtube: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21.25 7.15a2.85 2.85 0 0 0-2-2.02C17.49 4.65 12 4.65 12 4.65s-5.49 0-7.25.48a2.85 2.85 0 0 0-2 2.02A29.4 29.4 0 0 0 2.28 12c0 1.63.16 3.25.47 4.85a2.85 2.85 0 0 0 2 2.02c1.76.48 7.25.48 7.25.48s5.49 0 7.25-.48a2.85 2.85 0 0 0 2-2.02c.31-1.6.47-3.22.47-4.85s-.16-3.25-.47-4.85Z"></path><path class="social-icon-play" d="m10 15.2 5-3.2-5-3.2v6.4Z"></path></svg>`
    };
    return icons[key] || "";
  };

  const topSocialStripMarkup = () => `
    <div class="social-top-strip" id="top">
      <div class="container social-top-inner">
        <span class="social-top-label">Follow Us</span>
        <div class="social-top-links" aria-label="Glisten social media pages">
          ${content.socials.map(social => `
            <a class="social-top-link social-${escapeHtml(social.key)}" href="${escapeHtml(social.href)}" target="_blank" rel="noopener noreferrer" aria-label="Follow Glisten on ${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">
              ${socialIcon(social.key)}
            </a>`).join("")}
        </div>
      </div>
    </div>`;

  const childMarkup = child => `
    <li>
      <a data-page="${escapeHtml(child.href)}" href="${escapeHtml(child.href)}">
        <span class="dropdown-icon ${escapeHtml(child.accent || "blue")}">${child.accent === "gold" ? "★" : child.accent === "orange" ? "●" : "◆"}</span>
        <span class="dropdown-copy">
          <strong>${escapeHtml(child.label)}</strong>
          <small>${escapeHtml(child.description || "")}</small>
        </span>
        ${child.badge ? `<span class="menu-badge">${escapeHtml(child.badge)}</span>` : ""}
      </a>
    </li>`;

  const navMarkup = (item, liClass = "") => {
    if (item.children?.length) {
      return `
        <li class="nav-dropdown ${escapeHtml(liClass)}">
          <button class="nav-parent" type="button" aria-expanded="false">
            <span class="nav-icon" aria-hidden="true">${iconFor(item.label)}</span>
            <span class="nav-label">${escapeHtml(item.label)}</span>
            <span class="dropdown-caret" aria-hidden="true">⌄</span>
          </button>
          <ul class="dropdown-menu ${item.compact ? "compact-menu" : ""}" aria-label="${escapeHtml(item.label)} submenu">
            <li class="dropdown-heading" aria-hidden="true">
              <span>${escapeHtml(item.label)}</span><small>Explore Glisten Schools</small>
            </li>
            ${item.children.map(childMarkup).join("")}
          </ul>
        </li>`;
    }

    return `
      <li class="${escapeHtml(liClass)}">
        <a data-page="${escapeHtml(item.href)}" class="${item.cta ? "nav-contact" : ""}" href="${escapeHtml(item.href)}">
          <span class="nav-icon" aria-hidden="true">${iconFor(item.label)}</span>
          <span class="nav-label">${escapeHtml(item.label)}</span>
        </a>
      </li>`;
  };

  const headerMarkup = brandKey => {
    const brand = content.schools[brandKey] || content.schools.main;
    const centreNavigation = content.navigation.filter(item => !item.cta);
    const contactNavigation = content.navigation.find(item => item.cta);
    return `${topSocialStripMarkup()}
      <header class="site-header">
        <div class="scroll-progress" aria-hidden="true"><span></span></div>
        <nav class="navbar" aria-label="Primary navigation">
          <div class="nav-premium-line" aria-hidden="true"></div>
          <div class="container nav-wrap">
            <a class="brand ${brandKey === "preparatory" ? "brand-preparatory" : ""}" href="${escapeHtml(brand.home)}" aria-label="${escapeHtml(brand.name)} home">
              <span class="brand-logo-wrap">
                <span class="brand-logo-halo" aria-hidden="true"></span>
                <img class="logo" src="${escapeHtml(brand.logo)}" alt="${escapeHtml(brand.name)} logo">
              </span>
              <span class="brand-text">
                <strong>${escapeHtml(brand.name)}</strong>
                <span class="brand-meta">
                  <span class="brand-tagline">${escapeHtml(brand.tagline)}</span>
                </span>
              </span>
            </a>
            <button class="nav-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="primary-menu">
              <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="primary-menu">
              ${centreNavigation.map(item => navMarkup(item)).join("")}
              ${contactNavigation ? navMarkup(contactNavigation, "nav-mobile-cta") : ""}
            </ul>
            ${contactNavigation ? `
              <div class="nav-actions">
                <a data-page="${escapeHtml(contactNavigation.href)}" class="nav-premium-contact" href="${escapeHtml(contactNavigation.href)}">
                  <span class="nav-contact-copy"><small>Need guidance?</small><strong>Contact Us</strong></span>
                  <span class="nav-contact-arrow" aria-hidden="true">↗</span>
                </a>
              </div>` : ""}
          </div>
        </nav>
      </header>`;
  };

  const footerMarkup = () => {
    const main = content.schools.main;
    const prep = content.schools.preparatory;
    const mainContact = content.contacts.main;
    const prepContact = content.contacts.preparatory;

    return `
      <footer class="site-footer">
        <div class="footer-glow" aria-hidden="true"></div>
        <div class="container footer-intro">
          <div>
            <span class="footer-kicker">Glisten Schools</span>
            <h2>One vision. Two schools. Every stage matters.</h2>
          </div>
          <p>Glisten Preparatory and Glisten Pre and Primary School operate under the same ownership, serving children at different stages of their learning journey.</p>
        </div>
        <div class="container footer-grid">
          <div class="footer-about">
            <div class="footer-brand-duo">
              <img src="${escapeHtml(main.logo)}" alt="${escapeHtml(main.name)} logo">
              <img src="${escapeHtml(prep.logo)}" alt="${escapeHtml(prep.name)} logo">
            </div>
            <p>Quality learning, strong values, care, confidence, and purposeful growth in Mirerani.</p>
            <span class="footer-motto">Together We Excel</span>
            <div class="footer-social-block" aria-label="Follow Glisten online">
              <span class="footer-social-title">Follow Glisten</span>
              <div class="footer-social-links">
                ${content.socials.map(social => `
                  <a class="footer-social-link social-${escapeHtml(social.key)}" href="${escapeHtml(social.href)}" target="_blank" rel="noopener noreferrer">
                    <span class="footer-social-icon">${socialIcon(social.key)}</span>
                    <span>${escapeHtml(social.label)}</span>
                  </a>`).join("")}
              </div>
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="about.html">About Glisten Schools</a>
            <a href="academics.html">Academics</a>
            <a href="admissions.html">Admissions</a>
            <a href="gallery.html">Gallery</a>
            <a href="highlights.html">Highlights</a>
            <a href="contact.html">Contact Us</a>
          </div>
          <div class="footer-school-contact">
            <h3>Glisten</h3>
            <p>${escapeHtml(main.stage)}</p>
            <a href="tel:${escapeHtml(mainContact.phoneHref)}">${escapeHtml(mainContact.phone)}</a>
            <a href="${escapeHtml(mainContact.whatsapp)}" target="_blank" rel="noopener">WhatsApp School Office</a>
            <a href="mailto:${escapeHtml(mainContact.email)}">${escapeHtml(mainContact.email)}</a>
            <a href="${escapeHtml(content.location.maps)}" target="_blank" rel="noopener">Open Google Maps</a>
          </div>
          <div class="footer-school-contact">
            <h3>Preparatory</h3>
            <p>${escapeHtml(prep.stage)}</p>
            <a href="tel:${escapeHtml(prepContact.phoneHref)}">${escapeHtml(prepContact.phone)}</a>
            <a href="${escapeHtml(prepContact.whatsapp)}" target="_blank" rel="noopener">WhatsApp Preparatory</a>
            <a href="mailto:${escapeHtml(prepContact.email)}">${escapeHtml(prepContact.email)}</a>
            <span>Mirerani, about 2 km from the main school</span>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© <span data-year></span> Glisten Schools. All rights reserved.</span>
          <span>${escapeHtml(content.location.full)}</span>
        </div>
      </footer>`;
  };

  const eventCard = event => {
    const first = event.images[0];
    const otherImages = event.images.slice(1);
    return `
      <section class="section-pad event-feature-section" id="${escapeHtml(event.id)}">
        <div class="event-orb event-orb-one" aria-hidden="true"></div>
        <div class="event-orb event-orb-two" aria-hidden="true"></div>
        <div class="container event-feature-grid">
          <div class="event-copy reveal">
            <span class="section-kicker">Latest School Highlight</span>
            <div class="event-meta"><span>${escapeHtml(event.displayDate)}</span><span>${escapeHtml(event.location)}</span></div>
            <h2>${escapeHtml(event.title)}</h2>
            <p class="lead">${escapeHtml(event.summary)}</p>
            <div class="event-actions">
              <a class="btn btn-gold" href="highlights.html#${escapeHtml(event.id)}">Read the Highlight</a>
              <a class="text-link" href="gallery.html">Open Event Photos <span>→</span></a>
            </div>
          </div>
          <div class="event-mosaic reveal-group">
            <a class="event-photo event-photo-main" href="${escapeHtml(first.src)}" data-lightbox="event-${escapeHtml(event.id)}" data-caption="${escapeHtml(first.caption)}">
              <img ${responsiveThumb(first.src)} alt="${escapeHtml(first.alt)}" decoding="async" loading="lazy">
              <span>Uhuru Torch Visit</span>
            </a>
            ${otherImages.map((image, index) => `
              <a class="event-photo event-photo-small event-photo-${index + 2}" href="${escapeHtml(image.src)}" data-lightbox="event-${escapeHtml(event.id)}" data-caption="${escapeHtml(image.caption)}">
                <img ${responsiveThumb(image.src)} alt="${escapeHtml(image.alt)}" decoding="async" loading="lazy">
                <span class="event-photo-index">${String(index + 2).padStart(2, "0")}</span>
              </a>`).join("")}
          </div>
        </div>
      </section>`;
  };

  const highlightsPageMarkup = () => content.events.map(event => `
    <article class="highlight-story reveal" id="${escapeHtml(event.id)}">
      <div class="highlight-story-head">
        <div>
          <span class="section-kicker">${escapeHtml(event.category)}</span>
          <div class="event-meta"><span>${escapeHtml(event.displayDate)}</span><span>${escapeHtml(event.location)}</span></div>
          <h2>${escapeHtml(event.title)}</h2>
        </div>
        <span class="highlight-number" aria-hidden="true">01</span>
      </div>
      <p class="lead">${escapeHtml(event.summary)}</p>
      <div class="highlight-body">
        <div class="highlight-copy">
          ${event.description.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          <div class="highlight-quote">
            <span>Glisten Schools</span>
            <strong>Learning, service, unity, and purposeful growth.</strong>
          </div>
        </div>
        <div class="highlight-gallery">
          ${event.images.map((image, index) => `
            <a class="${index === 0 ? "wide" : ""}" href="${escapeHtml(image.src)}" data-lightbox="highlight-${escapeHtml(event.id)}" data-caption="${escapeHtml(image.caption)}">
              <img ${responsiveThumb(image.src)} alt="${escapeHtml(image.alt)}" decoding="async" loading="lazy">
              <span>${String(index + 1).padStart(2, "0")}</span>
            </a>`).join("")}
        </div>
      </div>
    </article>`).join("");

  const eventGalleryMarkup = () => content.events.flatMap(event =>
    event.images.map((image, index) => `
      <a class="gallery-item event-item" data-category="events" href="${escapeHtml(image.src)}" data-lightbox="gallery" data-caption="${escapeHtml(image.caption)}">
        <img ${responsiveThumb(image.src)} alt="${escapeHtml(image.alt)}" decoding="async" loading="lazy">
        <span>School Event</span>
        <em>${escapeHtml(event.title)} · ${String(index + 1).padStart(2, "0")}</em>
      </a>`)).join("");


  const contactSocialPanelMarkup = () => `
    <section class="section-pad compact contact-social-section" aria-labelledby="connect-glisten-title">
      <div class="container">
        <div class="contact-social-panel reveal">
          <div class="contact-social-heading">
            <span class="section-kicker">Connect With Us</span>
            <h2 id="connect-glisten-title">Follow Glisten online.</h2>
            <p>Visit our official social-media pages for school moments, news, and video highlights.</p>
          </div>
          <div class="contact-social-grid">
            ${content.socials.map(social => `
              <article class="contact-social-item social-${escapeHtml(social.key)}">
                <div class="contact-social-platform">
                  <span class="contact-social-icon">${socialIcon(social.key)}</span>
                  <h3>${escapeHtml(social.label)}</h3>
                </div>
                <a class="contact-social-button" href="${escapeHtml(social.href)}" target="_blank" rel="noopener noreferrer" aria-label="Visit Glisten on ${escapeHtml(social.label)}">
                  <span>Visit Page</span><b aria-hidden="true">↗</b>
                </a>
              </article>`).join("")}
          </div>
        </div>
      </div>
    </section>`;

  const contactCardsMarkup = () => {
    const schools = [
      {
        key: "main",
        label: "Standard One to Standard Seven",
        intro: "For admissions, official school information, visits, academic enquiries, and directions.",
        accent: "blue",
        visitLabel: "Open Google Maps",
        visitHref: content.location.maps
      },
      {
        key: "preparatory",
        label: "Baby Class, Middle Class and Pre-Unit",
        intro: "For early-learning admissions, class information, visits, and clear directions to the Preparatory campus.",
        accent: "orange",
        visitLabel: "Ask for Directions",
        visitHref: content.contacts.preparatory.whatsapp
      }
    ];

    return schools.map(item => {
      const school = content.schools[item.key];
      const contact = content.contacts[item.key];
      return `
        <article class="contact-hub-card contact-hub-${escapeHtml(item.accent)}">
          <div class="contact-hub-head">
            <span class="contact-hub-logo"><img src="${escapeHtml(school.logo)}" alt="${escapeHtml(school.name)} logo"></span>
            <span class="contact-hub-stage">${escapeHtml(item.label)}</span>
            <h3>${escapeHtml(school.name)}</h3>
            <p>${escapeHtml(item.intro)}</p>
          </div>
          <div class="contact-hub-actions">
            <a href="tel:${escapeHtml(contact.phoneHref)}">
              <span class="contact-action-icon" aria-hidden="true">☎</span>
              <span><small>Direct call</small><strong>${escapeHtml(contact.phone)}</strong></span>
              <i aria-hidden="true">→</i>
            </a>
            <a href="${escapeHtml(contact.whatsapp)}" target="_blank" rel="noopener">
              <span class="contact-action-icon" aria-hidden="true">◉</span>
              <span><small>WhatsApp</small><strong>Message the school</strong></span>
              <i aria-hidden="true">→</i>
            </a>
            <a href="mailto:${escapeHtml(contact.email)}">
              <span class="contact-action-icon" aria-hidden="true">✉</span>
              <span><small>Email</small><strong>${escapeHtml(contact.email)}</strong></span>
              <i aria-hidden="true">→</i>
            </a>
            <a href="${escapeHtml(item.visitHref)}" target="_blank" rel="noopener">
              <span class="contact-action-icon" aria-hidden="true">⌖</span>
              <span><small>Visit</small><strong>${escapeHtml(item.visitLabel)}</strong></span>
              <i aria-hidden="true">→</i>
            </a>
          </div>
        </article>`;
    }).join("");
  };

  document.querySelectorAll("[data-site-header]").forEach(host => {
    host.outerHTML = headerMarkup(host.dataset.brand || "main");
  });

  document.querySelectorAll("[data-site-footer]").forEach(host => {
    host.outerHTML = footerMarkup();
  });

  document.querySelectorAll("[data-featured-event]").forEach(host => {
    host.outerHTML = content.events.map(eventCard).join("");
  });

  document.querySelectorAll("[data-highlights-page]").forEach(host => {
    host.innerHTML = highlightsPageMarkup();
  });

  document.querySelectorAll("[data-event-gallery]").forEach(host => {
    host.outerHTML = eventGalleryMarkup();
  });

  document.querySelectorAll("[data-contact-cards]").forEach(host => {
    host.innerHTML = contactCardsMarkup();
  });

  document.querySelectorAll("[data-social-panel]").forEach(host => {
    host.outerHTML = contactSocialPanelMarkup();
  });

  document.documentElement.dataset.componentsReady = "true";
})();
