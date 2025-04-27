function calculate() {
    const n = parseInt(document.getElementById('n').value);
    const volumesInput = document.getElementById('volumes').value;
    const volumes = volumesInput.split(' ').map(Number);
    
    if (volumes.length !== n || volumes.some(isNaN)) {
        alert('Пожалуйста, введите корректные данные!');
        return;
    }
    
    let possible = true;
    for (let i = 0; i < n-1; i++) {
        if (volumes[i] > volumes[i+1]) {
            possible = false;
            break;
        }
    }
    
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    if (!possible) {
        resultDiv.textContent = '-1 (Выравнивание невозможно)';
        resultDiv.className = 'result error';
    } else {
        const operations = volumes[n-1] - volumes[0];
        resultDiv.textContent = `Минимальное количество операций: ${operations}`;
        resultDiv.className = 'result success';
    }
    
    visualize(volumes);
}

function visualize(volumes) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';
    
    if (volumes.length === 0) return;
    
    const maxVolume = Math.max(...volumes);
    const minVolume = Math.min(...volumes);
    const scale = maxVolume > 0 ? 280 / maxVolume : 1;
    
    volumes.forEach((vol, i) => {
        const tank = document.createElement('div');
        tank.className = 'tank';
        
        const liquid = document.createElement('div');
        liquid.className = 'liquid';
        liquid.style.height = `${vol * scale}px`;
        
        const label = document.createElement('div');
        label.className = 'tank-label';
        label.textContent = `Резервуар ${i+1}`;
        
        const volumeLabel = document.createElement('div');
        volumeLabel.className = 'tank-label';
        volumeLabel.textContent = `${vol} л`;
        
        tank.appendChild(liquid);
        tank.appendChild(volumeLabel);
        tank.appendChild(label);
        visualization.appendChild(tank);
    });
}