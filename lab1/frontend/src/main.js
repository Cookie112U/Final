import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,
});

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.addEventListener('click', handleCalculation);

    document.getElementById('volumes').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleCalculation();
    });
});

async function handleCalculation() {
    const nInput = document.getElementById('n');
    const volumesInput = document.getElementById('volumes');
    const resultContainer = document.getElementById('result');
    const resultContent = document.getElementById('result-content');
    const visualization = document.getElementById('visualization');
    
    // Сброс предыдущих результатов
    resultContainer.classList.add('hidden');
    visualization.innerHTML = '';
    
    const n = parseInt(nInput.value);
    const volumesText = volumesInput.value.trim();
    
    // Валидация ввода
    if (isNaN(n) || n < 1 || n > 100000) {
        showError(resultContainer, resultContent, 'Пожалуйста, введите корректное количество резервуаров (1-100000)');
        return;
    }
    
    const volumes = volumesText.split(/\s+/).map(Number);
    if (volumes.length !== n || volumes.some(isNaN) || volumes.some(v => v < 1 || v > 1e9)) {
        showError(resultContainer, resultContent, 'Пожалуйста, введите корректные объемы (1-10^9)');
        return;
    }

    try {
        // Показываем индикатор загрузки
        resultContainer.classList.remove('error', 'success');
        resultContent.textContent = 'Вычисление...';
        resultContainer.classList.remove('hidden');
        
        const response = await api.post('/calculate', {
            n: n,
            volumes: volumes
        });

        const data = response.data;
        
        if (data.result === -1) {
            showError(resultContainer, resultContent, 'Выравнивание невозможно');
            visualizeTanks(volumes, false);
        } else {
            showSuccess(resultContainer, resultContent, 
                `Минимальное количество операций: ${data.result}`);
            visualizeTanks(volumes, true, data.result);
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        let errorMessage = 'Произошла ошибка';
        
        if (error.response) {
            errorMessage = error.response.data?.detail || error.response.statusText;
        } else if (error.request) {
            errorMessage = 'Сервер не отвечает. Проверьте подключение.';
        } else {
            errorMessage = error.message;
        }
        
        showError(resultContainer, resultContent, errorMessage);
        visualizeTanks(volumes, false);
    }
}

function visualizeTanks(volumes, isPossible, operationsCount = 0) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';
    
    if (!volumes || volumes.length === 0) return;
    
    const maxVolume = Math.max(...volumes);
    const containerHeight = 300;
    const scale = containerHeight / maxVolume;
    
    volumes.forEach((vol, i) => {
        const tankWrapper = document.createElement('div');
        tankWrapper.className = 'tank-wrapper';
        
        const tank = document.createElement('div');
        tank.className = 'tank';
        
        const liquid = document.createElement('div');
        liquid.className = 'liquid';
        liquid.style.height = `${vol * scale}px`;
        
        // Анимация выравнивания
        if (isPossible) {
            setTimeout(() => {
                liquid.style.transition = 'height 1.5s ease-out';
                liquid.style.height = `${maxVolume * scale}px`;
            }, 100);
        }
        
        const label = document.createElement('div');
        label.className = 'tank-label';
        label.textContent = `Резервуар ${i+1}`;
        
        const volumeInfo = document.createElement('div');
        volumeInfo.className = 'volume-info';
        volumeInfo.innerHTML = `
            <div>Исходно: ${vol} л</div>
            ${isPossible ? `<div>После: ${maxVolume} л</div>` : ''}
        `;
        
        tank.appendChild(liquid);
        tankWrapper.appendChild(tank);
        tankWrapper.appendChild(label);
        tankWrapper.appendChild(volumeInfo);
        visualization.appendChild(tankWrapper);
    });
    
    // Добавляем информацию об операциях
    if (isPossible) {
        const operationsInfo = document.createElement('div');
        operationsInfo.className = 'operations-info';
        operationsInfo.textContent = `Требуется операций: ${operationsCount}`;
        visualization.appendChild(operationsInfo);
    }
}

function showSuccess(container, content, message) {
    container.classList.remove('hidden', 'error');
    container.classList.add('success');
    content.innerHTML = `
        <svg class="icon success-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
        </svg>
        <span>${message}</span>
    `;
}

function showError(container, content, message) {
    container.classList.remove('hidden', 'success');
    container.classList.add('error');
    content.innerHTML = `
        <svg class="icon error-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12S6.47 22 12 22 22 17.53 22 12 17.53 2 12 2M15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" />
        </svg>
        <span>${message}</span>
    `;
}