// 教學網站共用外框:在頁面頂端插入 LOGO 與「回教學首頁」連結,
// 並把深色底的頁首標記成 .hm-hero,改用品牌漸層 (樣式在 site-theme.css)。
(function () {
    // 從本檔網址推算網站根目錄,子資料夾裡的頁面也能正確連回首頁
    var me = document.currentScript;
    var root = me ? me.src.replace(/assets\/site-chrome\.js(\?.*)?$/, '') : '/';

    function insertTopbar() {
        if (document.querySelector('.hm-topbar')) return;
        var bar = document.createElement('div');
        bar.className = 'hm-topbar';
        bar.innerHTML =
            '<div class="hm-topbar-inner">' +
            '<a class="hm-brand" href="' + root + 'index.html">' +
            '<img src="https://www.hauman.com.tw/images_v4/logo.png" alt="Hauman" onerror="this.style.display=\'none\'">' +
            '<span>網路與資訊安全技術教學資源</span></a>' +
            '<a class="hm-back" href="' + root + 'index.html">← 回教學首頁</a>' +
            '</div>';

        var body = document.body;
        // body 有內距或置中排列時,讓導覽列仍貼齊左右與上緣
        var cs = getComputedStyle(body);
        bar.style.marginTop = '-' + cs.paddingTop;
        bar.style.marginLeft = '-' + cs.paddingLeft;
        bar.style.marginRight = '-' + cs.paddingRight;
        bar.style.marginBottom = cs.paddingTop === '0px' ? '0' : cs.paddingTop;
        bar.style.alignSelf = 'stretch';
        bar.style.width = 'auto';
        // body 是橫向 flex (例如整頁置中的黑板頁) 時,導覽列獨佔一整行,內容換到下一行
        if (cs.display.indexOf('flex') !== -1 && cs.flexDirection.indexOf('row') === 0) {
            bar.style.flex = '0 0 calc(100% + ' + cs.paddingLeft + ' + ' + cs.paddingRight + ')';
            body.style.flexWrap = 'wrap';
        }
        body.insertBefore(bar, body.firstChild);
    }

    // 文字為淺色的頁首 = 深色橫幅,換成品牌漸層;白底頁首維持原樣。
    // 頁首可能寫成 <header>,也可能是 body 底下的 <nav> (例如 FortiGate 系列)
    function isLightText(el) {
        var m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g);
        if (!m) return false;
        return 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2] > 200;
    }

    // 頁首本身或其中的標題是淺色字,就視為深色橫幅 (有些頁面白字只設在內層元素)
    function isDarkBanner(el) {
        if (isLightText(el)) return true;
        var title = el.querySelector('h1, h2');
        return !!title && isLightText(title);
    }

    // 深色設計頁面 (body.hm-keep-dark) 的頁首若沒有自己的底色 (例如寫在黑板上的標題),就不換成橫幅
    function hasOwnBackground(el) {
        var c = getComputedStyle(el);
        return c.backgroundImage !== 'none' || !/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor);
    }

    function markHero() {
        if (document.querySelector('.hm-hero')) return;
        var keepDark = document.body.classList.contains('hm-keep-dark');
        var candidates = document.querySelectorAll('body header, body > nav');
        for (var i = 0; i < candidates.length; i++) {
            if (keepDark && !hasOwnBackground(candidates[i])) continue;
            if (isDarkBanner(candidates[i])) {
                candidates[i].classList.add('hm-hero');
                return;
            }
        }
    }

    function init() {
        insertTopbar();
        markHero();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
    // Tailwind CDN 與 React 頁面在載入後才產生樣式或頁首,再檢查一次
    window.addEventListener('load', function () { markHero(); setTimeout(markHero, 600); });
})();
