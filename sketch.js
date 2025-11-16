var word = "",
    wordle = "",
    gno = 0,
    listofwords,
    count = 0;
let filteredwords = [];
let shuffledwords = [];
let words = [];

function menu() {
    document.getElementById("menubar").style.width = "30%";
}

function closemenu() {
    document.getElementById("menubar").style.width = "0";
}

async function fetchWords() {
    let response = await fetch(
        "https://raw.githubusercontent.com/openethereum/wordlist/master/res/wordlist.txt"
    );
    let text = await response.text();
    let words = text.split("\n");
    console.log("Words:", words);
    return words;
}
//to shuffle the words
function fisheryates(wordlist) {
    console.log("we enter fisher:", wordlist);
    var i = wordlist.length;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = wordlist[j];
        wordlist[j] = wordlist[i];
        wordlist[i] = temp;
    }
    return wordlist;
}
//
function preload() {
    let len = 5; //delete later
    console.log("startfetching");
    fetchWords().then((wordsfromfetch) => {
        words = wordsfromfetch;
        filteredwords = wordsfromfetch.filter((words) => words.length == len);
        console.log("Filtered Words:", filteredwords);
        shuffledwords = fisheryates(filteredwords);
        console.log(filteredwords);
    });
}

function setwordle() {
    let len = document.getElementById("wlen").value;
    console.log("in setwordle:", words);
    filteredwords = words.filter((word) => word.length == len);
    shuffledwords = fisheryates(filteredwords);

    let w = shuffledwords[count]; //count to keep giving new words to guess
    document.getElementById("wordle").value = w;
}

function withword() {
    let nword = document.getElementById("cword").value.trim().toLowerCase();
    document.getElementById("lenwarn").innerText = "";
    document.getElementById("wrdwarn").innerText = "";
    if (nword.length === 0) {
        document.getElementById("wrdwarn").innerText = "Please enter a word!";
        return;
    }

    // Optional: validate alphabetic
    if (!/^[a-zA-Z]+$/.test(nword)) {
        document.getElementById("wrdwarn").innerText =
            "Word must contain only letters!";
        return;
    }

    wordle = nword;
    document.getElementById("wordle").value = nword;

    // Reset everything
    gno = 0;
    count = 0;
    document.getElementById("urguess").maxLength = wordle.length;

    generateboxes(); // new boxes based on new length
}
//
function withlen() {
    let nlen = Number(document.getElementById("wlen").value);
    document.getElementById("lenwarn").innerText = "";
    document.getElementById("wrdwarn").innerText = "";

    if (!words || words.length === 0) {
        console.warn("Words not loaded yet!");
        return;
    }

    // Filter words of this length
    filteredwords = words.filter((w) => w.length === nlen);

    if (filteredwords.length === 0) {
        document.getElementById("lenwarn").innerText =
            "No words found with that length!";
        return;
    }

    shuffledwords = fisheryates(filteredwords);

    count = 0;
    gno = 0;

    // Set new wordle
    wordle = shuffledwords[count];
    document.getElementById("wordle").value = wordle;

    // Resize guess input
    document.getElementById("urguess").maxLength = wordle.length;

    generateboxes(); // refresh the grid
}

//
function setup() {
    setwordle();
}

function draw() {
    let newword = document.getElementById("urguess").value;
    if (newword != word) {
        word = newword;
    }
    let newwordle = document.getElementById("wordle").value;
    if (newwordle != wordle) {
        wordle = newwordle;
        document.getElementById("urguess").maxLength = wordle.length;
        generateboxes();
    }
    writeguess();
}

//this function makes the grid dynamically whenever the word changes
function generateboxes() {
    document.getElementById("result").innerText = ""; //resets
    const outerbox = document.getElementById("word");
    let cols = wordle.length; //set default wordle

    outerbox.innerHTML = "";

    for (var i = 0; i < 6; i += 1) {
        const guess = document.createElement("div");
        guess.className = "guess";
        guess.style.display = "flex";

        for (var j = 0; j < cols; j += 1) {
            const letter = document.createElement("div");
            letter.className = "letter";

            letter.innerText = " ";
            guess.appendChild(letter);
        }
        outerbox.appendChild(guess);
    }
}

//this function helps in writing the guesses directly into the boxes generated
function writeguess() {
    if (document.getElementById("result").innerText != "") {
        return;
    }
    let parent = document.getElementById("word");
    let child = document.getElementsByClassName("guess");
    let len = child[gno].children.length;

    if (word.length != wordle.length) {
        document.getElementById(
            "warning"
        ).innerText = `The word should be ${wordle.length} letter long!!!`;
    } else document.getElementById("warning").innerText = " ";

    for (var i = 0; i < len; i += 1) {
        let childofchild = child[gno].children[i];
        let a = word.charAt(i);
        childofchild.textContent = a;
    }
}

//This function keeps a track of how many guesses have been made and even checks if it is a valid guess or not.
function guessesno() {
    if (wordle.length == word.length) {
        gno += 1;
        checker();
        document.getElementById("urguess").value = "";
    }

    if (gno == 6) {
        //only 6 rows in wordle usually
        resultdisplay();
        gno = 0;
    }
}

//This function colors the text boxes according to the letter present
function checker() {
    let w = document.getElementsByClassName("guess");
    let arr_wordle = new Array(wordle.length).fill(1);

    for (var i = 0; i < wordle.length; i++) {
        if (word.charAt(i).toLowerCase() == wordle.charAt(i).toLowerCase()) {
            arr_wordle[i] = 0;
            let l = w[gno - 1].children[i];
            l.style.backgroundColor = "pink";
            l.style.color = "white";
            l.style.border = "1px solid pink";
        }
    }
    // console.log(arr_wordle);

    for (var i = 0; i < wordle.length; i++) {
        for (var j = 0; j < wordle.length; j++) {
            if (
                word.charAt(i).toLowerCase() ==
                    wordle.charAt(j).toLowerCase() &&
                arr_wordle[j] == 1
            ) {
                arr_wordle[j] = 0;
                let l = w[gno - 1].children[i];
                l.style.backgroundColor = "lavender";
                l.style.color = "white";
                // l.style.border="1px solid lavender";
            }
        }
    }
    // console.log(arr_wordle);
    if (word.toLowerCase() == wordle.toLowerCase()) {
        resultdisplay();
        gno = 0;
    }
}

//This function shows if you have guessed the word correctly.Eventually i got to lazy to create result pages...
function resultdisplay() {
    //if the person was able to guess or not
    //I'll make a div called result prolly let's see
    //or just game the page to a different html page with result (2 more html pages to make)
    let r = document.getElementById("result");
    r.style.border = "1px solid pink";
    r.style.color = "pink";
    r.style.fontSize = "32px";
    if (word.toLowerCase() == wordle.toLowerCase()) {
        r.innerText = "Congratulations!!! You've guessed the Word!!!";
    } else {
        r.innerText = `You've failed to guess the word "${wordle}"...Better Luck next time!!!`;
    }

    let butt = document.createElement("button");
    butt.style.backgroundColor = "pink";
    butt.innerText = "Play Again?";
    butt.style.padding = "10px";
    butt.style.border = "1px solid white";
    butt.style.color = "white";
    butt.onclick = reseteverything;

    r.appendChild(document.createElement("br")); // Add line break
    r.appendChild(butt);
}

//This resets the game.
function reseteverything() {
    count = count + 1;
    let w = shuffledwords[count];
    document.getElementById("wordle").value = w;
    document.getElementById("result").style.border = "none";
    generateboxes();
}
