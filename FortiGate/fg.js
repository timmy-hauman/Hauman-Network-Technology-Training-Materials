// Fortinet FortiGate 實戰課程共用測驗:頁面以 window.FG_QUIZ 提供題目,
// 本檔在 <div id="fg-quiz"></div> 產生題目、作答回饋、解析、得分與「重新作答」按鈕。
// 題目格式: { question: '...', options: ['A. ...', 'B. ...'], correct: 1, explanation: '...' }
(function () {
    function el(tag, cls, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function render() {
        var box = document.getElementById('fg-quiz');
        var data = window.FG_QUIZ;
        if (!box || !data || !data.length) return;
        box.innerHTML = '';
        var answered = 0, score = 0;
        var scoreEl = el('p', 'fg-score');

        function updateScore() {
            scoreEl.innerHTML = '已作答 ' + answered + ' / ' + data.length + ' 題,答對 <span>' + score + '</span> 題';
        }

        data.forEach(function (q, qi) {
            var card = el('div', 'fg-quiz-q');
            card.appendChild(el('h3', '', '<span class="fg-qno">Q' + (qi + 1) + '.</span>' + q.question));
            var buttons = [];
            var explain = el('div', 'fg-explain', '<strong>解析:</strong>' + (q.explanation || ''));
            q.options.forEach(function (opt, oi) {
                var b = el('button', 'fg-option', opt);
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

        var actions = el('div', 'fg-quiz-actions');
        var reset = el('button', 'fg-reset', '重新作答');
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
