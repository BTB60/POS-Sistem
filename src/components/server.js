document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([{ username: 'admin', password: 'admin', isAdmin: true, customers: [], sales: [] }]));
    }
    showLogin();
});

function showLogin() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('cash-register').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('cash-register').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('cash-register').classList.add('hidden');
    renderCustomers();
}

function showCashRegister() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('register-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('cash-register').classList.remove('hidden');
    renderSales();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.isAdmin) {
            showAdminPanel();
        } else {
            showCashRegister();
        }
    } else {
        alert('İstifadəçi adı və ya şifrə səhvdir');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    showLogin();
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const users = JSON.parse(localStorage.getItem('users'));

    if (username && password && !users.some(user => user.username === username)) {
        let newUser = { username, password, isAdmin: false, role, sales: [] };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        showLogin();
    } else {
        alert('İstifadəçi adı mövcuddur və ya boşdur');
    }
}

function addCustomer() {
    const customerName = document.getElementById('customer-name').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.username === currentUser.username);

    if (customerName) {
        users[userIndex].customers.push({ name: customerName, balance: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        renderCustomers();
        document.getElementById('customer-name').value = '';
    } else {
        alert('Müştəri adı boş ola bilməz');
    }
}

function renderCustomers() {
    const customerList = document.getElementById('customer-list');
    customerList.innerHTML = '';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === currentUser.username);

    user.customers.forEach(customer => {
        const listItem = document.createElement('li');
        listItem.innerText = customer.name;
        customerList.appendChild(listItem);
    });
}

function addSale() {
    const productName = document.getElementById('product-name').value;
    const productQuantity = parseInt(document.getElementById('product-quantity').value);
    let productPrice = 6; // Default price for normal sales

    // Check if customer is decorator or advertiser
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === currentUser.username);

    if (user.role === 'decorator') {
        productPrice = 10; // Price for decorators
    } else if (user.role === 'advertiser') {
        productPrice = 6; // Price for advertisers
    } else {
        // Default price if role is not specified or normal user
        productPrice = document.querySelector('input[name="product-price"]:checked').value;
    }

    const sale = { productName, productQuantity, productPrice, date: new Date().toLocaleString() };

    if (productName && productQuantity && productPrice) {
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        users[userIndex].sales.push(sale);
        localStorage.setItem('users', JSON.stringify(users));
        renderSales();
        document.getElementById('product-name').value = '';
        document.getElementById('product-quantity').value = '';
        document.getElementById('price-6').checked = true; // Reset to default price
    } else {
        alert('Zəhmət olmasa bütün sahələri doldurun');
    }
}

function renderSales() {
    const salesList = document.getElementById('sales-list');
    salesList.innerHTML = '';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === currentUser.username);

    user.sales.forEach(sale => {
        const listItem = document.createElement('li');
        listItem.innerText = `${sale.date} - ${sale.productName} - ${sale.productQuantity} ədəd - ${sale.productPrice.toFixed(2)} AZN`;
        salesList.appendChild(listItem);
    });
}

function calculateIncome(period) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === currentUser.username);
    const now = new Date();
    let startDate;

    switch (period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            break;
        case 'weekly':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            break;
    }

    const sales = user.sales.filter(sale => new Date(sale.date) > startDate);
    const totalIncome = sales.reduce((total, sale) => total + (sale.productPrice * sale.productQuantity), 0);
    document.getElementById('income-report').innerHTML = `<li>${period} gəliri: ${totalIncome.toFixed(2)} AZN</li>`;
}

function showUserTransactions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.username === currentUser.username);

    if (user.isAdmin) {
        let transactionsHtml = '<h2>İstifadəçinin Əməliyyatları</h2><ul>';

        user.transactions.forEach(transaction => {
            transactionsHtml += `<li>${transaction.type} - ${transaction.amount} AZN - Tarix: ${transaction.date}</li>`;
        });

        transactionsHtml += '</ul>';
        document.getElementById('transactions-list').innerHTML = transactionsHtml;
    } else {
        alert('Bu səhifəyə girməyinizə icazə verilməmişdir.');
    }
}

