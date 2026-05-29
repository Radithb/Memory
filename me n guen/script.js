/* ============================================================
   RUANG KENANGAN — JavaScript
   PIN: 2709  (tanggal jadian — sesuaikan jika perlu)
   ============================================================ */

'use strict';

// ─── CONFIG ────────────────────────────────────────────────
const CORRECT_PIN = '140226'; // 14 Februari 2026 — tanggal jadian
const PIN_LENGTH = 6;
const FLOWER_IMGS = ['flower1.png', 'flower2.png', 'flower3.png'];

// ─── STATE ─────────────────────────────────────────────────
let pinInput = '';
let isAnimating = false;

// ─── ELEMENT REFS ──────────────────────────────────────────
const loginScreen = document.getElementById('login-screen');
const giftboxScreen = document.getElementById('giftbox-screen');
const mainScreen = document.getElementById('main-screen');

const pinDots = document.querySelectorAll('.pin-dot');
const errorMsg = document.getElementById('error-msg');
const lockIcon = document.getElementById('lock-icon');
const boxLid = document.getElementById('box-lid');
const giftboxText = document.getElementById('giftbox-text');
const flowerExpBg = document.getElementById('flower-explosion-bg');

// ─── NUMPAD LOGIC ──────────────────────────────────────────
document.querySelectorAll('.num-btn[data-num]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (pinInput.length < PIN_LENGTH) {
      pinInput += btn.dataset.num;
      playKeyClick();
      updateDots();
    }
  });
});

document.getElementById('clear-btn').addEventListener('click', () => {
  if (pinInput.length > 0) {
    pinInput = pinInput.slice(0, -1);
    playPopSound();
    updateDots();
    clearError();
  }
});

document.getElementById('submit-btn').addEventListener('click', () => {
  if (pinInput.length === PIN_LENGTH) checkPin();
});

// Keyboard support
document.addEventListener('keydown', e => {
  if (!loginScreen.classList.contains('active')) return;
  if (e.key >= '0' && e.key <= '9' && pinInput.length < 4) {
    pinInput += e.key;
    updateDots();
  } else if (e.key === 'Backspace') {
    pinInput = pinInput.slice(0, -1);
    updateDots();
    clearError();
  } else if (e.key === 'Enter' && pinInput.length === PIN_LENGTH) {
    checkPin();
  }
});

function updateDots() {
  pinDots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < pinInput.length);
    dot.classList.remove('error');
  });
}

function clearError() {
  errorMsg.classList.remove('visible');
}

// ─── PIN CHECK ─────────────────────────────────────────────
function checkPin() {
  if (isAnimating) return;

  if (pinInput === CORRECT_PIN) {
    // Unlock! ✓
    isAnimating = true;
    lockIcon.textContent = '🔓';
    lockIcon.style.transform = 'scale(1.3) rotate(10deg)';
    playSuccessSound();

    // Wait a brief moment after unlocking, then start the flower curtain transition!
    setTimeout(() => {
      triggerFlowerCurtain();
    }, 500);

  } else {
    // Wrong PIN
    playErrorSound();
    pinDots.forEach(d => {
      d.classList.remove('filled');
      d.classList.add('error');
    });
    errorMsg.classList.add('visible');
    pinInput = '';

    setTimeout(() => {
      pinDots.forEach(d => d.classList.remove('error'));
    }, 800);
  }
}

// ─── FLOWER CURTAIN TRANSITION (DARI KANAN KE KIRI) ───────────
function triggerFlowerCurtain() {
  const overlay = document.getElementById('flower-storm-overlay');
  overlay.classList.add('active');
  overlay.innerHTML = '';

  // Create the sliding curtain element
  const curtain = document.createElement('div');
  curtain.classList.add('flower-curtain');
  overlay.appendChild(curtain);

  // Populate the curtain with large overlapping flowers to completely block the view
  populateCurtain(curtain);

  // Force layout reflow
  curtain.offsetHeight;

  // Step 1: Slide in from the right to the center (takes 1.3s)
  curtain.classList.add('center');

  // Step 2: Once it reaches the center (at 1.3s), the screen is 100% covered.
  // We pause the curtain sejenak (800ms pause) and switch the page underneath!
  setTimeout(() => {
    loginScreen.classList.remove('active');
    giftboxScreen.classList.add('active');
  }, 1300);

  // Step 3: After the pause (total 2.1s), slide the curtain away to the left!
  setTimeout(() => {
    curtain.classList.add('exit');

    // Trigger the giftbox opening sequence as the curtain slides out
    startGiftboxAnimation();

    // Step 4: After the slide-out finishes (takes 1.2s, total 3.3s), clean up!
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.innerHTML = '';
      isAnimating = false; // Reset lock state
    }, 1200);
  }, 2100); // 1.3s slide-in + 0.8s pause sejenak = 2.1s
}

function populateCurtain(curtain) {
  // Clear any existing content
  curtain.innerHTML = '';

  const columns = 12;
  const rows = 10;

  // Layer 1: Structured Overlapping Grid (Guarantees 100% mathematical coverage)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const img = document.createElement('img');
      img.classList.add('curtain-flower');
      img.src = FLOWER_IMGS[Math.floor(Math.random() * FLOWER_IMGS.length)];
      img.alt = '';
      img.draggable = false;

      // Center position of grid cell + slight organic offset to look natural
      const top = (r / rows) * 110 - 5 + (Math.random() - 0.5) * 8; // spreads -5% to 105%
      const left = (c / columns) * 110 - 5 + (Math.random() - 0.5) * 8; // spreads -5% to 105%

      // Extremely large size relative to cell (cell is ~8vw wide, flower is 20vw to 32vw wide!)
      // This creates a dense, thick, 2-layer to 3-layer overlapping carpet of flowers.
      const size = 160 + Math.floor(Math.random() * 120); // 160px to 280px
      const baseRot = Math.random() * 360;
      const floatDelay = Math.random() * -6;

      img.style.top = `${top}%`;
      img.style.left = `${left}%`;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.setProperty('--base-rot', `${baseRot}deg`);
      img.style.animationDelay = `${floatDelay}s`;
      img.style.zIndex = '1';

      curtain.appendChild(img);
    }
  }

  // Layer 2: Chaos Layer (60 extra flowers scattered randomly on top to break any grid visibility)
  const extraFlowers = 60;
  for (let i = 0; i < extraFlowers; i++) {
    const img = document.createElement('img');
    img.classList.add('curtain-flower');
    img.src = FLOWER_IMGS[Math.floor(Math.random() * FLOWER_IMGS.length)];
    img.alt = '';
    img.draggable = false;

    const top = -15 + Math.random() * 130;
    const left = -15 + Math.random() * 130;

    const size = 180 + Math.floor(Math.random() * 140); // 180px to 320px (massive!)
    const baseRot = Math.random() * 360;
    const floatDelay = Math.random() * -6;

    img.style.top = `${top}%`;
    img.style.left = `${left}%`;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.setProperty('--base-rot', `${baseRot}deg`);
    img.style.animationDelay = `${floatDelay}s`;
    img.style.zIndex = '2'; // sits on top

    curtain.appendChild(img);
  }
}

// ─── SCREEN TRANSITIONS ────────────────────────────────────
function transitionTo(from, to) {
  from.style.opacity = '0';
  from.style.transition = 'opacity 0.6s ease';

  setTimeout(() => {
    from.classList.remove('active');
    from.style.opacity = '';
    to.classList.add('active');
  }, 600);
}

function showMainScreen() {
  giftboxScreen.style.opacity = '0';
  giftboxScreen.style.transition = 'opacity 0.8s ease';

  setTimeout(() => {
    giftboxScreen.classList.remove('active');
    giftboxScreen.style.opacity = '';

    mainScreen.style.display = 'block';
    mainScreen.style.opacity = '0';
    mainScreen.style.transition = 'opacity 0.8s ease';
    mainScreen.classList.add('active');

    // Force reflow
    mainScreen.offsetHeight;
    mainScreen.style.opacity = '1';

    // Remove inline styles after transition
    setTimeout(() => {
      mainScreen.style.transition = '';
      mainScreen.style.opacity = '';
      initScrollReveal();
      initAudioPlayer();
      initScratchCards(); // Initialize scratch cards after main screen renders
      initFlippablePolaroids(); // Initialize 3D card flips for Board 2
      initBoard1Effects(); // Initialize camera leak and petal bursts for Board 1
      initLoveLetterEnvelope(); // Initialize interactive envelope modal
      initBucketList(); // Initialize interactive bucket list
      initHeroParallax(); // Initialize interactive mouse parallax for hero flowers
    }, 900);

    isAnimating = false;
  }, 800);
}

// ─── GIFT BOX ANIMATION ────────────────────────────────────
function startGiftboxAnimation() {
  // Step 1: Box bounces in (CSS animation already plays)
  // Step 2: Show text
  setTimeout(() => {
    giftboxText.classList.add('visible');
  }, 800);

  // Step 3: Open lid
  setTimeout(() => {
    boxLid.classList.add('open');
  }, 1400);

  // Step 4: Flower explosion
  setTimeout(() => {
    createFlowerExplosion();
  }, 1800);

  // Step 5: Transition to main
  setTimeout(() => {
    showMainScreen();
  }, 4000);
}

function createFlowerExplosion() {
  flowerExpBg.innerHTML = '';

  // Wave 1 — dense initial burst (90 particles)
  spawnFlowerWave(90, 0, 180, 380);

  // Wave 2 — second wave (80 particles)
  setTimeout(() => spawnFlowerWave(80, 0.05, 220, 480), 200);

  // Wave 3 — trailing wide wave (70 particles)
  setTimeout(() => spawnFlowerWave(70, 0.1, 300, 560), 450);
}

function spawnFlowerWave(count, baseDelay, minDist, maxDist) {
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.classList.add('flower-particle');
    img.src = FLOWER_IMGS[Math.floor(Math.random() * FLOWER_IMGS.length)];
    img.alt = '';
    img.draggable = false;

    // Arah dan jarak acak
    const angle = Math.random() * 360;
    const distance = minDist + Math.random() * (maxDist - minDist);
    const tx = Math.cos(angle * Math.PI / 180) * distance;
    const ty = Math.sin(angle * Math.PI / 180) * distance - 60;

    // Rotasi, durasi, delay, ukuran acak
    const rot = (Math.random() - 0.5) * 900;
    const dur = 1.4 + Math.random() * 1.6;
    const delay = baseDelay + Math.random() * 0.35;
    
    // Rich contrast size: 45px to 140px (making some of them prominently large!)
    const size = 45 + Math.floor(Math.random() * 95); 

    img.style.setProperty('--tx', `${tx}px`);
    img.style.setProperty('--ty', `${ty}px`);
    img.style.setProperty('--rot', `${rot}deg`);
    img.style.setProperty('--dur', `${dur}s`);
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain';
    img.style.left = '50%';
    img.style.top = '45%';
    img.style.animationDelay = `${delay}s`;
    img.style.transform = 'translate(-50%, -50%)';

    flowerExpBg.appendChild(img);
  }
}

// ─── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  // Immediately reveal elements already in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

// ─── AUDIO PLAYER ──────────────────────────────────────────
function initAudioPlayer() {
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const playIcon = playBtn.querySelector('.play-icon');
  const progressBar = document.getElementById('audio-progress-bar');
  const progressFill = document.getElementById('audio-progress-fill');
  const progressThumb = document.getElementById('audio-progress-thumb');
  const currentTime = document.getElementById('current-time');
  const totalTime = document.getElementById('total-time');
  const vinyl = document.getElementById('audio-vinyl');

  let isPlaying = false;

  // Format seconds → m:ss
  function fmt(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Update total time when metadata loads
  audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = fmt(audio.duration);
  });

  // Update progress
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    progressThumb.style.left = `${pct}%`;
    currentTime.textContent = fmt(audio.currentTime);
  });

  // End
  audio.addEventListener('ended', () => {
    isPlaying = false;
    playIcon.textContent = '▶';
    vinyl.classList.remove('spinning');
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTime.textContent = '0:00';
    audio.currentTime = 0;
  });

  // Play / Pause toggle
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playIcon.textContent = '▶';
      vinyl.classList.remove('spinning');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        playIcon.textContent = '⏸';
        vinyl.classList.add('spinning');
      }).catch(err => {
        console.warn('Audio play failed:', err);
      });
    }
  });

  // Seek on progress bar click
  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Drag seek
  let dragging = false;
  progressThumb.addEventListener('mousedown', () => { dragging = true; });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = progressBar.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    audio.currentTime = pct * audio.duration;
  });
  document.addEventListener('mouseup', () => { dragging = false; });

  // Touch drag
  progressThumb.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const rect = progressBar.getBoundingClientRect();
    let pct = (e.touches[0].clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    audio.currentTime = pct * audio.duration;
  }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
}

// ─── FLOATING PARTICLES on main screen ─────────────────────
function initFloatingParticles() {
  // Small ambient flower PNGs that float upward in background
  const container = document.createElement('div');
  container.style.cssText = `
    position:fixed; inset:0; pointer-events:none;
    z-index:0; overflow:hidden;
  `;
  mainScreen.insertBefore(container, mainScreen.firstChild);

  for (let i = 0; i < 12; i++) {
    const img = document.createElement('img');
    img.src = FLOWER_IMGS[Math.floor(Math.random() * FLOWER_IMGS.length)];
    img.alt = '';
    img.draggable = false;
    const size = 24 + Math.floor(Math.random() * 28); // px
    const xPos = Math.random() * 100;
    const dur = 14 + Math.random() * 18;
    const delay = Math.random() * -25;

    img.style.cssText = `
      position:absolute;
      left:${xPos}vw;
      bottom:-8%;
      width:${size}px;
      height:${size}px;
      object-fit:contain;
      opacity:0.2;
      animation: floatUp ${dur}s ${delay}s linear infinite;
    `;
    container.appendChild(img);
  }

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0%   { transform: translateY(0)   rotate(0deg);   opacity:0.2; }
      10%  { opacity: 0.28; }
      90%  { opacity: 0.15; }
      100% { transform: translateY(-110vh) rotate(360deg); opacity:0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── SCRATCH CARDS INTERACTIVE SYSTEM ────────────────────────
function initScratchCards() {
  const canvases = document.querySelectorAll('.scratch-canvas');

  canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    // Set actual canvas resolution to match display size
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw the beautiful, aesthetic "Scratch Me" cover
    drawScratchCover(canvas, ctx);

    // Track scratching state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      // Handle touch and mouse events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startScratching(e) {
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
    }

    function scratch(e) {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling on mobile touch

      const pos = getPos(e);

      // destination-out Composite Operation turns drawn lines transparent!
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.lineWidth = 26; // Thick coin scratch path
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = pos.x;
      lastY = pos.y;

      // Throttle checking percentage cleared for performance
      if (Math.random() < 0.15) {
        checkClearedPercentage();
      }
    }

    function stopScratching() {
      isDrawing = false;
    }

    // Attach mouse events
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', stopScratching);

    // Attach touch events
    canvas.addEventListener('touchstart', startScratching, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', stopScratching);

    // Check how much of the card has been scratched
    function checkClearedPercentage() {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let cleared = 0;

      // Scan every 80th pixel to optimize CPU usage
      for (let i = 3; i < pixels.length; i += 80) {
        if (pixels[i] === 0) {
          cleared++;
        }
      }

      const percentage = (cleared / (pixels.length / 80)) * 100;

      // If more than 50% is scratched off, fade out the cover completely!
      if (percentage > 50) {
        canvas.style.opacity = '0';
        setTimeout(() => {
          canvas.remove(); // Fully clean up from DOM
        }, 500);
      }
    }
  });
}

function drawScratchCover(canvas, ctx) {
  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw a beautiful warm pastel pink cover
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#f8bbd0'); // Soft pastel pink
  grad.addColorStop(1, '#e8a0b4'); // Dusty pink
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Draw a vintage dot overlay (pure canvas pattern)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let x = 4; x < w; x += 10) {
    for (let y = 4; y < h; y += 10) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Draw a gold/white dashed inner border for an elegant scrapbooking/gift aesthetic
  ctx.strokeStyle = '#d4788e';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.setLineDash([]); // Reset dash

  // 4. Draw centered icons and texts
  ctx.fillStyle = '#7b4d5e';

  // Icon
  ctx.font = '26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✨🌸✨', w / 2, h / 2 - 25);

  // Cursive Text "Scratch Me!"
  ctx.font = 'bold 20px "Dancing Script", cursive';
  ctx.fillText('Gosok Aku!', w / 2, h / 2 + 10);

}

// ─── FLIPPABLE POLAROIDS INTERACTIVE SYSTEM ──────────────────
function initFlippablePolaroids() {
  const cards = document.querySelectorAll('.flippable-polaroid');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't flip card if clicking a link or button
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      card.classList.toggle('flipped');
    });
  });
}

// ─── BOARD 1 CLASSIC CAMERA LEAKS & BLOSSOM BURSTS ───────────
function initBoard1Effects() {
  const cards = document.querySelectorAll('#polaroid-1, #polaroid-2, #polaroid-3, #polaroid-4, #polaroid-5, #polaroid-6, #polaroid-7, #polaroid-8, #polaroid-9');
  
  cards.forEach(card => {
    // 1. Dynamically append the premium light-leak overlay if it does not exist
    const wrap = card.querySelector('.polaroid-img-wrap');
    if (wrap && !wrap.querySelector('.light-leak-overlay')) {
      const leak = document.createElement('div');
      leak.classList.add('light-leak-overlay');
      wrap.appendChild(leak);
    }

    // 2. Parse card classes to match its native rotation exactly in our breathing pulse keyframe
    let rot = 0;
    const classes = card.className;
    if (classes.includes('sb-p1') || classes.includes('sb-p5')) rot = -6;
    else if (classes.includes('sb-p2') || classes.includes('sb-p9')) rot = 4;
    else if (classes.includes('sb-p3')) rot = -2;
    else if (classes.includes('sb-p4') || classes.includes('sb-p15')) rot = 7;
    else if (classes.includes('sb-p6')) rot = 5;
    else if (classes.includes('sb-p7')) rot = -3;
    else if (classes.includes('sb-p8')) rot = 3;

    card.style.setProperty('--original-rot', `${rot}deg`);

    // 3. Bind click/tap triggers
    card.addEventListener('click', (e) => {
      // Don't trigger effects if the user is playing/toggling video content
      if (e.target.tagName === 'VIDEO' || e.target.tagName === 'BUTTON') {
        return;
      }

      const wasActive = card.classList.contains('effect-active');
      
      // Deactivate other active effects to keep the screen elegant and focused
      cards.forEach(c => c.classList.remove('effect-active'));

      if (!wasActive) {
        card.classList.add('effect-active');
        // Spawn the beautiful cherry petal burst
        spawnPetalBurst(card);
      }
    });
  });
}

function spawnPetalBurst(card) {
  const particles = ['🌸', '💮', '💖', '✨', '💗', '🌷'];
  const count = 10 + Math.floor(Math.random() * 4); // Spawns 10 to 13 particles organically

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.classList.add('mini-petal');
    
    // Stagger shape selections
    petal.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    // Dynamic physical vectors (force scatter radius between 85px and 175px)
    const angle = Math.random() * Math.PI * 2;
    const distance = 85 + Math.random() * 90;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 50; // Drifts upwards organically

    // Rotation angles
    const rotMid = Math.random() * 180 - 90;
    const rotEnd = Math.random() * 360 - 180;
    const dur = 1.1 + Math.random() * 0.7; // 1.1s to 1.8s duration
    const delay = Math.random() * 0.12;

    // Apply values to CSS variables for smooth GPU-accelerated transition
    petal.style.setProperty('--tx', `${tx}px`);
    petal.style.setProperty('--ty', `${ty}px`);
    petal.style.setProperty('--rot-mid', `${rotMid}deg`);
    petal.style.setProperty('--rot-end', `${rotEnd}deg`);
    petal.style.setProperty('--dur', `${dur}s`);
    petal.style.setProperty('--delay', `${delay}s`);

    // Dynamic sizes for high-depth visual hierarchy
    const size = 14 + Math.floor(Math.random() * 10); // 14px to 24px
    petal.style.fontSize = `${size}px`;

    // Position initial spawn relative to card center
    petal.style.left = '50%';
    petal.style.top = '45%';

    card.appendChild(petal);

    // Garbage-collect particles after transition to keep the DOM footprint small
    setTimeout(() => {
      petal.remove();
    }, (dur + delay) * 1000 + 100);
  }
}

// ─── INTERACTIVE LOVE LETTER ENVELOPE MODAL ──────────────────
function initLoveLetterEnvelope() {
  const envelope = document.getElementById('interactive-envelope');
  const modal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('close-letter-btn');
  const overlay = document.getElementById('letter-modal-overlay');
  const card = document.getElementById('modal-letter-card');

  if (!envelope || !modal || !closeBtn) return;

  envelope.addEventListener('click', () => {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    playFairyChime();

    // 1. Play envelope hearts & sparks burst!
    spawnEnvelopeHearts(envelope);

    // 2. Wait 0.8s for envelope top flip & paper preview pull animation to complete
    setTimeout(() => {
      modal.classList.add('active');
      setTimeout(() => {
        card.classList.add('visible');
      }, 100);
    }, 900);
  });

  // Close triggers
  const closeLetter = () => {
    card.classList.remove('visible');
    playPopSound();
    setTimeout(() => {
      modal.classList.remove('active');
      // Fold envelope back
      setTimeout(() => {
        envelope.classList.remove('open');
      }, 500);
    }, 400);
  };

  closeBtn.addEventListener('click', closeLetter);
  overlay.addEventListener('click', closeLetter);
}

function spawnEnvelopeHearts(envelope) {
  const heartParticles = ['💖', '✨', '💗', '❤️', '🌸', '💝'];
  const count = 12 + Math.floor(Math.random() * 5); // Spawns 12 to 16 sparks dynamically

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.classList.add('mini-petal'); // Reuses CSS transition styles for dispersion
    spark.textContent = heartParticles[Math.floor(Math.random() * heartParticles.length)];

    // Vector calculation (burst outwards in a 360-degree radius)
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 60; // Shunted upward for ambient float

    const rotMid = Math.random() * 180 - 90;
    const rotEnd = Math.random() * 360 - 180;
    const dur = 1.2 + Math.random() * 0.8;
    const delay = Math.random() * 0.15;

    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);
    spark.style.setProperty('--rot-mid', `${rotMid}deg`);
    spark.style.setProperty('--rot-end', `${rotEnd}deg`);
    spark.style.setProperty('--dur', `${dur}s`);
    spark.style.setProperty('--delay', `${delay}s`);

    // Depth sizing
    const size = 16 + Math.floor(Math.random() * 12); // 16px to 28px
    spark.style.fontSize = `${size}px`;

    // Position center relative to card envelope
    spark.style.left = '50%';
    spark.style.top = '50%';

    envelope.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, (dur + delay) * 1000 + 100);
  }
}

// ─── AUDIO SYNTH HELPERS ─────────────────────────────────
function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    playTone(523.25, now, 0.4); // C5
    playTone(659.25, now + 0.07, 0.45); // E5
    playTone(783.99, now + 0.14, 0.5); // G5
    playTone(1046.50, now + 0.21, 0.6); // C6
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

function playFairyChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.05);
      gain.gain.setValueAtTime(0.04, now + index * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.05 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.05);
      osc.stop(now + index * 0.05 + 0.35);
    });
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

function playKeyClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const chords = [261.63, 329.63, 392.00, 523.25];
    chords.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

function playErrorSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(115, now);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(113, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (err) {
    console.warn('AudioContext failed:', err);
  }
}

// ─── INTERACTIVE BUCKET LIST BOARD ───────────────────────────
function initBucketList() {
  const items = document.querySelectorAll('.bucket-item');
  items.forEach(item => {
    // If it's already completed (established), it is locked
    if (item.classList.contains('established')) return;

    item.addEventListener('click', (e) => {
      // Prevent triggering if clicking location badges (anchor links)
      if (e.target.tagName === 'A' || e.target.closest('a')) return;

      // Toggle stamped promise
      const isStamped = item.classList.contains('stamped');
      if (!isStamped) {
        item.classList.add('stamped');
        playChimeSound();
        // Spawn cute heart spark bursts!
        spawnBucketSparks(item);
      } else {
        // Allow removing/toggling the promise back off if they want to play!
        item.classList.remove('stamped');
        playPopSound();
      }
    });
  });
}

function spawnBucketSparks(item) {
  const particles = ['💖', '❤️', '💗', '✨', '🌸', '💝'];
  const count = 8 + Math.floor(Math.random() * 4); // 8 to 11 sparkles

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.classList.add('mini-petal');
    spark.textContent = particles[Math.floor(Math.random() * particles.length)];

    // Vector scatter from bottom-right (where the stamp seal lands!)
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 20;

    const rotMid = Math.random() * 180 - 90;
    const rotEnd = Math.random() * 360 - 180;
    const dur = 1.0 + Math.random() * 0.6;
    const delay = Math.random() * 0.1;

    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);
    spark.style.setProperty('--rot-mid', `${rotMid}deg`);
    spark.style.setProperty('--rot-end', `${rotEnd}deg`);
    spark.style.setProperty('--dur', `${dur}s`);
    spark.style.setProperty('--delay', `${delay}s`);

    const size = 12 + Math.floor(Math.random() * 8);
    spark.style.fontSize = `${size}px`;

    // Center spawn near bottom right seal stamp
    spark.style.left = '80%';
    spark.style.top = '80%';

    item.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, (dur + delay) * 1000 + 100);
  }
}

// ─── INTERACTIVE HERO PARALLAX FLOWERS ────────────────────────
function initHeroParallax() {
  const hero = document.querySelector('.hero-section');
  const wrappers = document.querySelectorAll('.hf-wrap');
  if (!hero || wrappers.length === 0) return;

  // Track cursor position to shift parent wrapper divs for rich 3D layered parallax depth
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    wrappers.forEach((wrap) => {
      // Each wrapper has a unique parallax depth factor!
      let factorX = 0.02;
      let factorY = 0.02;

      if (wrap.classList.contains('hfw1')) { factorX = -0.028; factorY = -0.024; }
      else if (wrap.classList.contains('hfw2')) { factorX = 0.032; factorY = 0.026; }
      else if (wrap.classList.contains('hfw3')) { factorX = -0.016; factorY = 0.018; }
      else if (wrap.classList.contains('hfw4')) { factorX = 0.024; factorY = -0.016; }
      else if (wrap.classList.contains('hfw5')) { factorX = -0.034; factorY = -0.03; }
      else if (wrap.classList.contains('hfw6')) { factorX = 0.018; factorY = 0.022; }

      const tx = x * factorX;
      const ty = y * factorY;

      // Translate the wrapper, leaving the child image's continuous CSS float sways completely intact!
      wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  // Smoothly slide wrappers back to their rest position when cursor leaves the hero
  hero.addEventListener('mouseleave', () => {
    wrappers.forEach((wrap) => {
      wrap.style.transform = `translate3d(0, 0, 0)`;
    });
  });
}
