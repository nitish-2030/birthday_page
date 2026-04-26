document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  /* ══════════════════════════════════
     LOGIN PAGE
  ══════════════════════════════════ */
  if (page === "form") {
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "nitish" && password === "2030") {
        sessionStorage.setItem("isLoggedIn", "true");
        launchPortalAnimation(() => { window.location.href = "main.html"; });
      } else {
        message.textContent = "❌ Wrong username or password!";
        message.style.color = "#ff4466";
        const container = document.querySelector(".container");
        container?.classList.add("shake");
        setTimeout(() => container?.classList.remove("shake"), 600);
      }
    });
  }

  /* ══════════════════════════════════
     MAIN PAGE
  ══════════════════════════════════ */
  if (page === "main") {
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
      window.location.href = "index.html"; return;
    }

    // ── Logout ──
    document.getElementById("logout-button")?.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "index.html";
    });

    // ── Navbar toggle ──
    const navToggle = document.getElementById("navToggle");
    const navLinks  = document.getElementById("navLinks");
    navToggle?.addEventListener("click", () => navLinks?.classList.toggle("open"));
    navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

    // ── Custom Cursor ──
    const ring = document.getElementById("cursor-ring");
    const dot  = document.getElementById("cursor-dot");
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;

    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    });

    (function animCursor() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll("a, button, .card, .photo-item, .slider-btn, .orbit-planet").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
    });

    // ── Hero Canvas — floating glowing particles ──
    const hc = document.getElementById("heroCanvas");
    if (hc) {
      const hx = hc.getContext("2d");
      const resize = () => { hc.width = hc.offsetWidth; hc.height = hc.offsetHeight; };
      resize(); window.addEventListener("resize", resize);

      const colors = ["#ff0066","#7b00ff","#00ccff","#ffeb3b","#ff6ec7","#00ff99"];
      const pts = Array.from({length: 100}, () => ({
        x: Math.random() * hc.width, y: Math.random() * hc.height,
        vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6,
        r: Math.random()*2.5 + 0.5,
        color: colors[Math.floor(Math.random()*colors.length)],
        alpha: Math.random()*0.6+0.2
      }));

      // Mouse parallax for hero
      let hmx = 0, hmy = 0;
      document.addEventListener("mousemove", e => {
        hmx = (e.clientX / window.innerWidth  - 0.5) * 30;
        hmy = (e.clientY / window.innerHeight - 0.5) * 30;
      });

      const heroContent = document.querySelector(".hero-content");
      document.addEventListener("mousemove", e => {
        if (!heroContent) return;
        const tx = (e.clientX / window.innerWidth  - 0.5) * 18;
        const ty = (e.clientY / window.innerHeight - 0.5) * 12;
        heroContent.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      (function heroLoop() {
        hx.clearRect(0, 0, hc.width, hc.height);
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > hc.width)  p.vx *= -1;
          if (p.y < 0 || p.y > hc.height) p.vy *= -1;
          hx.globalAlpha = p.alpha;
          hx.shadowBlur = 15; hx.shadowColor = p.color;
          hx.fillStyle = p.color;
          hx.beginPath(); hx.arc(p.x, p.y, p.r, 0, Math.PI*2); hx.fill();
        });

        // draw connections
        hx.shadowBlur = 0;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i+1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
              hx.globalAlpha = (1 - dist/100) * 0.15;
              hx.strokeStyle = "#ffffff";
              hx.lineWidth = 0.5;
              hx.beginPath(); hx.moveTo(pts[i].x, pts[i].y); hx.lineTo(pts[j].x, pts[j].y); hx.stroke();
            }
          }
        }
        hx.globalAlpha = 1;
        requestAnimationFrame(heroLoop);
      })();
    }

    // ── Confetti ──
    const confWrap = document.getElementById("confetti");
    if (confWrap) {
      const cols   = ["#ff0066","#00ccff","#ffeb3b","#ff6ec7","#80ffcc","#b300ff","#fff"];
      const shapes = ["●","★","♦","▲","✦","❋"];
      for (let i = 0; i < 70; i++) {
        const el = document.createElement("span");
        el.className = "confetti-piece";
        el.textContent = shapes[Math.floor(Math.random()*shapes.length)];
        el.style.cssText = `
          left:${Math.random()*100}%;
          color:${cols[Math.floor(Math.random()*cols.length)]};
          font-size:${Math.random()*14+7}px;
          animation-delay:${Math.random()*6}s;
          animation-duration:${Math.random()*5+5}s;
          opacity:${Math.random()*0.7+0.3};
        `;
        confWrap.appendChild(el);
      }
    }

    // ── ULTRA 3D Card Slider ──
    const sliderSection = document.querySelector(".slider-section");
    if (sliderSection) {

      // Card data — front image + back message
      const cardData = [
        { img:"images/s5.jpeg",  title:"Smiles that Speak Volumes",  backEmoji:"😊", backTitle:"Born to Shine!", backText:"Your smile lights up every room it walks into 🌟" },
        { img:"images/s7.jpeg",  title:"Solo Moments, Full of Life",  backEmoji:"🌙", backTitle:"Living Every Moment!", backText:"Making memories that last a thousand lifetimes ✨" },
        { img:"images/s11.jpeg", title:"Chasing Dreams Alone",        backEmoji:"🚀", backTitle:"Dream Big, Always!", backText:"The universe is too small for your ambitions 🎯" },
        { img:"images/s9.jpeg",  title:"Unforgettable Moments",       backEmoji:"🎉", backTitle:"Unforgettable!", backText:"Every single moment with you is pure magic 💙" },
      ];

      // ── Build DOM ──
      const secTitle = sliderSection.querySelector(".section-title");
      if (secTitle) {
        // Animate each char in title
        secTitle.innerHTML = [...secTitle.textContent].map(c =>
          c.trim() ? `<span class="title-char">${c}</span>` : c
        ).join('');
        secTitle.querySelectorAll(".title-char").forEach((ch, i) => {
          ch.style.animationDelay = `${i * 0.07}s`;
        });
      }

      // Remove old wrapper
      const oldWrapper = sliderSection.querySelector(".cards-wrapper");
      if (oldWrapper) oldWrapper.remove();

      // Build curtains
      const curtainLeft  = document.createElement("div");
      const curtainRight = document.createElement("div");
      curtainLeft.className  = "curtain-left";
      curtainRight.className = "curtain-right";
      curtainLeft.innerHTML  = `<span class="curtain-emoji-left">🎭</span>`;
      curtainRight.innerHTML = `<span class="curtain-emoji-right">🎭</span>`;
      sliderSection.appendChild(curtainLeft);
      sliderSection.appendChild(curtainRight);

      // Build 3D scene
      const scene = document.createElement("div");
      scene.className = "cards-3d-scene";

      // Particle canvas on the section
      const particleCanvas = document.createElement("canvas");
      particleCanvas.id = "card-particles";
      sliderSection.style.position = "relative";
      sliderSection.appendChild(particleCanvas);

      cardData.forEach((d, i) => {
        const card = document.createElement("div");
        card.className = "card-3d";
        card.dataset.index = i;
        card.innerHTML = `
          <div class="card-3d-inner">
            <div class="card-face card-front">
              <img src="${d.img}" alt="${d.title}" loading="lazy">
              <div class="card-front-overlay"><h3>${d.title}</h3></div>
            </div>
            <div class="card-face card-back">
              <div class="card-back-emoji">${d.backEmoji}</div>
              <h4>${d.backTitle}</h4>
              <p>${d.backText}</p>
            </div>
          </div>`;
        scene.appendChild(card);
      });

      sliderSection.insertBefore(scene, curtainLeft);

      // Hint
      const hint = document.createElement("p");
      hint.className = "card-hint";
      hint.textContent = "✦ tap the glowing card to reveal a message ✦";
      sliderSection.insertBefore(hint, curtainLeft);

      // Dots
      const dots = document.createElement("div");
      dots.className = "cards-nav-dots";
      cardData.forEach((_, i) => {
        const d = document.createElement("div");
        d.className = "nav-dot" + (i === 0 ? " active" : "");
        d.dataset.index = i;
        dots.appendChild(d);
      });
      sliderSection.insertBefore(dots, curtainLeft);

      // Arrows
      const arrows = document.createElement("div");
      arrows.className = "card-nav-arrows";
      arrows.innerHTML = `
        <button class="card-arrow" id="cardPrev"><span>←</span></button>
        <button class="card-arrow" id="cardNext"><span>→</span></button>`;
      sliderSection.insertBefore(arrows, curtainLeft);

      // ── Curtain IntersectionObserver ──
      const curtainObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setTimeout(() => sliderSection.classList.add("curtains-open"), 300);
            curtainObs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      curtainObs.observe(sliderSection);

      // ── 3D Positions ──
      const POSITIONS = {
        "-3": { x:-700, z:-280, ry: 60, sc:0.50, op:0 },
        "-2": { x:-510, z:-180, ry: 48, sc:0.65, op:0.38 },
        "-1": { x:-290, z: -70, ry: 30, sc:0.82, op:0.78 },
        " 0": { x:   0, z:  90, ry:  0, sc:1.08, op:1 },
        " 1": { x: 290, z: -70, ry:-30, sc:0.82, op:0.78 },
        " 2": { x: 510, z:-180, ry:-48, sc:0.65, op:0.38 },
        " 3": { x: 700, z:-280, ry:-60, sc:0.50, op:0 },
      };

      function getPos(offset) {
        const key = " " + Math.max(-3, Math.min(3, offset));
        return POSITIONS[key] || POSITIONS[" 3"];
      }

      let current = 0;
      const flipped = new Set();
      const visited = new Set([0]);
      const cardEls = Array.from(scene.querySelectorAll(".card-3d"));

      function updateCards() {
        cardEls.forEach((card, i) => {
          const off = i - current;
          const p   = getPos(off);
          card.style.transform  = `translateX(${p.x}px) translateZ(${p.z}px) rotateY(${p.ry}deg) scale(${p.sc})`;
          card.style.opacity    = p.op;
          card.style.zIndex     = 10 - Math.abs(off);
          card.style.filter     = off === 0 ? "none" : `brightness(${Math.max(0.35, 0.9 - Math.abs(off)*0.22)})`;
          card.style.pointerEvents = Math.abs(off) <= 1 ? "all" : "none";
          card.classList.toggle("active", off === 0);
          // un-flip when moving away
          if (off !== 0 && flipped.has(i)) {
            flipped.delete(i);
            card.classList.remove("flipped");
          }
        });
        dots.querySelectorAll(".nav-dot").forEach((d, i) => d.classList.toggle("active", i === current));
      }

      function goTo(idx) {
        current = ((idx % cardEls.length) + cardEls.length) % cardEls.length;
        visited.add(current);
        updateCards();
        // Easter egg: visited all cards
        if (visited.size === cardData.length) {
          showToast("🎊 You've seen all the memories! Happy Birthday Shivam! 🎂");
        }
      }

      updateCards();

      // ── Click handler ──
      cardEls.forEach((card, i) => {
        card.addEventListener("click", () => {
          const off = i - current;
          if (off === 0) {
            // Flip
            if (flipped.has(i)) {
              flipped.delete(i);
              card.classList.remove("flipped");
            } else {
              flipped.add(i);
              card.classList.add("flipped");
              burstParticles(card);
            }
          } else {
            goTo(i);
          }
        });

        // ── 3D Tilt ──
        card.addEventListener("mousemove", e => {
          const off = i - current;
          if (Math.abs(off) > 1 || flipped.has(i)) return;
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width/2))  / (r.width/2);
          const dy = (e.clientY - (r.top  + r.height/2)) / (r.height/2);
          const p  = getPos(off);
          card.style.transform =
            `translateX(${p.x}px) translateZ(${p.z + 20}px) ` +
            `rotateY(${p.ry + dx * 14}deg) rotateX(${-dy * 10}deg) scale(${p.sc})`;
        });

        card.addEventListener("mouseleave", () => {
          if (!flipped.has(i)) updateCards();
        });
      });

      // ── Arrows ──
      sliderSection.querySelector("#cardPrev")?.addEventListener("click", () => goTo(current - 1));
      sliderSection.querySelector("#cardNext")?.addEventListener("click", () => goTo(current + 1));

      // ── Dots ──
      dots.querySelectorAll(".nav-dot").forEach(d => {
        d.addEventListener("click", () => goTo(+d.dataset.index));
      });

      // ── Keyboard ──
      document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft")  goTo(current - 1);
        if (e.key === "ArrowRight") goTo(current + 1);
      });

      // ── Auto-advance ──
      let autoTimer = setInterval(() => goTo(current + 1), 4200);
      sliderSection.addEventListener("mouseenter", () => clearInterval(autoTimer));
      sliderSection.addEventListener("mouseleave", () => { autoTimer = setInterval(() => goTo(current + 1), 4200); });

      // ── Touch swipe ──
      let touchSX = 0;
      scene.addEventListener("touchstart", e => { touchSX = e.touches[0].clientX; }, { passive:true });
      scene.addEventListener("touchend",   e => {
        const diff = touchSX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
      });

      // ── Particle Burst ──
      const pCtx = particleCanvas.getContext("2d");
      let pParticles = [], pRunning = false;

      function resizePCanvas() {
        const r = sliderSection.getBoundingClientRect();
        particleCanvas.width  = sliderSection.offsetWidth;
        particleCanvas.height = sliderSection.offsetHeight;
        particleCanvas.style.position = "absolute";
        particleCanvas.style.top  = "0";
        particleCanvas.style.left = "0";
      }
      resizePCanvas();
      window.addEventListener("resize", resizePCanvas);

      function burstParticles(cardEl) {
        const cr = cardEl.getBoundingClientRect();
        const sr = sliderSection.getBoundingClientRect();
        const cx = cr.left + cr.width/2  - sr.left;
        const cy = cr.top  + cr.height/2 - sr.top;
        const cols = ["#ff0066","#00ccff","#ffeb3b","#ff6ec7","#7b00ff","#80ffcc","#ffffff"];
        for (let i = 0; i < 90; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 9 + 2;
          pParticles.push({
            x:cx, y:cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - Math.random()*4,
            r: Math.random()*5 + 1.5,
            col: cols[Math.floor(Math.random()*cols.length)],
            alpha: 1,
            grav: 0.18 + Math.random()*0.1,
            decay: 0.018 + Math.random()*0.012,
            star: Math.random() > 0.55,
            rot: Math.random()*Math.PI*2,
            rotSpeed: (Math.random()-0.5)*0.2,
          });
        }
        if (!pRunning) { pRunning = true; animParticles(); }
      }

      function animParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        pParticles = pParticles.filter(p => p.alpha > 0.01);
        pParticles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += p.grav;
          p.vx *= 0.985; p.alpha -= p.decay; p.rot += p.rotSpeed;
          pCtx.save();
          pCtx.globalAlpha = Math.max(0, p.alpha);
          pCtx.fillStyle = p.col;
          pCtx.shadowBlur = 12; pCtx.shadowColor = p.col;
          pCtx.translate(p.x, p.y);
          pCtx.rotate(p.rot);
          if (p.star) {
            pCtx.beginPath();
            for (let j=0;j<5;j++){
              const a=j*Math.PI*4/5-Math.PI/2, b=a+Math.PI/5;
              pCtx.lineTo(Math.cos(a)*p.r, Math.sin(a)*p.r);
              pCtx.lineTo(Math.cos(b)*p.r*0.4, Math.sin(b)*p.r*0.4);
            }
            pCtx.closePath(); pCtx.fill();
          } else {
            pCtx.beginPath(); pCtx.arc(0,0,p.r,0,Math.PI*2); pCtx.fill();
          }
          pCtx.restore();
        });
        if (pParticles.length) requestAnimationFrame(animParticles);
        else pRunning = false;
      }

      // ── Toast ──
      function showToast(msg) {
        const existing = document.querySelector(".card-toast");
        if (existing) existing.remove();
        const t = document.createElement("div");
        t.className = "card-toast";
        t.textContent = msg;
        document.body.appendChild(t);
        requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add("show")); });
        setTimeout(() => {
          t.classList.add("hide");
          setTimeout(() => t.remove(), 500);
        }, 4000);
      }
    }

    // ── Sparkle cursor trail ──
    const sparkColors = ["#ff0066","#00ccff","#ffeb3b","#ff6ec7","#7b00ff"];
    let lastSX=0, lastSY=0, sparkCount=0;
    document.addEventListener("mousemove", e => {
      sparkCount++;
      if (sparkCount % 3 !== 0) return; // every 3rd move
      const s = document.createElement("div");
      s.className = "sparkle";
      const sz = Math.random()*6+3;
      s.style.cssText = `
        left:${e.clientX}px; top:${e.clientY}px;
        width:${sz}px; height:${sz}px;
        background:${sparkColors[Math.floor(Math.random()*sparkColors.length)]};
        box-shadow:0 0 ${sz*2}px ${sparkColors[Math.floor(Math.random()*sparkColors.length)]};
        margin:-${sz/2}px 0 0 -${sz/2}px;
      `;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    });

    // ── Scroll reveal ──
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
      }, { threshold: 0.12 });
      reveals.forEach(el => obs.observe(el));
    }
  }
});

/* ══════════════════════════════════
   PORTAL WARP ANIMATION (login)
══════════════════════════════════ */
function launchPortalAnimation(callback) {
  const overlay = document.createElement("div");
  overlay.id = "portal-overlay";
  overlay.innerHTML = `
    <canvas id="portalCanvas"></canvas>
    <div class="portal-text">
      <div class="portal-emoji">🎂</div>
      <div class="portal-msg">Entering the Party...</div>
    </div>`;
  document.body.appendChild(overlay);

  const canvas = document.getElementById("portalCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const cx = canvas.width/2, cy = canvas.height/2;
  let frame = 0;

  const particles = Array.from({length: 300}, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 60 + 20;
    return {
      angle, radius,
      x: cx + Math.cos(angle)*radius,
      y: cy + Math.sin(angle)*radius,
      speed: Math.random()*18+6,
      size: Math.random()*3+1,
      color: `hsl(${Math.random()*60+280},100%,70%)`,
      opacity: 1
    };
  });

  function draw() {
    frame++;
    ctx.fillStyle = "rgba(8,4,20,0.18)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const pulse = Math.sin(frame*0.08)*20;
    const g = ctx.createRadialGradient(cx,cy,0,cx,cy,200+pulse);
    g.addColorStop(0,"rgba(180,0,255,0)");
    g.addColorStop(0.4,"rgba(255,0,120,0.15)");
    g.addColorStop(0.7,"rgba(0,200,255,0.25)");
    g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.beginPath(); ctx.arc(cx,cy,200+pulse,0,Math.PI*2);
    ctx.fillStyle = g; ctx.fill();

    particles.forEach(p => {
      p.radius += p.speed*(1+frame*0.012);
      p.x = cx + Math.cos(p.angle)*p.radius;
      p.y = cy + Math.sin(p.angle)*p.radius;
      p.opacity -= 0.006;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.shadowBlur = 10; ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });

    for (let r=1; r<=5; r++) {
      ctx.beginPath();
      ctx.arc(cx,cy, r*18+Math.sin(frame*0.1+r)*8, 0, Math.PI*2);
      ctx.strokeStyle = `hsla(${frame*3+r*40},100%,70%,${0.6-r*0.1})`;
      ctx.lineWidth = 2; ctx.stroke();
    }

    if (frame > 85) overlay.style.background = `rgba(255,255,255,${(frame-85)*0.07})`;
    if (frame < 130) requestAnimationFrame(draw);
    else {
      overlay.style.transition = "opacity 0.3s"; overlay.style.opacity = "0";
      setTimeout(callback, 300);
    }
  }
  draw();
}
