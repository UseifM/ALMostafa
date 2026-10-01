/**
 * =============================================================================
 * مكتب المصطفى للمحاماة والاستشارات القانونية
 * المحامي: يوسف مصطفى ضاهر
 * Main JavaScript File (Vanilla JS - Clean, Robust, Accessible)
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. MOBILE NAVIGATION & DRAWER
  // ---------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ---------------------------------------------------------------------------
  // 2. STICKY HEADER & ACTIVE NAVIGATION LINK TRACKING
  // ---------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling on scroll
    if (scrollPos > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Track active navigation link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
      mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ---------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ---------------------------------------------------------------------------
  // 4. ELEGANT CUSTOM AUDIO PLAYER (كلمة من فريقنا)
  // ---------------------------------------------------------------------------
  const audio = document.getElementById('firm-audio');
  const playBtn = document.getElementById('audio-play-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const playerWrapper = document.getElementById('custom-audio-player');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.getElementById('progress-container');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeBtn = document.getElementById('volume-btn');
  const volIcon = document.getElementById('vol-icon');
  const volMuteIcon = document.getElementById('vol-mute-icon');
  const audioNotice = document.getElementById('audio-notice');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (audio && playBtn) {
    // Toggle Play / Pause
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          playerWrapper.classList.add('playing');
        }).catch(err => {
          console.warn('Audio playback could not start automatically or file is missing:', err);
          if (audioNotice) {
            audioNotice.innerHTML = `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>تنبيه: لتفعيل الكلمة الصوتية، يرجى وضع الملف الصوتي الفعلي في <code>assets/youssef-voice.mp3</code>.</span>
            `;
          }
        });
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playerWrapper.classList.remove('playing');
      }
    });

    // Time update listener
    audio.addEventListener('timeupdate', () => {
      const current = audio.currentTime;
      const duration = audio.duration;
      currentTimeEl.textContent = formatTime(current);

      if (duration && !isNaN(duration)) {
        const percent = (current / duration) * 100;
        progressBar.style.width = `${percent}%`;
      }
    });

    // Loaded metadata listener
    audio.addEventListener('loadedmetadata', () => {
      if (!isNaN(audio.duration)) {
        durationTimeEl.textContent = formatTime(audio.duration);
      }
    });

    // Audio Ended listener
    audio.addEventListener('ended', () => {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      playerWrapper.classList.remove('playing');
      progressBar.style.width = '0%';
      audio.currentTime = 0;
      currentTimeEl.textContent = '00:00';
    });

    // Progress Bar Click & Drag Seeking
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        // Since RTL: distance from right edge is the elapsed progress
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        // In Arabic RTL, the progress goes right-to-left
        const ratio = 1 - (clickX / width);
        if (audio.duration && !isNaN(audio.duration)) {
          audio.currentTime = ratio * audio.duration;
        }
      });
    }

    // Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        if (audio.volume === 0) {
          volIcon.style.display = 'none';
          volMuteIcon.style.display = 'block';
        } else {
          volIcon.style.display = 'block';
          volMuteIcon.style.display = 'none';
        }
      });
    }

    // Volume Mute Button Toggle
    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        if (audio.muted || audio.volume === 0) {
          audio.muted = false;
          audio.volume = 0.8;
          if (volumeSlider) volumeSlider.value = 0.8;
          volIcon.style.display = 'block';
          volMuteIcon.style.display = 'none';
        } else {
          audio.muted = true;
          if (volumeSlider) volumeSlider.value = 0;
          volIcon.style.display = 'none';
          volMuteIcon.style.display = 'block';
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 5. CONSULTATION FORM VALIDATION & HANDLING
  // ---------------------------------------------------------------------------
  const form = document.getElementById('consultation-form');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const consultationTypeSelect = document.getElementById('consultationType');
  const detailsTextarea = document.getElementById('details');
  const charCountEl = document.getElementById('char-count');
  const submitBtn = document.getElementById('submit-btn');

  // Success Modal Elements
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalSummary = document.getElementById('modal-summary');
  const modalWaBtn = document.getElementById('modal-wa-btn');

  // Character counter for textarea
  if (detailsTextarea && charCountEl) {
    detailsTextarea.addEventListener('input', () => {
      const length = detailsTextarea.value.trim().length;
      charCountEl.textContent = `${length} حرف`;
    });
  }

  // Helper validation functions
  function validateFullName(name) {
    return name.trim().length >= 2;
  }

  function validateEmail(email) {
    // RFC 5322 compliant regex for standard emails
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(email.trim());
  }

  function validatePhone(phone) {
    // Accepts Egyptian mobile numbers (010, 011, 012, 015) and standard international phone formats
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleaned.length >= 8 && /^[+0-9]{8,16}$/.test(cleaned);
  }

  function validateDetails(details) {
    return details.trim().length >= 10;
  }

  function setFieldError(fieldElement, hasError) {
    const parentGroup = fieldElement.closest('.form-group');
    if (parentGroup) {
      if (hasError) {
        parentGroup.classList.add('has-error');
      } else {
        parentGroup.classList.remove('has-error');
      }
    }
  }

  // Live input error removal on typing
  [fullNameInput, emailInput, phoneInput, detailsTextarea].forEach(input => {
    if (input) {
      input.addEventListener('input', () => setFieldError(input, false));
    }
  });

  if (consultationTypeSelect) {
    consultationTypeSelect.addEventListener('change', () => setFieldError(consultationTypeSelect, false));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstErrorField = null;

      // 1. Full Name
      if (!validateFullName(fullNameInput.value)) {
        setFieldError(fullNameInput, true);
        isValid = false;
        if (!firstErrorField) firstErrorField = fullNameInput;
      } else {
        setFieldError(fullNameInput, false);
      }

      // 2. Email
      if (!validateEmail(emailInput.value)) {
        setFieldError(emailInput, true);
        isValid = false;
        if (!firstErrorField) firstErrorField = emailInput;
      } else {
        setFieldError(emailInput, false);
      }

      // 3. Phone
      if (!validatePhone(phoneInput.value)) {
        setFieldError(phoneInput, true);
        isValid = false;
        if (!firstErrorField) firstErrorField = phoneInput;
      } else {
        setFieldError(phoneInput, false);
      }

      // 4. Consultation Type
      if (!consultationTypeSelect.value) {
        setFieldError(consultationTypeSelect, true);
        isValid = false;
        if (!firstErrorField) firstErrorField = consultationTypeSelect;
      } else {
        setFieldError(consultationTypeSelect, false);
      }

      // 5. Details
      if (!validateDetails(detailsTextarea.value)) {
        setFieldError(detailsTextarea, true);
        isValid = false;
        if (!firstErrorField) firstErrorField = detailsTextarea;
      } else {
        setFieldError(detailsTextarea, false);
      }

      // If invalid, focus first error
      if (!isValid) {
        if (firstErrorField) {
          firstErrorField.focus();
        }
        return;
      }

      // If valid, demonstrate client-side submission state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const originalText = btnText.textContent;

      submitBtn.disabled = true;
      btnText.textContent = 'جارٍ إرسال الطلب...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      // =========================================================================
      // BACKEND INTEGRATION HOOK
      // -------------------------------------------------------------------------
      // Note: Since this is currently an HTML/CSS/JS frontend-only website,
      // you can easily connect this form to a backend endpoint (e.g. Node/Express,
      // PHP mailer, EmailJS, or Formspree) by replacing this simulated delay
      // with a real fetch() call:
      //
      // fetch('/api/consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     fullName: fullNameInput.value,
      //     email: emailInput.value,
      //     phone: phoneInput.value,
      //     consultationType: consultationTypeSelect.value,
      //     details: detailsTextarea.value
      //   })
      // })
      // =========================================================================

        // ============ إرسال فعلي عبر Web3Forms ============
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.json())
      .then(data => {
        // إعادة الزر لحالته
        submitBtn.disabled = false;
        btnText.textContent = originalText;
        if (btnSpinner) btnSpinner.style.display = 'none';

        if (data.success) {
          // نجاح — عرض Modal
          const nameVal = fullNameInput.value.trim();
          const emailVal = emailInput.value.trim();
          const phoneVal = phoneInput.value.trim();
          const typeVal = consultationTypeSelect.value;
          const detailsVal = detailsTextarea.value.trim();

          if (modalSummary) {
            modalSummary.innerHTML = `
              <div><strong>مقدم الطلب:</strong> ${escapeHtml(nameVal)}</div>
              <div><strong>رقم الهاتف:</strong> <span dir="ltr">${escapeHtml(phoneVal)}</span></div>
              <div><strong>نوع الاستشارة:</strong> ${escapeHtml(typeVal)}</div>
            `;
          }

          // WhatsApp direct link
          if (modalWaBtn) {
            const waMessage = encodeURIComponent(
              `السلام عليكم ورحمة الله،\nأود تأكيد طلب استشارة قانونية:\n` +
              `- الاسم: ${nameVal}\n` +
              `- الهاتف: ${phoneVal}\n` +
              `- البريد: ${emailVal}\n` +
              `- نوع الاستشارة: ${typeVal}\n` +
              `- تفاصيل موجزة: ${detailsVal}`
            );
            modalWaBtn.href = `https://wa.me/201023838513?text=${waMessage}`;
          }

          // عرض Modal
          if (successModal) {
            successModal.style.display = 'flex';
          }

          // تفريغ الفورم
          form.reset();
          if (charCountEl) charCountEl.textContent = '0 حرف';
        } else {
          alert('حدث خطأ: ' + (data.message || 'حاول مرة أخرى'));
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        submitBtn.disabled = false;
        btnText.textContent = originalText;
        if (btnSpinner) btnSpinner.style.display = 'none';
        alert('حدث خطأ في الاتصال. جرب مرة أخرى أو تواصل عبر واتساب.');
      });
