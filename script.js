const diceData = {
    "d6": {1: "Nada", 2: "Nada", 3: "Coruja", 4: "Coruja/Cervo", 5: "Coruja/Cervo", 6: "Joaninha"},
    "d10": {1: "Nada", 2: "Nada", 3: "Coruja", 4: "Coruja/Cervo", 5: "Coruja/Cervo", 6: "Joaninha", 7: "Joaninha/Joaninha", 8: "Joaninha/Cervo", 9: "Joaninha/Cervo/Coruja", 10: "Joaninha/Joaninha/Coruja"},
    "d12": {1: "Nada", 2: "Nada", 3: "Coruja", 4: "Coruja/Cervo", 5: "Coruja/Cervo", 6: "Joaninha", 7: "Joaninha/Joaninha", 8: "Joaninha/Cervo", 9: "Joaninha/Cervo/Coruja", 10: "Joaninha/Joaninha/Coruja", 11: "Joaninha/Cervo/Cervo/Coruja", 12: "Coruja/Coruja"}
};

let selectedDice = { "d6": 0, "d10": 0, "d12": 0 }; // Contagem de dados selecionados

// Função para adicionar ou remover dados
document.querySelectorAll('.dice').forEach(dice => {
    dice.addEventListener('click', function() {
        const diceType = this.getAttribute('data-dice');
        
        // Adiciona o dado selecionado à lista de dados selecionados
        if (selectedDice[diceType] < 5) { // Limita a seleção a 5 dados por tipo
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

    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            const diceElement = document.createElement('div');
            diceElement.classList.add('selected-dice');
            diceElement.textContent = diceType.toUpperCase();

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
            results.push(`${diceType.toUpperCase()} Rolado: ${diceData[diceType][randomFace]} (Face: ${randomFace})`);
        }
    }

    // Exibe os resultados
    const resultDiv = document.getElementById('result');
    const interpretationDiv = document.getElementById('interpretation');
    if (hasDice) {
        resultDiv.innerHTML = results.join('<br>');
        interpretationDiv.innerHTML = "<b>Interpretação: </b>Baseado nas faces roladas, você pode determinar o resultado final.";
    } else {
        resultDiv.innerHTML = "Nenhum dado selecionado!";
        interpretationDiv.innerHTML = "";
    }
});

// Inicializa a lista de dados e resultados
updateSelectedDiceList();
