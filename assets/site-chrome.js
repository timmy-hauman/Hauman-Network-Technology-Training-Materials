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
        body.insertBefore(bar, body.firstChild);
    }

    // 文字為淺色的頁首 = 深色橫幅,換成品牌漸層;白底頁首維持原樣
    function markHero() {
        var header = document.querySelector('body header');
        if (!header || header.classList.contains('hm-hero')) return;
        var m = getComputedStyle(header).color.match(/\d+(\.\d+)?/g);
        if (!m) return;
        var lum = 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2];
        if (lum > 200) header.classList.add('hm-hero');
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
