let cards = [];
let deck = [];
let currentCard = null;
let isGameReady = false;

// ----------------------------
// Завантаження гри
// ----------------------------
async function loadGame() {

    try {

        const response = await fetch("data/cards.json");

        if (!response.ok) throw new Error("Не вдалося завантажити cards.json");

        cards = await response.json();

        // Чи є вже готова колода?
        const savedDeck = localStorage.getItem("deck");
        const savedIndex = Number(localStorage.getItem("deckIndex"));

        if (savedDeck) {

            try {

                deck = JSON.parse(savedDeck);

            } catch {

                localStorage.removeItem("deck");

            }

        }

        if (!Array.isArray(deck) || !deck.length) {

            createNewDeck();

        }

        if (!Number.isInteger(savedIndex) || savedIndex < 0 || savedIndex > deck.length) {

            localStorage.setItem("deckIndex", 0);

        }

        isGameReady = true;
        document.getElementById("missionButton").disabled = false;
        document.getElementById("libraryButton").disabled = false;
        updateProgress();

    } catch (error) {

    console.error(error);

    console.error(error.stack);

    document.getElementById("progress").textContent = "Не вдалося завантажити картки.";

}

}

loadGame();


// ----------------------------
// Створити нову перемішану колоду
// ----------------------------
function createNewDeck() {

    deck = [...cards];

    shuffle(deck);

    localStorage.setItem("deck", JSON.stringify(deck));

    localStorage.setItem("deckIndex", 0);

}


// ----------------------------
// Перемішування Fisher-Yates
// ----------------------------
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

}


// ----------------------------
// Відкрити місію
// ----------------------------
function nextMission() {

    if (!isGameReady) return;

    let index = Number(localStorage.getItem("deckIndex"));

    if (index >= deck.length) {

        alert("🎉 Молодець! Ти пройшов усю колоду!");

        return;

    }

    currentCard = deck[index];

    document.getElementById("start").classList.add("hidden");

    document.getElementById("screen2").classList.remove("hidden");

    document.getElementById("completeButton").classList.remove("hidden");
    document.getElementById("libraryBackButton").classList.add("hidden");

    document.getElementById("cardImg").src = currentCard.image;

}


// ----------------------------
// Виконано
// ----------------------------
function completeMission() {

    let index = Number(localStorage.getItem("deckIndex"));

    index++;

    localStorage.setItem("deckIndex", index);

    location.reload();

}


// ----------------------------
// Оновлення прогресу
// ----------------------------
function updateProgress() {

    let index = Number(localStorage.getItem("deckIndex"));

    let left = cards.length - index;

    document.getElementById("progress").innerHTML =
        "🌟 Залишилось пригод: <b>" + left + "</b>";

}


// ----------------------------
// Скинути прогрес
// ----------------------------
function resetGame() {

    localStorage.removeItem("deck");

    localStorage.removeItem("deckIndex");

    location.reload();

}
// ==========================
// БІБЛІОТЕКА ПРИГОД
// ==========================

function openLibrary(){

    if (!isGameReady) return;

    document.getElementById("start").classList.add("hidden");

    document.getElementById("library").classList.remove("hidden");

}

function closeLibrary(){

    document.getElementById("library").classList.add("hidden");

    document.getElementById("start").classList.remove("hidden");

}

function openCategory(category) {

    if (!isGameReady) return;

    const categoryCards = cards.filter(card => card.category === category);

    if (!categoryCards.length) return;

    shuffle(categoryCards);

    currentCard = categoryCards[0];

    document.getElementById("library").classList.add("hidden");
    document.getElementById("screen2").classList.remove("hidden");
    document.getElementById("cardImg").src = currentCard.image;
    document.getElementById("completeButton").classList.add("hidden");
    document.getElementById("libraryBackButton").classList.remove("hidden");

}

function backToLibrary() {

    document.getElementById("screen2").classList.add("hidden");
    document.getElementById("library").classList.remove("hidden");

}
