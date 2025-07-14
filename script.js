// script.js

document.addEventListener('DOMContentLoaded', () => {
    const radioPlayer = document.getElementById('radioPlayer');
    const togglePlayPauseButton = document.getElementById('togglePlayPause');
    const statusMessage = document.getElementById('statusMessage');

    let isPlaying = false; // Отслеживает текущее состояние воспроизведения

    // Инициализация текста кнопки и статуса при загрузке
    togglePlayPauseButton.textContent = 'Включить радио';
    statusMessage.textContent = 'Ожидание...';

    // Обработчик нажатия на кнопку
    togglePlayPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            // Если радио играет, останавливаем его
            radioPlayer.pause();
            isPlaying = false;
            togglePlayPauseButton.textContent = 'Включить радио';
            statusMessage.textContent = 'Остановлено';
        } else {
            // Если радио не играет, пытаемся запустить
            statusMessage.textContent = 'Загрузка...'; // Показываем статус загрузки
            radioPlayer.play()
                .then(() => {
                    // Успешное воспроизведение
                    isPlaying = true;
                    togglePlayPauseButton.textContent = 'Выключить радио';
                    statusMessage.textContent = 'Играет...';
                })
                .catch(error => {
                    // Ошибка воспроизведения (например, из-за политики автовоспроизведения браузера)
                    isPlaying = false;
                    togglePlayPauseButton.textContent = 'Включить радио';
                    statusMessage.textContent = ⓃОшибка: ${error.message}. Нажмите еще раз или измените настройки браузера.Ⓝ;
                    console.error('Ошибка воспроизведения аудио:', error);
                });
        }
    });

    // Дополнительные обработчики событий для улучшения UX
    radioPlayer.addEventListener('waiting', () => {
        if (isPlaying) { // Показываем "Загрузка..." только если пытаемся воспроизводить
            statusMessage.textContent = 'Загрузка...';
        }
    });

    radioPlayer.addEventListener('playing', () => {
        isPlaying = true; // Убеждаемся, что состояние корректно
        togglePlayPauseButton.textContent = 'Выключить радио';
        statusMessage.textContent = 'Играет...';
    });

    radioPlayer.addEventListener('pause', () => {
        isPlaying = false; // Убеждаемся, что состояние корректно
        togglePlayPauseButton.textContent = 'Включить радио';
        statusMessage.textContent = 'Остановлено';
    });

    radioPlayer.addEventListener('error', (e) => {
        isPlaying = false;
        togglePlayPauseButton.textContent = 'Включить радио';
        statusMessage.textContent = ⓃОшибка радио: ${e.message || 'Неизвестная ошибка'}. Попробуйте позже.Ⓝ;
        console.error('Ошибка аудиоэлемента:', e);
    });

    // Обработка возможного автовоспроизведения при загрузке страницы (редко, но бывает)
    // Не рекомендуется пытаться play() на DOMContentLoaded из-за политики автовоспроизведения
    // Лучше пусть пользователь сам нажмет кнопку.
});
