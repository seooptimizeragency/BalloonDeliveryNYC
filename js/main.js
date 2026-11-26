// Shared interactivity: FAQ accordion, scroll-spy nav, YouTube facades, validated in-page form submission.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const sections = [...document.querySelectorAll('[data-spy]')];
  const links = [...document.querySelectorAll('.main-nav a[data-spy-link]')];
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '/#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  document.querySelectorAll('.yt-facade').forEach(btn => {
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0';
      iframe.title = btn.dataset.title || 'Balloons Lane video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });

  (function () {
    var forms = document.querySelectorAll('form.inquiry-form');
    if (!forms.length) return;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var zipRe = /^\d{5}(-\d{4})?$/;
    forms.forEach(function (form) {
      var note = form.querySelector('.form-note');
      var btn = form.querySelector('button[type="submit"]');
      var frame = form.querySelector('.formsubmit-frame');
      var submitted = false;
      var settled = false;
      var timer = null;
      function setNote(msg, ok) {
        if (!note) return;
        note.textContent = msg;
        note.classList.toggle('form-note-ok', !!ok);
        note.classList.toggle('form-note-error', !ok && !!msg);
      }
      function finish(ok, msg) {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
        setNote(msg, ok);
        if (ok) form.reset();
      }
      function checkFrame() {
        if (!submitted || settled || !frame) return;
        try {
          var path = frame.contentWindow && frame.contentWindow.location && frame.contentWindow.location.pathname;
          if (path === '/form-sent/') finish(true, 'Thank you! Your inquiry has been submitted successfully.');
        } catch (e) {}
      }
      if (frame) frame.addEventListener('load', function () {
        if (!submitted) return;
        checkFrame();
        setTimeout(function () {
          checkFrame();
          if (!settled) {
            try {
              var path = frame.contentWindow.location.pathname;
              if (path === '/form-sent/') finish(true, 'Thank you! Your inquiry has been submitted successfully.');
            } catch (e) {}
          }
        }, 800);
      });
      form.addEventListener('submit', function (e) {
        var honey = form.querySelector('[name="_honey"]');
        if (honey && honey.value) { e.preventDefault(); return; }
        var human = form.querySelector('[name="human_verified"]');
        if (!human || !human.checked) {
          e.preventDefault();
          setNote('Please verify you are human before sending.', false);
          if (human) human.focus();
          return;
        }
        var email = form.querySelector('[name="email"]');
        if (!email || !emailRe.test(email.value.trim())) {
          e.preventDefault(); setNote('Please enter a valid email address.', false); if (email) email.focus(); return;
        }
        var zip = form.querySelector('[name="delivery_zip"]');
        if (!zip || !zipRe.test(zip.value.trim())) {
          e.preventDefault(); setNote('Please enter a valid 5-digit delivery zip code.', false); if (zip) zip.focus(); return;
        }
        var msg = form.querySelector('[name="message"]');
        if (!msg || !msg.value.trim()) {
          e.preventDefault(); setNote('Please write your message.', false); if (msg) msg.focus(); return;
        }
        var phone = form.querySelector('[name="phone"]');
        if (phone && phone.value.trim() && phone.value.replace(/\D/g, '').length < 7) {
          e.preventDefault(); setNote('Please enter a valid phone number.', false); phone.focus(); return;
        }
        var date = form.querySelector('[name="event_date"]');
        if (date && date.value) {
          var d = new Date(date.value + 'T00:00:00');
          var today = new Date(); today.setHours(0, 0, 0, 0);
          if (isNaN(d.getTime())) { e.preventDefault(); setNote('Please choose a valid event date.', false); date.focus(); return; }
          if (d < today) { e.preventDefault(); setNote('Event date cannot be in the past.', false); date.focus(); return; }
        }
        var file = form.querySelector('[name="attachment"]');
        if (file && file.files && file.files[0] && file.files[0].size > 10 * 1024 * 1024) {
          e.preventDefault(); setNote('Please attach a file smaller than 10 MB.', false); file.focus(); return;
        }
        submitted = true;
        settled = false;
        setNote('', false);
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
        timer = setTimeout(function () {
          checkFrame();
          if (!settled) finish(false, 'Your inquiry could not be sent. Please try again.');
        }, 30000);
      });
    });
  })();
});

(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.textContent = open ? '✕' : '☰';
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    }
  });
})();
