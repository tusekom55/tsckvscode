// API Base Configuration
const API_CONFIG = {
    baseUrl: window.location.pathname.includes('/user-panel-v2/') ? '../backend' : 'backend',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

// API Endpoints
const API_ENDPOINTS = {
    auth: {
        profile: '/public/profile.php',
        logout: '/public/logout.php',
        login: '/public/login.php'
    },
    user: {
        trading: '/user/trading.php',
        deposits: '/user/deposits.php',
        positions: '/user/leverage_trading.php',
        transactions: '/user/transaction_history.php'
    }
};

// API Error Handler
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// API Client Class
class ApiClient {
    static async request(endpoint, options = {}) {
        try {
            const url = API_CONFIG.baseUrl + endpoint;
            const response = await fetch(url, {
                ...API_CONFIG,
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(
                    data.message || 'API request failed',
                    response.status,
                    data
                );
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(error.message, 500);
        }
    }

    // Auth Methods
    static async login(username, password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        return await this.request(API_ENDPOINTS.auth.login, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set content-type for FormData
        });
    }

    static async getUserProfile() {
        return await this.request(API_ENDPOINTS.auth.profile);
    }

    static async logout() {
        return await this.request(API_ENDPOINTS.auth.logout);
    }

    // Trading Methods
    static async getPortfolio() {
        return await this.request(API_ENDPOINTS.user.trading + '?action=portfolio');
    }

    static async executeTrade(type, coinId, amount, price) {
        const formData = new FormData();
        formData.append('coin_id', coinId);
        formData.append('miktar', amount);
        formData.append('fiyat', price);

        return await this.request(API_ENDPOINTS.user.trading + `?action=${type}`, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set content-type for FormData
        });
    }

    // Position Methods
    static async getPositions() {
        return await this.request(API_ENDPOINTS.user.positions + '?action=positions');
    }

    static async openPosition(data) {
        return await this.request(API_ENDPOINTS.user.positions, {
            method: 'POST',
            body: JSON.stringify({
                action: 'open_position',
                ...data
            })
        });
    }

    static async closePosition(positionId, closePrice) {
        return await this.request(API_ENDPOINTS.user.positions, {
            method: 'POST',
            body: JSON.stringify({
                action: 'close_position',
                position_id: positionId,
                close_price: closePrice
            })
        });
    }

    // Deposit Methods
    static async createDepositRequest(data) {
        return await this.request(API_ENDPOINTS.user.deposits + '?action=create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async getDepositHistory() {
        return await this.request(API_ENDPOINTS.user.deposits + '?action=list');
    }

    // Transaction History
    static async getTransactionHistory(limit = 20) {
        return await this.request(API_ENDPOINTS.user.transactions + `?action=list&limit=${limit}`);
    }
}

// Export API Client
window.ApiClient = ApiClient;
