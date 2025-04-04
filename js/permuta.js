document.getElementById('processBtn').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    const key = document.getElementById('key').value;
    const action = document.getElementById('action').value;
    
    if (!message || !key) {
        alert('Por favor, preencha a mensagem e a chave.');
        return;
    }
    
    let result;
    if (action === 'encrypt') {
        result = encrypt(message, key);
    } else {
        result = decrypt(message, key);
    }
    
    document.getElementById('result').textContent = result;
});

function encrypt(text, key) {
    // Remove espaços e converte para maiúsculas
    const cleanedText = text.replace(/\s+/g, '').toUpperCase();
    const cleanedKey = key.replace(/\s+/g, '').toUpperCase();
    
    // Determina o número de colunas baseado no comprimento da chave
    const cols = cleanedKey.length;
    const rows = Math.ceil(cleanedText.length / cols);
    
    // Preenche com 'X' se necessário para completar a última linha
    const paddedText = cleanedText.padEnd(rows * cols, 'X');
    
    // Cria a matriz para a permutação
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const start = i * cols;
        const end = start + cols;
        matrix.push(paddedText.slice(start, end).split(''));
    }
    
    // Obtém a ordem de leitura das colunas baseada na chave
    const keyOrder = getKeyOrder(cleanedKey);
    let ciphertext = '';
    
    // Lê as colunas na ordem determinada pela chave
    for (const col of keyOrder) {
        for (let row = 0; row < rows; row++) {
            ciphertext += matrix[row][col];
        }
    }
    
    return ciphertext;
}

function decrypt(ciphertext, key) {
    const cleanedKey = key.replace(/\s+/g, '').toUpperCase();
    const cols = cleanedKey.length;
    const rows = Math.ceil(ciphertext.length / cols);
    
    // Obtém a ordem de leitura das colunas
    const keyOrder = getKeyOrder(cleanedKey);
    
    // Cria uma matriz vazia
    const matrix = Array.from({ length: rows }, () => new Array(cols));
    
    // Preenche a matriz coluna por coluna na ordem original
    let index = 0;
    for (const col of keyOrder) {
        for (let row = 0; row < rows; row++) {
            if (index < ciphertext.length) {
                matrix[row][col] = ciphertext[index++];
            }
        }
    }
    
    // Lê a matriz linha por linha para obter o texto original
    let plaintext = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            plaintext += matrix[row][col];
        }
    }
    
    // Remove os 'X' adicionados durante a criptografia
    return plaintext.replace(/X+$/, '');
}

function getKeyOrder(key) {
    // Cria um array de objetos com caractere e índice original
    const keyChars = key.split('').map((char, index) => ({ char, index }));
    
    // Ordena os caracteres alfabeticamente, mantendo o índice original para desempate
    keyChars.sort((a, b) => {
        if (a.char < b.char) return -1;
        if (a.char > b.char) return 1;
        return a.index - b.index;
    });
    
    // Extrai os índices originais na nova ordem
    return keyChars.map(item => item.index);
}