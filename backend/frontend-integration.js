// Library Management System - API Integration
// Add this to your index.html to connect with the backend

const API_BASE_URL = 'http://localhost:8000/api';
let authToken = null;

// ======================
// Authentication
// ======================

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            authToken = data.data.access;
            localStorage.setItem('token', authToken);
            localStorage.setItem('refreshToken', data.data.refresh);
            return { success: true, data: data.data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error' };
    }
}

async function logout() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        await fetch(`${API_BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ refresh: refreshToken })
        });
        
        authToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}

function loadToken() {
    authToken = localStorage.getItem('token');
    return authToken;
}

// ======================
// API Helper
// ======================

async function apiRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (response.status === 401) {
            // Token expired, redirect to login
            window.location.href = '/login.html';
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        return { status: 'error', message: 'Network error' };
    }
}

// ======================
// Books API
// ======================

async function getBooks(page = 1, search = '') {
    let endpoint = `/books/?page=${page}`;
    if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
    }
    return await apiRequest(endpoint);
}

async function getBook(id) {
    return await apiRequest(`/books/${id}/`);
}

async function createBook(bookData) {
    return await apiRequest('/books/', 'POST', bookData);
}

async function updateBook(id, bookData) {
    return await apiRequest(`/books/${id}/`, 'PUT', bookData);
}

async function deleteBook(id) {
    return await apiRequest(`/books/${id}/`, 'DELETE');
}

// ======================
// Authors API
// ======================

async function getAuthors() {
    return await apiRequest('/books/authors/');
}

async function createAuthor(authorData) {
    return await apiRequest('/books/authors/', 'POST', authorData);
}

async function getAuthorBooks(authorId) {
    return await apiRequest(`/books/authors/${authorId}/books/`);
}

// ======================
// Categories API
// ======================

async function getCategories() {
    return await apiRequest('/books/categories/');
}

async function createCategory(categoryData) {
    return await apiRequest('/books/categories/', 'POST', categoryData);
}

// ======================
// Members API
// ======================

async function getMembers(page = 1) {
    return await apiRequest(`/members/?page=${page}`);
}

async function getMember(id) {
    return await apiRequest(`/members/${id}/`);
}

async function createMember(memberData) {
    return await apiRequest('/members/', 'POST', memberData);
}

async function updateMember(id, memberData) {
    return await apiRequest(`/members/${id}/`, 'PUT', memberData);
}

async function blockMember(id) {
    return await apiRequest(`/members/${id}/block/`, 'POST');
}

async function unblockMember(id) {
    return await apiRequest(`/members/${id}/unblock/`, 'POST');
}

async function getMemberHistory(id) {
    return await apiRequest(`/members/${id}/history/`);
}

// ======================
// Transactions API
// ======================

async function getTransactions(page = 1) {
    return await apiRequest(`/transactions/?page=${page}`);
}

async function issueBook(transactionData) {
    // transactionData = { member: id, book: id, notes: "..." }
    return await apiRequest('/transactions/', 'POST', transactionData);
}

async function returnBook(transactionId) {
    return await apiRequest(`/transactions/${transactionId}/return/`, 'POST');
}

// ======================
// Reservations API
// ======================

async function getReservations(page = 1) {
    return await apiRequest(`/reservations/?page=${page}`);
}

async function createReservation(reservationData) {
    // reservationData = { member: id, book: id }
    return await apiRequest('/reservations/', 'POST', reservationData);
}

async function approveReservation(id) {
    return await apiRequest(`/reservations/${id}/approve/`, 'POST');
}

async function cancelReservation(id) {
    return await apiRequest(`/reservations/${id}/cancel/`, 'POST');
}

// ======================
// Fines API
// ======================

async function getFines(page = 1) {
    return await apiRequest(`/fines/?page=${page}`);
}

async function collectFine(id) {
    return await apiRequest(`/fines/${id}/collect/`, 'POST');
}

async function waiveFine(id) {
    return await apiRequest(`/fines/${id}/waive/`, 'POST');
}

async function getFineSettings() {
    return await apiRequest('/fines/settings/');
}

async function updateFineSettings(finePerDay) {
    return await apiRequest('/fines/settings/', 'PUT', { fine_per_day: finePerDay });
}

// ======================
// Notifications API
// ======================

async function getNotifications(page = 1) {
    return await apiRequest(`/notifications/?page=${page}`);
}

async function markNotificationRead(id) {
    return await apiRequest(`/notifications/${id}/read/`, 'POST');
}

async function markAllNotificationsRead() {
    return await apiRequest('/notifications/mark-all-read/', 'POST');
}

// ======================
// Dashboard & Reports API
// ======================

async function getDashboardStats() {
    return await apiRequest('/books/dashboard/stats/');
}

async function getInventoryReport() {
    return await apiRequest('/books/reports/inventory/');
}

async function getCirculationReport() {
    return await apiRequest('/books/reports/circulation/');
}

async function getFinesReport() {
    return await apiRequest('/books/reports/fines/');
}

async function getOverdueReport() {
    return await apiRequest('/books/reports/overdue/');
}

// ======================
// UI Helper Functions
// ======================

function showError(message) {
    // Show error notification
    alert(message); // Replace with your UI notification system
}

function showSuccess(message) {
    // Show success notification
    alert(message); // Replace with your UI notification system
}

// ======================
// Example Usage in HTML
// ======================

/*
// Login Form Example
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await login(email, password);
    if (result.success) {
        showSuccess('Login successful!');
        window.location.href = '/dashboard.html';
    } else {
        showError(result.message);
    }
});

// Load Books Example
async function loadBooks() {
    const result = await getBooks(1);
    if (result.status === 'success') {
        const books = result.data.results;
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = '';
        
        books.forEach(book => {
            const bookCard = `
                <div class="book-card">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author_name}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <p>Available: ${book.available_quantity}/${book.quantity}</p>
                    <button onclick="viewBook(${book.id})">View Details</button>
                </div>
            `;
            booksList.innerHTML += bookCard;
        });
    }
}

// Issue Book Example
async function issueBookToMember() {
    const memberId = document.getElementById('memberId').value;
    const bookId = document.getElementById('bookId').value;
    const notes = document.getElementById('notes').value;
    
    const result = await issueBook({
        member: memberId,
        book: bookId,
        notes: notes
    });
    
    if (result.status === 'success') {
        showSuccess('Book issued successfully!');
        loadTransactions(); // Refresh the list
    } else {
        showError(result.message);
    }
}

// Dashboard Example
async function loadDashboard() {
    const stats = await getDashboardStats();
    if (stats.status === 'success') {
        document.getElementById('totalBooks').textContent = stats.data.stats.total_books;
        document.getElementById('totalMembers').textContent = stats.data.stats.total_members;
        document.getElementById('activeTransactions').textContent = stats.data.stats.active_transactions;
        document.getElementById('overdueBooks').textContent = stats.data.stats.overdue_books;
        
        // Load monthly chart
        const monthlyData = stats.data.monthly_borrowing;
        createChart(monthlyData);
    }
}

// Search Books Example
document.getElementById('searchInput').addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    if (searchTerm.length > 2) {
        const result = await getBooks(1, searchTerm);
        displayBooks(result.data.results);
    }
});
*/

// ======================
// Initialize on page load
// ======================

document.addEventListener('DOMContentLoaded', () => {
    loadToken();
    
    // Check if user is logged in
    if (!authToken && !window.location.pathname.includes('login')) {
        window.location.href = '/login.html';
    }
    
    // If on dashboard, load data
    if (window.location.pathname.includes('dashboard')) {
        loadDashboard();
    }
});
