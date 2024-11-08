const diceData = {
    "d6": {
        1: ["assets/nada.png"],  
        2: ["assets/nada.png"],
        3: ["assets/coruja.png"], 
        4: ["assets/coruja.png", "assets/cervo.png"], 
        5: ["assets/coruja.png", "assets/cervo.png"], 
        6: ["assets/joaninha.png"]
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

let selectedDice = { "d6": 0, "d10": 0, "d12": 0 };
let selectedResults = [];
let rolledResults = [];

// Seleção e desmarcação dos dados
document.querySelectorAll('.dice').forEach(dice => {
    dice.addEventListener('click', function() {
        const diceType = this.getAttribute('data-dice');
        
        if (selectedDice[diceType] < 10) {
            selectedDice[diceType] += 1;
        } else if (selectedDice[diceType] > 0) {
            selectedDice[diceType] -= 1;
        }
        updateSelectedDiceList();
    });
});

// Atualiza a lista de dados selecionados
function updateSelectedDiceList() {
    const selectedDiceList = document.getElementById('selectedDiceList');
    selectedDiceList.innerHTML = '';

    let anyDiceSelected = false;

    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            anyDiceSelected = true;
            const diceElement = document.createElement('div');
            diceElement.classList.add('selected-dice');
            diceElement.innerHTML = `<span>${diceType.toUpperCase()}</span>`;

            diceElement.addEventListener('click', function() {
                selectedDice[diceType] -= 1;
                updateSelectedDiceList();
            });

            selectedDiceList.appendChild(diceElement);
        }
    }

    // Esconder o botão quando não houver dados selecionados
    if (!anyDiceSelected) {
        document.getElementById('result').innerHTML = "";
        document.getElementById('interpretation').innerHTML = "";
        document.getElementById('okayButton').classList.remove('show');  // Esconde o botão
    }
}

// Rola os dados selecionados
document.getElementById('rollButton').addEventListener('click', function() {
    rolledResults = [];
    let hasDice = false;
    const results = [];

    document.getElementById('interpretation').innerHTML = '';
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    for (const diceType in selectedDice) {
        for (let i = 0; i < selectedDice[diceType]; i++) {
            hasDice = true;
            const randomFace = Math.floor(Math.random() * Object.keys(diceData[diceType]).length) + 1;
            const images = diceData[diceType][randomFace];

            const diceContainer = document.createElement('div');
            diceContainer.classList.add('dice-container');
            
            const faceResult = { images: images, diceType: diceType, randomFace: randomFace };
            rolledResults.push(faceResult);

            images.forEach(imageSrc => {
                if (imageSrc.includes("nada")) {
                    const textElement = document.createElement('span');
                    textElement.textContent = "Nada";
                    textElement.classList.add('dice-text');
                    diceContainer.appendChild(textElement);
                } else {
                    const imageElement = document.createElement('img');
                    imageElement.src = imageSrc;
                    imageElement.classList.add('dice-image');
                    diceContainer.appendChild(imageElement);
                }
            });

            // Adiciona o evento de clique para alternar a seleção de um resultado
            diceContainer.addEventListener('click', function() {
                const index = selectedResults.findIndex(result => result === faceResult);
                if (index !== -1) {
                    selectedResults.splice(index, 1);
                    diceContainer.classList.remove('selected-border');
                } else {
                    selectedResults.push(faceResult);
                    diceContainer.classList.add('selected-border');
                }
            });

            results.push(diceContainer);
        }
    }

    if (hasDice) {
        results.forEach(result => {
            resultDiv.appendChild(result);
        });

        // Mostrar o botão de seleção após rolar os dados
        document.getElementById('okayButton').classList.add('show');
    } else {
        resultDiv.innerHTML = "Nenhum dado selecionado!";
    }
});

// Interpreta os resultados selecionados
document.getElementById('okayButton').addEventListener('click', function() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (selectedResults.length === 0) {
        resultDiv.innerHTML = "Nenhum resultado selecionado!";
        return;
    }

    selectedResults.forEach(finalResult => {
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

        const interpretationContainer = document.createElement('div');
        interpretationContainer.classList.add('interpretation-container');
        
        const { sucesso, adaptacao, pressao, nada } = calculateResult(finalResult);

        interpretationContainer.innerHTML = `
            <b>Resultado Final:</b><br>
            Sucesso: ${sucesso}<br>
            Adaptação: ${adaptacao}<br>
            Pressão: ${pressao}<br>
            Nada: ${nada}
        `;

        finalContainer.appendChild(interpretationContainer);
        resultDiv.appendChild(finalContainer);
    });

    selectedResults = [];
});

// Calcula o resultado com base nas imagens
function calculateResult(finalResult) {
    let sucesso = 0;
    let adaptacao = 0;
    let pressao = 0;
    let nada = 0;

    const imageTypes = {
        "assets/joaninha.png": "sucesso",
        "assets/coruja.png": "pressao",
        "assets/cervo.png": "adaptacao",
        "assets/nada.png": "nada"
    };

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

    return { sucesso, adaptacao, pressao, nada };
}