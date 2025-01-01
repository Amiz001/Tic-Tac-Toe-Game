function checkResult(arr) {
  const wins = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 4, 8], 
    [2, 4, 6], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
  ];

  const array = Array.from(arr).map(a => a.textContent);

  for (let win of wins) {
    const [a, b, c] = win;

    if (array[a] === "X" && array[b] === "X" && array[c] === "X") {
      window.alert("Winner is Player X");
      return true;
    } else if (array[a] === "O" && array[b] === "O" && array[c] === "O") {
      window.alert("Winner is Player O");
      return false;
    }
  }
}


function App() {
  let symbol = true;
  const boxes = document.querySelectorAll(".btn");
  boxes.forEach(box => {
    box.addEventListener("click", () => {

      if(symbol && box.textContent == ""){
        box.textContent = "X"
        symbol = false;
      }
      else if(!symbol && box.textContent == ""){
        box.textContent = "O"
        symbol = true;
      }
    })
  })

  return (
    <>  
      <div>
      <button className="btn"></button>
      <button className="btn"></button>
      <button className="btn"></button>
      </div>

      <div>
      <button className="btn"></button>
      <button className="btn"></button>
      <button className="btn"></button>
      </div>
      <div>
      <button className="btn"></button>
      <button className="btn"></button>
      <button className="btn"></button>
      </div>
    </>
  )
}

export default App
