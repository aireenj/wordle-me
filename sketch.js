var word="",wordle="",gno=0,listofwords;










function setup() {
  //createCanvas(400, 400);
}

function draw() 
{
  //background(220);
  let newword=document.getElementById("urguess").value;
  if(newword!=word)
    {
      word=newword;
    }
  let newwordle=document.getElementById("wordle").value; 
  if(newwordle!=wordle)
    {
      wordle=newwordle;
      document.getElementById("urguess").maxLength = wordle.length;
      generateboxes();
    }
  writeguess();
  
}

//this function makes the grid dynamically whenever the word changes
function generateboxes()
{
  document.getElementById("result").innerText="";//resets
  const outerbox=document.getElementById("word");
  let cols=wordle.length;
  
  outerbox.innerHTML = "";
  
  for( var i=0; i<6;i+=1)
    {
      const guess=document.createElement("div");
      guess.className="guess";
      guess.style.display="flex";
      
      for(var j=0; j<cols;j+=1)
        {
          const letter=document.createElement("div");
          letter.className="letter";
          
          letter.innerText=" ";
          guess.appendChild(letter);
        }
      outerbox.appendChild(guess);
      
    }
}

//this function helps in writing the guesses directly into the boxes generated
function writeguess(){
  if(document.getElementById("result").innerText!="")
    {
      return;
    }
  let parent=document.getElementById("word");
  let child=document.getElementsByClassName("guess");
  let len=child[gno].children.length;
  
  if(word.length!=wordle.length)
    {
      document.getElementById("warning").innerText=`The word should be ${wordle.length} letter long!!!`;
    }
  else
    document.getElementById("warning").innerText=" ";
  
  for(var i=0;i<len;i+=1)
    {
      let childofchild=child[gno].children[i];
      let a=word.charAt(i);
      childofchild.textContent = a;
    }
}

//This function keeps a track of how many guesses have been made and even checks if it is a valid guess or not.
function guessesno(){
  if(wordle.length==word.length)
  { 
    gno+=1;
    checker();    
    document.getElementById("urguess").value = "";
  }
   
  if(gno==6) //only 6 rows in wordle usually
    {
      resultdisplay();
      gno=0;
    }
    
}

//This function colors the text boxes according to the letter present
function checker(){
  let w=document.getElementsByClassName("guess");
  let arr_wordle=new Array(wordle.length).fill(1);

  for(var i=0;i<wordle.length;i++)
  {
    if(word.charAt(i).toLowerCase()==wordle.charAt(i).toLowerCase())
      {
        arr_wordle[i]=0;
        let l=w[gno-1].children[i];
        l.style.backgroundColor="pink";
        l.style.color="white";
        l.style.border="1px solid pink";
      }
  }
  // console.log(arr_wordle);

  for(var i=0;i<wordle.length;i++)
    {
      for(var j=0;j<wordle.length;j++)
        {
          
          if((word.charAt(i).toLowerCase()==wordle.charAt(j).toLowerCase())&&(arr_wordle[j]==1))
            {
              arr_wordle[j]=0;
              let l=w[gno-1].children[i];
              l.style.backgroundColor="lavender";
              l.style.color="white";
              // l.style.border="1px solid lavender";
            }
        }      
    }
    // console.log(arr_wordle);
  if(word.toLowerCase()==wordle.toLowerCase())
    {
      resultdisplay();
      gno=0;
    }
}

//This function shows if you have guessed the word correctly.Eventually i got to lazy to create result pages...
function resultdisplay(){
  //if the person was able to guess or not 
  //I'll make a div called result prolly let's see
  //or just game the page to a different html page with result (2 more html pages to make)
  let r=document.getElementById("result");
  r.style.border="1px solid pink";
  r.style.color="pink";
  r.style.fontSize="32px";
  if(word.toLowerCase()==wordle.toLowerCase())
    {
      r.innerText="Congratulations!!! You've guessed the Word!!!";
    }
    
  else
    {
      r.innerText="You've failed to guess the word...Better Luck next time!!!";
    }
  
  let butt=document.createElement("button");
  butt.style.backgroundColor="pink";
  butt.innerText="Play Again?"
  butt.style.padding="10px";
  butt.style.border="1px solid white";
  butt.style.color="white";
  butt.onclick=reseteverything;
  
  r.appendChild(document.createElement("br")); // Add line break 
  r.appendChild(butt);
  
}

//This resets the game.
function reseteverything(){  
  document.getElementById("result").style.border="none";
  generateboxes();
}

