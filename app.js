/**
 * PROJECT POLLEN - BETA v0.95.4
 * Logic: Version Interpolation, Sandbox Protection, & Custom Themes
 */

const VERSION = "v0.95.4";

const gameFiles = [
    "CircloO", "CircloO 2", "Cookie Clicker", "Crazy Cattle 3D", "Crossy Road", 
    "Duck Life", "Duck Life 2", "Duck Life 3", "Duck Life 4", "Duck Life 5", 
    "Duck Life 8", "Emulator.JS", "Escape Road", "Five Nights at Freddys", 
    "Five Nights at Freddys 2", "Five Nights at Freddys 3", "Five Nights at Freddys 4", 
    "Five Nights at Freddys Pizza Simulator", "Five Nights at Freddys Sister Location", 
    "Five Nights at Freddys Ultimate Custom Night", "Five Nights at Freddys World", 
    "Five Nights at Freddys World Refreshed", "Five Nights at Winstons", "Fruit Ninja", 
    "Fundamental Paper Novel", "Gunspin", "Happy Wheels", "Jeffys Basics In Education and Learning", 
    "Jetpack Joyride", "Papas Bakeria", "Papas Burgeria", "Papas Cheeseria", 
    "Papas Cupcakeria", "Papas Donuteria", "Papas Freezeria", "Papas Hot Doggeria", 
    "Papas Pancakeria", "Papas Pastaria", "Papas Pizeria", "Papas Scooperia", 
    "Papas Sushiria", "Papas Taco Mia", "Papas Wingeria", "Please Dont Touch Anything", 
    "Riddle School", "Riddle School 2", "Riddle School 3", "Riddle School 4", 
    "Riddle School 5", "Riddle Transfer", "Riddle Transfer 2", "Stick With It", 
    "The Impossible Quiz", "Tomb Of The Mask"
];

let openTabs = [];
const tabsBar = document.getElementById('tabs-bar');
const container = document.getElementById('iframes-container');
const themeSelect = document.getElementById('theme-select');

// --- INITIALIZATION ---

function initTheme() {
    const savedTheme = localStorage.getItem('pollen-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    if (themeSelect) themeSelect.value = savedTheme;
    loadSavedCustomTheme();
}

// --- TAB SYSTEM ---

function createMenuTab() {
    const id = Date.now().toString();
    openTabs.forEach(t => t.active = false);
    openTabs.push({ 
        id: id, 
        name: `Home ${VERSION}`, 
        type: "menu", 
        active: true, 
        searchQuery: "" 
    });
    renderTabs();
    renderTabView(openTabs.find(t => t.id === id));
}

function switchTab(id) {
    openTabs.forEach(t => t.active = (t.id === id));
    renderTabs();
    renderTabView(openTabs.find(t => t.id === id));
}

function closeTab(id) {
    const index = openTabs.findIndex(t => t.id === id);
    if (index === -1) return;
    const wasActive = openTabs[index].active;
    const view = document.getElementById(`view-${id}`);
    if (view) view.remove();
    openTabs.splice(index, 1);
    if (openTabs.length === 0) createMenuTab();
    else if (wasActive) switchTab(openTabs[openTabs.length - 1].id);
    else renderTabs();
}

// --- NAVIGATION ---

function refreshCurrentTab() {
    const activeTab = openTabs.find(t => t.active);
    if (!activeTab) return;

    const logoBtn = document.getElementById('logo-btn');
    if (logoBtn) {
        logoBtn.classList.remove('logo-flash');
        void logoBtn.offsetWidth; 
        logoBtn.classList.add('logo-flash');
    }

    if (activeTab.type === 'game') {
        activeTab.type = 'menu';
        activeTab.name = `Home ${VERSION}`;
        activeTab.searchQuery = "";
        if (document.fullscreenElement) document.exitFullscreen();
        renderTabView(activeTab);
    } else {
        activeTab.searchQuery = "";
        const view = document.getElementById(`view-${activeTab.id}`);
        const searchInput = view.querySelector('.tab-search');
        if (searchInput) searchInput.value = "";
        if (view) view.scrollTo({ top: 0, behavior: 'instant' });
        populateGrid(activeTab.id, "");
    }
    renderTabs();
}

function launchGame(name) {
    const activeTab = openTabs.find(t => t.active);
    if (!activeTab) return;
    activeTab.type = "game";
    activeTab.name = name;
    activeTab.url = `Games/${name}.html`;
    renderTabs();
    renderTabView(activeTab);
}

// --- RENDERING ---

function renderTabView(tab) {
    let view = document.getElementById(`view-${tab.id}`);
    if (!view) {
        view = document.createElement('div');
        view.id = `view-${tab.id}`;
        view.className = 'tab-view';
        container.appendChild(view);
    }

    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    view.classList.add('active');

    if (tab.type === 'menu') {
        view.innerHTML = `
            <div class="container">
                <h1 style="font-size: 1.2rem; margin-bottom: 20px; opacity: 0.8;">Project Pollen <span style="color: var(--accent);">${VERSION}</span></h1>
                <input type="text" class="tab-search" placeholder="Search games..." 
                    oninput="filterGames(this, '${tab.id}')" value="${tab.searchQuery}">
                <div class="game-grid" id="grid-${tab.id}"></div>
            </div>
        `;
        populateGrid(tab.id, tab.searchQuery);
    } else {
        view.innerHTML = `
            <div class="game-wrapper">
                <div class="game-container-box">
                    <div class="game-control-bar">
                        <button class="play-btn-small" onclick="refreshCurrentTab()">Back</button>
                        <span style="flex: 1; font-size: 0.9rem; margin-left: 15px; font-weight: bold;">${tab.name}</span>
                        <button class="play-btn-small" onclick="toggleIframeFullscreen('${tab.id}')">⛶ Fullscreen (F)</button>
                    </div>
                    <iframe 
                        src="${tab.url}" 
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        allowfullscreen="true">
                    </iframe>
                </div>
            </div>`;
    }
}

function populateGrid(tabId, query) {
    const grid = document.getElementById(`grid-${tabId}`);
    if (!grid) return;
    grid.innerHTML = "";
    gameFiles.forEach(name => {
        if (name.toLowerCase().includes(query.toLowerCase())) {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.onclick = () => launchGame(name);
            card.innerHTML = `
                <div class="game-thumb" style="background-image: url('Icons/${name}.jpg');"></div>
                <div class="game-info"><h3>${name}</h3></div>
            `;
            grid.appendChild(card);
        }
    });
}

function filterGames(input, tabId) {
    const tab = openTabs.find(t => t.id === tabId);
    if (tab) tab.searchQuery = input.value;
    populateGrid(tabId, input.value);
}

function renderTabs() {
    tabsBar.innerHTML = "";
    openTabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.active ? 'active' : ''}`;
        tabEl.innerHTML = `
            <div class="tab-click-zone" onclick="switchTab('${tab.id}')">${tab.name}</div>
            <div class="tab-close-zone" onclick="closeTab('${tab.id}')">×</div>
        `;
        tabsBar.appendChild(tabEl);
    });
    const plusBtn = document.createElement('button');
    plusBtn.className = 'play-btn-small';
    plusBtn.style.margin = "5px";
    plusBtn.innerText = "+";
    plusBtn.onclick = createMenuTab;
    tabsBar.appendChild(plusBtn);
}

// --- THEME CUSTOMIZER LOGIC ---

function updateColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
    
    // Switch dropdown to 'custom' status
    if (themeSelect) themeSelect.value = 'custom';
    document.body.setAttribute('data-theme', 'custom');
    localStorage.setItem('pollen-theme', 'custom');

    const customPalette = JSON.parse(localStorage.getItem('pollen-custom-hex')) || {};
    customPalette[variable] = value;
    localStorage.setItem('pollen-custom-hex', JSON.stringify(customPalette));
}

function loadSavedCustomTheme() {
    const savedType = localStorage.getItem('pollen-theme');
    if (savedType === 'custom') {
        const customPalette = JSON.parse(localStorage.getItem('pollen-custom-hex'));
        if (customPalette) {
            Object.entries(customPalette).forEach(([variable, value]) => {
                document.documentElement.style.setProperty(variable, value);
            });
            // Match pickers to saved hexes
            if(document.getElementById('bgPicker')) document.getElementById('bgPicker').value = customPalette['--bg'] || '#0f0f2d';
            if(document.getElementById('accentPicker')) document.getElementById('accentPicker').value = customPalette['--accent'] || '#000099';
            if(document.getElementById('textPicker')) document.getElementById('textPicker').value = customPalette['--text'] || '#ffffff';
        }
    }
}

// Setup Pickers
const colorConfig = [
    { id: 'bgPicker', var: '--bg' },
    { id: 'accentPicker', var: '--accent' },
    { id: 'textPicker', var: '--text' }
];

colorConfig.forEach(config => {
    const picker = document.getElementById(config.id);
    if (picker) {
        picker.addEventListener('input', (e) => updateColor(config.var, e.target.value));
    }
});

// Export/Import Logic
document.getElementById('exportTheme').onclick = () => {
    const rootStyle = getComputedStyle(document.documentElement);
    const themeData = {
        bg: rootStyle.getPropertyValue('--bg').trim(), 
        accent: rootStyle.getPropertyValue('--accent').trim(), 
        text: rootStyle.getPropertyValue('--text').trim(),
        version: VERSION
    };
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pollen_theme_${VERSION}.txt`;
    link.click();
};

const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importTheme');
importBtn.onclick = () => importInput.click();
importInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const theme = JSON.parse(event.target.result);
            if (theme.bg) updateColor('--bg', theme.bg);
            if (theme.accent) updateColor('--accent', theme.accent);
            if (theme.text) updateColor('--text', theme.text);
            alert("Theme Applied!");
        } catch (err) { alert("Invalid theme file."); }
    };
    reader.readAsText(file);
};

// --- HELPERS & EVENTS ---

function toggleIframeFullscreen(tabId) {
    const view = document.getElementById(`view-${tabId}`);
    const iframe = view.querySelector('iframe');
    if (iframe) {
        if (!document.fullscreenElement) iframe.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    }
}

function updateClock() {
    const clockEl = document.getElementById('header-clock');
    if (clockEl) clockEl.innerText = new Date().toLocaleTimeString();
}

themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('pollen-theme', theme);
    if (theme !== 'custom') localStorage.removeItem('pollen-custom-hex');
});

document.getElementById('openSettings').addEventListener('click', () => { document.getElementById('settingsModal').style.display = 'flex'; });
document.getElementById('closeSettings').addEventListener('click', () => { document.getElementById('settingsModal').style.display = 'none'; });
document.getElementById('saveSettings').addEventListener('click', () => { document.getElementById('settingsModal').style.display = 'none'; });

window.addEventListener('keydown', (e) => {
    const activeTab = openTabs.find(t => t.active);
    if (!activeTab) return;
    if (e.key === "Backspace" && activeTab.type === 'game') { e.preventDefault(); refreshCurrentTab(); }
    if (e.key.toLowerCase() === "f" && activeTab.type === 'game') { toggleIframeFullscreen(activeTab.id); }
});

initTheme();
createMenuTab();
setInterval(updateClock, 1000);
updateClock();