/**
 * Avatar Card — 3D tilt + glare + click-to-expand
 * FLIP animation: fly from sidebar to center with one-time spin.
 */
(function () {
  var overlayEl = null;
  var expanded = false;
  var savedRect = null;

  function init() {
    var avatarImg = document.querySelector(
      '.widget[data-type="profile"] .avatar'
    );
    if (!avatarImg) return;
    if (avatarImg.closest('.avatar-card')) return;

    var backImg = avatarImg.cloneNode(true);

    var card = document.createElement('div');
    card.className = 'avatar-card';

    var translater = document.createElement('div');
    translater.className = 'avatar-card__translater';

    var rotator = document.createElement('div');
    rotator.className = 'avatar-card__rotator';

    var front = document.createElement('div');
    front.className = 'avatar-card__front';
    avatarImg.parentNode.insertBefore(card, avatarImg);
    front.appendChild(avatarImg);

    var glare = document.createElement('div');
    glare.className = 'avatar-card__glare';

    var back = document.createElement('div');
    back.className = 'avatar-card__back';
    back.appendChild(backImg);

    rotator.appendChild(front);
    rotator.appendChild(glare);
    rotator.appendChild(back);
    translater.appendChild(rotator);
    card.appendChild(translater);

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    card.addEventListener('click', onClick);
  }

  /* ---------- mouse tracking ---------- */

  function onMouseEnter(e) {
    var card = e.currentTarget;
    if (card.classList.contains('active')) return;
    card.style.setProperty('--card-opacity', '0.9');
    card.classList.add('interacting');
  }

  function onMouseLeave(e) {
    var card = e.currentTarget;
    card.style.setProperty('--card-opacity', '0');
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.classList.remove('interacting');
  }

  function onMouseMove(e) {
    var card = e.currentTarget;
    if (card.classList.contains('active')) return;

    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    var ox = (e.clientX - cx) / (rect.width / 2);
    var oy = (e.clientY - cy) / (rect.height / 2);
    ox = Math.max(-1, Math.min(1, ox));
    oy = Math.max(-1, Math.min(1, oy));

    var maxTilt = 18;
    card.style.setProperty('--rotate-x', (ox * maxTilt).toFixed(2) + 'deg');
    card.style.setProperty('--rotate-y', (-oy * maxTilt).toFixed(2) + 'deg');

    var gx = ((e.clientX - rect.left) / rect.width) * 100;
    var gy = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glare-x', gx.toFixed(1) + '%');
    card.style.setProperty('--glare-y', gy.toFixed(1) + '%');
  }

  /* ---------- click to expand (FLIP) ---------- */

  function onClick(e) {
    if (expanded) return;
    e.stopPropagation();
    expand(e.currentTarget);
  }

  function expand(card) {
    expanded = true;

    // Record original position
    var rect = card.getBoundingClientRect();
    savedRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

    card.classList.add('active');
    card.classList.remove('interacting');
    card.style.setProperty('--card-opacity', '0');
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');

    // Create overlay
    overlayEl = document.createElement('div');
    overlayEl.className = 'avatar-card-overlay';
    document.body.appendChild(overlayEl);

    // Move card into overlay at original position
    overlayEl.appendChild(card);
    card.style.left = rect.left + 'px';
    card.style.top = rect.top + 'px';
    card.style.setProperty('--card-scale', '1');
    card.getBoundingClientRect(); // force layout

    // Fly to center
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    card.style.left = ((vw - 380) / 2) + 'px';
    card.style.top = ((vh - 380) / 2) + 'px';

    // Close hint
    var hint = document.createElement('div');
    hint.className = 'avatar-card-close-hint';
    hint.textContent = '点击空白处 或 按 ESC 关闭';
    document.body.appendChild(hint);

    document.addEventListener('keydown', onKeyDown);
    overlayEl.addEventListener('click', onOverlayClick);
    document.body.style.overflow = 'hidden';

    // Enable mouse tilt after fly-in + spin completes
    setTimeout(function () {
      card.addEventListener('mousemove', onExpandedMouseMove);
      card.addEventListener('mouseenter', onExpandedMouseEnter);
      card.addEventListener('mouseleave', onExpandedMouseLeave);
    }, 900);
  }

  function collapse() {
    if (!expanded || !overlayEl) return;
    expanded = false;

    var card = overlayEl.querySelector('.avatar-card');
    if (!card) return;

    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = '';
    card.removeEventListener('mousemove', onExpandedMouseMove);
    card.removeEventListener('mouseenter', onExpandedMouseEnter);
    card.removeEventListener('mouseleave', onExpandedMouseLeave);

    var hint = document.querySelector('.avatar-card-close-hint');
    if (hint) hint.remove();

    // Fly back to original position
    card.style.left = savedRect.left + 'px';
    card.style.top = savedRect.top + 'px';
    card.style.setProperty('--card-scale', '1');
    card.style.setProperty('--card-opacity', '0');
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');

    overlayEl.classList.add('closing');

    overlayEl.addEventListener('animationend', function onAnimEnd() {
      overlayEl.removeEventListener('animationend', onAnimEnd);
      card.classList.remove('active');
      card.style.left = '';
      card.style.top = '';

      var profileFigure = document.querySelector(
        '.widget[data-type="profile"] figure.image'
      );
      if (profileFigure) profileFigure.appendChild(card);

      overlayEl.remove();
      overlayEl = null;
    }, { once: true });
  }

  function onOverlayClick(e) {
    if (e.target === overlayEl) collapse();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') collapse();
  }

  /* ---------- mouse tilt inside overlay ---------- */

  function onExpandedMouseEnter(e) {
    e.currentTarget.style.setProperty('--card-opacity', '0.8');
  }

  function onExpandedMouseLeave(e) {
    var card = e.currentTarget;
    card.style.setProperty('--card-opacity', '0');
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  }

  function onExpandedMouseMove(e) {
    var card = e.currentTarget;
    var rect = card.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;

    var ox = (e.clientX - cx) / (rect.width / 2);
    var oy = (e.clientY - cy) / (rect.height / 2);
    ox = Math.max(-1, Math.min(1, ox));
    oy = Math.max(-1, Math.min(1, oy));

    var maxTilt = 12;
    card.style.setProperty('--rotate-x', (ox * maxTilt).toFixed(2) + 'deg');
    card.style.setProperty('--rotate-y', (-oy * maxTilt).toFixed(2) + 'deg');

    var gx = ((e.clientX - rect.left) / rect.width) * 100;
    var gy = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--glare-x', gx.toFixed(1) + '%');
    card.style.setProperty('--glare-y', gy.toFixed(1) + '%');
  }

  /* ---------- PJAX ---------- */

  function destroy() {
    if (expanded) {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      expanded = false;
    }
    if (overlayEl) { overlayEl.remove(); overlayEl = null; }
    var hint = document.querySelector('.avatar-card-close-hint');
    if (hint) hint.remove();
  }

  window.AvatarCard = { init: init, destroy: destroy };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
