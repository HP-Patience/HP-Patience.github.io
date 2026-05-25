(function (window, document) {
  var activeObservers = [];

  function setupToc($toc) {
    var currentInView = new Set();
    var headingToMenu = new Map();
    var $menus = Array.from($toc.querySelectorAll('.menu-list > li > a'));

    // ── Scroll-spy ───────────────────────────────────────────────────
    for (var i = 0; i < $menus.length; i++) {
      var $menu = $menus[i];
      var raw = $menu.getAttribute('data-href') || $menu.getAttribute('href');
      if (!raw || raw === 'javascript:;') continue;
      var elementId = raw.trim().slice(1);
      var $heading = document.getElementById(elementId);
      if ($heading) {
        headingToMenu.set($heading, $menu);
      }
    }

    var $headings = Array.from(headingToMenu.keys());

    var callback = function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (entry.isIntersecting) {
          currentInView.add(entry.target);
        } else {
          currentInView.delete(entry.target);
        }
      }
      var $highlight;
      if (currentInView.size) {
        $highlight = Array.from(currentInView).sort(function (a, b) {
          return a.offsetTop - b.offsetTop;
        })[0];
      } else if ($headings.length) {
        var above = [];
        for (var j = 0; j < $headings.length; j++) {
          if ($headings[j].getBoundingClientRect().top < 0) {
            above.push($headings[j]);
          }
        }
        $highlight = above.sort(function (a, b) {
          return b.offsetTop - a.offsetTop;
        })[0];
      }
      if ($highlight && headingToMenu.has($highlight)) {
        for (var k = 0; k < $menus.length; k++) {
          $menus[k].classList.remove('is-active');
        }
        var $activeMenu = headingToMenu.get($highlight);
        if (!$activeMenu.parentElement) return;
        $activeMenu.classList.add('is-active');
        var $menuList = $activeMenu.parentElement.parentElement;
        while (
          $menuList &&
          $menuList.classList.contains('menu-list') &&
          $menuList.parentElement.tagName.toLowerCase() === 'li'
        ) {
          $menuList.parentElement.children[0].classList.add('is-active');
          $menuList = $menuList.parentElement.parentElement;
        }
      }
    };

    var observer = new IntersectionObserver(callback, { threshold: 0 });

    for (var m = 0; m < $headings.length; m++) {
      var $heading = $headings[m];
      observer.observe($heading);
      if (headingToMenu.has($heading)) {
        var $menu = headingToMenu.get($heading);
        $menu.setAttribute('data-href', '#' + $heading.id);
        $menu.setAttribute('href', 'javascript:;');
        $menu.addEventListener('click', (function ($h) {
          return function (e) {
            e.preventDefault();
            if (typeof $h.scrollIntoView === 'function') {
              $h.scrollIntoView({ behavior: 'smooth' });
            }
            var anchor = '#' + $h.id;
            if (history.pushState) {
              history.pushState(null, null, anchor);
            } else {
              location.hash = anchor;
            }
          };
        })($heading));
        $heading.style.scrollMargin = '1em';
      }
    }

    // ── Heading folding ───────────────────────────────────────────────
    var $allLinks = $toc.querySelectorAll('.menu-list a');
    for (var n = 0; n < $allLinks.length; n++) {
      var $link = $allLinks[n];
      var $li = $link.parentElement;
      var $childList = $link.nextElementSibling;
      if ($childList && $childList.classList.contains('menu-list')) {
        $li.classList.add('has-children');
        var $levelLeft = $link.querySelector('.level-left');
        if ($levelLeft && !$levelLeft.querySelector('.toc-toggle')) {
          var $toggle = document.createElement('span');
          $toggle.className = 'toc-toggle';
          $toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $li.classList.toggle('is-collapsed');
          });
          $levelLeft.insertBefore($toggle, $levelLeft.firstChild);
        }
      }
    }

    $toc._tocObserver = observer;
    activeObservers.push(observer);
  }

  function initAllToc() {
    // 断开所有旧的 observer，防止 PJAX 导航后旧回调干扰
    for (var i = 0; i < activeObservers.length; i++) {
      activeObservers[i].disconnect();
    }
    activeObservers = [];

    var $tocs = document.querySelectorAll('#toc');
    for (var j = 0; j < $tocs.length; j++) {
      setupToc($tocs[j]);
    }
  }

  if (typeof window.IntersectionObserver !== 'undefined') {
    initAllToc();
    document.addEventListener('pjax:complete', initAllToc);
  }
})(window, document);
