const $startScreen = $("#startscreen");
const $game = $("#game"); //game screen



$("#submit-play").on("submit", function(e) {

	e.preventDefault();
	gridSize = $("input[name='size']:checked").val();
	// console.log($gridSize);
	$startScreen.toggleClass("hide"); // hides start screen 

	// if instructions modal still open ??? its ok now bc instructions modal is now nested inside of the startscreen

	$game.toggleClass("hide"); // unhides game screen  

});


$("#instructions, #X").on("click", function(e) {


	$(".instructionsModal").toggleClass("hide");


});





class Game {
	constructor(gridSize) {
		//console.log("making game");

		// this.gridSize = gridSize;
		this.values = [];
		//this.previousState = [];
		this.gameOver = false;     // change it later !!!!!
		this.emptyCells = 16;				// only changes when there is a spawn/merge
		
	}

	setupGame() {
		
		const $grid = $("<div/>").attr("class", "grid");

		$game.append($grid);
		
		for (let a = 0; a < 4; a++) {
			let temp = new Array(4);
			this.values.push(temp);
		}	
		


		for (let a = 0; a< this.values.length; a++) {
			for (let b = 0; b < this.values[a].length; b++) {
				const $cell = $("<div/>").attr("class", "cell");
				$cell.css("grid-column", a);
				$cell.css("grid-row", b);
				$cell.attr("id", `${a}${b}`);
				$grid.append($cell);
				
			}

		}
		


		
	}

	startGame () {
		const row = Math.floor(Math.random() * 4);
		const col = Math.floor(Math.random() * 3);

		const row2 = Math.floor(Math.random() * 4);
		const col2 = 3;

		//print2DArray(this.values);


		console.log("rand row 1: " + row +"," + col);
		console.log("rand row 1: " + row2 +"," + col2);

		//debugger;

		this.values[row][col] = 2;
		this.values[row2][col2] = 2;

		$(`#${row}${col}`).addClass("value-2").text("2");
		$(`#${row2}${col2}`).addClass("value-2").text("2");

		this.emptyCells -= 2;

	}

	
	//event listener for arrow keys

	makeMove() {
		const temp = this;

		//before any changes to this.values, store it in previous state to keep a record

		

		$(document).keydown(function(e) {
			//temp.previousState = temp.values;
			//console.log("previous" + temp.previousState); 

			if ($game.hasClass("hide")) { // check for this.gameOver here?
				console.log("not ready");
			} else if (temp.gameOver == true){
				console.log("you lost the game");
			}
			else {
				switch(e.which) {
					case 37: //left
						console.log("left key pressed"); 

						temp.moveLeft(); 

						//check merge before spawn
						temp.merge("left");
						temp.newSpawn();								// ****** SPAWNS AFTER EVER TURN ******



						//console.log(temp.values);

						break;


					case 38: //up 

						console.log("up key pressed");
						temp.moveUp(); 
						temp.merge("up"); 
						temp.newSpawn();
						break;
					
					case 39: //right 
						console.log("right key pressed");

						temp.moveRight(); 
						temp.merge("right");
						temp.newSpawn();
						break;

					case 40: // down

						console.log("down key pressed");

						temp.moveDown(); 
						temp.merge("down"); 
						temp.newSpawn(); 
						break;

					default:
						console.log("wrong key pressed");
						break;
				}



				temp.isLost();
			}
		});

	}


	// moves ALL tiles in their respective direction

	moveLeft() { 
		for (let c = 0; c < this.values.length; c++) {        // loop starting with the left-most elements
			for (let r = 0; r < this.values[c].length; r++) {
				// console.log(`element is ${this.values[a][b]}`);

				if (this.values[r][c] !== undefined) {				// if there is a value at the cell, then move it
					//console.log("sending it to available " + r + "," + c);
					this.findNextAvailableCell(r, c, "left");

				}

			}
		}	
	}


	moveUp() {
		for (let r = 0; r < this.values.length; r++) {       // loop starting with the top-most elements 
			for (let c = 0; c < this.values[r].length; c++) {
				if(this.values[r][c] !== undefined) {
					this.findNextAvailableCell(r,c,"up");
				}
			}

		}

	}


	moveRight() {
		for(let c = this.values.length-1; c >= 0; c-- ) { // loop starting with the right-most element 
			for(let r = 0; r < this.values[c].length; r++) {
				if(this.values[r][c] !== undefined) {
					this.findNextAvailableCell(r,c,"right");
				}
			}
		}
	}

	moveDown() {
		for(let r = this.values.length-1; r >= 0; r--) {
			for(let c = 0; c < this.values[r].length; c++) {
				if(this.values[r][c] !== undefined) {
					this.findNextAvailableCell(r,c,"down");
				}
			}
		}
	}


	//searches if there is an available cell to move, if there is, then move the tile directly ----- MOVES ONLY 1 TILE

	findNextAvailableCell(row, col, direction) {
		switch(direction) {
			case "left": 						
				for (let a = 0; a < col; a++) { // doesnt check at position 'col'
					if (this.values[row][a] === undefined) {						// if there is available cell, then move
						this.values[row][a] = this.values[row][col];

						$(`#${row}${a}`).addClass(`value-${this.values[row][col]}`);
						$(`#${row}${a}`).text(`${this.values[row][col]}`);

						this.values[row][col] = undefined;

						$(`#${row}${col}`).attr("class", "cell"); //replaces class 
						$(`#${row}${col}`).text("");
						
						//break out of loop here? 
						break;

					}

				}
				break; 

			case "up":
				//col stays the same, change the row only. 

				for (let a = 0; a < row; a++) {									// it always starts at the top most, so its ok to loop through this way
					if (this.values[a][col] === undefined) {
						//console.log("here break?");
						this.values[a][col] = this.values[row][col]; 
						$(`#${a}${col}`).addClass(`value-${this.values[row][col]}`);
						$(`#${a}${col}`).text(`${this.values[row][col]}`);

						this.values[row][col] = undefined;

						$(`#${row}${col}`).attr("class", "cell"); //replaces class 
						$(`#${row}${col}`).text("");
						
						//break out of loop here? 
						break;

					}
				} 
				break;
			

			case "right":
				
				for (let a = 3; a > col; a--) { // start at index 3 (right most, bc if you're at index 3, you can't move right anymore), doesnt check position 'col' (bc dont need to)
					if(this.values[row][a] === undefined) {
						this.values[row][a] = this.values[row][col];
						$(`#${row}${a}`).addClass(`value-${this.values[row][col]}`);
						$(`#${row}${a}`).text(`${this.values[row][col]}`);


						this.values[row][col] = undefined;

						$(`#${row}${col}`).attr("class", "cell"); //replaces class 
						$(`#${row}${col}`).text("");
						
						break;
					}
				}

				break;

			case "down": 

				for(let a = 3; a > row; a--) {
					if(this.values[a][col] === undefined) {
						this.values[a][col] = this.values[row][col]; 

						$(`#${a}${col}`).addClass(`value-${this.values[row][col]}`);
						$(`#${a}${col}`).text(`${this.values[row][col]}`);


						this.values[row][col] = undefined;

						$(`#${row}${col}`).attr("class", "cell"); //replaces class 
						$(`#${row}${col}`).text("");
						
						break;

					}
				}

			default:
				break;
		}
	}



	newSpawn() { // spawn new tile after each move, doesnt care about direction of move 
		const randomValue = 2 * (Math.floor(Math.random() * 2) + 1); // random 2 or 4 
		let setted = false; 


		//console.log("Is newSpawn even being called?");
		//console.log("empty spots " + this.emptyCells);
		while (!setted && this.emptyCells > 0) {   // search for an cell that is available 

			const row = Math.floor(Math.random() * 4);
			const col = Math.floor(Math.random() * 4);
			//console.log("looking for available spot");

			if (this.values[row][col] === undefined) {     // found a random empty spot
				//console.log("found available spot!");

				this.values[row][col] = randomValue; 
				$(`#${row}${col}`).addClass(`value-${randomValue}`).text(`${randomValue}`).velocity({scale:1.25},{duration:50}).velocity({scale:1},{duration:50});


				this.emptyCells--;

				setted = true;
			}
		}


	}

	merge(direction) {    			// merge AFTER the move, BEFORE newSpawn() ------ if 2 tiles are next to each other, then merge into 1 tile 
		switch (direction) {
			case "left":
				for (let r = 0;  r < this.values.length; r++) {
					for (let c = 0; c < this.values[r].length-1; c++) {


						if (this.values[r][c] == this.values[r][c+1] && this.values[r][c] !== undefined) {
							//console.log("Same values! We are merging here");
							this.values[r][c] *= 2; 
							this.values[r][c+1] = undefined;

							$(`#${r}${c}`).addClass(`value-${this.values[r][c]}`).removeClass(`value-${this.values[r][c]/2}`).text(`${this.values[r][c]}`); //.velocity({rotateZ:360},{duration:1000});
							$(`#${r}${c+1}`).removeClass(`value-${this.values[r][c]/2}`).text("");

							$(`#${r}${c}`).velocity( {opacity: 0.25}, {duration: 100}).velocity("reverse");

							this.moveLeft(); // ???????
											// move the tiles again after the merge, in case [  2 2 2 0 ] ---> (after merge) [ 4 2 0 0]

							this.emptyCells++;
							c++;

						}
					}
				}


				break;

			case "up": 
				for (let c = 0; c < this.values.length; c++) {
					for(let r = 0; r < this.values[c].length-1; r++) {

						//console.log(`this.values[r][c] is ${this.values[r][c]}`);
						//console.log(`this.values[r+1][c] is ${this.values[r+1][c]}`);

						if (this.values[r][c] == this.values[r+1][c] && this.values[r][c] !== undefined) {
							this.values[r][c] *= 2; 
							this.values[r+1][c] = undefined; 

							$(`#${r}${c}`).addClass(`value-${this.values[r][c]}`).removeClass(`value-${this.values[r][c]/2}`).text(`${this.values[r][c]}`); //.velocity({rotateZ:360},{duration:1000});
							$(`#${r+1}${c}`).removeClass(`value-${this.values[r][c]/2}`).text("");
							$(`#${r}${c}`).velocity( {opacity: 0.25}, {duration: 100}).velocity("reverse");


							this.moveUp();
							this.emptyCells++; 
							r++; 

						}
					}
				}

				break;

			case "right":

				for(let r = 0; r < this.values.length; r++) {
					for (let c = this.values[r].length - 1; c > 0; c--) {

						if (this.values[r][c] == this.values[r][c-1] && this.values[r][c] !== undefined) {
							this.values[r][c] *= 2; 
							this.values[r][c-1] = undefined; 

							$(`#${r}${c}`).addClass(`value-${this.values[r][c]}`).removeClass(`value-${this.values[r][c]/2}`).text(`${this.values[r][c]}`); //.velocity({rotateZ:360},{duration:1000});
							$(`#${r}${c-1}`).removeClass(`value-${this.values[r][c]/2}`).text("");
							$(`#${r}${c}`).velocity( {opacity: 0.25}, {duration: 100}).velocity("reverse");

							this.moveRight(); 
							this.emptyCells++;
							c--; 

						}
					}
				}
				break;

			case "down": 

				for(let c = 0; c < this.values.length; c++) {
					for(let r = this.values[c].length-1; r > 0; r--) {

						if (this.values[r][c] == this.values[r-1][c] && this.values[r][c] !== undefined) {
							this.values[r][c] *=2; 
							this.values[r-1][c] = undefined; 

							$(`#${r}${c}`).addClass(`value-${this.values[r][c]}`).removeClass(`value-${this.values[r][c]/2}`).text(`${this.values[r][c]}`); //.velocity({rotateZ:360},{duration:1000}); //.velocity({scale:1},{duration:50});
							$(`#${r-1}${c}`).removeClass(`value-${this.values[r][c]/2}`).text("");
							$(`#${r}${c}`).velocity( {opacity: 0.25}, {duration: 100}).velocity("reverse");

							this.moveDown(); 
							this.emptyCells++; 
							r--; 

						}	
					}
				}

				break;	

			default:
				break;
		}
	}


	//checks if you lost the game (cannont win in the game)
	isLost() {
		// console.log(this.emptyCells);
		if (this.emptyCells <= 0) {										// make sure all the cells are filled up 
			

			for (let r = 0; r < this.values.length; r++) {
				for (let c = 0; c < this.values[r].length; c++) { 
					
					if (c != this.values[r].length-1) {						// checks if we're not checking the last column index

						if(this.values[r][c] == this.values[r][c+1]) { 				// check if able to merge horizontally 
							console.log("able to still merge horizontally");
							return false; 
						}
					}

					if (r != this.values.length-1) {
						if ( this.values[r][c] == this.values[r+1][c]) {
							console.log("able to still merge vertically");
							return false; 
						}
					}


				}
			}


			this.gameOver = true;  
			console.log("LOST THE GAME");


			//$game.velocity("fadeOut", { duration: 10000, loop:1 });

			//$game.toggleClass("hide");

			$("#lose-screen").toggleClass("hide");
			

		}
	}



}




function animationValue() {
	//for (let a = 0; a < 6; a++) {
	const $test = $("<div/>").attr("class", "cell value-2 rain").text("2");
	const $test8 = $("<div/>").attr("class", "cell value-8 rain8").text("8");
	const $test4 = $("<div/>").attr("class", "cell value-4 rain4").text("4");
	const $test128 = $("<div/>").attr("class", "cell value-128 rain128").text("12");



	//$test.attr("id", `v2-${a}`);



	const left = Math.floor(Math.random() * 1200); // change 900 later 
	const left8 = Math.floor(Math.random() * 1200); // change 900 later 
	const left4 = Math.floor(Math.random() * 1200); 
	const left128 = Math.floor(Math.random() * 1200); 


	$test.css("left", `${left}px`);
	$test8.css("left", `${left8}px`);
	$test4.css("left", `${left4}px`);
	$test128.css("left", `${left128}px`);


	$startScreen.append($test);
	$startScreen.append($test8);
	$startScreen.append($test4);
	$startScreen.append($test128);







	$(".rain").velocity({
		translateY: ['1000%','0%'], 
		rotateZ: 180,
		}, { duration: 5000, display: "none" });

	$(".rain8").velocity({
		translateY: ['1000%','0%'], 
		rotateZ: -180,
		}, { duration: 5900, display: "none"});

	$(".rain4").velocity({
		translateY: ['1000%','0%'], 
		rotateZ: -90,
		}, { duration: 4000, display: "none"});
	$(".rain128").velocity({
		translateY: ['1000%','0%'], 
		rotateZ: 90,
		}, { duration: 5500, display: "none"});

}
 
 // function rm (val) {

 // 	console.log(val.id);
 // 	$(val.id).remove();
 // }


function animate() {
	for (let a = 0; a < 99; a++) {
		if (!($startScreen.hasClass("hide"))) {
			break;
		}
		animationValue();


	}
}


function render() {
	animate();


	$startScreen.toggleClass("hide"); // hides start screen

	const g = new Game();
	g.setupGame();
	g.startGame();
	g.makeMove();



}

render();