document.addEventListener('DOMContentLoaded', () => {
    const playPauseButton = document.getElementById('playPauseButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const statusMessage = document.getElementById('statusMessage');

    let isPlaying = false;

    const togglePlayPause = () => {
        if (!isPlaying) {
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    playPauseButton.textContent = 'Остановить Радио';
                    statusMessage.textContent = 'Радио играет...';
                    console.log('Аудио успешно запущено.');
                })
                .catch(error => {
                    console.error('Ошибка при попытке воспроизведения аудио:', error);
                    statusMessage.textContent = 'Ошибка воспроизведения. Нажмите еще раз или разрешите автовоспроизведение.';
                    isPlaying = false;
                    playPauseButton.textContent = 'Включить Радио';
                });
        } else {
            audioPlayer.pause();
            isPlaying = false;
            playPauseButton.textContent = 'Включить Радио';
            statusMessage.textContent = 'Радио остановлено.';
            console.log('Аудио остановлено.');
        }
    };

    playPauseButton.addEventListener('click', togglePlayPause);

    // Обработчики событий для аудио, чтобы синхронизировать состояние
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playPauseButton.textContent = 'Остановить Радио';
        statusMessage.textContent = 'Радио играет...';
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playPauseButton.textContent = 'Включить Радио';
        statusMessage.textContent = 'Радио остановлено.';
    });

    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        playPauseButton.textContent = 'Включить Радио';
        statusMessage.textContent = 'Воспроизведение завершено.';
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Ошибка аудио:', e);
        isPlaying = false;
        playPauseButton.textContent = 'Включить Радио';
        statusMessage.textContent = 'Ошибка загрузки или воспроизведения аудио.';
    });
});
