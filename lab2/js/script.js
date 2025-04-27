document.getElementById('calculate-btn').addEventListener('click', () => {
    const r = parseFloat(document.getElementById('r').value);
    const theta = parseFloat(document.getElementById('theta').value);
    const n = parseInt(document.getElementById('n').value);
    const a = parseFloat(document.getElementById('a').value);

    // Валидация данных
    if (isNaN(r) || isNaN(theta) || isNaN(n) || isNaN(a)) {
        showError('Пожалуйста, введите все значения корректно.');
        return;
    }

    // Математическая модель Розы Гвидо
    const calculatedR = a * Math.cos(n * theta);

    if (Math.abs(r - calculatedR) < 1e-6) {
        showSuccess('Точка на кривой');
    } else {
        showError('Точка не на кривой');
    }
});

function showSuccess(message) {
    const resultContent = document.getElementById('result-content');
    resultContent.textContent = message;
    resultContent.className = 'result success';
}

function showError(message) {
    const resultContent = document.getElementById('result-content');
    resultContent.textContent = message;
    resultContent.className = 'result error';
}