class LoginManager {
    constructor() {
        this.failedAttempts = 0;
        this.isBlocked = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('loginFormElement').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('recoveryFormElement').addEventListener('submit', (e) => this.handleRecovery(e));
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => this.showRecoveryForm(e));
        document.getElementById('backToLogin').addEventListener('click', () => this.showLoginForm());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
    }

    showMessage(elementId, text, type = 'error') {
        const messageEl = document.getElementById(elementId);
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }

    showRecoveryForm(e) {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.remove('hidden');
    }

    showLoginForm() {
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        // Clear form
        document.getElementById('loginFormElement').reset();
    }

    showDashboard(username) {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('recoveryForm').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Update dashboard info
        document.getElementById('dashboardUsername').textContent = username;
        document.getElementById('loginTime').textContent = new Date().toLocaleString();
    }

    handleLogout() {
        this.failedAttempts = 0;
        this.isBlocked = false;
        this.showLoginForm();
        this.showMessage('message', 'You have been logged out successfully.', 'success');
    }

    setLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loading"></span>Processing...';
        } else {
            button.disabled = false;
            button.innerHTML = buttonId === 'loginBtn' ? 'Sign In' : 'Send Recovery Email';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        if (this.isBlocked) {
            this.showMessage('message', 'Account is temporarily blocked. Please use password recovery.', 'error');
            return;
        }

        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        this.setLoading('loginBtn', true);

        try {
            const response = await this.mockLoginAPI(credentials);
            
            if (response.success) {
                this.failedAttempts = 0;
                this.showMessage('message', 'Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    this.showDashboard(credentials.username);
                }, 1500);
            } else {
                this.handleLoginFailure(response);
            }
        } catch (error) {
            this.showMessage('message', 'Network error. Please try again.', 'error');
        } finally {
            this.setLoading('loginBtn', false);
        }
    }

    handleLoginFailure(response) {
        this.failedAttempts++;
        
        if (response.blocked || this.failedAttempts >= 3) {
            this.isBlocked = true;
            this.showMessage('message', 
                'Account blocked after 3 failed attempts. Please use password recovery to unblock your account.', 
                'error'
            );
        } else {
            const attemptsLeft = 3 - this.failedAttempts;
            this.showMessage('message', 
                `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`, 
                'warning'
            );
        }
    }

    async handleRecovery(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');

        this.setLoading('recoveryBtn', true);

        try {
            const response = await this.mockRecoveryAPI(email);
            
            if (response.success) {
                this.isBlocked = false;
                this.failedAttempts = 0;
                this.showMessage('recoveryMessage', 'Recovery email sent! Account has been unblocked.', 'success');
                
                setTimeout(() => {
                    this.showLoginForm();
                }, 3000);
            } else {
                this.showMessage('recoveryMessage', response.message, 'error');
            }
        } catch (error) {
            this.showMessage('recoveryMessage', 'Network error. Please try again.', 'error');
        } finally {
            this.setLoading('recoveryBtn', false);
        }
    }

    // API calls to your local server
    async mockLoginAPI(credentials) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            
            // Handle different HTTP status codes
            if (response.ok) {
                return { success: true, message: data.message || 'Login successful', data };
            } else {
                // Handle different error scenarios based on your API
                return { 
                    success: false, 
                    blocked: data.blocked || false,
                    message: data.message || 'Login failed' 
                };
            }
        } catch (error) {
            console.error('Login API error:', error);
            
            // More detailed error information
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Cannot connect to API server. Make sure your API is running on localhost:3000 and CORS is enabled.');
            }
            throw new Error(`API connection failed: ${error.message}`);
        }
    }

    async mockRecoveryAPI(email) {
        try {
            const response = await fetch('http://localhost:3000/api/recover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, message: data.message || 'Recovery email sent' };
            } else {
                return { 
                    success: false, 
                    message: data.message || 'Recovery failed' 
                };
            }
        } catch (error) {
            console.error('Recovery API error:', error);
            
            // More detailed error information
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Cannot connect to API server. Make sure your API is running on localhost:3000 and CORS is enabled.');
            }
            throw new Error(`API connection failed: ${error.message}`);
        }
    }
}

// Initialize the login manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});