document.addEventListener('DOMContentLoaded', () => {
    const radioPlayer = document.getElementById('radioPlayer');
    const togglePlayPauseBtn = document.getElementById('togglePlayPause');
    const statusMessage = document.getElementById('statusMessage');

    const radioStreamUrl = 'https://myradio24.org/52340'; // Прямой поток радио
    radioPlayer.src = radioStreamUrl; // Устанавливаем источник, если он не был установлен в HTML

    // Функция для обновления статуса
    function updateStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? '#e74c3c' : '#666';
    }

    // Обработчик кнопки Play/Pause
    togglePlayPauseBtn.addEventListener('click', () => {
        if (radioPlayer.paused) {
            updateStatus('Подключение...');
            radioPlayer.play()
                .then(() => {
                    togglePlayPauseBtn.textContent = 'Пауза';
                    updateStatus('Воспроизведение...');
                })
                .catch(error => {
                    console.error('Ошибка воспроизведения:', error);
                    updateStatus('Ошибка воспроизведения! ' + error.message, true);
                    togglePlayPauseBtn.textContent = 'Включить радио';
                    // Дополнительная проверка на ошибку autoplay policy
                    if (error.name === "NotAllowedError" || error.name === "AbortError") {
                        alert("Автоматическое воспроизведение заблокировано браузером. Пожалуйста, взаимодействуйте со страницей, чтобы начать.");
                    }
                });
        } else {
            radioPlayer.pause();
            togglePlayPauseBtn.textContent = 'Включить радио';
            updateStatus('Остановлено.');
        }
    });

    // Обработчики событий аудио
    radioPlayer.addEventListener('play', () => {
        togglePlayPauseBtn.textContent = 'Пауза';
        updateStatus('Воспроизведение...');
    });

    radioPlayer.addEventListener('pause', () => {
        togglePlayPauseBtn.textContent = 'Включить радио';
        updateStatus('Остановлено.');
    });

    radioPlayer.addEventListener('error', (e) => {
        console.error('Ошибка аудио:', e);
        let errorMessage = 'Неизвестная ошибка аудио.';
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Воспроизведение прервано.';
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Ошибка сети. Проверьте ваше подключение.';
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                errorMessage = 'Ошибка декодирования аудио.';
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Источник не поддерживается или не найден.';
                break;
        }
        updateStatus(ⓃОшибка: ${errorMessage}Ⓝ, true);
        togglePlayPauseBtn.textContent = 'Включить радио';
    });

    radioPlayer.addEventListener('waiting', () => {
        updateStatus('Буферизация...');
    });

    radioPlayer.addEventListener('stalled', () => {
        updateStatus('Загрузка прервана...');
    });

    radioPlayer.addEventListener('ended', () => {
        updateStatus('Поток завершился. Возможно, радио временно не работает.', true);
        togglePlayPauseBtn.textContent = 'Включить радио';
    });


    // --- PWA: Регистрация Service Worker ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker зарегистрирован:', registration.scope);
                })
                .catch(error => {
                    console.error('Ошибка регистрации Service Worker:', error);
                });
        });
    } else {
        console.warn('Ваш браузер не поддерживает Service Worker. PWA-функции недоступны.');
    }
});
