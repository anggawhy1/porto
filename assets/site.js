/* Skrip bersama untuk index.html dan halaman proyek */
(() => {
    const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const isIndex = !!$('#tentang'), root = document.documentElement, hd = $('header'), m = $('main');
    if (!$('#bar')) { document.body.insertAdjacentHTML('afterbegin', '<div id="bar"></div><div class="blob" style="width:420px;height:420px;background:#2563eb;top:-120px;left:-140px"></div><div class="blob" style="width:380px;height:380px;background:#7c3aed;bottom:-140px;right:-120px;animation-delay:-8s"></div>') }
    const bar = $('#bar');

    /* Tema gelap/terang */
    const tb = document.createElement('button'), sync = () => tb.innerHTML = '<i class="fa-solid ' + (root.classList.contains('light') ? 'fa-moon' : 'fa-sun') + '"></i>';
    tb.className = 'ml-2 w-9 h-9 rounded-lg border border-slate-700 text-slate-300 hover:text-white'; tb.setAttribute('aria-label', 'Ganti tema gelap atau terang');
    tb.onclick = () => { root.classList.toggle('light'); try { localStorage.theme = root.classList.contains('light') ? 'light' : 'dark' } catch (e) { } sync() }; sync();

    /* Menu mobile */
    const menu = $('#menu'), mb = $('#menu-btn'), wrap = document.createElement('div'); wrap.className = 'flex items-center'; wrap.append(tb);
    if (mb) {
        wrap.append(mb); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-controls', 'menu');
        const set = o => { menu.classList.toggle('hidden', !o); mb.setAttribute('aria-expanded', o); mb.innerHTML = '<i class="fa-solid ' + (o ? 'fa-xmark' : 'fa-bars') + '"></i>' };
        mb.onclick = () => set(menu.classList.contains('hidden')); $$('a', menu).forEach(a => a.onclick = () => set(false)); addEventListener('keydown', e => e.key === 'Escape' && set(false))
    }
    $('header>div').append(wrap);

    /* Tombol ke atas */
    const up = document.createElement('button'); up.innerHTML = '<i class="fa-solid fa-arrow-up"></i>'; up.setAttribute('aria-label', 'Kembali ke atas');
    up.className = 'fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-blue-500 text-white shadow-lg opacity-0 pointer-events-none transition-opacity hover:bg-blue-400';
    up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' }); document.body.append(up);

    /* Scroll: progres, header, tombol atas, garis timeline */
    const tl = $('.tl'); let ly = 0;
    const onScroll = () => {
        const y = scrollY, h = root.scrollHeight - innerHeight; bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
        hd.classList.toggle('hide', y > ly && y > 300 && (!menu || menu.classList.contains('hidden'))); ly = y;
        up.style.opacity = y > 500 ? 1 : 0; up.style.pointerEvents = y > 500 ? 'auto' : 'none';
        if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)) * 100 + '%') }
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* Muncul saat di-scroll */
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => e.target.style.transitionDelay = '', 1000) } }), { threshold: .12 });
    (isIndex ? $$('main .card,main .h2,main h3.text-xl') : [...m.children]).forEach(el => { const i = [...el.parentElement.children].indexOf(el); el.style.transitionDelay = Math.min(i, 4) * 70 + 'ms'; el.classList.add('rv'); io.observe(el) });

    /* Efek cahaya mengikuti kursor + miring 3D pada kartu proyek */
    $$('.card').forEach(el => {
        const tilt = el.tagName === 'A' && !!el.closest('#proyek');
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; el.style.setProperty('--x', x + 'px'); el.style.setProperty('--y', y + 'px');
            if (tilt && e.pointerType === 'mouse' && !rm) { el.style.setProperty('--ry', (x / r.width - .5) * 8 + 'deg'); el.style.setProperty('--rx', -(y / r.height - .5) * 8 + 'deg') }
        });
        el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') })
    });

    if (isIndex) {
        if (!rm) $$('.hero-txt>*').forEach((e, i) => e.style.animation = 'up .7s ' + (i * .12) + 's both');

        /* Hitung angka */
        const co = new IntersectionObserver(es => es.forEach(e => {
            if (!e.isIntersecting) return; co.unobserve(e.target); if (rm) return; const el = e.target, t = +el.dataset.count, d = +(el.dataset.dec || 0), sf = el.dataset.suf || '', t0 = performance.now();
            (function f(n) { const k = Math.min((n - t0) / 1200, 1); el.textContent = (t * (1 - Math.pow(1 - k, 3))).toFixed(d) + sf; if (k < 1) requestAnimationFrame(f) })(t0)
        }), { threshold: .6 });
        $$('[data-count]').forEach(el => co.observe(el));

        /* Teks peran yang berganti */
        const ty = $('#typed'), W = ['System Analyst', 'IT Business Analyst', 'Technical Writer', 'Implementor', 'Application Analyst', 'IT Consultant', 'Software Technical Support'];
        let w = 0, c = 0, dl = false;
        if (!rm) ty.textContent = '';
        if (!rm) (function tick() { const s = W[w]; c += dl ? -1 : 1; ty.textContent = s.slice(0, c); let d = dl ? 35 : 70; if (!dl && c === s.length) { dl = true; d = 1700 } else if (dl && c === 0) { dl = false; w = (w + 1) % W.length; d = 300 } setTimeout(tick, d) })();

        /* Menu aktif sesuai bagian yang dilihat */
        const links = $$('header nav a[href^="#"]');
        const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id)) }), { rootMargin: '-40% 0px -55% 0px' });
        $$('main section[id]').forEach(x => so.observe(x));

        $$('#proyek a .p-4').forEach(p => p.insertAdjacentHTML('beforeend', '<span class="inline-block mt-3 text-xs font-semibold text-blue-400">Lihat detail <i class="fa-solid fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i></span>'));

        /* Filter keahlian */
        const grid = $('#keahlian .grid'), cards = [...grid.children], cats = ['Semua', ...cards.map(c => $('h3', c).textContent)], bx = document.createElement('div');
        bx.className = 'flex flex-wrap gap-2 mb-6'; bx.setAttribute('role', 'group'); bx.setAttribute('aria-label', 'Filter keahlian');
        cats.forEach((t, i) => {
            const b = document.createElement('button'); b.className = 'chip'; b.textContent = t; b.setAttribute('aria-pressed', i === 0);
            b.onclick = () => { $$('.chip', bx).forEach(x => x.setAttribute('aria-pressed', x === b)); cards.forEach(c => { const on = i === 0 || $('h3', c).textContent === t; c.style.display = on ? '' : 'none'; if (on) c.classList.add('in') }); }; bx.append(b)
        });
        grid.before(bx);

        /* Salin email */
        const toast = t => { let n = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast', role: 'status' })); n.textContent = t; n.classList.add('on'); setTimeout(() => n.classList.remove('on'), 2200) };
        const cb = $('#copy-email'); if (cb) cb.onclick = () => navigator.clipboard.writeText('anggadwiwhy67@gmail.com').then(() => toast('Email disalin ke clipboard'), () => toast('anggadwiwhy67@gmail.com'));
    } else {
        /* Halaman proyek: proyek sebelumnya/berikutnya */
        const L = [['posyandu', 'Website Posyandu Surobayan'], ['banyuagung', 'Sistem Penerimaan Santri Baru'], ['laporpak', 'LaporPak'], ['sengkala', 'Website Sengkala Graduation']];
        const k = Math.max(0, L.findIndex(x => location.pathname.endsWith(x[0] + '.html'))), a = L[(k + L.length - 1) % L.length], b = L[(k + 1) % L.length];
        m.insertAdjacentHTML('beforeend', '<nav class="mt-12 pt-6 border-t border-slate-800 grid sm:grid-cols-2 gap-3 text-sm"><a href="' + a[0] + '.html" class="lk"><span class="text-xs text-slate-400 block mb-1"><i class="fa-solid fa-arrow-left"></i> Proyek sebelumnya</span><span class="font-semibold text-white">' + a[1] + '</span></a><a href="' + b[0] + '.html" class="lk sm:text-right"><span class="text-xs text-slate-400 block mb-1">Proyek berikutnya <i class="fa-solid fa-arrow-right"></i></span><span class="font-semibold text-white">' + b[1] + '</span></a></nav>');
    }
    /* Perbesar tangkapan layar */
    const lb = document.createElement('div'); lb.className = 'fixed inset-0 z-50 bg-black/85 hidden items-center justify-center p-4 cursor-zoom-out'; lb.innerHTML = '<img class="max-h-full max-w-full rounded-lg" alt="">'; document.body.append(lb);
    $$('main .grid img').forEach(i => { i.style.cursor = 'zoom-in'; i.onclick = () => { lb.firstChild.src = i.src; lb.classList.replace('hidden', 'flex') } });
    lb.onclick = () => lb.classList.replace('flex', 'hidden'); addEventListener('keydown', e => e.key === 'Escape' && lb.onclick());
})();
