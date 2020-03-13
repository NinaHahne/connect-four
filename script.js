(function() {
    var currentPlayer = "player1";

    $(".column").on("click", function(e) {
        var col = $(e.currentTarget);
        var slotsInCol = col.children();

        // var colIsFull = true;

        for (var i = slotsInCol.length - 1; i >= 0; i--) {
            if (
                !slotsInCol.eq(i).hasClass("player1") &&
                !slotsInCol.eq(i).hasClass("player2")
            ) {
                // colIsFull = false;
                slotsInCol.eq(i).addClass(currentPlayer);
                break;
            }
        }
        // did I get through the whole loop? then i == -1, because all slots in the column where full. in this case: don't switch players.. ect..
        if (i == -1) {
            return;
        }

        //alternatively set a boolean to check for empty slots:
        // if (colIsFull) {
        //     return;
        // }

        //the slot we just put the piece in is in index i where previous loop broke
        var slotsInRow = $(".row" + i);

        // ----WAYS TO GET DIAGONAL SLOTS TO CHECK:
        // 1) X

        // 2) loop through all 42 slots and check 3 up and right or down and right navigating by increasing column number and row number...inefficient

        // 3) +7 /+5 (check difference of 1 between their column indices)

        // 4) hardcode (canned) list of possible diagonal win situations
        // var victories = [
        //     [0,7,14,21], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
        // ];
        // var slots = $('.slot');

        // loop through victories

        // 5) column - row for every slot; column + row for every slot:

        //column index - row index for every slot
        //
        //  0  1  2  3  4 5 6
        // -1  0  1  2  3 4 5
        // -2 -1  0  1  2 3 4
        // -3 -2 -1  0  1 2 3
        // -4 -3 -2 -1  0 1 2
        // -5 -4 -3 -2 -1 0 1
        //
        //
        // column index + row index for every slot
        //
        // 0 1 2 3 4  5  6
        // 1 2 3 4 5  6  7
        // 2 3 4 5 6  7  8
        // 3 4 5 6 7  8  9
        // 4 5 6 7 8  9 10
        // 5 6 7 8 9 10 11
        // -------------------------

        var columns = $(".column");

        var slotsDiagonal1 = $();
        var slotsDiagonal2 = $();
        var currentRowIndex = i;
        // var currentColIndex = slotsInRow.index(slotsInCol.eq(i));
        // or:
        var currentColIndex = col.index();
        var indexDiff = currentColIndex - currentRowIndex;
        var indexSum = currentColIndex + currentRowIndex;
        // console.log('currentRowIndex: ', currentRowIndex, ' currentColIndex: ', currentColIndex, 'indexDiff: ', indexDiff);

        for (var j = 0; j < columns.length; j++) {
            var rowsInColumn = columns.eq(j).children();
            // console.log('rowsInColumn', rowsInColumn);
            for (var k = 0; k < rowsInColumn.length; k++) {
                // console.log(rowsInColumn.eq(k));
                if (j - k == indexDiff) {
                    // slotsDiagonal1.push(rowsInColumn.eq(k));
                    slotsDiagonal1 = slotsDiagonal1.add(rowsInColumn.eq(k));
                }
                if (j + k == indexSum) {
                    // slotsDiagonal2.push(rowsInColumn.eq(k));
                    slotsDiagonal2 = slotsDiagonal2.add(rowsInColumn.eq(k));
                }
            }
        }

        // console.log(slotsDiagonal1);

        // check for victory in column:
        if (checkForVictory(slotsInCol)) {
            victoryDance();

            //check if they won in row:
        } else if (checkForVictory(slotsInRow)) {
            victoryDance();
        } else if (checkForVictory(slotsDiagonal1)) {
            victoryDance();
        } else if (checkForVictory(slotsDiagonal2)) {
            victoryDance();
        } else {
            switchPlayers();
        }

    });

    function victoryDance() {
        console.log(currentPlayer, " wins!");
        $(document).off("mousemove", followMouse);
        $(".column").off("click");
        var checker1 = $(".checker.green-apple");
        var checker2 = $(".checker.orange");
        checker1.addClass('hidden');
        checker2.addClass('hidden');
        if (currentPlayer == "player1") {
            $("#apple-wins").addClass("on");
        } else {
            $("#orange-wins").addClass("on");
        }
    }

    function checkForVictory(slots) {
        var count = 0;
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    function switchPlayers() {
        var checker1 = $(".checker.green-apple");
        var checker2 = $(".checker.orange");

        if (currentPlayer == "player1") {
            checker1.addClass('hidden');
            // checker1.removeClass('followMe');
            currentPlayer = "player2";
            checker2.removeClass('hidden');
        } else {
            // checker2.removeClass('followMe');
            checker2.addClass('hidden');
            currentPlayer = "player1";
            checker1.removeClass('hidden');
        }
    }

    var button = $(".button");
    button.on("click", function() {
        window.location.reload(true);
    });
    // -----------------------------

    function updatePosition(event) {
        var positionX;
        var positionY;
        var checker1 = $(".checker.green-apple");
        // console.log(checker1.eq(0));
        var checker2 = $(".checker.orange");

        positionX = event.pageX;
        // console.log("positionX: ", positionX);
        positionY = event.pageY;
        // console.log("positionY: ", positionY);

        //both checkers always follow the mouse, but one will be hidden:
        checker1.addClass('followMe');
        checker1.css({
            top: positionY + "px",
            left: positionX + "px",
        });
        checker2.addClass('followMe');
        checker2.css({
            top: positionY + "px",
            left: positionX + "px",
        });

        //either apple or orange follow cursor:
        // if (currentPlayer == "player1") {
        //     checker1.addClass('followMe');
        //     checker1.css({
        //         top: positionY + "px",
        //         left: positionX + "px",
        //     });
        // } else {
        //     checker2.addClass('followMe');
        //     checker2.css({
        //         top: positionY + "px",
        //         left: positionX + "px",
        //     });
        // }
    }

    function followMouse(event) {
        var checker1 = $(".checker.green-apple");
        var checker2 = $(".checker.orange");
        if (currentPlayer == "player1") {
            checker1.removeClass('hidden');
        } else {
            checker2.removeClass('hidden');
        }
        updatePosition(event);
    }
    $(document).on("mousemove", followMouse);

})();
