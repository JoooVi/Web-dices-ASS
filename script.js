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
// Função para atualizar a lista de dados selecionados
function updateSelectedDiceList() {
    const selectedDiceList = document.getElementById('selectedDiceList');
    selectedDiceList.innerHTML = ''; // Limpa a lista

    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            const diceElement = document.createElement('div');
            diceElement.classList.add('selected-dice');

            // Adiciona um texto simples representando o dado selecionado
            diceElement.innerHTML = `<span>${diceType.toUpperCase()}</span>`;  // Exibe o tipo do dado (D6, D10, D12)

            // Adiciona um evento para remover o dado da seleção
            diceElement.addEventListener('click', function() {
                selectedDice[diceType] -= 1;
                updateSelectedDiceList(); // Atualiza a lista de dados
            });

            selectedDiceList.appendChild(diceElement);
        }
    }
}

// Função para rolar os dados e atualizar os resultados
document.getElementById('rollButton').addEventListener('click', function() {
    let results = [];
    let hasDice = false;

    // Rola os dados selecionados
    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            hasDice = true;
            const randomFace = Math.floor(Math.random() * Object.keys(diceData[diceType]).length) + 1;
            const images = diceData[diceType][randomFace]; // Pode ter várias imagens
            const description = `Número Rolado: ${randomFace}`; // Descrição do número que caiu

            // Cria um contêiner para cada conjunto de imagens e descrições
            const diceContainer = document.createElement('div');
            diceContainer.classList.add('dice-container');

            // Se a face não for "nada", cria as imagens
            if (images[0] !== "assets/nada.png") {
                images.forEach(imageSrc => {
                    const imageElement = document.createElement('img');
                    imageElement.src = imageSrc;
                    imageElement.alt = "Face do Dado";
                    imageElement.classList.add('dice-image');
                    diceContainer.appendChild(imageElement);
                });
            }

            // Cria a descrição, independentemente da imagem
            const descriptionElement = document.createElement('div');
            descriptionElement.textContent = description;
            descriptionElement.classList.add('dice-description');
            diceContainer.appendChild(descriptionElement);

            // Adiciona o contêiner ao resultado
            results.push(diceContainer);
        }
    }

    // Exibe os resultados
    const resultDiv = document.getElementById('result');
    const interpretationDiv = document.getElementById('interpretation');
    if (hasDice) {
        // Limpa resultados anteriores e adiciona os novos
        resultDiv.innerHTML = '';
        results.forEach(result => {
            resultDiv.appendChild(result);
        });
        interpretationDiv.innerHTML = "<b>Interpretação: </b>Baseado nas faces roladas, você pode determinar o resultado final.";
    } else {
        resultDiv.innerHTML = "Nenhum dado selecionado!";
        interpretationDiv.innerHTML = "";
    }
});