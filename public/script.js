// ===== PARTICLE/GRID BACKGROUND =====
(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles, mouse;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;
  const MOUSE_DIST = 200;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  mouse = { x: -1000, y: -1000 };

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.strokeStyle = `rgba(255, 107, 53, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw & update particles
    for (const p of particles) {
      // Mouse interaction
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < MOUSE_DIST) {
        const force = (1 - mdist / MOUSE_DIST) * 0.02;
        p.vx += mdx * force;
        p.vy += mdy * force;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.25)';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  resize();
  createParticles();
  draw();
})();


// ===== SCROLL REVEAL =====
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe hero elements immediately
  document.querySelectorAll('.hero .fade-in').forEach((el) => {
    // Trigger hero animations on load
    setTimeout(() => el.classList.add('visible'), 100);
  });

  // Observe other elements on scroll
  document.querySelectorAll('.fade-in:not(.hero .fade-in)').forEach((el) => {
    observer.observe(el);
  });
})();


// ===== NAV SCROLL =====
(function initNav() {
  const nav = document.getElementById('nav');
  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  });
})();


// ===== MOBILE MENU =====
(function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close on link click
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
    });
  });
})();


// ===== FLOATING SECTION DOTS =====
(function initSectionDots() {
  const dotsNav = document.getElementById('section-dots');
  if (!dotsNav) return;

  const dots = dotsNav.querySelectorAll('.section-dot');
  const sectionIds = Array.from(dots).map(d => d.dataset.section);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Show dots after scrolling past hero
  function updateDotsVisibility() {
    if (window.scrollY > window.innerHeight * 0.5) {
      dotsNav.classList.add('visible');
    } else {
      dotsNav.classList.remove('visible');
    }
  }

  // Highlight active section
  function updateActiveDot() {
    let current = '';
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) {
        current = section.id;
      }
    }
    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.section === current);
    });
  }

  let dotTicking = false;
  window.addEventListener('scroll', () => {
    if (!dotTicking) {
      requestAnimationFrame(() => {
        updateDotsVisibility();
        updateActiveDot();
        dotTicking = false;
      });
      dotTicking = true;
    }
  });
})();


// ===== AGENT TERMINAL ANIMATION =====
(function initTerminal() {
  var terminal = document.getElementById('agent-terminal');
  if (!terminal) return;
  var body = document.getElementById('terminal-body');
  if (!body) return;

  var started = false;
  var cursor = document.createElement('span');
  cursor.className = 'term-cursor';
  cursor.textContent = '\u2588';

  var script = [
    {
      type: 'user',
      parts: [
        { text: 'Hey, I want to buy some Bitcoin with my NEAR. First, read this skill ', typed: true },
        { text: 'https://skills.outlayer.ai/agent-custody/SKILL.md', typed: false, cls: 'term-val' }
      ]
    },
    {
      type: 'agent',
      lines: [
        { text: 'Reading skill...', cls: 'term-dim' },
        { text: '\u2713 Loaded Outlayer Wallet skill', cls: 'term-ok' },
        { text: '  gasless ops \u00b7 NEAR Intents \u00b7 cross-chain swaps', cls: 'term-dim' },
        null,
        { text: 'Agent: To get started, send me 1 NEAR to fund your agent wallet:', cls: 'term-key' },
        { text: 'https://dashboard.outlayer.ai/wallet/fund?to=a1b2c3...a1b2&amount=1&token=wrap.near&dest=intents', cls: 'term-val' },
      ]
    },
    {
      type: 'user',
      parts: [
        { text: 'Done, sent 1 NEAR', typed: true }
      ]
    },
    {
      type: 'agent',
      lines: [
        { text: 'Agent: Got it! Your 1 NEAR is already deposited to Intents via the funding link.', cls: 'term-key' },
        { text: 'Agent: Getting a swap quote...', cls: 'term-key' },
        null,
        { text: 'POST /wallet/v1/intents/swap/quote', cls: 'term-dim' },
        { text: '  quote    1 NEAR \u2192 0.00003841 BTC', cls: 'term-key' },
        { text: 'POST /wallet/v1/intents/swap', cls: 'term-dim' },
        { text: '\u2713 swap     intent: ABC1...f93d', cls: 'term-ok' },
        null,
        { text: 'Agent: Done! 0.00003841 BTC in your intents balance.', cls: 'term-ok' },
      ]
    },
    {
      type: 'agent',
      lines: [
        { text: 'Agent: Withdrawing BTC to your ledger wallet bc1qxy2k...x0wlh', cls: 'term-key' },
        null,
        { text: 'POST /wallet/v1/intents/withdraw/dry-run', cls: 'term-dim' },
        { text: '\u2713 policy   within limits', cls: 'term-ok' },
        { text: 'POST /wallet/v1/intents/withdraw', cls: 'term-dim' },
        { text: '\u2713 withdraw intent: D4e5...a81b', cls: 'term-ok' },
        null,
        { text: 'Agent: Sent 0.00003691 BTC \u2192 bc1qxy...0wlh \u2713', cls: 'term-ok' },
      ]
    },
    {
      type: 'agent',
      lines: [
        null,
        { text: 'Agent: What else would you like to do?', cls: 'term-key' },
        { text: '  \u2022 Set up a policy engine with spending limits & multisig approvals', cls: 'term-dim' },
        { text: '  \u2022 Create payment checks for agent-to-agent transfers', cls: 'term-dim' },
        { text: '  \u2022 Upload files to decentralized storage FastFS', cls: 'term-dim' },
      ]
    },
  ];

  function addLine() {
    var div = document.createElement('div');
    div.className = 'term-line visible';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function sleep(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }

  function moveCursor(el) {
    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
    el.appendChild(cursor);
    body.scrollTop = body.scrollHeight;
  }

  function typeChars(container, text, cls, delay) {
    return new Promise(function(resolve) {
      var span = document.createElement('span');
      span.className = cls || 'term-cmd';
      container.insertBefore(span, cursor);
      var i = 0;
      function next() {
        if (i < text.length) {
          span.textContent += text[i++];
          body.scrollTop = body.scrollHeight;
          setTimeout(next, delay);
        } else {
          resolve();
        }
      }
      next();
    });
  }

  function paste(container, text, cls) {
    var span = document.createElement('span');
    span.className = cls || 'term-val';
    span.textContent = text;
    container.insertBefore(span, cursor);
    body.scrollTop = body.scrollHeight;
  }

  async function run() {
    // Start with blinking cursor
    var cursorLine = addLine();
    moveCursor(cursorLine);
    await sleep(1200);

    for (var s = 0; s < script.length; s++) {
      var step = script[s];

      if (step.type === 'user') {
        // Reuse cursor line or create new one
        var line;
        if (cursorLine) {
          line = cursorLine;
          cursorLine = null;
        } else {
          line = addLine();
        }

        var prompt = document.createElement('span');
        prompt.className = 'term-prompt';
        prompt.textContent = '> ';
        line.insertBefore(prompt, cursor);
        await sleep(300);

        for (var p = 0; p < step.parts.length; p++) {
          var part = step.parts[p];
          if (part.typed) {
            await typeChars(line, part.text, part.cls || 'term-cmd', 35);
          } else {
            await sleep(200);
            paste(line, part.text, part.cls);
          }
        }
        await sleep(700);

      } else if (step.type === 'agent') {
        // Cursor blinks for 1s while agent "thinks"
        if (!cursorLine) {
          cursorLine = addLine();
          moveCursor(cursorLine);
        }
        await sleep(1000);
        // Remove the empty cursor line before agent output
        if (cursorLine && cursorLine.parentNode && !cursorLine.textContent.replace('\u2588', '').trim()) {
          cursorLine.parentNode.removeChild(cursorLine);
          cursorLine = null;
        }

        for (var l = 0; l < step.lines.length; l++) {
          var ld = step.lines[l];
          if (ld === null) {
            addLine().innerHTML = '\u00a0';
            await sleep(500);
          } else {
            var al = addLine();
            var sp = document.createElement('span');
            sp.className = ld.cls || 'term-key';
            sp.textContent = ld.text;
            al.appendChild(sp);
            moveCursor(al);
            await sleep(1000);
          }
        }
        await sleep(500);
        cursorLine = addLine();
        moveCursor(cursorLine);
      }
    }

    // End: remove cursor
    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
    // Remove trailing empty line
    if (cursorLine && cursorLine.parentNode && !cursorLine.textContent.trim()) {
      cursorLine.parentNode.removeChild(cursorLine);
    }
  }

  var observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !started) {
      started = true;
      run();
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(terminal);
})();


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
