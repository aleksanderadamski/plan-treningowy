document.addEventListener('DOMContentLoaded', function () {
    
     const workouts = {
        push: [
            { options: [{ name: "Wyciskanie sztangi na ławce płaskiej", sets: "4x8-10" }, { name: "Wyciskanie hantli (płasko)", sets: "4x8-10" }, { name: "Pompki na poręczach", sets: "4xMAX" }] },
            { options: [{ name: "Wyciskanie hantli nad głowę (siedząc)", sets: "3x8-12" }, { name: "Wyciskanie żołnierskie (stojąc)", sets: "3x8-10" }, { name: "Wyciskanie na maszynie", sets: "3x10-12" }] },
            { options: [{ name: "Wyciskanie sztangi na ławce skośnej", sets: "3x10-12" }, { name: "Wyciskanie hantli (skośna)", sets: "3x10-12" }] },
            { options: [{ name: "Wznosy hantli bokiem", sets: "3x12-15" }, { name: "Face pulls (linka)", sets: "3x12-15" }] },
            { options: [{ name: "Rozpiętki na maszynie 'Butterfly'", sets: "3x12-15" }, { name: "Rozpiętki z hantlami", sets: "3x12-15" }] },
            { options: [{ name: "Prostowanie ramion (linka wyciągu)", sets: "3x10-15" }, { name: "Wyciskanie francuskie", sets: "3x10-12" }] }
        ],
        pull: [
            { options: [{ name: "Podciąganie na drążku (nachwyt)", sets: "4xMAX" }, { name: "Ściąganie drążka wyciągu", sets: "4x8-12" }] },
            { options: [{ name: "Wiosłowanie sztangą (opad tułowia)", sets: "4x8-10" }, { name: "Wiosłowanie hantlem", sets: "4x8-10" }, { name: "Wiosłowanie na maszynie", sets: "4x10-12" }] },
            { options: [{ name: "Przyciąganie uchwytu V (siedząc)", sets: "3x10-12" }, { name: "Wiosłowanie 'półsztangą'", sets: "3x8-10" }] },
            { options: [{ name: "Ściąganie drążka (proste ramiona)", sets: "3x12-15" }, { name: "Przenoszenie hantla ('pullover')", sets: "3x12-15" }] },
            { options: [{ name: "Uginanie ramion ze sztangą", sets: "3x10-12" }, { name: "Uginanie z hantlami (supinacja)", sets: "3x10-12" }] },
            { options: [{ name: "Uginanie ramion na modlitewniku", sets: "3x10-15" }, { name: "Uginanie w oparciu o ławkę", sets: "3x10-12" }] }
        ],
        legs: [
            { options: [{ name: "Przysiady ze sztangą", sets: "4x8-10" }, { name: "Wypychanie na suwnicy", sets: "4x10-12" }, { name: "Przysiady bułgarskie", sets: "4x8-10 (na nogę)" }] },
            { options: [{ name: "Martwy ciąg na prostych nogach (RDL)", sets: "3x10-12" }, { name: "'Dzień dobry' ze sztangą", sets: "3x10-12" }, { name: "Uginanie nóg (leżąc)", sets: "3x12-15" }] },
            { options: [{ name: "Wykroki z hantlami", sets: "3x10-12 (na nogę)" }, { name: "Wchodzenie na podwyższenie", sets: "3x10-12 (na nogę)" }] },
            { options: [{ name: "Prostowanie nóg na maszynie", sets: "3x12-15" }, { name: "Przysiad 'sissy squat'", sets: "3xMAX" }] },
            { options: [{ name: "Uginanie nóg na maszynie (siedząc)", sets: "3x12-15" }, { name: "'Żuraw' (Glute Ham Raise)", sets: "3xMAX" }] },
            { options: [{ name: "Wspięcia na palce (stojąc)", sets: "4x15-20" }, { name: "Wspięcia na suwnicy", sets: "4x15-20" }, { name: "Wspięcia z hantlem", sets: "4x15-20" }] }
        ],
        brzuch: [
            { options: [{ name: "'Allahy' (linka wyciągu)", sets: "3x15-20" }, { name: "Spięcia na maszynie", sets: "3x15-20" }] },
            { options: [{ name: "Unoszenie nóg w zwisie", sets: "3xMAX" }, { name: "Unoszenie kolan w zwisie", sets: "3xMAX" }] },
            { options: [{ name: "Plank (deska)", sets: "3x60s" }, { name: "Plank boczny", sets: "3x30-45s (na str.)" }] },
            { options: [{ name: "'Russian Twist' (z obciążeniem)", sets: "3x15 (na str.)" }, { name: "'Wood choppers' (wyciąg)", sets: "3x12-15 (na str.)" }] }
        ]
    };

    const LOG_STORAGE_KEY = 'interactiveTrainingLog';
    let progressChart = null; 

    // THEME TOGGLE LOGIC
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Show correct icon on page load
    if (document.documentElement.classList.contains('dark')) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function() {
        // toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('theme')) {
            if (localStorage.getItem('theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
        // Update chart if it's visible
        let activeSelectValue = null;
        document.querySelectorAll('.progress-select').forEach(select => {
            if (select.value) {
                activeSelectValue = select.value;
            }
        });

        if (activeSelectValue) {
            renderProgressChart(activeSelectValue);
        }
    });

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast-message');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-600'
        };
        toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 text-white text-sm font-bold py-2 px-4 rounded-md opacity-0 z-50';
        toast.textContent = message;
        toast.classList.add(colors[type]);
        toast.classList.remove('opacity-0');
        toast.classList.add('toast-animation');
        
        setTimeout(() => {
            toast.classList.add('opacity-0');
            toast.classList.remove('toast-animation');
        }, 2800);
    }

    function saveLogToStorage() {
        localStorage.setItem(LOG_STORAGE_KEY, document.getElementById('csv-output').value);
    }

    function loadLogFromStorage() {
        const savedLog = localStorage.getItem(LOG_STORAGE_KEY);
        if (savedLog) {
            document.getElementById('csv-output').value = savedLog;
        }
    }

    function populateWorkoutCards() {
        for (const workoutType in workouts) {
            const container = document.getElementById(`${workoutType}-cards`);
            if (container) {
                container.innerHTML = ''; 
                workouts[workoutType].forEach((exerciseSlot, index) => {
                    const card = document.createElement('div');
                    card.className = 'bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm exercise-card';
                    card.dataset.index = index;
                    
                    const optionsHtml = exerciseSlot.options
                        .map(opt => `<option value="${opt.name}">${opt.name}</option>`).join('');
                    const initialSets = exerciseSlot.options[0].sets;

                    card.innerHTML = `
                        <div class="mb-3">
                            <select class="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-base exercise-select bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                                ${optionsHtml}
                            </select>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-gray-600 dark:text-gray-400 sets-cell text-sm">${initialSets}</span>
                            <div class="flex items-center gap-2">
                                <input type="number" step="0.5" min="0" class="w-24 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-center text-base bg-gray-50 dark:bg-gray-700 dark:text-gray-200 weight-input" placeholder="0">
                                <span class="text-gray-500 dark:text-gray-400">kg</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        }
    }

    function saveWorkout(workoutType) {
        const container = document.getElementById(`${workoutType}-cards`);
        const cards = container.querySelectorAll('.exercise-card');
        const csvOutput = document.getElementById('csv-output');
        const today = new Date().toISOString().slice(0, 10);
        let workoutData = "";

        cards.forEach(card => {
            const exerciseSelect = card.querySelector('.exercise-select');
            const weightInput = card.querySelector('.weight-input');
            const weight = parseFloat(weightInput.value);

            if (weight > 0) {
                const exerciseName = exerciseSelect.value;
                const setsInfo = card.querySelector('.sets-cell').textContent;
                workoutData += `${today},${workoutType.toUpperCase()},"${exerciseName}",${setsInfo},${weight}\n`;
            }
        });

        if(workoutData) {
            if (csvOutput.value.trim() === "") {
                csvOutput.value = "Data,Trening,Ćwiczenie,Serie x Powt.,Ciężar (kg)\n";
            }
            csvOutput.value += workoutData;
            saveLogToStorage();
            showToast(`Trening ${workoutType.toUpperCase()} zapisany!`, 'info');
        } else {
            showToast('Wprowadź ciężar, aby zapisać.', 'error');
        }
    }

    function parseCsvData() {
        const log = localStorage.getItem(LOG_STORAGE_KEY);
        if (!log || log.trim() === '' || log.split('\n').length < 2) return [];
        const rows = log.trim().split('\n');
        rows.shift(); 
        return rows.map(row => {
            const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
             if (values.length < 5) return null;
            return {
                date: values[0],
                workout: values[1],
                exercise: values[2] ? values[2].replace(/"/g, '') : '',
                sets: values[3],
                weight: parseFloat(values[4])
            };
        }).filter(Boolean);
    }

     function updateProgressTab() {
        const data = parseCsvData();
        const noDataMessage = document.getElementById('no-data-message');
        
        if (data.length === 0) {
            noDataMessage.classList.remove('hidden');
            document.getElementById('push-progress-section').classList.add('hidden');
            document.getElementById('pull-progress-section').classList.add('hidden');
            document.getElementById('legs-progress-section').classList.add('hidden');
            return;
        }

        noDataMessage.classList.add('hidden');

        const exercises = {
            PUSH: [...new Set(data.filter(d => d.workout === 'PUSH').map(item => item.exercise))].sort(),
            PULL: [...new Set(data.filter(d => d.workout === 'PULL').map(item => item.exercise))].sort(),
            LEGS: [...new Set(data.filter(d => d.workout === 'LEGS').map(item => item.exercise))].sort()
        };

        ['push', 'pull', 'legs'].forEach(type => {
            const section = document.getElementById(`${type}-progress-section`);
            const select = section.querySelector('.progress-select');
            const exerciseList = exercises[type.toUpperCase()];

            if (exerciseList.length > 0) {
                section.classList.remove('hidden');
                select.innerHTML = '<option value="">-- Wybierz ćwiczenie --</option>';
                exerciseList.forEach(ex => {
                    if(ex) {
                        const option = document.createElement('option');
                        option.value = ex;
                        option.textContent = ex;
                        select.appendChild(option);
                    }
                });
            } else {
                section.classList.add('hidden');
            }
        });
    }
    
    function renderProgressChart(selectedExercise) {
        const chartContainer = document.getElementById('progress-chart-container');
        if (!selectedExercise) {
            chartContainer.classList.add('hidden');
            return;
        }
        
        chartContainer.classList.remove('hidden');
        const isDarkMode = document.documentElement.classList.contains('dark');
        const data = parseCsvData();
        const chartData = data
            .filter(item => item.exercise === selectedExercise)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = chartData.map(d => d.date);
        const weights = chartData.map(d => d.weight);

        const ctx = document.getElementById('progress-chart').getContext('2d');
        
        if (progressChart) {
            progressChart.destroy();
        }

        progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Progresja ciężaru (kg)`,
                    data: weights,
                    borderColor: isDarkMode ? '#60a5fa' : '#2563eb',
                    backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: isDarkMode ? '#93c5fd' : '#1d4ed8',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: selectedExercise, 
                        font: { size: 14, family: 'Poppins' },
                        color: isDarkMode ? '#d1d5db' : '#374151'
                    },
                     legend: { display: false }
                },
                scales: {
                    y: { 
                        title: { display: true, text: 'Ciężar (kg)', color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        ticks: { color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    },
                    x: { 
                        title: { display: false },
                        ticks: { color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    }
                }
            }
        });
    }

    document.getElementById('save-push').addEventListener('click', () => saveWorkout('push'));
    document.getElementById('save-pull').addEventListener('click', () => saveWorkout('pull'));
    document.getElementById('save-legs').addEventListener('click', () => saveWorkout('legs'));
    document.getElementById('save-brzuch').addEventListener('click', () => saveWorkout('brzuch'));

    document.getElementById('save-log-changes').addEventListener('click', () => {
        saveLogToStorage();
        showToast('Zmiany w dzienniku zapisane!', 'success');
        updateProgressTab();
        renderProgressChart(''); 
    });

    document.getElementById('copy-log').addEventListener('click', () => {
        const csvOutput = document.getElementById('csv-output');
         if(!csvOutput.value) return;
        navigator.clipboard.writeText(csvOutput.value).then(() => {
            showToast('Skopiowano do schowka!', 'success');
        });
    });
    
    const clearLogBtn = document.getElementById('clear-log');
    clearLogBtn.addEventListener('click', () => {
        if (clearLogBtn.dataset.confirm === 'true') {
            document.getElementById('csv-output').value = '';
            localStorage.removeItem(LOG_STORAGE_KEY);
            showToast('Dziennik wyczyszczony!', 'error');
            updateProgressTab(); 
            if (progressChart) progressChart.destroy();
            document.getElementById('progress-chart-container').classList.add('hidden');
            
            clearLogBtn.textContent = 'Wyczyść';
            clearLogBtn.dataset.confirm = 'false';
            clearLogBtn.classList.remove('bg-yellow-500');
        } else {
            clearLogBtn.textContent = 'Potwierdź';
            clearLogBtn.dataset.confirm = 'true';
            clearLogBtn.classList.add('bg-yellow-500');
            setTimeout(() => {
                if (clearLogBtn.dataset.confirm === 'true') {
                     clearLogBtn.textContent = 'Wyczyść';
                     clearLogBtn.dataset.confirm = 'false';
                     clearLogBtn.classList.remove('bg-yellow-500');
                }
            }, 3000);
        }
    });


    const navBtns = document.querySelectorAll('.nav-btn');
    const panes = document.querySelectorAll('.page-pane');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            navBtns.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            panes.forEach(pane => {
                pane.classList.add('hidden');
            });
            document.getElementById(target).classList.remove('hidden');

            if (target === 'postepy') {
                updateProgressTab();
                renderProgressChart('');
            }
            window.scrollTo(0, 0);
        });
    });

    document.querySelectorAll('.progress-select').forEach(select => {
        select.addEventListener('change', (e) => {
            document.querySelectorAll('.progress-select').forEach(otherSelect => {
                if(otherSelect !== e.target) {
                    otherSelect.value = '';
                }
            });
            renderProgressChart(e.target.value);
        });
    });

    const scheduleToggle = document.getElementById('scheduleToggle');
    scheduleToggle.addEventListener('change', () => {
        const scheduleDisplay = document.getElementById('schedule-display');
        const toggleDot = scheduleToggle.parentElement.querySelector('.dot');
        const toggleBlock = scheduleToggle.parentElement.querySelector('.block');
        if (scheduleToggle.checked) {
            scheduleDisplay.innerHTML = `<h4 class="font-semibold mb-1">Przykładowy plan (4 dni):</h4><p>Tydzień 1: PUSH, PULL, LEGS, PUSH<br>Tydzień 2: PULL, LEGS, PUSH, PULL</p>`;
            toggleDot.style.transform = 'translateX(100%)';
            toggleBlock.classList.replace('bg-gray-200', 'bg-blue-500');
            toggleBlock.classList.replace('dark:bg-gray-600', 'dark:bg-blue-600');
        } else {
            scheduleDisplay.innerHTML = `<h4 class="font-semibold mb-1">Przykładowy plan (3 dni):</h4><p>Poniedziałek - PUSH, Środa - PULL, Piątek - LEGS</p>`;
            toggleDot.style.transform = 'translateX(0)';
            toggleBlock.classList.replace('bg-blue-500', 'bg-gray-200');
            toggleBlock.classList.replace('dark:bg-blue-600', 'dark:bg-gray-600');
        }
    });
    
    function onCardSelectChange(e) {
        if (e.target.classList.contains('exercise-select')) {
            const selectEl = e.target;
            const card = selectEl.closest('.exercise-card');
            const workoutType = card.parentElement.id.replace('-cards', '');
            const rowIndex = parseInt(card.dataset.index, 10);
            const selectedIndex = selectEl.selectedIndex;

            const newSets = workouts[workoutType][rowIndex].options[selectedIndex].sets;
            card.querySelector('.sets-cell').textContent = newSets;
        }
    }
    
    document.getElementById('push-cards').addEventListener('change', onCardSelectChange);
    document.getElementById('pull-cards').addEventListener('change', onCardSelectChange);
    document.getElementById('legs-cards').addEventListener('change', onCardSelectChange);
    document.getElementById('brzuch-cards').addEventListener('change', onCardSelectChange);

    populateWorkoutCards();
    loadLogFromStorage();
    document.querySelector('.nav-btn[data-tab="harmonogram"]').click();
});

