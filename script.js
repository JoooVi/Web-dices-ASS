const diceData = {
    "d6": {
        1: ["assets/nada.png"],  // Uma imagem
        2: ["assets/nada.png"],
        3: ["assets/coruja.png"], // Uma imagem
        4: ["assets/coruja.png", "assets/cervo.png"], // Duas imagens
        5: ["assets/coruja.png", "assets/cervo.png"], // Duas imagens
        6: ["assets/joaninha.png"] // Uma imagem
    },
    "d10": {
        1: ["assets/nada.png"],
        2: ["assets/nada.png"],
        3: ["assets/coruja.png"],
        4: ["assets/coruja.png", "assets/cervo.png"],
        5: ["assets/coruja.png", "assets/cervo.png"],
        6: ["assets/joaninha.png"],
        7: ["assets/joaninha.png", "assets/joaninha.png"],
        8: ["assets/joaninha.png", "assets/cervo.png"],
        9: ["assets/joaninha.png", "assets/cervo.png", "assets/coruja.png"],
        10: ["assets/joaninha.png", "assets/joaninha.png", "assets/coruja.png"]
    },
    "d12": {
        1: ["assets/nada.png"],
        2: ["assets/nada.png"],
        3: ["assets/coruja.png"],
        4: ["assets/coruja.png", "assets/cervo.png"],
        5: ["assets/coruja.png", "assets/cervo.png"],
        6: ["assets/joaninha.png"],
        7: ["assets/joaninha.png", "assets/joaninha.png"],
        8: ["assets/joaninha.png", "assets/cervo.png"],
        9: ["assets/joaninha.png", "assets/cervo.png", "assets/coruja.png"],
        10: ["assets/joaninha.png", "assets/joaninha.png", "assets/coruja.png"],
        11: ["assets/joaninha.png", "assets/cervo.png", "assets/cervo.png", "assets/coruja.png"],
        12: ["assets/coruja.png", "assets/coruja.png"]
    }
};


let selectedDice = { "d6": 0, "d10": 0, "d12": 0 }; // Contagem de dados selecionados

// Função para adicionar ou remover dados
document.querySelectorAll('.dice').forEach(dice => {
    dice.addEventListener('click', function() {
        const diceType = this.getAttribute('data-dice');
        
        // Adiciona o dado selecionado à lista de dados selecionados
        if (selectedDice[diceType] < 10) { // Limita a seleção a 10 dados por tipo
            selectedDice[diceType] += 1;
        } else {
            selectedDice[diceType] -= 1;
        }
        updateSelectedDiceList(); // Atualiza a lista de dados selecionados
    });
});

// Função para atualizar a lista de dados selecionados
function updateSelectedDiceList() {
    const selectedDiceList = document.getElementById('selectedDiceList');
    selectedDiceList.innerHTML = ''; // Limpa a lista

    let anyDiceSelected = false;

    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            anyDiceSelected = true; // Indica que há dados selecionados
            const diceElement = document.createElement('div');
            diceElement.classList.add('selected-dice');
            diceElement.innerHTML = `<span>${diceType.toUpperCase()}</span>`;

            // Adiciona um evento para remover o dado da seleção
            diceElement.addEventListener('click', function() {
                selectedDice[diceType] -= 1;
                updateSelectedDiceList(); // Atualiza a lista de dados
            });

            selectedDiceList.appendChild(diceElement);
        }
    }

    // Se não há mais dados selecionados, limpa o resultado e a interpretação
    if (!anyDiceSelected) {
        document.getElementById('result').innerHTML = "";
        document.getElementById('interpretation').innerHTML = "";
    }
}


// Função para rolar os dados e exibir os resultados
document.getElementById('rollButton').addEventListener('click', function() {
    rolledResults = []; // Reinicia os resultados a cada rolagem
    let hasDice = false;
    const results = [];

    // Limpa o contêiner de interpretação e resultados ao re-rolar
    document.getElementById('interpretation').innerHTML = '';
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Rola os dados selecionados
    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            hasDice = true;
            const randomFace = Math.floor(Math.random() * Object.keys(diceData[diceType]).length) + 1;
            const images = diceData[diceType][randomFace];

            // Cria um contêiner para cada face rolada
            const diceContainer = document.createElement('div');
            diceContainer.classList.add('dice-container');
            
            // Salva o resultado e exibe as imagens
            const faceResult = { images: images, diceType: diceType };
            rolledResults.push(faceResult);

            // Adiciona as imagens e o texto "Nada" ao contêiner
            images.forEach(imageSrc => {
                if (imageSrc === "nada") {
                    const textElement = document.createElement('span');
                    textElement.textContent = "Nada"; // Exibe "Nada" como texto
                    textElement.classList.add('dice-text');
                    diceContainer.appendChild(textElement);
                } else {
                    const imageElement = document.createElement('img');
                    imageElement.src = imageSrc;
                    imageElement.classList.add('dice-image');
                    diceContainer.appendChild(imageElement);
                }
            });

            // Evento para selecionar o resultado final
            diceContainer.addEventListener('click', function() {
                displayFinalResult(faceResult); // Exibe apenas o resultado selecionado
            });

            results.push(diceContainer);
        }
    }

    // Exibe os resultados na tela
    if (hasDice) {
        results.forEach(result => {
            resultDiv.appendChild(result);
        });
    } else {
        resultDiv.innerHTML = "Nenhum dado selecionado!";
    }
});

// Função para exibir apenas o dado final selecionado e mostrar a contagem
function displayFinalResult(finalResult) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Limpa todos os outros resultados

    // Cria um contêiner para o resultado final selecionado
    const finalContainer = document.createElement('div');
    finalContainer.classList.add('dice-container');
    
    finalResult.images.forEach(imageSrc => {
        if (imageSrc === "nada") {
            const textElement = document.createElement('span');
            textElement.textContent = "Nada";
            textElement.classList.add('dice-text');
            finalContainer.appendChild(textElement);
        } else {
            const imageElement = document.createElement('img');
            imageElement.src = imageSrc;
            imageElement.classList.add('dice-image');
            finalContainer.appendChild(imageElement);
        }
    });

    resultDiv.appendChild(finalContainer);

    // Calcula e exibe a contagem dos tipos de imagem
    calculateResult(finalResult);
}

// Função para calcular e exibir a quantidade de sucessos, adaptações, pressões e nada
function calculateResult(finalResult) {
    let sucesso = 0;
    let adaptacao = 0;
    let pressao = 0;
    let nada = 0;

    // Classificação das imagens atualizada
    const imageTypes = {
        "assets/joaninha.png": "sucesso",      // Joaninha -> Sucesso
        "assets/coruja.png": "pressao",        // Coruja -> Pressão
        "assets/cervo.png": "adaptacao",       // Cervo -> Adaptação
        "assets/nada.png": "nada"                         // "Nada" -> Nada
    };

    // Conta cada tipo de imagem
    finalResult.images.forEach(imageSrc => {
        switch (imageTypes[imageSrc]) {
            case "sucesso":
                sucesso++;
                break;
            case "adaptacao":
                adaptacao++;
                break;
            case "pressao":
                pressao++;
                break;
            case "nada":
                nada++;
                break;
        }
    });

    // Exibe a contagem
    const interpretationDiv = document.getElementById('interpretation');
    interpretationDiv.innerHTML = `
        <b>Resultado Final Selecionado:</b><br>
        Sucesso: ${sucesso}<br>
        Adaptação: ${adaptacao}<br>
        Pressão: ${pressao}<br>
        Nada: ${nada}
    `;
}
