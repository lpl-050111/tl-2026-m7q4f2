// 家书页面动效：金粉漂浮 + 滚动入场
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 金粉粒子 ---
  function seedDust(layer) {
    var count = parseInt(layer.getAttribute('data-dust'), 10) || 14;
    for (var i = 0; i < count; i++) {
      var d = document.createElement('span');
      d.className = 'dust';
      d.style.left = (Math.random() * 100).toFixed(2) + '%';
      d.style.width = d.style.height = (2 + Math.random() * 4).toFixed(1) + 'px';
      d.style.animationDuration = (9 + Math.random() * 12).toFixed(1) + 's';
      d.style.animationDelay = (Math.random() * 14).toFixed(1) + 's';
      layer.appendChild(d);
    }
  }
  if (!reducedMotion) {
    var layers = document.querySelectorAll('.dust-layer[data-dust]');
    for (var i = 0; i < layers.length; i++) seedDust(layers[i]);
  }

  // --- 滚动入场 ---
  var revealEls = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    for (var j = 0; j < revealEls.length; j++) revealEls[j].classList.add('visible');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // --- 相册灯箱 ---
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    var lbItems = Array.prototype.slice.call(document.querySelectorAll('.album .album-item'));
    var cur = 0;
    function lbShow(k) {
      cur = (k + lbItems.length) % lbItems.length;
      var img = lbItems[cur].querySelector('img');
      var cap = lbItems[cur].querySelector('figcaption');
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
    }
    function lbOpen(k) { lbShow(k); lb.hidden = false; document.body.style.overflow = 'hidden'; }
    function lbClose() { lb.hidden = true; document.body.style.overflow = ''; }
    lbItems.forEach(function (item, k) {
      item.querySelector('img').addEventListener('click', function () { lbOpen(k); });
    });
    lb.querySelector('.lb-close').addEventListener('click', lbClose);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); lbShow(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); lbShow(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbShow(cur - 1);
      else if (e.key === 'ArrowRight') lbShow(cur + 1);
    });
  }
})();
