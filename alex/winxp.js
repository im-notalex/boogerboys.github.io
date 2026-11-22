/*
  ==========================================================================
  JAVASCRIPT LOGIC
  ==========================================================================
*/

// --- Core UI elements ---
const loginScreen = document.getElementById('login-screen');
const loginWelcome = document.getElementById('login-welcome');
const loginHint = document.getElementById('login-hint');
const loginWarning = document.getElementById('login-warning');
const desktop = document.getElementById('desktop');
const shutdownScreen = document.getElementById('shutdown-screen');
const startMenu = document.getElementById('start-menu');
const taskbarApps = document.getElementById('taskbar-apps');
const clock = document.getElementById('clock');
const dragPreview = document.getElementById('window-drag-preview');
const crtOverlay = document.querySelector('.crt-effect');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// NEW: Calendar elements
const calendarPopup = document.getElementById('calendar-popup');
const calendarTitle = document.getElementById('calendar-title');
const calendarGrid = document.getElementById('calendar-grid');

// Calendar state
let currentCalendarDate = new Date();
let crtEnabled = true;

// --- Audio Elements ---
const jukeboxAudio = document.getElementById('bg-music');
let jukeboxBaseVolume = 0.35;
let currentSongVolumeMultiplier = 1;
const startupSound = document.getElementById('startup-sound');
const shutdownSound = document.getElementById('shutdown-sound');
const clickSound = new Audio('open.mp3');
const notificationSound = document.getElementById('notification-sound');
const dynamicAudio = new Set();
let masterVolume = 1;
let sfxBaseVolume = 1;
let isMuted = false;
let awaitingAudioUnlock = false;
let autoplayNoticeShown = false;
clickSound.preload = 'metadata';

// --- Easter Egg Messages ---
const easterEggs = [
  "wait, hold on, i can edit these?",
  "windows xp was a kinda fun operating system.",
  "did you know a single floppy disk could only hold 1.44 MB?",
  "time to add the 90th dial up sound to make it 9000 millionths more retro!",
  "if you're reading this, you just found an easter egg! :egg: :retro_egg: :egg:",
  "'This whole project was made with the help of a very helpful AI.' - gemini & chatgpt, ty for help!",
  "ooooooooooooooooouuuuuggggghhhhh",
  "GITHUB developer CAUGHT using .WEBP files?!",
  "the computer says NO.",
  "hi nil :smile:",
  "LOVE-LETTER-FOR-YOU.TXT.vbs received in email!",
  "don't worry, the BSOD is just a feature.",
  "Warning: RETRO SLUDGE AHEAD.",
  "'wow, its barely buggy!' i say, with my large bug shaped belly.",
  "dial up reference no. 4",
  "don't forget to defragment your hard drive for optimal performance!",
  "you've been using your computer for a while. maybe it's time to take a break?",
  "you see Spawn! by evan fong? that guy is actually vanossgaming Ã°Å¸ËœÂ­",
  "im probably not putting THIS much effort into the other sites, i love favouritism!",
  "dont worry, as long as its in the recycle bin, its trashed, right?",
  "Kindly check the attached love letter from me! ~ LOVE-LETTER-FOR-YOU.TXT.vbs"
];

// --- State variables ---
let openWindows = {};
let zIndexCounter = 100;
let chatEmbedInitialized = false;
const powerShellHistory = [];
const powerShellEasterEggs = {
  IHATEALIENS: {
    message: 'Detected hostile life forms. Redirecting to emergency briefing...',
    url: 'https://www.youtube.com/watch?v=p_khWy7GAcQ'
  },
  ILOVEALIENS: {
    message: 'Establishing peaceful communication channel...',
    url: 'https://www.youtube.com/watch?v=8Dsf5j-jUZo'
  }
};
let idiotAudio = null;
let angelSummoned = false;

// --- Jukebox songs data ---
const songs = [
  { file: "Music1.mp3", credit: "Spawn! - Evan Fong", icon: "Music1.jpg", lyricsId: "spawn" },
  { file: "Music2.mp3", credit: "Vapor Buster - Deltarune Chapter 3 + 4 - Toby Fox", icon: "Music2.jpg" },
  { file: "Music3.mp3", credit: "Fireplace - Deltarune Chapter 3 + 4 - Toby Fox", icon: "Music3.jpg" },
  { file: "Music4.mp3", credit: "Air Waves - Deltarune Chapter 3 + 4 - Toby Fox", icon: "Music4.jpg" },
  { file: "Music5.mp3", credit: "Home Sweet Grave - Arc System Works - GUILTY GEAR SOUND COMPLETE BOX (7)", icon: "Music5.jpg" },
  { file: "Music6.mp3", credit: "Don't Preheat your Oven Because if you do the Song Won't Play - Pizza Tower", icon: "Music6.jpg" },
  { file: "Music7.mp3", credit: "BLOODY STREAM - JJBA", icon: "Music7.jpg", lyricsId: "bloodyStream", volumeMultiplier: 0.5 },
  { file: "Music8.mp3", credit: "growing on me - snayk", icon: "Music8.jpg" },
  { file: "Music9.mp3", credit: "Friday Theme - uglyburger0", icon: "Music9.jpg" },
  { file: "Music10.mp3", credit: "Great Days - JJBA", icon: "Music10.jpg", lyricsId: "greatDays" },
  { file: "Music11.mp3", credit: "Red Sun - METAL GEAR RISING: REVENGEANCE", icon: "Music11.jpg", lyricsId: "redSun" },
  { file: "Music12.mp3", credit: "Famine (Pursuer Jason) || FORSAKEN OST", icon: "MISSING.png" }
];
let currentSongIndex = 0;

const jukeboxControls = {
  elements: null,
  isSeeking: false
};
const SECRET_SEQUENCE = ['x', 'p', '!'];
let secretSequenceProgress = 0;

const lyricsLibrary = {
  spawn: {
    note: "Auto-synced (approx.)",
    cues: [
      { section: "Intro" },
      { time: 3.8, text: "Kapooya!" },
      { time: 12.7, text: "One, two, three, four!" },
      { section: "Verse 1" },
      { time: 43, text: "(In my bed)", muted: true },
      { time: 46, text: "(Counting stars on my ceiling)", muted: true },
      { time: 48.4, text: "(Before I paint it red)", muted: true },
      { time: 53, text: "(In my mess)", muted: true },
      { time: 55, text: "(Spawn a new face on my head)", muted: true },
      { time: 58, text: "(I will not regret)", muted: true },
      { time: 62.5, text: "In my bed (my bed, my bed)" },
      { time: 65, text: "Counting stars on my ceiling (ceiling, ceiling)" },
      { time: 67.4, text: "Before I paint it red (paint it red)" },
      { time: 72, text: "In my mess (my mess, my mess)" },
      { time: 74, text: "Spawn a new face on my head (my head, my head)" },
      { time: 77, text: "I will not regret (regret, regret)" },
      { section: "Chorus" },
      { time: 80.6, text: "When I feel lost" },
      { time: 84, text: "Man, I swear to God, I don't feel my brain" },
      { time: 87.3, text: "Last chance, I won't be coming back" },
      { time: 94.8, text: "Will they understand, understand?" },
      { section: "Verse 2" },
      { time: 100.8, text: "Back again (back again)" },
      { time: 103, text: "Project Mayhem, evil friend (evil friend)" },
      { time: 106, text: "Solace in the end (the end)" },
      { time: 110, text: "Smoke some Reds (smoke some Reds)" },
      { time: 112.3, text: "Spawn a new face on my head (my head)" },
      { time: 113.2, text: "I will not regret (regret)" },
      { section: "Chorus" },
      { time: 117.9, text: "When I feel lost" },
      { time: 122.7, text: "Man, I swear to God, I don't feel my brain" },
      { time: 128, text: "Last chance, I won't be coming back" },
      { time: 133, text: "Will they understand, understand?" },
      { time: 138, text: "When I feel lost" },
      { time: 142, text: "Man, I swear to God, I don't feel my brain" },
      { time: 147, text: "Last chance, I won't be coming back" },
      { time: 152, text: "Will they understand, understand? (Understand)" },
      { section: "Hook" },
      { time: 157.0, text: "In my bed (understand)" },
      { time: 158.5, text: "I lose my breath (understand)" },
      { time: 160.0, text: "Should I eject? (Understand)" },
      { time: 161.5, text: "And lay to rest (understand)" },
      { time: 163.0, text: "In my bed (understand)" },
      { time: 164.5, text: "I lose my breath (understand)" },
      { time: 166.0, text: "Should I eject? (Understand)" },
      { time: 167.5, text: "And lay to rest (understand)" },
      { section: "Outro" },
      { time: 177.0, text: "In my mess (understand)" },
      { time: 180.0, text: "Spawn a new face on my head" },
      { time: 183.0, text: "I will not regret" },
      { time: 186.0, text: "When I feel lost" },
    ]
  },
  bloodyStream: {
    note: "[Lyrics Unavailable]",
    cues: [
      { section: "[Lyrics Unavailable]" },
      { time: 0, text: "[Lyrics Unavailable]" }
    ]
  },
  greatDays: {
    note: "[Lyrics Unavailable]",
    cues: [
      { section: "[Lyrics Unavailable]" },
      { time: 0, text: "[Lyrics Unavailable]" }
    ]
  },
  redSun: {
    note: "[Lyrics Unavailable]",
    cues: [
      { section: "[Lyrics Unavailable]" },
      { time: 0, text: "[Lyrics Unavailable]" }
    ]
  }
};

const LYRICS_SYNC_LEEWAY = 0.35;

const lyricsState = {
  cues: [],
  currentIndex: -1,
  pending: null,
  songFile: null,
  ui: null
};

// --- App content data ---
const windowContent = {
  'Bio': `<p>hi, thanks for opening my page and stuff,,,,,</p><p>im alex, 16 (feb 21, 2009) soooo uhhh yea. this website is a personal project to practice my HTML, CSS, and JavaScript with the help of openai and gemini cause im batshit stupid, (BUT I DID DO A BIG MARGIN OF IT OK)</p><p>i might add some more stuff here some other time, but for now i hope you like it.</p><p>but this was a site i made as a replacement straw page for my friends :)</p><p>contact:</p><p>discord: im.notalex</p><p>roblox: midnightmesa</p><p>x: toomanyalexs</p><p>i hope you like the site though, im working with my other friends to get theirs setup then yall will be able to interact with it ðŸ‘…</p><p>ill update this when my friends are finished their site, currently riley is working on his and im helping nil with hers, so eventually they'll be done and temkky, hoodie and valks will be done aswell :)</p><p>ill probably add some other friends aswell :P</p><p>abc for bf ahh 😭😭❤️‍🩹</div>`,
  'Interests': `<div class="window-entry"><p>i like playing games, especially sandbox and pvp games. i also enjoy drawing and programming. i listen to music and stuff, or call people or sm</p><p>IM DEVELOPING A GAME COME BACK LATER PLS!!!</div>`,
  'DNI': `<p>if you are older than me by about ~3-5 ish years dont expect me to be super comfortable around you unless i know you (unless you're my goat retro being 34 years older than me bro!!)</p><p>but i also dont like heavy racist stuff (stupid instagram reels are ok cause I send them ((im just such a nice hypocritical guy)</p><p>also adult people in general make me uncomfortable if i dont know them (cause obviously im not 16 talking to a 25 year old brotato chip)</p><p>and im a huge g(j)ermaphobe and i hate anything like blood, mucus, etc. it just makes me a little uneasy but i wont like scream from it.</p><p>yes, even i have parameters im comfortable with, you FUCKS</p><p>aka the rodents that saw ts and was picking at me for it, you're getting FELT up tonight BUDDY.</p></div>`,
  'Journal': `<textarea id="journal-text-area" placeholder="wait i forgot this is a input area not a text area, oopsies"></textarea>`,
  'Drawings': `<p>heres some stuff i draw/drew</p><img src="15.png" alt="Drawing 1" loading="lazy" decoding="async"><img src="16.png" alt="Drawing 2" loading="lazy" decoding="async">`,
  'Games': `<p>i play these games:</p><ul><li>roblox</li><li>minecraft</li><li>terraria (sometimes)</li><li>stardew valley</li><li>ultrakill</li><li>gow:r</li><li>any multiplayer sandbox game pretty much.</li></ul><p>i don't play these games:</p><ul><li>fortnite</li><li>cod</li><li>overwatch</li><li>valorant</li><li>practically any fps game that is massively multiplayer, i dont play. maybe fort though</li></ul><p>things i frequent:</p><ul><li>roblox</li><li>discord</li></ul>`,
  'Projects': `
        <div class="projects-window">
          <p>my projects:</p>
          <div class="projects-list">
            <a class="project-card" href="https://github.com/im-notalex/Botsmyth" target="_blank" rel="noopener">
              <span class="project-title">Botsmyth</span>
              <span class="project-meta">github.com/im-notalex/Botsmyth</span>
            </a>
            <a class="project-card" href="https://github.com/im-notalex/OCreator" target="_blank" rel="noopener">
              <span class="project-title">OCreator</span>
              <span class="project-meta">github.com/im-notalex/OCreator</span>
            </a>
            <a class="project-card" href="https://github.com/im-notalex/luau-assistant" target="_blank" rel="noopener">
              <span class="project-title">luau-assistant</span>
              <span class="project-meta">github.com/im-notalex/luau-assistant</span>
            </a>
          </div>
        </div>
      `,
  'My Computer': `<p>i forgot to put something here, uh ohhhh.... (what would i put here anyways?)</p>`,
  'Recycle Bin': `<p>guys, awesome bin here, i cant wait to make a rm -rf /* joke on a windows os!</p>`,
  'Browser': `
        <div class="browser-toolbar">
            <img src="12.png" style="width: 16px; height: 16px;" loading="lazy" decoding="async" alt="">
            <button>&larr;</button>
            <button>&rarr;</button>
            <button>&#8635;</button>
            <input type="text" class="url-bar" value="https://alanisagooner.chud" readonly>
        </div>
        <div id="browser-content">
          <img src="skull.gif" alt="skull" class="browser-skull" data-action="idiot-virus" role="button" tabindex="0" loading="lazy" decoding="async">
        </div>
      `,
  'Jukebox': `
        <div id="jukebox-content">
          <div class="jukebox-song">
            <img id="song-icon" src="Music1.jpg" alt="Song artwork" loading="lazy" decoding="async">
            <div id="song-info" aria-live="polite">Loading...</div>
          </div>
          <div class="jukebox-controls">
            <button class="jukebox-nav" type="button" data-action="jukebox-prev">&laquo;</button>
            <button class="jukebox-nav" type="button" data-action="jukebox-next">&raquo;</button>
          </div>
          <div class="volume-container">
            <label for="volume">Volume</label>
            <input id="volume" type="range" min="0" max="1" step="0.01" value="0.35">
          </div>
          <div class="jukebox-progress">
            <time id="jukebox-current-time">0:00</time>
            <input id="jukebox-seek" type="range" min="0" max="0" step="0.1" value="0" disabled>
            <time id="jukebox-duration">0:00</time>
          </div>
          <div class="jukebox-options">
            <div class="option-group">
              <label class="loop-toggle" id="jukebox-loop-toggle">
                <input type="checkbox" id="jukebox-loop">
                <span>Loop track</span>
              </label>
            </div>
            <div class="option-group">
              <button type="button" class="jukebox-action-btn" id="jukebox-play">Start</button>
              <button type="button" class="jukebox-action-btn" id="jukebox-stop">Stop</button>
              <button type="button" class="jukebox-action-btn" id="lyrics-disclaimer-toggle" aria-expanded="false">Copyright notice</button>
            </div>
          </div>
          <div id="lyrics-disclaimer-panel" class="lyrics-disclaimer" hidden>
            <strong>Copyright Notice &amp; Disclaimer</strong>
            <p>This project includes references to the song &quot;Spawn!&quot; by Evan Fong (Vanoss), and possibly other copyrighted musical works.</p>
            <p>All lyrics, compositions, and recordings are the intellectual property of their respective copyright holders.</p>
            <p>No ownership of the original music, lyrics, or artwork is claimed by the project author. All referenced material is used for demonstration, educational, or fan purposes only, and no revenue is generated from its use.</p>
            <p>This repository does NOT distribute or host any copyrighted audio, nor does it seek to replace, monetize, or compete with the original work. It is hosted, however it is NOT monetized or permitted for download off this repository.</p>
            <p>If you are a rights holder and believe any portion of this project violates your rights, please contact me directly for removal or modification.</p>
            <p>&copy; Evan Fong / Vanoss &amp; respective rights holders. All rights reserved. Project maintained by im.notalex.</p>
          </div>
          <div id="lyrics-panel" data-state="loading">
            <div class="lyrics-header">
              <span>Lyrics</span>
              <span id="lyrics-status">Loading...</span>
            </div>
            <div id="lyrics-scroll">
              <ul id="lyrics-lines"></ul>
              <p class="lyrics-empty">Lyrics not available for this track.</p>
            </div>
          </div>
        </div>
      `,
  'XP Tips': `
        <div class="window-entry">
          <p>Hidden tricks for wandering XP explorers:</p>
          <ul>
            <li><strong>Ctrl&nbsp;+&nbsp;Alt&nbsp;+&nbsp;C</strong> toggles the CRT bloom overlay.</li>
            <li>Tap <strong>X &rarr; P &rarr; !</strong> to surface this secret again.</li>
            <li>Use the jukebox <em>Start</em>/<em>Stop</em> buttons to quickly audition a track without leaving the window.</li>
          </ul>
          <p>Now shoo.</p>
        </div>
      `,
  'Settings': `
        <div class="settings-window">
          <section class="settings-section">
            <h3>Sound</h3>
            <label class="settings-toggle">
              <input type="checkbox" id="settings-mute">
              <span>Mute all audio</span>
            </label>
            <label class="settings-range">
              <span>Master volume</span>
              <input id="settings-master-volume" type="range" min="0" max="1" step="0.01" value="1">
            </label>
          </section>
          <section class="settings-section">
            <h3>Display</h3>
            <label class="settings-toggle">
              <input type="checkbox" id="settings-crt">
              <span>CRT bloom overlay</span>
            </label>
            <p class="settings-note">Turn it off if the flicker is too much.</p>
          </section>
          <section class="settings-section">
            <h3>Shortcuts</h3>
            <ul class="settings-shortcuts">
              <li><strong>Ctrl + Alt + C</strong><span>Toggle CRT bloom</span></li>
              <li><strong>Ctrl + Alt + P</strong><span>Open XP Tips</span></li>
              <li><strong>F1</strong><span>Summon helper</span></li>
              <li><strong>?</strong><span>Open Settings</span></li>
              <li><strong>X -> P -> !</strong><span>Unlock XP Tips</span></li>
            </ul>
          </section>
        </div>
      `,
  'Chat': `
        <div class="chat-window">
          <p>Say hi, this is public and every message is visible!!</p>
          <iframe src="https://iframe.chat/embed?chat=boogerchat" id="chattable" class="chat-iframe" title="boogerchat live room" loading="lazy"></iframe>
          <div class="chat-status" data-state="connecting">Loading boogerchat...</div>
        </div>
      `,
  'PowerShell': `
        <div class="powershell-window">
          <div class="powershell-output" role="log" aria-live="polite"></div>
          <form class="powershell-input-row" autocomplete="off">
            <span class="powershell-prompt">PS C:\\alex&gt;</span>
            <input type="text" class="powershell-input" placeholder="Type a command" spellcheck="false">
            <button type="submit" class="powershell-submit">Run</button>
          </form>
          <p class="powershell-hint">PRESS [[F1]] FOR HELP!</p>
        </div>
      `,
  'Calculator': `
        <div class="calculator-grid" id="calculator-grid">
            <div class="calculator-display-wrapper">
                <button type="button" class="calc-screw top-left" aria-label="Unscrew top left" aria-disabled="false">&#8226;</button>
                <button type="button" class="calc-screw top-right" aria-label="Unscrew top right" aria-disabled="false">&#8226;</button>
                <button type="button" class="calc-screw bottom-left" aria-label="Unscrew bottom left" aria-disabled="false">&#8226;</button>
                <button type="button" class="calc-screw bottom-right" aria-label="Unscrew bottom right" aria-disabled="false">&#8226;</button>
                <div class="calculator-display-glass">
                    <div id="calculator-display">0</div>
                </div>
                <div class="calculator-maintenance-panel" id="calculator-secret-panel" aria-hidden="true">
                    <div class="secret-slot-row">
                        <div class="secret-slot" data-index="0"></div>
                        <div class="secret-slot" data-index="1"></div>
                        <div class="secret-slot" data-index="2"></div>
                        <div class="secret-slot" data-index="3"></div>
                        <div class="secret-slot" data-index="4"></div>
                        <div class="secret-slot" data-index="5"></div>
                    </div>
                    <div class="secret-token-tray">
                        <button type="button" class="secret-token" data-value="1">1</button>
                        <button type="button" class="secret-token" data-value="8">8</button>
                        <button type="button" class="secret-token" data-value="*">&#215;</button>
                        <button type="button" class="secret-token" data-value="/">&#247;</button>
                        <button type="button" class="secret-token" data-value="5">5</button>
                        <button type="button" class="secret-token" data-value="9">9</button>
                        <button type="button" class="secret-token" data-value=")">)</button>
                        <button type="button" class="secret-token" data-value="/">/</button>
                        <button type="button" class="secret-token" data-value="=">=</button>
                    </div>
                    <button type="button" class="secret-reset-btn">Reset order</button>
                </div>
            </div>
            <button class="calc-btn" type="button" data-value="C">C</button>
            <button class="calc-btn operator" type="button" data-value="/">&#247;</button>
            <button class="calc-btn operator" type="button" data-value="*">&#215;</button>
            <button class="calc-btn operator" type="button" data-value="-">-</button>
            <button class="calc-btn" type="button" data-value="7">7</button>
            <button class="calc-btn" type="button" data-value="8">8</button>
            <button class="calc-btn" type="button" data-value="9">9</button>
            <button class="calc-btn operator" type="button" data-value="+">+</button>
            <button class="calc-btn" type="button" data-value="4">4</button>
            <button class="calc-btn" type="button" data-value="5">5</button>
            <button class="calc-btn" type="button" data-value="6">6</button>
            <button class="calc-btn equals" type="button" data-value="=">=</button>
            <button class="calc-btn" type="button" data-value="1">1</button>
            <button class="calc-btn" type="button" data-value="2">2</button>
            <button class="calc-btn" type="button" data-value="3">3</button>
            <button class="calc-btn" type="button" data-value="0">0</button>
            <button class="calc-btn" type="button" data-value=".">.</button>
        </div>
      `,

  'Minesweeper': `
        <div class="minesweeper-wrapper">
          <div class="minesweeper-top">
            <div class="minesweeper-counter" id="minesweeper-mine-counter">000</div>
            <button class="minesweeper-reset" id="minesweeper-reset-button" type="button" data-action="minesweeper-reset" data-face="neutral" data-face-glyph=":)" title="Reset game" aria-label="Reset game">:)</button>
            <div class="minesweeper-counter" id="minesweeper-timer">000</div>
          </div>
          <div class="minesweeper-grid" id="minesweeper-grid"></div>
        </div>
      `
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 1000);
  startMenu.classList.add('hidden');
  setCompactMode();
  applySfxVolume();
  applySongVolume(true);
  setupDesktopIcons();
  setupStartMenuEntries();
  setupTaskbarControls();
  setupClockControls();
  setupGlobalActionHandlers();

  // Start the random notification loop
  setTimeout(showRandomEasterEgg, 5000);
});

// --- Login & Shutdown logic ---
function attemptLogin() {
  loginWelcome.style.opacity = '0';
  if (loginHint) {
    loginHint.classList.add('visible');
    loginHint.setAttribute('aria-hidden', 'false');
  }
  if (loginWarning) {
    loginWarning.classList.add('visible');
    loginWarning.setAttribute('aria-hidden', 'false');
  }
  if (startupSound) {
    startupSound.play().catch(e => console.error("Startup sound failed:", e));
  }
  setTimeout(() => {
    loginScreen.classList.add('hidden');
    desktop.classList.add('visible');
    const { x, y } = getJukeboxOpenPosition();
    openWindow('Jukebox', 10, x, y);
    if (loginHint) {
      loginHint.classList.remove('visible');
      loginHint.setAttribute('aria-hidden', 'true');
    }
    if (loginWarning) {
      loginWarning.classList.remove('visible');
      loginWarning.setAttribute('aria-hidden', 'true');
    }
  }, 4500);
}

function shutdownSequence() {
  loginScreen.style.opacity = '0';
  shutdownScreen.style.display = 'flex';
  if (shutdownSound) {
    shutdownSound.play().catch(e => console.error("Shutdown sound failed:", e));
  }
  setTimeout(() => {
    window.location.href = 'https://im-notalex.github.io/boogerboys.github.io/';
  }, 5000);
}

function logOff() {
  window.location.reload();
}

// --- Taskbar & Start Menu logic ---
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  clock.textContent = `${time} ${date}`;
}

// UPDATED: Calendar logic
function toggleCalendar() {
  calendarPopup.classList.toggle('visible');
  if (calendarPopup.classList.contains('visible')) {
    renderCalendar();
  }
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const monthName = currentCalendarDate.toLocaleString('en-US', { month: 'long' });

  calendarTitle.textContent = `${monthName} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.appendChild(document.createElement('div'));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.textContent = i;
    if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
      dayEl.style.fontWeight = 'bold';
      dayEl.style.backgroundColor = '#d7e0f3';
    }
    calendarGrid.appendChild(dayEl);
  }
}

function changeMonth(delta) {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
  renderCalendar();
}

function toggleStartMenu() {
  startMenu.classList.toggle('hidden');
}

function playClickSound() {
  if (!clickSound) return;
  clickSound.play().catch(() => { });
}

function isCompactViewport() {
  if (window.matchMedia) {
    return window.matchMedia('(max-width: 720px)').matches || window.matchMedia('(max-height: 560px)').matches;
  }
  return (window.innerWidth || 0) <= 720 || (window.innerHeight || 0) <= 560;
}

function setCompactMode() {
  const compact = isCompactViewport();
  document.body.classList.toggle('compact', compact);
  return compact;
}

function getJukeboxOpenPosition() {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 360;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 640;
  const compactViewport = isCompactViewport();
  const jukeboxWidth = compactViewport
    ? Math.max(240, viewportWidth - 12)
    : Math.max(240, Math.min(360, viewportWidth - 24));
  const startX = Math.max(12, Math.round((viewportWidth - jukeboxWidth) / 2));
  const estimatedHeight = compactViewport ? 460 : 340;
  const maxTop = Math.max(32, viewportHeight - estimatedHeight - 16);
  const preferredTop = viewportHeight * 0.22;
  const startY = Math.max(32, Math.min(maxTop, preferredTop));
  return { x: startX, y: startY };
}

function openWindowFromStartMenu(entry) {
  if (!entry) return;
  const title = entry.dataset.window;
  const icon = entry.dataset.icon;
  if (!title || !icon) return;
  if (entry.dataset.position === 'jukebox') {
    const { x, y } = getJukeboxOpenPosition();
    openWindow(title, icon, x, y);
  } else {
    openWindow(title, icon);
  }
  toggleStartMenu();
  playClickSound();
}

function setupStartMenuEntries() {
  const entries = document.querySelectorAll('.start-menu-entry');
  entries.forEach(entry => {
    entry.setAttribute('role', 'button');
    entry.tabIndex = 0;
    entry.addEventListener('click', () => openWindowFromStartMenu(entry));
    entry.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openWindowFromStartMenu(entry);
      }
    });
  });
}

function setupTaskbarControls() {
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      toggleStartMenu();
      playClickSound();
    });
  }

  const logoffBtn = document.getElementById('logoff-btn');
  if (logoffBtn) {
    logoffBtn.addEventListener('click', () => {
      logOff();
      playClickSound();
    });
  }

  const shutdownBtn = document.getElementById('shutdown-btn');
  if (shutdownBtn) {
    shutdownBtn.addEventListener('click', () => {
      shutdownSequence();
      playClickSound();
    });
  }
}

function setupClockControls() {
  if (!clock) return;
  clock.setAttribute('role', 'button');
  clock.setAttribute('aria-label', 'Toggle calendar');
  clock.tabIndex = 0;
  clock.addEventListener('click', toggleCalendar);
  clock.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleCalendar();
    }
  });
}

function setupGlobalActionHandlers() {
  document.addEventListener('click', handleActionClick);
  document.addEventListener('keydown', handleActionKeydown);
}

function handleActionClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'login') {
    attemptLogin();
    playClickSound();
    return;
  }
  if (action === 'shutdown') {
    shutdownSequence();
    playClickSound();
    return;
  }
  if (action === 'calendar-prev') {
    changeMonth(-1);
    playClickSound();
    return;
  }
  if (action === 'calendar-next') {
    changeMonth(1);
    playClickSound();
    return;
  }
  if (action === 'window-minimize') {
    const win = target.closest('.xp-window');
    if (win) {
      minimizeWindow(win);
      playClickSound();
    }
    return;
  }
  if (action === 'window-close') {
    const win = target.closest('.xp-window');
    if (win) {
      closeWindow(win);
      playClickSound();
    }
    return;
  }
  if (action === 'jukebox-prev') {
    prevSong();
    playClickSound();
    return;
  }
  if (action === 'jukebox-next') {
    nextSong();
    playClickSound();
    return;
  }
  if (action === 'minesweeper-reset') {
    resetMinesweeper();
    playClickSound();
    return;
  }
  if (action === 'idiot-virus') {
    triggerIdiotVirus();
    return;
  }
}

function handleActionKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target.closest('[data-action]');
  if (!target) return;
  if (target.tagName === 'BUTTON') return;
  event.preventDefault();
  target.click();
}

// --- Notification Logic ---
function announceDesktopMessage(message) {
  const notificationArea = document.getElementById('notification-area');
  if (!notificationArea) return;
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `<img src="11.png" alt="Notification"><p>${message}</p>`;
  notificationArea.appendChild(notification);

  if (notificationSound) {
    notificationSound.play().catch(() => { });
  }

  // Remove after 5 seconds with a fade-out
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

function showEasterEgg() {
  const randomMessage = easterEggs[Math.floor(Math.random() * easterEggs.length)];
  announceDesktopMessage(randomMessage);
}

function setCRTEnabled(enabled, silent = false) {
  crtEnabled = enabled;
  if (crtOverlay) {
    crtOverlay.style.display = enabled ? 'block' : 'none';
  }
  document.body.classList.toggle('crt-disabled', !enabled);
  if (!silent) {
    announceDesktopMessage(enabled ? 'CRT bloom enabled.' : 'CRT bloom disabled.');
  }
  syncSettingsUI();
}

function toggleCRT(force) {
  const targetState = typeof force === 'boolean' ? force : !crtEnabled;
  setCRTEnabled(targetState);
}

setCRTEnabled(!prefersReducedMotion.matches, true);
prefersReducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    setCRTEnabled(false);
  }
});

function constrainWindowToViewport(win) {
  if (!win) return;
  const rect = win.getBoundingClientRect();
  const desiredLeft = parseFloat(win.style.left) || rect.left;
  const desiredTop = parseFloat(win.style.top) || rect.top;
  const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
  const maxTop = Math.max(32, window.innerHeight - rect.height - 16);
  const clampedLeft = Math.min(Math.max(desiredLeft, 8), maxLeft);
  const clampedTop = Math.min(Math.max(desiredTop, 32), maxTop);
  win.style.left = `${clampedLeft}px`;
  win.style.top = `${clampedTop}px`;
}

function handleViewportResize() {
  const compact = setCompactMode();
  if (compact) return;
  Object.values(openWindows).forEach(win => {
    if (!win) return;
    constrainWindowToViewport(win);
  });
}

window.addEventListener('resize', handleViewportResize);

function getSongVolumeMultiplier(song) {
  if (!song) return 1;
  return typeof song.volumeMultiplier === 'number' ? song.volumeMultiplier : 1;
}

function applySongVolume(updateSlider = false) {
  const actualVolume = Math.max(0, Math.min(1, jukeboxBaseVolume * currentSongVolumeMultiplier * masterVolume));
  jukeboxAudio.volume = actualVolume;
  jukeboxAudio.muted = isMuted;
  if (!updateSlider) return;
  const controls = getJukeboxControls();
  if (controls && controls.volume && document.activeElement !== controls.volume) {
    controls.volume.value = jukeboxBaseVolume;
  }
}

function applyAudioToElement(audio, baseVolume) {
  if (!audio) return;
  const volume = Math.max(0, Math.min(1, baseVolume * masterVolume));
  audio.volume = volume;
  audio.muted = isMuted;
}

function applySfxVolume() {
  applyAudioToElement(startupSound, sfxBaseVolume);
  applyAudioToElement(shutdownSound, sfxBaseVolume);
  applyAudioToElement(clickSound, sfxBaseVolume);
  applyAudioToElement(notificationSound, sfxBaseVolume);
  dynamicAudio.forEach((audio) => {
    const base = typeof audio._baseVolume === 'number' ? audio._baseVolume : sfxBaseVolume;
    applyAudioToElement(audio, base);
  });
}

function registerDynamicAudio(audio, baseVolume = sfxBaseVolume) {
  if (!audio) return;
  audio._baseVolume = baseVolume;
  dynamicAudio.add(audio);
  applyAudioToElement(audio, baseVolume);
}

function setMasterVolume(value) {
  if (!Number.isFinite(value)) return;
  masterVolume = Math.max(0, Math.min(1, value));
  applySfxVolume();
  applySongVolume(true);
  syncSettingsUI();
}

function setMuted(muted) {
  isMuted = !!muted;
  applySfxVolume();
  applySongVolume(true);
  syncSettingsUI();
}

function showRandomEasterEgg() {
  showEasterEgg();
  const randomInterval = Math.random() * (120000 - 30000) + 30000;
  setTimeout(showRandomEasterEgg, randomInterval);
}

function initializeChatStylesheet(retry = 0) {
  if (window.chattable && typeof window.chattable.initialize === 'function') {
    window.chattable.initialize({
      stylesheet: '/alex/chattables/chattable.css'
    });
    chatEmbedInitialized = true;
    return true;
  }
  if (chatEmbedInitialized) {
    return true;
  }
  if (retry < 8) {
    setTimeout(() => initializeChatStylesheet(retry + 1), 500);
  }
  return false;
}

function setupChatWindow(win) {
  if (!win) return;
  const iframe = win.querySelector('#chattable');
  const status = win.querySelector('.chat-status');
  if (status) {
    status.dataset.state = 'connecting';
    status.textContent = 'Connecting to boogerchat...';
  }
  if (!iframe) {
    initializeChatStylesheet();
    return;
  }

  const markReady = () => {
    if (status) {
      status.dataset.state = 'ready';
      status.textContent = 'Connected. Be nice!';
    }
  };

  const handleLoad = () => {
    markReady();
    iframe.removeEventListener('load', handleLoad);
    iframe.removeEventListener('error', handleError);
  };

  const handleError = () => {
    if (status) {
      status.dataset.state = 'error';
      status.textContent = 'Could not reach boogerchat.';
    }
    iframe.removeEventListener('load', handleLoad);
    iframe.removeEventListener('error', handleError);
  };

  iframe.addEventListener('load', handleLoad);
  iframe.addEventListener('error', handleError);

  initializeChatStylesheet();
}

function appendPowerShellLine(output, text, type = 'system') {
  if (!output) return;
  const line = document.createElement('div');
  line.className = `ps-line ps-line-${type}`;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function handlePowerShellCommand(command, output) {
  if (!output) return;
  const trimmed = command.trim();
  if (!trimmed) return;
  const upper = trimmed.toUpperCase();

  if (upper === 'HELP') {
    appendPowerShellLine(output, 'Available easter commands:', 'system');
    Object.keys(powerShellEasterEggs).forEach(key => appendPowerShellLine(output, ` - ${key}`, 'system'));
    appendPowerShellLine(output, 'Extra: CLS clears the screen.', 'system');
    return;
  }

  if (upper === 'CLS') {
    output.innerHTML = '';
    appendPowerShellLine(output, 'Console cleared.', 'system');
    return;
  }

  const egg = powerShellEasterEggs[upper];
  if (egg) {
    appendPowerShellLine(output, egg.message, 'system');
    setTimeout(() => {
      window.location.href = egg.url;
    }, 900);
    return;
  }

  appendPowerShellLine(output, `"${trimmed}" is not recognized. Type HELP for available commands.`, 'error');
}

function setupPowerShellWindow(win) {
  if (!win || win.dataset.psReady === 'true') return;
  const output = win.querySelector('.powershell-output');
  const form = win.querySelector('.powershell-input-row');
  const input = win.querySelector('.powershell-input');
  if (!output || !form || !input) return;

  const submitCommand = (event) => {
    if (event) event.preventDefault();
    const rawValue = input.value.trim();
    if (!rawValue) return;
    appendPowerShellLine(output, `PS C:\\alex>${rawValue}`, 'command');
    powerShellHistory.push(rawValue);
    handlePowerShellCommand(rawValue, output);
    input.value = '';
    input.focus();
  };

  form.addEventListener('submit', submitCommand);
  const submitBtn = form.querySelector('.powershell-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitCommand);
  }

  appendPowerShellLine(output, 'Windows PowerShell 1.2', 'system');
  appendPowerShellLine(output, 'Type HELP for help.', 'system');
  win.dataset.psReady = 'true';
  setTimeout(() => input.focus(), 50);
}

function syncSettingsUI() {
  const settingsWin = openWindows['Settings'];
  if (!settingsWin) return;
  const muteToggle = settingsWin.querySelector('#settings-mute');
  const masterSlider = settingsWin.querySelector('#settings-master-volume');
  const crtToggle = settingsWin.querySelector('#settings-crt');
  if (muteToggle) muteToggle.checked = isMuted;
  if (masterSlider && document.activeElement !== masterSlider) {
    masterSlider.value = masterVolume;
  }
  if (crtToggle) crtToggle.checked = crtEnabled;
}

function setupSettingsWindow(win) {
  if (!win || win.dataset.settingsReady === 'true') return;
  const muteToggle = win.querySelector('#settings-mute');
  const masterSlider = win.querySelector('#settings-master-volume');
  const crtToggle = win.querySelector('#settings-crt');

  if (muteToggle) {
    muteToggle.addEventListener('change', () => setMuted(muteToggle.checked));
  }
  if (masterSlider) {
    masterSlider.addEventListener('input', () => {
      const nextValue = parseFloat(masterSlider.value);
      setMasterVolume(nextValue);
    });
  }
  if (crtToggle) {
    crtToggle.addEventListener('change', () => toggleCRT(crtToggle.checked));
  }

  win.dataset.settingsReady = 'true';
  syncSettingsUI();
}

function applyWindowMediaHints(win) {
  if (!win) return;
  const images = win.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
  const frames = win.querySelectorAll('iframe');
  frames.forEach(frame => {
    if (!frame.hasAttribute('loading')) frame.setAttribute('loading', 'lazy');
  });
}

// --- Window logic ---
function openWindow(title, iconNumber, initialX = 50, initialY = 50) {
  if (openWindows[title]) {
    const existing = openWindows[title];
    existing.style.display = 'block';
    bringToFront(existing);
    return;
  }

  zIndexCounter++;
  const win = document.createElement('div');
  win.className = 'xp-window active-window';
  if (!document.body.classList.contains('compact')) {
    win.style.left = `${initialX}px`;
    win.style.top = `${initialY}px`;
  }
  win.style.zIndex = zIndexCounter;
  win.id = `window-${title.replace(/\s/g, '-')}`;

  const taskbarIcon = document.createElement('button');
  taskbarIcon.className = 'taskbar-app-icon active';
  taskbarIcon.type = 'button';
  taskbarIcon.innerHTML = `<img src="${iconNumber}.png" style="width: 16px; height: 16px;"><span>${title}</span>`;
  taskbarIcon.addEventListener('click', () => {
    if (win.style.display === 'none') {
      win.style.display = 'block';
      bringToFront(win);
    } else if (win.style.zIndex != zIndexCounter) {
      bringToFront(win);
    } else {
      win.style.display = 'none';
      taskbarIcon.classList.remove('active');
    }
  });
  taskbarApps.appendChild(taskbarIcon);
  win.taskbarIcon = taskbarIcon;

  const windowHtml = `
        <div class="window-titlebar">
          <span>${title}</span>
          <div class="window-buttons">
            <button class="window-button" type="button" data-action="window-minimize">
              <img src="minimize.png">
            </button>
            <button class="window-button close" type="button" data-action="window-close">
              <img src="close.png">
            </button>
          </div>
        </div>
        <div class="window-content">
          ${windowContent[title] || `<p>Content for ${title} is missing.</p>`}
        </div>
      `;
  win.innerHTML = windowHtml;
  applyWindowMediaHints(win);
  desktop.appendChild(win);
  openWindows[title] = win;
  bringToFront(win);
  if (!document.body.classList.contains('compact')) {
    constrainWindowToViewport(win);
  }

  win.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.window-content') || e.target.closest('.window-titlebar')) {
      bringToFront(win);
    }
  });

  if (title === 'Jukebox') {
    setupJukeboxWindow(win);
    playSong(Math.floor(Math.random() * songs.length), { notifyOnBlock: true });
  } else if (title === 'Minesweeper') {
    initializeMinesweeper();
  } else if (title === 'Chat') {
    setupChatWindow(win);
  } else if (title === 'PowerShell') {
    setupPowerShellWindow(win);
  } else if (title === 'Calculator') {
    setupCalculatorWindow(win);
  } else if (title === 'Settings') {
    setupSettingsWindow(win);
  }
}

function closeWindow(win) {
  const title = win.id.replace('window-', '').replace(/-/g, ' ');
  win.classList.add('closed');
  win.classList.remove('active-window');
  if (win.taskbarIcon) win.taskbarIcon.remove();
  delete openWindows[title];

  if (title === 'Jukebox') {
    stopCurrentTrack(true);
    resetLyricsUI();
    lyricsState.ui = null;
    jukeboxControls.elements = null;
    jukeboxControls.isSeeking = false;
  } else if (title === 'Minesweeper') {
    stopMinesweeperTimer();
  }

  setTimeout(() => {
    if (win.parentNode) win.parentNode.removeChild(win);
  }, 300);
}

function minimizeWindow(win) {
  win.style.display = 'none';
  win.classList.remove('active-window');
  if (win.taskbarIcon) win.taskbarIcon.classList.remove('active');
}

function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
  Object.values(openWindows).forEach(w => {
    if (!w) return;
    w.classList.remove('active-window');
    if (w.taskbarIcon) w.taskbarIcon.classList.remove('active');
  });
  win.classList.add('active-window');
  if (win.taskbarIcon) win.taskbarIcon.classList.add('active');
}

// --- Window Drag logic ---
let activeWindow = null;
let offsetX, offsetY;

function dragStart(e, win) {
  if (document.body.classList.contains('compact')) return;
  if (e.target.closest('.window-titlebar')) {
    activeWindow = win;
    bringToFront(activeWindow);
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    dragPreview.style.display = 'block';
    dragPreview.style.width = win.offsetWidth + 'px';
    dragPreview.style.height = win.offsetHeight + 'px';
    dragPreview.style.left = win.offsetLeft + 'px';
    dragPreview.style.top = win.offsetTop + 'px';

    activeWindow.style.opacity = '0.5';
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  }
}

function drag(e) {
  if (activeWindow) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    dragPreview.style.left = newX + 'px';
    dragPreview.style.top = newY + 'px';
  }
}

function dragEnd() {
  if (activeWindow) {
    const newX = parseInt(dragPreview.style.left, 10);
    const newY = parseInt(dragPreview.style.top, 10);

    activeWindow.style.left = newX + 'px';
    activeWindow.style.top = newY + 'px';
    activeWindow.style.opacity = '1';
    constrainWindowToViewport(activeWindow);

    dragPreview.style.display = 'none';
    activeWindow = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  }
}

// --- Desktop Icon Drag Logic ---
let activeIcon = null;

function openWindowFromIcon(icon) {
  if (!icon) return;
  const title = icon.dataset.title;
  const explicitIcon = icon.dataset.icon;
  const iconImage = icon.querySelector('img');
  const iconSrc = iconImage ? iconImage.getAttribute('src') : null;
  const iconNumber = explicitIcon || (iconSrc ? iconSrc.split('/').pop().replace('.png', '') : null);
  if (!title || !iconNumber) return;
  openWindow(title, iconNumber);
  playClickSound();
}

function setupDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');
  icons.forEach(icon => {
    icon.setAttribute('role', 'button');
    icon.setAttribute('aria-label', icon.dataset.title || 'Desktop icon');
    icon.tabIndex = 0;
    icon.addEventListener('mousedown', (e) => {
      if (document.body.classList.contains('compact')) return;
      activeIcon = icon;
      offsetX = e.clientX - icon.offsetLeft;
      offsetY = e.clientY - icon.offsetTop;
      document.addEventListener('mousemove', dragIcon);
      document.addEventListener('mouseup', stopDragIcon);
      e.preventDefault();
    });
    icon.addEventListener('dblclick', () => {
      openWindowFromIcon(icon);
    });
    icon.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openWindowFromIcon(icon);
      }
    });
  });
}

function dragIcon(e) {
  if (activeIcon) {
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    x = Math.max(0, Math.min(x, desktop.clientWidth - activeIcon.clientWidth));
    y = Math.max(0, Math.min(y, desktop.clientHeight - activeIcon.clientHeight - 28));

    activeIcon.style.left = x + 'px';
    activeIcon.style.top = y + 'px';
  }
}

function stopDragIcon() {
  activeIcon = null;
  document.removeEventListener('mousemove', dragIcon);
  document.removeEventListener('mouseup', stopDragIcon);
}

// --- Jukebox Logic ---
jukeboxAudio.addEventListener("ended", nextSong);
jukeboxAudio.addEventListener("timeupdate", () => {
  syncLyricsToTime(jukeboxAudio.currentTime);
  updatePlaybackTimeUI();
});
jukeboxAudio.addEventListener("seeked", () => {
  syncLyricsToTime(jukeboxAudio.currentTime);
  updatePlaybackTimeUI(true);
});
jukeboxAudio.addEventListener("loadedmetadata", handleAudioMetadata);
jukeboxAudio.addEventListener("durationchange", () => updatePlaybackTimeUI(true));
jukeboxAudio.addEventListener("play", () => {
  awaitingAudioUnlock = false;
  autoplayNoticeShown = false;
});

function attemptJukeboxPlayback(options = {}) {
  const notifyOnBlock = !!options.notifyOnBlock;
  const playAttempt = jukeboxAudio.play();
  if (!playAttempt || typeof playAttempt.catch !== 'function') {
    return;
  }
  playAttempt.then(() => {
    awaitingAudioUnlock = false;
  }).catch((error) => {
    if (notifyOnBlock && isAutoplayBlock(error)) {
      handleAutoplayBlock();
    } else {
      console.error("Audio playback failed:", error);
    }
  });
}

function isAutoplayBlock(error) {
  if (!error) return false;
  return error.name === 'NotAllowedError' || error.name === 'SecurityError' || error.name === 'NotSupportedError';
}

function handleAutoplayBlock() {
  if (!autoplayNoticeShown) {
    announceDesktopMessage('Browser blocked the jukebox autoplay. Press Start in the jukebox window to enable sound.');
    autoplayNoticeShown = true;
  }
  armAudioUnlock();
}

function armAudioUnlock() {
  if (awaitingAudioUnlock) return;
  awaitingAudioUnlock = true;
  const unlock = () => {
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
    awaitingAudioUnlock = false;
    attemptJukeboxPlayback({ notifyOnBlock: false });
  };
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
}

function playSong(index, options = {}) {
  currentSongIndex = index;
  const song = songs[index];
  jukeboxAudio.src = song.file;
  attemptJukeboxPlayback({ notifyOnBlock: !!options.notifyOnBlock });

  const songInfoEl = document.getElementById("song-info");
  const songIconEl = document.getElementById("song-icon");

  if (songInfoEl) songInfoEl.textContent = song.credit;
  if (songIconEl) {
    songIconEl.src = song.icon || 'Music1.jpg';
    songIconEl.alt = `Artwork for ${song.credit}`;
  }

  currentSongVolumeMultiplier = getSongVolumeMultiplier(song);
  applySongVolume(true);

  jukeboxControls.isSeeking = false;
  updatePlaybackTimeUI(true);
  const controls = getJukeboxControls();
  if (controls) {
    if (controls.seek) {
      controls.seek.disabled = !Number.isFinite(jukeboxAudio.duration);
      controls.seek.value = 0;
    }
    if (controls.loopToggle) {
      controls.loopToggle.checked = jukeboxAudio.loop;
      setLoopIndicator(jukeboxAudio.loop);
    }
    if (controls.volume && document.activeElement !== controls.volume) {
      controls.volume.value = jukeboxBaseVolume;
    }
  }

  updateLyricsForSong(song);
}

function nextSong() {
  let next = (currentSongIndex + 1) % songs.length;
  playSong(next);
}

function prevSong() {
  let prev = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prev);
}

function getLyricsUI() {
  if (lyricsState.ui && document.body.contains(lyricsState.ui.panel)) {
    return lyricsState.ui;
  }
  const panel = document.getElementById('lyrics-panel');
  if (!panel) {
    lyricsState.ui = null;
    return null;
  }
  lyricsState.ui = {
    panel,
    status: document.getElementById('lyrics-status'),
    list: document.getElementById('lyrics-lines'),
    scroll: document.getElementById('lyrics-scroll')
  };
  return lyricsState.ui;
}

function resetLyricsUI() {
  lyricsState.cues = [];
  lyricsState.currentIndex = -1;
  lyricsState.pending = null;
  lyricsState.songFile = null;
  closeDisclaimerPanel();
  const ui = getLyricsUI();
  if (!ui) {
    lyricsState.ui = null;
    return;
  }
  if (ui.list) {
    ui.list.innerHTML = '';
  }
  ui.panel.dataset.state = 'loading';
  ui.panel.dataset.mode = 'compact';
  if (ui.status) {
    ui.status.textContent = 'Lyrics will appear when a compatible song plays.';
  }
}

function getJukeboxControls(forceRefresh = false) {
  if (!forceRefresh && jukeboxControls.elements && jukeboxControls.elements.seek && document.body.contains(jukeboxControls.elements.seek)) {
    return jukeboxControls.elements;
  }

  const seek = document.getElementById('jukebox-seek');
  if (!seek) {
    jukeboxControls.elements = null;
    return null;
  }

  jukeboxControls.elements = {
    seek,
    current: document.getElementById('jukebox-current-time'),
    duration: document.getElementById('jukebox-duration'),
    loopToggle: document.getElementById('jukebox-loop'),
    loopLabel: document.getElementById('jukebox-loop-toggle'),
    volume: document.getElementById('volume')
  };
  return jukeboxControls.elements;
}

function setLoopIndicator(isOn) {
  const controls = getJukeboxControls();
  if (!controls || !controls.loopLabel) return;
  controls.loopLabel.classList.toggle('active', !!isOn);
}

function getDisclaimerElements() {
  return {
    panel: document.getElementById('lyrics-disclaimer-panel'),
    button: document.getElementById('lyrics-disclaimer-toggle')
  };
}

function toggleDisclaimerPanel(forceShow) {
  const { panel, button } = getDisclaimerElements();
  if (!panel || !button) return;
  const currentlyHidden = panel.hasAttribute('hidden');
  const shouldShow = typeof forceShow === 'boolean' ? forceShow : currentlyHidden;
  if (typeof forceShow === 'undefined') {
    playClickSound();
  }
  if (shouldShow) {
    panel.removeAttribute('hidden');
  } else {
    panel.setAttribute('hidden', '');
  }
  button.setAttribute('aria-expanded', shouldShow ? 'true' : 'false');
  button.textContent = shouldShow ? 'Hide notice' : 'Copyright notice';
}

function closeDisclaimerPanel() {
  const { panel, button } = getDisclaimerElements();
  if (!panel || !button) return;
  panel.setAttribute('hidden', '');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Copyright notice';
}

function stopCurrentTrack(resetPosition = false) {
  jukeboxAudio.pause();
  jukeboxControls.isSeeking = false;
  if (resetPosition) {
    jukeboxAudio.currentTime = 0;
    syncLyricsToTime(0);
    updatePlaybackTimeUI(true);
    closeDisclaimerPanel();
  } else {
    syncLyricsToTime(jukeboxAudio.currentTime);
    updatePlaybackTimeUI();
  }
  applySongVolume(true);
}

function setupJukeboxWindow(win) {
  const controls = getJukeboxControls(true);
  if (!controls) return;
  jukeboxControls.isSeeking = false;

  if (controls.volume) {
    controls.volume.value = jukeboxBaseVolume;
    controls.volume.addEventListener('input', () => {
      const nextValue = parseFloat(controls.volume.value);
      if (Number.isFinite(nextValue)) {
        jukeboxBaseVolume = Math.max(0, Math.min(1, nextValue));
        applySongVolume();
      }
    });
    applySongVolume(true);
  }

  const playBtn = document.getElementById('jukebox-play');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      playClickSound();
      attemptJukeboxPlayback();
    });
  }

  const stopBtn = document.getElementById('jukebox-stop');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      playClickSound();
      stopCurrentTrack(false);
    });
  }

  const disclaimerBtn = document.getElementById('lyrics-disclaimer-toggle');
  if (disclaimerBtn) {
    disclaimerBtn.addEventListener('click', () => toggleDisclaimerPanel());
  }
  closeDisclaimerPanel();

  const seek = controls.seek;
  if (seek) {
    seek.min = 0;
    seek.value = jukeboxAudio.currentTime || 0;
    seek.disabled = !Number.isFinite(jukeboxAudio.duration);
    seek.addEventListener('input', handleSeekInput);
    seek.addEventListener('change', commitSeek);
    ['pointerdown', 'mousedown', 'touchstart'].forEach(evt => {
      seek.addEventListener(evt, () => { jukeboxControls.isSeeking = true; });
    });
    ['pointerup', 'mouseup', 'touchend', 'touchcancel', 'pointercancel'].forEach(evt => {
      seek.addEventListener(evt, commitSeek);
    });
  }

  if (controls.loopToggle) {
    controls.loopToggle.checked = jukeboxAudio.loop;
    jukeboxAudio.loop = controls.loopToggle.checked;
    controls.loopToggle.addEventListener('change', () => {
      jukeboxAudio.loop = controls.loopToggle.checked;
      setLoopIndicator(controls.loopToggle.checked);
    });
    setLoopIndicator(controls.loopToggle.checked);
  }

  updatePlaybackTimeUI(true);
}

function handleSeekInput() {
  const controls = getJukeboxControls();
  if (!controls || !controls.seek) return;
  const value = parseFloat(controls.seek.value);
  if (!Number.isFinite(value)) return;
  jukeboxControls.isSeeking = true;
  if (controls.current) {
    controls.current.textContent = formatTime(value);
  }
  if (Number.isFinite(jukeboxAudio.duration) && jukeboxAudio.duration > 0) {
    jukeboxAudio.currentTime = Math.min(Math.max(value, 0), jukeboxAudio.duration);
    syncLyricsToTime(jukeboxAudio.currentTime);
  }
}

function commitSeek() {
  const controls = getJukeboxControls();
  if (!controls || !controls.seek) {
    jukeboxControls.isSeeking = false;
    return;
  }
  const value = parseFloat(controls.seek.value);
  if (Number.isFinite(value)) {
    const duration = Number.isFinite(jukeboxAudio.duration) && jukeboxAudio.duration > 0 ? jukeboxAudio.duration : value;
    const clamped = Math.min(Math.max(value, 0), duration);
    jukeboxAudio.currentTime = clamped;
    syncLyricsToTime(clamped);
  }
  jukeboxControls.isSeeking = false;
  updatePlaybackTimeUI(true);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updatePlaybackTimeUI(force = false) {
  const controls = getJukeboxControls();
  if (!controls) return;
  const duration = Number.isFinite(jukeboxAudio.duration) && jukeboxAudio.duration > 0 ? jukeboxAudio.duration : 0;
  const current = Number.isFinite(jukeboxAudio.currentTime) && jukeboxAudio.currentTime > 0 ? jukeboxAudio.currentTime : 0;

  if (controls.duration) {
    controls.duration.textContent = duration ? formatTime(duration) : '--:--';
  }

  if (controls.seek) {
    controls.seek.min = 0;
    if (duration > 0) {
      controls.seek.disabled = false;
      controls.seek.max = duration;
      controls.seek.step = Math.max(duration / 1200, 0.05);
      if (!jukeboxControls.isSeeking || force) {
        controls.seek.value = current;
      }
    } else {
      controls.seek.disabled = true;
      controls.seek.value = 0;
    }
  }

  if (controls.current && (!jukeboxControls.isSeeking || force)) {
    controls.current.textContent = formatTime(current);
  }
}

function updateLyricsForSong(song) {
  const ui = getLyricsUI();
  lyricsState.songFile = song.file;
  lyricsState.cues = [];
  lyricsState.pending = null;
  setActiveLyricsIndex(-1);
  if (!ui) {
    return;
  }
  closeDisclaimerPanel();
  ui.panel.dataset.mode = 'full';
  if (ui.list) {
    ui.list.innerHTML = '';
  }
  if (!song.lyricsId || !lyricsLibrary[song.lyricsId]) {
    ui.panel.dataset.state = 'empty';
    ui.panel.dataset.mode = 'compact';
    if (ui.status) {
      ui.status.textContent = 'Lyrics unavailable for this track.';
    }
    lyricsState.pending = null;
    return;
  }
  const entry = lyricsLibrary[song.lyricsId];
  const duration = Number.isFinite(jukeboxAudio.duration) ? jukeboxAudio.duration : 0;
  const needsDuration = entry.cues.some(cue => typeof cue.fraction === 'number');

  ui.panel.dataset.state = 'loading';
  if (ui.status) {
    ui.status.textContent = 'Syncing lyrics...';
  }

  if (needsDuration && duration <= 0) {
    lyricsState.pending = { entry, songFile: song.file };
    ui.panel.dataset.mode = entry.cues.length <= 4 ? 'compact' : 'full';
    return;
  }

  renderLyrics(entry, duration);
  lyricsState.pending = null;
}

function renderLyrics(entry, duration) {
  const ui = getLyricsUI();
  if (!ui || !ui.list) return;
  ui.list.innerHTML = '';
  lyricsState.cues = [];
  lyricsState.currentIndex = -1;

  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const upperClamp = safeDuration > 0 ? Math.max(safeDuration - 0.2, safeDuration * 0.95) : 0;

  entry.cues.forEach(item => {
    if (item.section) {
      const sectionEl = document.createElement('li');
      sectionEl.className = 'lyrics-line';
      sectionEl.dataset.section = 'true';
      sectionEl.textContent = item.section;
      ui.list.appendChild(sectionEl);
      return;
    }

    const lineEl = document.createElement('li');
    lineEl.className = 'lyrics-line';
    if (item.muted) {
      lineEl.dataset.muted = 'true';
    }
    lineEl.textContent = item.text;

    let cueTime = 0;
    if (typeof item.time === 'number') {
      cueTime = item.time;
    } else if (typeof item.fraction === 'number' && safeDuration > 0) {
      cueTime = item.fraction * safeDuration;
    }

    if (safeDuration > 0) {
      cueTime = Math.min(Math.max(cueTime, 0), upperClamp);
    } else {
      cueTime = Math.max(cueTime, 0);
    }

    lineEl.dataset.time = cueTime.toFixed(3);
    lyricsState.cues.push({ time: cueTime, element: lineEl });
    ui.list.appendChild(lineEl);
  });

  if (lyricsState.cues.length) {
    lyricsState.cues.sort((a, b) => a.time - b.time);
    ui.panel.dataset.state = 'ready';
    ui.panel.dataset.mode = lyricsState.cues.length <= 4 ? 'compact' : 'full';
  } else {
    ui.panel.dataset.state = 'empty';
    ui.panel.dataset.mode = 'compact';
  }

  if (ui.status) {
    ui.status.textContent = entry.note || 'Synced lyrics';
  }

  syncLyricsToTime(jukeboxAudio.currentTime);
}

function handleAudioMetadata() {
  updatePlaybackTimeUI(true);
  const song = songs[currentSongIndex];
  if (!song) return;
  applySongVolume(true);
  if (lyricsState.pending && song.file === lyricsState.pending.songFile) {
    renderLyrics(lyricsState.pending.entry, jukeboxAudio.duration);
    lyricsState.pending = null;
  }
  syncLyricsToTime(jukeboxAudio.currentTime);
}

function syncLyricsToTime(currentTime) {
  if (!lyricsState.cues.length) {
    if (lyricsState.currentIndex !== -1) {
      setActiveLyricsIndex(-1);
    }
    return;
  }

  let nextIndex = -1;
  for (let i = lyricsState.cues.length - 1; i >= 0; i--) {
    const cueTime = Number(lyricsState.cues[i].time ?? 0);
    if (currentTime + LYRICS_SYNC_LEEWAY >= cueTime) {
      nextIndex = i;
      break;
    }
  }

  if (nextIndex !== lyricsState.currentIndex) {
    setActiveLyricsIndex(nextIndex);
  }
}

function setActiveLyricsIndex(index) {
  const ui = getLyricsUI();
  if (!ui || !ui.list) return;

  if (lyricsState.currentIndex >= 0 && lyricsState.cues[lyricsState.currentIndex]) {
    lyricsState.cues[lyricsState.currentIndex].element.classList.remove('active');
  }

  lyricsState.currentIndex = index;

  if (index >= 0 && lyricsState.cues[index]) {
    const lineEl = lyricsState.cues[index].element;
    lineEl.classList.add('active');
    scrollLyricsIntoView(lineEl, ui.scroll);
  }
}

function scrollLyricsIntoView(lineEl, container) {
  if (!container || !lineEl) return;
  const lineTop = lineEl.offsetTop;
  const lineBottom = lineTop + lineEl.offsetHeight;
  const viewTop = container.scrollTop;
  const viewBottom = viewTop + container.clientHeight;

  if (lineTop < viewTop) {
    const target = Math.max(lineTop - 12, 0);
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      container.scrollTop = target;
    }
  } else if (lineBottom > viewBottom) {
    const target = lineBottom - container.clientHeight + 12;
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({ top: target, behavior: 'smooth' });
    } else {
      container.scrollTop = target;
    }
  }
}

function handleGlobalHotkeys(event) {
  const keyLower = event.key && event.key.toLowerCase ? event.key.toLowerCase() : event.key;
  const targetTag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
  const isTypingField = targetTag === 'input' || targetTag === 'textarea' || event.target?.isContentEditable;
  if (event.ctrlKey && event.altKey && keyLower === 'c') {
    event.preventDefault();
    toggleCRT();
    return;
  }
  if (event.key === 'F1') {
    event.preventDefault();
    summonAngel();
    return;
  }
  const isQuestion = event.key === '?' || (event.key === '/' && event.shiftKey);
  if (!event.ctrlKey && !event.altKey && !event.metaKey && isQuestion && !isTypingField) {
    event.preventDefault();
    openWindow('Settings', 11, 160, 120);
    return;
  }
  if (event.ctrlKey && event.altKey && keyLower === 'p') {
    event.preventDefault();
    playClickSound();
    const alreadyOpen = !!openWindows['XP Tips'];
    openWindow('XP Tips', 'XP', 160, 110);
    if (!alreadyOpen) {
      announceDesktopMessage('XP Tips unlocked. Press X -> P -> ! anytime.');
    }
    return;
  }
  if (event.ctrlKey || event.altKey || event.metaKey) {
    secretSequenceProgress = 0;
    return;
  }
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const expected = SECRET_SEQUENCE[secretSequenceProgress];
  const expectedNormalized = expected.length === 1 ? expected.toLowerCase() : expected;
  if (key === expectedNormalized) {
    secretSequenceProgress++;
    if (secretSequenceProgress === SECRET_SEQUENCE.length) {
      secretSequenceProgress = 0;
      const alreadyOpen = !!openWindows['XP Tips'];
      openWindow('XP Tips', 'XP', 160, 110);
      if (!alreadyOpen) {
        announceDesktopMessage('XP Tips unlocked. Press Ctrl+Alt+C to toggle CRT bloom.');
      }
    }
  } else {
    const firstNormalized = SECRET_SEQUENCE[0].length === 1 ? SECRET_SEQUENCE[0].toLowerCase() : SECRET_SEQUENCE[0];
    secretSequenceProgress = key === firstNormalized ? 1 : 0;
  }
}

document.addEventListener('keydown', handleGlobalHotkeys);

// --- "You Are An Idiot" Virus Logic ---
let idiotWindows = [];

function stopIdiotAudio() {
  if (idiotAudio) {
    idiotAudio.pause();
    idiotAudio.currentTime = 0;
    dynamicAudio.delete(idiotAudio);
    idiotAudio = null;
  }
}

function summonAngel() {
  if (angelSummoned) {
    announceDesktopMessage('Angel already assisting this session.');
    return;
  }
  angelSummoned = true;

  const angel = document.createElement('img');
  angel.src = 'ANGEL.webp';
  angel.alt = 'Guardian angel';
  const angelSize = 44;
  angel.style.position = 'absolute';
  angel.style.width = `${angelSize}px`;
  angel.style.height = `${angelSize}px`;
  angel.style.pointerEvents = 'none';
  angel.style.zIndex = 9999;

  desktop.appendChild(angel);

  const laugh = new Audio('laugh.mp3');
  const heal = new Audio('heal.mp3');
  registerDynamicAudio(laugh, 0.9);
  registerDynamicAudio(heal, 0.9);
  const desktopRect = desktop.getBoundingClientRect();
  const startPoint = {
    x: Math.max(24, desktopRect.width - angelSize - 24),
    y: 28
  };
  angel.style.left = `${startPoint.x}px`;
  angel.style.top = `${startPoint.y}px`;

  const controlPoint = {
    x: Math.max(angelSize, desktopRect.width * 0.55 - angelSize * 0.5),
    y: desktopRect.height * 0.18
  };
  const endPoint = {
    x: 20,
    y: 32
  };

  const halfDurations = [1700, 1700];

  const getPointOnCurve = (t) => {
    const u = 1 - t;
    return {
      x: u * u * startPoint.x + 2 * u * t * controlPoint.x + t * t * endPoint.x,
      y: u * u * startPoint.y + 2 * u * t * controlPoint.y + t * t * endPoint.y
    };
  };

  const animateHalf = (segmentIndex) => {
    let startTime = null;
    const duration = halfDurations[segmentIndex];
    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const globalT = segmentIndex === 0 ? eased * 0.5 : 0.5 + eased * 0.5;
      const point = getPointOnCurve(globalT);
      angel.style.left = `${point.x}px`;
      angel.style.top = `${point.y}px`;
      if (segmentIndex === 0 && progress >= 0.5 && !angel.dataset.midReached) {
        angel.dataset.midReached = 'true';
        laugh.play().catch(() => { });
        setTimeout(() => heal.play().catch(() => { }), 600);
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (segmentIndex === 0) {
        animateHalf(1);
      } else {
        setTimeout(() => {
          if (angel.parentNode) angel.parentNode.removeChild(angel);
        }, 600);
      }
    };
    requestAnimationFrame(step);
  };

  animateHalf(0);
}

function triggerIdiotVirus() {
  if (idiotWindows.length > 0) return;

  if (!idiotAudio) {
    idiotAudio = new Audio('YAAI.mp3');
    idiotAudio.loop = true;
    idiotAudio.preload = 'metadata';
    registerDynamicAudio(idiotAudio, 0.8);
    idiotAudio.play().catch(err => console.warn('YAAI audio blocked:', err));
  }

  for (let i = 0; i < 9; i++) {
    createIdiotWindow();
  }

  setTimeout(() => {
    idiotWindows.forEach(win => {
      if (win.parentNode) {
        win.parentNode.removeChild(win);
      }
    });
    idiotWindows = [];
    stopIdiotAudio();
  }, 15000);
}

function createIdiotWindow() {
  zIndexCounter++;
  const win = document.createElement('div');
  win.className = 'idiot-window';
  win.style.zIndex = zIndexCounter;
  win.innerHTML = `<img src="You_Are_An_Idiot.gif" alt="You are an idiot" loading="lazy" decoding="async">`;

  desktop.appendChild(win);

  const rect = desktop.getBoundingClientRect();

  let pos = {
    x: Math.random() * (rect.width - 280),
    y: Math.random() * (rect.height - 210 - 28)
  };
  let vel = {
    x: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1),
    y: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1)
  };

  win.style.left = pos.x + 'px';
  win.style.top = pos.y + 'px';

  const move = () => {
    if (!win.parentNode) return;

    pos.x += vel.x;
    pos.y += vel.y;

    if (pos.x <= 0 || pos.x >= rect.width - 280) vel.x *= -1;
    if (pos.y <= 0 || pos.y >= rect.height - 210 - 28) vel.y *= -1;

    win.style.left = pos.x + 'px';
    win.style.top = pos.y + 'px';

    requestAnimationFrame(move);
  };

  move();
  idiotWindows.push(win);
}

// Make window titlebars trigger drag
document.addEventListener('mousedown', (e) => {
  const titlebar = e.target.closest('.window-titlebar');
  if (titlebar) {
    dragStart(e, titlebar.parentNode);
  }
});

// --- Calculator Logic ---
let calcState = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false
};
function updateSecretTokenStates(panel) {
  if (!panel) return;
  const tokens = panel.querySelectorAll('.secret-token');
  tokens.forEach(token => {
    const available = !token.classList.contains('used');
    token.disabled = !available;
    token.setAttribute('aria-disabled', available ? 'false' : 'true');
    token.classList.toggle('disabled', !available);
    token.tabIndex = available ? 0 : -1;
  });
}

function shuffleSecretTokens(panel) {
  const tray = panel.querySelector('.secret-token-tray');
  if (!tray) return;
  const tokens = Array.from(tray.querySelectorAll('.secret-token'));
  for (let i = tokens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tokens[i], tokens[j]] = [tokens[j], tokens[i]];
  }
  tokens.forEach(token => tray.appendChild(token));
}

function selectSecretSlot(panel, slot) {
  const slots = panel.querySelectorAll('.secret-slot');
  slots.forEach(s => s.classList.remove('selected'));
  if (slot) {
    slot.classList.add('selected');
    panel.dataset.selectedSlot = slot.dataset.index;
  } else {
    delete panel.dataset.selectedSlot;
  }
}

function releaseSecretSlot(panel, slot) {
  if (!slot || !slot.dataset.tokenId) return;
  const token = panel.querySelector(`.secret-token[data-token-id="${slot.dataset.tokenId}"]`);
  if (token) {
    token.classList.remove('used');
    token.disabled = false;
    token.setAttribute('aria-disabled', 'false');
    token.classList.remove('disabled');
    token.tabIndex = 0;
  }
  slot.dataset.value = '';
  slot.dataset.tokenId = '';
  slot.textContent = '';
  slot.classList.remove('filled');
  updateSecretTokenStates(panel);
}

function resetCalculatorSecret(panel) {
  if (!panel) return;
  panel.classList.remove('solved');
  selectSecretSlot(panel, null);
  const slots = panel.querySelectorAll('.secret-slot');
  slots.forEach(slot => {
    slot.dataset.value = '';
    slot.dataset.tokenId = '';
    slot.textContent = '';
    slot.classList.remove('filled');
  });
  const tokens = panel.querySelectorAll('.secret-token');
  tokens.forEach(token => {
    token.classList.remove('used', 'disabled');
    token.disabled = false;
    token.setAttribute('aria-disabled', 'false');
    token.tabIndex = 0;
  });
  shuffleSecretTokens(panel);
  updateSecretTokenStates(panel);
}

function chooseSecretSlot(panel) {
  const selectedIndex = panel.dataset.selectedSlot;
  if (selectedIndex) {
    const slot = panel.querySelector(`.secret-slot[data-index="${selectedIndex}"]`);
    if (slot) return slot;
  }
  return Array.from(panel.querySelectorAll('.secret-slot')).find(slot => !slot.dataset.value) || null;
}

function handleSecretTokenClick(panel, token) {
  if (!panel || !token || token.disabled || token.classList.contains('used')) return;
  const slot = chooseSecretSlot(panel);
  if (!slot) return;
  slot.dataset.value = token.dataset.value;
  slot.dataset.tokenId = token.dataset.tokenId;
  slot.textContent = token.textContent;
  slot.classList.add('filled');
  token.classList.add('used');
  token.disabled = true;
  token.setAttribute('aria-disabled', 'true');
  updateSecretTokenStates(panel);
  selectSecretSlot(panel, null);
  const allFilled = Array.from(panel.querySelectorAll('.secret-slot')).every(s => s.dataset.value);
  if (allFilled) {
    checkCalculatorSecret(panel);
  }
}

function handleSecretSlotClick(panel, slot) {
  if (!panel || !slot) return;
  if (slot.classList.contains('selected')) {
    if (slot.dataset.tokenId) {
      releaseSecretSlot(panel, slot);
    }
    selectSecretSlot(panel, null);
  } else {
    selectSecretSlot(panel, slot);
  }
}

function updateCalculatorDisplay() {
  const el = document.getElementById('calculator-display');
  if (el) el.textContent = calcState.displayValue;
}

function handleCalculatorInput(input) {
  const { displayValue, waitingForSecondOperand } = calcState;

  if (input === 'C') {
    calcState = { displayValue: '0', firstOperand: null, operator: null, waitingForSecondOperand: false };
  } else if (input === '=') {
    if (calcState.operator && calcState.firstOperand !== null) {
      const result = operate(calcState.firstOperand, calcState.operator, parseFloat(displayValue));
      calcState.displayValue = `${result}`;
      calcState.firstOperand = null;
      calcState.operator = null;
      calcState.waitingForSecondOperand = true;
    }
  } else if (['+', '-', '*', '/'].includes(input)) {
    const inputValue = parseFloat(displayValue);

    if (calcState.operator && waitingForSecondOperand) {
      calcState.operator = input;
      return;
    }

    if (calcState.firstOperand === null) {
      calcState.firstOperand = inputValue;
    } else if (calcState.operator) {
      const result = operate(calcState.firstOperand, calcState.operator, inputValue);
      calcState.displayValue = `${result}`;
      calcState.firstOperand = result;
    }
    calcState.waitingForSecondOperand = true;
    calcState.operator = input;
  } else if (input === '.') {
    if (waitingForSecondOperand) {
      calcState.displayValue = '0.';
      calcState.waitingForSecondOperand = false;
    } else if (!displayValue.includes('.')) {
      calcState.displayValue += '.';
    }
  } else {
    if (waitingForSecondOperand) {
      calcState.displayValue = input;
      calcState.waitingForSecondOperand = false;
    } else {
      calcState.displayValue = displayValue === '0' ? input : displayValue + input;
    }
  }
  updateCalculatorDisplay();
}

function operate(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return a / b;
  return b;
}

function setupCalculatorWindow(win) {
  if (!win || win.dataset.calcReady === 'true') return;
  win.dataset.calcReady = 'true';
  const wrapper = win.querySelector('.calculator-display-wrapper');
  const maintenancePanel = win.querySelector('#calculator-secret-panel');
  const screws = win.querySelectorAll('.calc-screw');
  const calcButtons = win.querySelectorAll('.calc-btn[data-value]');
  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => handleCalculatorInput(btn.dataset.value));
  });
  if (!wrapper || !maintenancePanel || !screws.length) return;

  const revealMaintenancePanel = () => {
    if (wrapper.classList.contains('panel-active')) return;
    wrapper.classList.add('panel-active');
    maintenancePanel.setAttribute('aria-hidden', 'false');
    initializeCalculatorSecret(maintenancePanel);
  };

  let unscrewed = 0;
  screws.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('unscrewed')) return;
      btn.classList.add('unscrewed');
      btn.textContent = 'x';
      btn.setAttribute('aria-disabled', 'true');
      unscrewed += 1;
      if (unscrewed === screws.length) {
        revealMaintenancePanel();
      }
    });
  });
}

function initializeCalculatorSecret(panel) {
  if (!panel) return;
  const tokens = panel.querySelectorAll('.secret-token');
  const slots = panel.querySelectorAll('.secret-slot');
  if (panel.dataset.bound !== 'true') {
    tokens.forEach((token, index) => {
      if (!token.dataset.tokenId) {
        token.dataset.tokenId = `calc-token-${index}`;
      }
      token.addEventListener('click', () => handleSecretTokenClick(panel, token));
    });
    slots.forEach(slot => {
      slot.addEventListener('click', () => handleSecretSlotClick(panel, slot));
    });
    const resetBtn = panel.querySelector('.secret-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => resetCalculatorSecret(panel));
    }
    panel.dataset.bound = 'true';
  }
  resetCalculatorSecret(panel);
}

function checkCalculatorSecret(panel) {
  const slots = panel.querySelectorAll('.secret-slot');
  const values = Array.from(slots).map(slot => slot.dataset.value || null);
  if (values.some(v => !v)) return;
  const equationOk =
    values[0] === '1' &&
    values[1] === '8' &&
    ['*', '/'].includes(values[2]) &&
    values[3] === '5' &&
    ['9', ')', '/'].includes(values[4]) &&
    values[5] === '=';
  if (equationOk) {
    panel.classList.add('solved');
    setTimeout(() => {
      window.location.href = 'https://im-notalex.github.io/boogerboys.github.io/temp/index.html';
    }, 900);
  }
}

// --- Minesweeper Logic ---
const MINESWEEPER_BOARD_SIZE = 10;
const MINESWEEPER_MINE_COUNT = 15;
let minesweeperBoard = [];
let minesweeperGameover = false;
let minesweeperFlagsPlaced = 0;
let minesweeperTimerSeconds = 0;
let minesweeperTimerInterval = null;
let minesweeperStarted = false;
const MINESWEEPER_FACES = {
  neutral: ':)',
  dead: 'X(',
  cool: 'B)'
};

const MINESWEEPER_FACE_LABELS = {
  neutral: 'Start a new game',
  dead: 'Game over',
  cool: 'Minefield cleared'
};


function formatCounter(value) {
  const clamped = Math.max(-99, Math.min(999, value));
  if (clamped < 0) {
    const digits = Math.abs(clamped).toString().padStart(2, '0');
    return `-${digits}`;
  }
  return Math.abs(clamped).toString().padStart(3, '0');
}

function updateMineCounter() {
  const el = document.getElementById('minesweeper-mine-counter');
  if (!el) return;
  const remaining = MINESWEEPER_MINE_COUNT - minesweeperFlagsPlaced;
  el.textContent = formatCounter(remaining);
}

function updateTimerDisplay() {
  const el = document.getElementById('minesweeper-timer');
  if (!el) return;
  el.textContent = formatCounter(minesweeperTimerSeconds);
}

function setMinesweeperFace(state) {
  const btn = document.getElementById('minesweeper-reset-button');
  if (!btn) return;
  const glyph = MINESWEEPER_FACES[state] || MINESWEEPER_FACES.neutral;
  btn.dataset.face = state;
  btn.dataset.faceGlyph = glyph;
  const label = MINESWEEPER_FACE_LABELS[state] || MINESWEEPER_FACE_LABELS.neutral;
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
}


function startMinesweeperTimer() {
  if (minesweeperStarted) return;
  minesweeperStarted = true;
  minesweeperTimerInterval = setInterval(() => {
    if (minesweeperGameover) return;
    minesweeperTimerSeconds = Math.min(999, minesweeperTimerSeconds + 1);
    updateTimerDisplay();
  }, 1000);
}

function stopMinesweeperTimer() {
  if (minesweeperTimerInterval) {
    clearInterval(minesweeperTimerInterval);
    minesweeperTimerInterval = null;
  }
  minesweeperStarted = false;
}

function resetMinesweeper() {
  initializeMinesweeper();
}


function initializeMinesweeper() {
  setMinesweeperFace('neutral');
  const grid = document.getElementById('minesweeper-grid');
  if (!grid) return;

  if (!grid.dataset.bound) {
    grid.addEventListener('click', handleMinesweeperClick);
    grid.addEventListener('contextmenu', handleMinesweeperRightClick);
    grid.dataset.bound = 'true';
  }

  stopMinesweeperTimer();
  minesweeperBoard = [];
  minesweeperGameover = false;
  minesweeperFlagsPlaced = 0;
  minesweeperTimerSeconds = 0;
  minesweeperStarted = false;
  updateMineCounter();
  updateTimerDisplay();

  grid.innerHTML = '';

  for (let i = 0; i < MINESWEEPER_BOARD_SIZE * MINESWEEPER_BOARD_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'minesweeper-cell';
    cell.dataset.index = i;
    grid.appendChild(cell);
    minesweeperBoard.push({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    });
  }

  let minesPlaced = 0;
  while (minesPlaced < MINESWEEPER_MINE_COUNT) {
    const randomIndex = Math.floor(Math.random() * minesweeperBoard.length);
    if (!minesweeperBoard[randomIndex].isMine) {
      minesweeperBoard[randomIndex].isMine = true;
      minesPlaced++;
    }
  }

  for (let i = 0; i < minesweeperBoard.length; i++) {
    if (!minesweeperBoard[i].isMine) {
      minesweeperBoard[i].neighborMines = countNeighborMines(i);
    }
  }
}

function handleMinesweeperClick(e) {
  if (minesweeperGameover) return;
  const cellEl = e.target.closest('.minesweeper-cell');
  if (!cellEl) return;

  const index = parseInt(cellEl.dataset.index);
  const cellData = minesweeperBoard[index];

  if (cellData.isFlagged || cellData.isRevealed) {
    return;
  }

  if (!minesweeperStarted) {
    startMinesweeperTimer();
  }

  if (cellData.isMine) {
    cellEl.classList.add('revealed');
    cellEl.innerHTML = `<img src="mine.png">`;
    minesweeperGameover = true;
    setMinesweeperFace('dead');
    stopMinesweeperTimer();
    revealAllMines();
    updateMineCounter();
  } else {
    revealCell(index);
    checkWinCondition();
  }
}

function handleMinesweeperRightClick(e) {
  e.preventDefault();
  if (minesweeperGameover) return;
  const cellEl = e.target.closest('.minesweeper-cell');
  if (!cellEl) return;

  const index = parseInt(cellEl.dataset.index);
  const cellData = minesweeperBoard[index];

  if (cellData.isRevealed) return;

  if (cellData.isFlagged) {
    cellData.isFlagged = false;
    cellEl.innerHTML = '';
    minesweeperFlagsPlaced -= 1;
  } else {
    cellData.isFlagged = true;
    cellEl.innerHTML = `<img src="flag.png">`;
    minesweeperFlagsPlaced += 1;
  }
  updateMineCounter();
  checkWinCondition();
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / MINESWEEPER_BOARD_SIZE);
  const col = index % MINESWEEPER_BOARD_SIZE;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;

      if (newRow >= 0 && newRow < MINESWEEPER_BOARD_SIZE && newCol >= 0 && newCol < MINESWEEPER_BOARD_SIZE) {
        const newIndex = newRow * MINESWEEPER_BOARD_SIZE + newCol;
        neighbors.push(newIndex);
      }
    }
  }
  return neighbors;
}

function countNeighborMines(index) {
  let count = 0;
  const neighbors = getNeighbors(index);
  neighbors.forEach(neighborIndex => {
    if (minesweeperBoard[neighborIndex].isMine) {
      count++;
    }
  });
  return count;
}

function revealCell(index) {
  const cellData = minesweeperBoard[index];
  const cellEl = document.querySelector(`.minesweeper-cell[data-index="${index}"]`);

  if (cellData.isRevealed || cellData.isFlagged) return;

  cellData.isRevealed = true;
  cellEl.classList.add('revealed');

  if (cellData.neighborMines > 0) {
    cellEl.textContent = cellData.neighborMines;
    cellEl.classList.add(`number-${cellData.neighborMines}`);
  } else {
    const neighbors = getNeighbors(index);
    neighbors.forEach(neighborIndex => {
      revealCell(neighborIndex);
    });
  }
}

function revealAllMines() {
  minesweeperBoard.forEach((cell, index) => {
    if (cell.isMine) {
      const cellEl = document.querySelector(`.minesweeper-cell[data-index="${index}"]`);
      cellEl.classList.add('revealed');
      if (!cell.isFlagged) {
        cellEl.innerHTML = `<img src="mine.png">`;
      }
    }
  });
}

function checkWinCondition() {
  let revealedCount = 0;
  let correctlyFlagged = 0;
  minesweeperBoard.forEach(cell => {
    if (cell.isRevealed) {
      revealedCount++;
    }
    if (cell.isFlagged && cell.isMine) {
      correctlyFlagged++;
    }
  });

  let playerWon = false;

  if (revealedCount === (MINESWEEPER_BOARD_SIZE * MINESWEEPER_BOARD_SIZE) - MINESWEEPER_MINE_COUNT) {
    minesweeperGameover = true;
    playerWon = true;
  } else if (correctlyFlagged === MINESWEEPER_MINE_COUNT) {
    let allMinesFlagged = true;
    let hasWrongFlags = false;
    minesweeperBoard.forEach(cell => {
      if (cell.isMine && !cell.isFlagged) {
        allMinesFlagged = false;
      }
      if (!cell.isMine && cell.isFlagged) {
        hasWrongFlags = true;
      }
    });
    if (allMinesFlagged && !hasWrongFlags) {
      minesweeperGameover = true;
      playerWon = true;
    }
  }

  if (playerWon) {
    stopMinesweeperTimer();
    setMinesweeperFace('cool');
    updateMineCounter();
  }
}



