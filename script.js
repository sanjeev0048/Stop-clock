
        let startTime = 0;
        let elapsedTime = 0;
        let timerInterval = null;
        let isRunning = false;
        let lapCounter = 1;

        const timeDisplay = document.getElementById('timeDisplay');
        const millisecondsDisplay = document.getElementById('millisecondsDisplay');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const lapBtn = document.getElementById('lapBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapTimes = document.getElementById('lapTimes');

        function formatTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const ms = Math.floor((milliseconds % 1000) / 10);

            return {
                time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                milliseconds: ms.toString().padStart(2, '0') + '0'
            };
        }

        function updateDisplay() {
            const formatted = formatTime(elapsedTime);
            timeDisplay.textContent = formatted.time;
            millisecondsDisplay.textContent = formatted.milliseconds;
        }

        function startStopwatch() {
            if (!isRunning) {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(() => {
                    elapsedTime = Date.now() - startTime;
                    updateDisplay();
                }, 10);
                
                isRunning = true;
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                lapBtn.disabled = false;
                
                // Add visual feedback
                startBtn.textContent = 'Running';
            }
        }

        function pauseStopwatch() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                lapBtn.disabled = true;
                
                startBtn.textContent = 'Resume';
            }
        }

        function resetStopwatch() {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            lapCounter = 1;
            
            updateDisplay();
            
            // Reset button states
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            lapBtn.disabled = true;
            startBtn.textContent = 'Start';
            
            // Clear lap times
            const lapContainer = lapTimes.querySelector('h3');
            if (lapContainer && lapContainer.nextSibling) {
                while (lapContainer.nextSibling) {
                    lapContainer.nextSibling.remove();
                }
            }
        }

        function recordLap() {
            if (isRunning) {
                const lapTime = elapsedTime;
                const formatted = formatTime(lapTime);
                
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `
                    <span class="lap-number">Lap ${lapCounter}</span>
                    <span class="lap-time">${formatted.time}:${formatted.milliseconds}</span>
                `;
                
                // Insert after the h3 element
                const h3 = lapTimes.querySelector('h3');
                if (h3.nextSibling) {
                    lapTimes.insertBefore(lapItem, h3.nextSibling);
                } else {
                    lapTimes.appendChild(lapItem);
                }
                
                lapCounter++;
                
                // Scroll to show the new lap
                lapTimes.scrollTop = 0;
            }
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (isRunning) {
                        pauseStopwatch();
                    } else {
                        startStopwatch();
                    }
                    break;
                case 'KeyL':
                    if (isRunning) {
                        recordLap();
                    }
                    break;
                case 'KeyR':
                    resetStopwatch();
                    break;
            }
        });

        // Initialize display
        updateDisplay();

        // Add some visual enhancements
        function addRippleEffect(event) {
            const button = event.currentTarget;
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientHeight, button.clientWidth);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
            circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
            circle.classList.add('ripple');
            
            const ripple = button.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }
            
            button.appendChild(circle);
        }

        // Add ripple effect to all buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', addRippleEffect);
        });