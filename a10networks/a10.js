// A10 Networks Thunder 實戰課程共用測驗:頁面以 window.A10_QUIZ 提供題目,
// 本檔在 <div id="a10-quiz"></div> 產生題目、作答回饋、解析、得分與「重新作答」按鈕。
// 題目格式: { question: '...', options: ['A. ...', 'B. ...'], correct: 1, explanation: '...' }
(function () {
    function el(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function render() {
        var box = document.getElementById('a10-quiz');
        var data = window.A10_QUIZ;
        if (!box || !data || !data.length) return;
        box.innerHTML = '';
        var answered = 0, score = 0;
        var scoreEl = el('p', 'a10-score');

        function updateScore() {
            scoreEl.innerHTML = '已作答 ' + answered + ' / ' + data.length + ' 題,答對 <span>' + score + '</span> 題';
        }

        data.forEach(function (q, qi) {
            var card = el('div', 'a10-quiz-q');
            card.appendChild(el('h3', '', '<span class="a10-qno">Q' + (qi + 1) + '.</span>' + q.question));
            var buttons = [];
            var explain = el('div', 'a10-explain', '<strong>解析:</strong>' + (q.explanation || ''));
            q.options.forEach(function (opt, oi) {
                var b = el('button', 'a10-option', opt);
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

        var actions = el('div', 'a10-quiz-actions');
        var reset = el('button', 'a10-reset', '重新作答');
        reset.type = 'button';
        reset.addEventListener('click', function () {
            render();
            box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        actions.appendChild(reset);
        box.appendChild(actions);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
    else render();
})();
