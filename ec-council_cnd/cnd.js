// EC-Council CND 系列共用測驗:頁面以 window.CND_QUIZ 提供題目,
// 本檔在 <div id="cnd-quiz"></div> 產生題目、作答回饋、解析與得分。
// 題目格式: { question: '...', options: ['A. ...', 'B. ...'], correct: 1, explanation: '...' }
(function () {
    function el(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function render() {
        var box = document.getElementById('cnd-quiz');
        var data = window.CND_QUIZ;
        if (!box || !data || !data.length) return;
        var answered = 0, score = 0;
        var scoreEl = el('p', 'cnd-score');

        function updateScore() {
            scoreEl.innerHTML = '已作答 ' + answered + ' / ' + data.length + ' 題,答對 <span>' + score + '</span> 題';
        }

        data.forEach(function (q, qi) {
            var card = el('div', 'cnd-quiz-q');
            card.appendChild(el('h3', '', '<span class="cnd-qno">Q' + (qi + 1) + '.</span>' + q.question));
            var buttons = [];
            var explain = el('div', 'cnd-explain', '<strong>解析:</strong>' + (q.explanation || ''));
            q.options.forEach(function (opt, oi) {
                var b = el('button', 'cnd-option', opt);
                b.type = 'button';
                b.addEventListener('click', function () {
                    buttons.forEach(function (x) { x.disabled = true; });
                    buttons[q.correct].classList.add('is-correct');
                    if (oi !== q.correct) b.classList.add('is-wrong');
                    else score++;
                    answered++;
                    explain.classList.add('show');
                    updateScore();
                });
                buttons.push(b);
                card.appendChild(b);
            });
            card.appendChild(explain);
            box.appendChild(card);
        });
        updateScore();
        box.appendChild(scoreEl);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
})();
