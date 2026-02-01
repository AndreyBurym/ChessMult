/**
 * CHESS MULTIPLAYER ARENA - CODE ADDITIONS
 * Add these sections to your existing HTML file
 */

// ==================================================================
// 1. ADD TO CSS (in <style> section)
// ==================================================================

/* Add these styles to your <style> section */

/* Avatar selector grid */
.avatar-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    margin-bottom: 16px;
}

.avatar-option {
    width: 100%;
    aspect-ratio: 1;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.avatar-option:hover {
    background: var(--border);
    transform: scale(1.1);
}

.avatar-option.selected {
    border-color: var(--accent-green);
    background: rgba(127, 166, 80, 0.2);
    transform: scale(1.05);
}

/* Title selector grid */
.title-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 16px;
}

.title-option {
    padding: 12px;
    background: var(--bg-tertiary);
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.title-option:hover {
    background: var(--border);
    transform: translateY(-2px);
}

.title-option.selected {
    border-color: var(--accent-green);
    background: rgba(127, 166, 80, 0.2);
}

/* Title styles matching chess.com */
.title-option.gm, .player-title.gm {
    background: linear-gradient(135deg, #d4af37, #f4d03f);
    color: #000;
}

.title-option.im, .player-title.im {
    background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
    color: #000;
}

.title-option.fm, .player-title.fm {
    background: linear-gradient(135deg, #cd7f32, #e6a370);
    color: #fff;
}

.title-option.cm, .player-title.cm {
    background: linear-gradient(135deg, #8b4513, #a0522d);
    color: #fff;
}

.title-option.nm, .player-title.nm {
    background: linear-gradient(135deg, #4a90e2, #5ba3f5);
    color: #fff;
}

.title-option.none {
    background: var(--bg-tertiary);
    color: var(--text-muted);
}

.player-title {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
}

// ==================================================================
// 2. UPDATE HTML - Player Modal Body
// ==================================================================

// Replace the .modal-body section in playerModal with:
/*
<div class="modal-body">
    <div class="form-group">
        <label class="form-label">Player Name</label>
        <input type="text" class="form-control" id="playerNameInput">
    </div>
    
    <div class="form-group">
        <label class="form-label">Rating (ELO)</label>
        <input type="number" class="form-control" id="playerEloInput" min="0" max="3000">
    </div>
    
    <div class="form-group">
        <label class="form-label">Avatar</label>
        <div class="avatar-grid" id="avatarGrid"></div>
    </div>
    
    <div class="form-group">
        <label class="form-label">Title</label>
        <div class="title-grid">
            <div class="title-option none" data-title="" onclick="selectTitle('')">None</div>
            <div class="title-option gm" data-title="GM" onclick="selectTitle('GM')">GM</div>
            <div class="title-option im" data-title="IM" onclick="selectTitle('IM')">IM</div>
            <div class="title-option fm" data-title="FM" onclick="selectTitle('FM')">FM</div>
            <div class="title-option cm" data-title="CM" onclick="selectTitle('CM')">CM</div>
            <div class="title-option nm" data-title="NM" onclick="selectTitle('NM')">NM</div>
        </div>
    </div>
</div>
*/

// ==================================================================
// 3. COMMAND CONSOLE - DELETE your old <!-- Command Console --> div
//    AND its entire <script> block. Then paste this at the very end
//    of your HTML, right before </body></html>:
// ==================================================================

/*
<!-- Command Console -->
<div id="commandConsole" style="
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    background:#0a0a0a;
    border-top:2px solid #7fa650;
    padding:12px 20px;
    font-family:'JetBrains Mono',monospace;
    z-index:1000;
    box-shadow:0 -4px 20px rgba(0,0,0,0.5);
    transform:translateY(100%);
    transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
">
    <div style="max-width:1800px;margin:0 auto;display:flex;flex-direction:column;gap:8px;">
        <div style="font-size:11px;color:#666;">Press O to open | Commands: connect ws://localhost:8080 | disconnect | status | close | help | clear</div>
        <div style="display:flex;align-items:center;gap:12px;">
            <span style="color:#7fa650;font-weight:600;font-size:14px;">chess></span>
            <input type="text" id="consoleInput" placeholder="Enter command..." autocomplete="off" style="flex:1;background:#1a1a1a;border:1px solid #333;border-radius:4px;padding:8px 12px;color:#e8e6e3;font-family:'JetBrains Mono',monospace;font-size:14px;outline:none;">
            <div style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#7a7774;padding:4px 10px;background:#1a1a1a;border-radius:4px;border:1px solid #333;">
                <span id="consoleStatusDot" style="width:6px;height:6px;border-radius:50%;background:#666;"></span>
                <span id="consoleStatusText">Disconnected</span>
            </div>
        </div>
        <div id="consoleOutput" style="font-size:12px;color:#f0c15c;min-height:16px;"></div>
    </div>
</div>

<script>
(function() {
    var consoleEl = document.getElementById('commandConsole');
    var consoleInput = document.getElementById('consoleInput');
    var consoleOutput = document.getElementById('consoleOutput');
    var statusDot = document.getElementById('consoleStatusDot');
    var statusText = document.getElementById('consoleStatusText');

    function openConsole() {
        consoleEl.style.transform = 'translateY(0)';
        consoleInput.focus();
    }

    function closeConsole() {
        consoleEl.style.transform = 'translateY(100%)';
        consoleInput.value = '';
        consoleInput.blur();
    }

    function setOutput(message, type) {
        consoleOutput.textContent = message;
        if (type === 'error') consoleOutput.style.color = '#d84a40';
        else if (type === 'success') consoleOutput.style.color = '#7fa650';
        else consoleOutput.style.color = '#f0c15c';
    }

    function setStatus(connected, text) {
        statusText.textContent = text;
        statusDot.style.background = connected ? '#7fa650' : '#666';
    }

    function executeCommand(cmd) {
        var trimmed = cmd.trim().toLowerCase();

        if (trimmed === 'close') {
            closeConsole();
            return;
        }

        if (trimmed === 'help' || trimmed === '') {
            setOutput('Commands: connect <url> | disconnect | status | close | help | clear', 'success');
            return;
        }

        if (trimmed === 'clear') {
            consoleOutput.textContent = '';
            return;
        }

        if (trimmed === 'status') {
            if (ws && ws.readyState === WebSocket.OPEN) {
                setOutput('Status: Connected | Lobby: ' + (currentLobby || 'None'), 'success');
            } else {
                setOutput('Status: Disconnected', 'error');
            }
            return;
        }

        if (trimmed === 'disconnect') {
            if (ws) {
                ws.close();
                ws = null;
                setOutput('Disconnected from server', 'success');
                setStatus(false, 'Disconnected');
            } else {
                setOutput('Not connected to any server', 'error');
            }
            return;
        }

        if (trimmed.startsWith('connect ')) {
            var url = cmd.trim().substring(8).trim();
            if (!url) {
                setOutput('Error: specify a URL. Example: connect ws://localhost:8080', 'error');
                return;
            }
            if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
                setOutput('Error: URL must start with ws:// or wss://', 'error');
                return;
            }

            setOutput('Connecting to ' + url + '...', 'success');
            setStatus(false, 'Connecting...');

            try {
                if (ws) ws.close();
                ws = new WebSocket(url);
                wsUrl = url;

                ws.onopen = function() {
                    setStatus(true, 'Connected');
                    setOutput('✓ Connected to ' + url, 'success');
                    updateConnectionStatus('Connected', true);
                };
                ws.onmessage = function(event) {
                    var data = JSON.parse(event.data);
                    handleServerMessage(data);
                };
                ws.onerror = function() {
                    setStatus(false, 'Failed');
                    setOutput('✗ Failed to connect to ' + url, 'error');
                };
                ws.onclose = function() {
                    setStatus(false, 'Disconnected');
                    setOutput('Connection closed', 'error');
                };
            } catch (e) {
                setOutput('✗ Error: ' + e.message, 'error');
                setStatus(false, 'Error');
            }
            return;
        }

        setOutput('Unknown command: ' + trimmed + ' (type "help")', 'error');
    }

    // Enter submits
    consoleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var command = consoleInput.value;
            consoleInput.value = '';
            if (command.trim()) executeCommand(command);
        }
    });

    // O opens, Escape closes
    document.addEventListener('keydown', function(e) {
        if (e.key === 'o' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            var tag = document.activeElement.tagName.toLowerCase();
            if (tag !== 'input' && tag !== 'textarea') {
                openConsole();
                e.preventDefault();
            }
        }
        if (e.key === 'Escape' && consoleEl.style.transform === 'translateY(0)') {
            closeConsole();
            e.preventDefault();
        }
    });

    setOutput('Chess Console — Press O to open, type "close" to close', 'success');
})();
</script>
*/

// ==================================================================
// 4. ADD TO JAVASCRIPT - Variables Section (in your first <script>)
// ==================================================================

var selectedAvatar = null;
var selectedTitle = '';

var avatars = [
    '♔', '♕', '♖', '♗', '♘', '♙',
    '♚', '♛', '♜', '♝', '♞', '♟',
    '🤴', '👑', '🦁', '🐉', '🔥', '⚡',
    '🌟', '💎', '🎯', '🏆', '⚔️', '🛡️'
];

// ==================================================================
// 5. ADD TO JAVASCRIPT - New Functions (in your first <script>)
// ==================================================================

// Avatar selection
function populateAvatars() {
    var grid = document.getElementById('avatarGrid');
    grid.innerHTML = '';
    
    avatars.forEach(function(avatar) {
        var option = document.createElement('div');
        option.className = 'avatar-option';
        option.textContent = avatar;
        option.onclick = function() { selectAvatar(avatar); };
        grid.appendChild(option);
    });
}

function selectAvatar(avatar) {
    selectedAvatar = avatar;
    
    document.querySelectorAll('.avatar-option').forEach(function(el) {
        el.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
}

// Title selection
function selectTitle(title) {
    selectedTitle = title;
    
    document.querySelectorAll('.title-option').forEach(function(el) {
        el.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
}

// ==================================================================
// 6. UPDATE EXISTING JAVASCRIPT FUNCTIONS (in your first <script>)
// ==================================================================

// UPDATE editPlayer function:
function editPlayer(color) {
    if (multiplayerMode) return;
    
    editingPlayer = color;
    var player = players[color];
    
    document.getElementById('playerNameInput').value = player.name;
    document.getElementById('playerEloInput').value = player.elo;
    
    populateAvatars();
    
    selectedAvatar = player.avatar;
    selectedTitle = player.title || '';
    
    setTimeout(function() {
        document.querySelectorAll('.avatar-option').forEach(function(el) {
            if (el.textContent === selectedAvatar) {
                el.classList.add('selected');
            }
        });
        
        document.querySelectorAll('.title-option').forEach(function(el) {
            if (el.getAttribute('data-title') === selectedTitle) {
                el.classList.add('selected');
            }
        });
    }, 50);
    
    document.getElementById('playerModal').classList.add('show');
}

// UPDATE savePlayerInfo function:
function savePlayerInfo() {
    var player = players[editingPlayer];
    
    player.name = document.getElementById('playerNameInput').value || 
                  (editingPlayer === 'white' ? 'White' : 'Black');
    player.elo = parseInt(document.getElementById('playerEloInput').value) || 1500;
    player.avatar = selectedAvatar || player.avatar;
    player.title = selectedTitle;
    
    updatePlayerDisplay(editingPlayer);
    closeModal();
}

// UPDATE updatePlayerDisplay function:
function updatePlayerDisplay(color) {
    var player = players[color];
    
    document.getElementById(color + 'Name').textContent = player.name;
    document.getElementById(color + 'Elo').textContent = player.elo;
    document.getElementById(color + 'Avatar').textContent = player.avatar;
    
    if (player.title) {
        var titleClass = player.title.toLowerCase();
        document.getElementById(color + 'Title').innerHTML = 
            '<span class="player-title ' + titleClass + '">' + player.title + '</span>';
    } else {
        document.getElementById(color + 'Title').innerHTML = '';
    }
}

// ==================================================================
// 7. INITIALIZATION (at the very end of your first <script>)
// ==================================================================

document.querySelector('.app-container').style.paddingBottom = '20px';
