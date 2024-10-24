// frontend/app.js
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('luan').value;
    const password = document.getElementById('0710').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) throw new Error('Login falhou');
        return response.json();
    })
    .then(data => {
        console.log('Login bem-sucedido:', data);
        // Aqui você pode redirecionar ou mostrar a tela principal
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});