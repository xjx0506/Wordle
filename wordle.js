const tilesContainer = document.querySelector('.tile_container')
const keyboard = document.querySelector('.keys_container')
const messageDisplay = document.querySelector('.message_container')

const keys = ['Q','W','E','R','T','Y','U','I','O','P',
                'A','S','D','F','G','H','J','K','L',
                'Z','X','C','V','B','N','M', 
                    'ENTER','<<'
]
let word
// make a call to the random word api and collect the response
const getWord = () =>{
    fetch('http://localhost:8000/word')
    .then(res => res.json())
    .then(json => {
        console.log(json);
        word = json.toUpperCase()
    })
    .catch(error => console.log(error))
}
getWord()
const guessRow = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','']
]
let currRow = 0;
let currTile = 0;
// for each row, create a div
guessRow.forEach((guessRow, guessRowIndex) => {
    const row = document.createElement('div')
    // set this div an id
    row.setAttribute('id', 'guessRow-' + guessRowIndex)
    // for each row div, create a div for each tile, give each tile an id, an attribute, append it to the row element
    guessRow.forEach((guess, guessIndex)=> {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', `guess_row-${guessRowIndex}-tile-${guessIndex}`)
        //add all tiles to the same tile class
        tileElement.classList.add('tile')
        row.append(tileElement)
    })
    
    //append the element to the tile_container
    tilesContainer.append(row)
})

//create a button for each tile
keys.forEach(key =>{
  const buttonElement =  document.createElement('button')
  buttonElement.textContent = key
  buttonElement.setAttribute('id', key)
  buttonElement.addEventListener('click',()=>handleClick(key))
  keyboard.append(buttonElement)
})

// every time a button is clicked, call this function
function handleClick(key){
    console.log('clicked', key);
    if(key == '<<'){
        deleteLetter()
        console.log(guessRow);
        
        return
    }
    if(key === 'ENTER'){
        checkRow()
        console.log(guessRow);
        return
    }
    addletter(key)
    console.log(guessRow);
}
//make sure everytime we click a letter, it is added to the correct tile
function addletter(letter){
    if(currRow < 6 && currTile < 5){
        const tile = document.getElementById('guess_row-'+currRow+'-tile-'+currTile)
        tile.textContent = letter
        guessRow[currRow][currTile] = letter
        tile.setAttribute('data', letter)
        currTile++;

    } 
}
//delete the letter in the current tile
function deleteLetter(){
    // only delete if the current tile number in a row > 0, since we can't delele anything that doesn't exist
    if(currTile > 0){
         // we need to put currTile-- here because if not, it will try to set a none-exist letter to null, which causes an error
        currTile--
        const tile = document.getElementById('guess_row-'+currRow+'-tile-'+currTile)
        tile.textContent = ''
        guessRow[currRow][currTile] = ''
        tile.setAttribute('data', '')
    }
   

}

// to check if the word is matched with word
function checkRow(){
    //get the guess and turn it into array
    const guess = guessRow[currRow].join('')
    const isGameOver = false
    
    // only check when the current row in entirely filled
    if(currTile > 4){
       flipTile()
       console.log('guess is: ' + guess, 'wordle is '+ word)
       //if we have a match
       if(word === guess){
          showMessage("Awesome!")
          return
       }else{ //if we don't have a match
          if(currRow >= 5){ //if we have used all 6 opportunities
            isGameOver = true;
            return
          }else{//otherwise go to the next row
            currRow++
            currTile = 0 
          }
       }
    }
}

//display when a correct answer is guessed
function showMessage(msg){
    const msgElement = document.createElement('p')
    msgElement.textContent = msg
    messageDisplay.append(msgElement)
    //remove this element after 2 second
    setTimeout(() =>{
        messageDisplay.removeChild(msgElement)
    }, 2000)
}


function flipTile(){
    //get the current row, and select all of its 5 child elements
    const rowTiles = document.querySelector('#guessRow-'+currRow).childNodes
    const guess = []
    let checkWordle = word

    //store each tile in the guess array, each tile is an object, with tile's letter, and the color it currently should have
    rowTiles.forEach(tile =>{
        guess.push({letter: tile.getAttribute('data'), color: 'grey_overlay'})
    })

    guess.forEach((guess, index)=>{
        if(guess.letter === word[index]){
            guess.color = 'green_overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess =>{
        if(checkWordle.includes(guess.letter)){
            guess.color = 'yellow_overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
       setTimeout(() => {
            tile.classList.add(guess[index].color)
       }, 500*index); 
    
    })
}