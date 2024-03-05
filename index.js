var cells = [];

function import_puzzle () {
	var sudoku1 =  [[0,0,0,2,6,0,7,0,1],
					[6,8,0,0,7,0,0,9,0],
					[1,9,0,0,0,4,5,0,0],
					[8,2,0,1,0,0,0,4,0],
					[0,0,4,6,0,2,9,0,0],
					[0,5,0,0,0,3,0,2,8],
					[0,0,9,3,0,0,0,7,4],
					[0,4,0,0,5,0,0,3,6],
					[7,0,3,0,1,8,0,0,0]];

	return sudoku1;
}

function sudoku_GUI() {
    var table = document.getElementById("gui");


    for (var c = 0; c < 9; c++) {
        var row = document.createElement("tr");

        for (var r = 0; r < 9; r++) {
            var input = document.createElement("input");
            input.type = "text"; 
            input.maxLength = 1; 
            input.row = r;
            input.column = c;
            input.square = square_number(r, c);
            input.onkeypress = validate;


            var cell = document.createElement("td");
            cell.appendChild(input); 
            
            row.appendChild(cell);
            cells.push(input); 
        }
        table.appendChild(row); 
    }
}

function validate(evt) {
    evt = (evt) ? evt : window.event;
    var key = evt.keyCode || evt.which;
    key = String.fromCharCode(key);

    var regex = /[0-9]|\./;
    if ( !regex.test(key) ) {
        evt.returnValue = false;
        if (evt.preventDefault) { evt.preventDefault(); }
    }
}

function square_number(row, column) {
    if (row < 3 && column < 3) { return 0; }
    if (row > 2 && row < 6 && column < 3) { return 1; }
    if (row > 5 && column < 3) { return 2; }
    if (row < 3 && column > 2 && column < 6) { return 3; }
    if (row > 2 && row < 6 && column > 2 && column < 6) { return 4; }
    if (row > 5 && column > 2 && column < 6) { return 5; }
    if (row < 3 && column > 5) { return 6; }
    if (row > 2 && row < 6 && column > 5) { return 7; }
    if (row > 5 && column > 5) { return 8; }
}

function valid_check(cell, value) { 
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].row == cell.row && cells[i].value == value) {
            return false;
        } else if (cells[i].column == cell.column && cells[i].value == value){
            return false;
        } else if (cells[i].square == cell.square && cells[i].value == value) {
            return false;
        } 
    }
    return true;
}

function solve_sudoku(random_row) {
	var numbers = [1,2,3,4,5,6,7,8,9];
	var i = 0;
	var n = 0;
	var m = 1;

	var nums = [1,2,3,4,5,6,7,8,9]; 

	while (true) {
		if (i < 9 && random_row) {
			var random_value = nums[Math.floor(Math.random()*nums.length)];
			nums.splice(nums.indexOf(random_value),1); 
			cells[i].value = random_value;
			i++; 
		} else if (cells[i].a == 1) { // tries solving cell
			if (valid_check(cells[i], numbers[n])) {
                // this is run if valid number is found
				cells[i].value = numbers[n]; // assigns value
				i++;    // next cell 
				n = 0;  // resets numbers array index
				m = 1;  // directon = forwards
			} else {
				if (n == 8) {
                    // this is run if we are at the end of numbers array (no more possible values)
					cells[i].value = 0; // removes value
					i--;    // steps to previous cell
					m = 0;  // direction: backwards
					if (cells[i].value == 9) { i--; }
					n = cells[i].value;
				} else {
                    // this is run if we have not found valid value and we are not at the end of possible values
					n++; // goes to next number in numbers array
				}
			}
		} else {
            // this is run if we hit a cell with static value,
            // moves backwards/forwards based on m variable
			if (m) { i++; }
            else { i--; }
		}
		if (i == 81) { break; } // stops the loop when we are done with last cell
	}
}

function generate_sudoku() {
    /* this function is used in the generation of the sudoku */

	for (cell of cells) { cell.a = 1; } // makes all cells-editable

	solve_sudoku(true); // the sudoku is solved with a random first row -> sudoku is created

	for (cell of cells) { // turns random cells blank
		if (Math.floor((Math.random() * 3)) == 0) { cell.value = ""; } 
	}
	
	for (cell of cells) { // locks all cells with values
		if (cell.value > 0) { cell.a = 0; }
	}
}

function load_sudoku() {
	var i = 0;
	var sudoku = import_puzzle();
	for (var c = 0; c < 9; c++) {
		for (var r = 0; r < 9; r++) {
			if (sudoku[c][r] != 0) {
				cells[i].value = sudoku[c][r];
			} else {
				cells[i].a = 1; // unlocks cells without values
			}
			i++;
		}
	}
}

function clear_gui() {
	for (cell of cells) {
		cell.value = "";    // removes value
		cell.a = 0;         // locks all cells (default) 
	}
}

sudoku_GUI();