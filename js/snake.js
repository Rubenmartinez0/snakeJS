(function($){ // State that we are creating a plugin. This avoids conflics.
    canvas = $("#snakeCanvas")[0];
    canvasContext = canvas.getContext("2d");

    //document.addEventListener("keydown", keyPush);
    speed = 10;
    interval = setInterval(game,1000/speed);
    //easy 5
    //normal 10
    //hard 15
    //super-hard 20

    tileSize = 20; //Square tiles with a size of 20px.
    tileCount = 30; //Same number of rows and columns.

    
    score = $("#score").text(); //Get the score.
    //pause = true;

    generateInitialValues();
    function game(){ //Infinite loop for the game execution.
        snakeX+=xDirection;
        snakeY+=yDirection;

        checkSnakeInEdge();
        drawGame();
        checkAndGenerateApple();
        

        trail.push({x:snakeX, y:snakeY});
        while(trail.length>tail){
            trail.shift();
        }

        //Draw the apple
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(appleX*tileSize,appleY*tileSize,tileSize-2,tileSize-2);


    }

    function generateInitialValues(){
        //Generate the snake initial position.
        snakeX = Math.floor((Math.random() * 100))%tileCount;
        snakeY = Math.floor((Math.random() * 100))%tileCount;
        //No movement when starting the game.
        xDirection = 0;
        yDirection = 0;


        //Generate the apple initial position and check that the
        //apple and the snake are not starting in the same position.
        do{
            appleX = Math.floor((Math.random() * 100))%tileCount;
            appleY = Math.floor((Math.random() * 100))%tileCount;
        }while(snakeX === appleX && snakeY === appleY);
        trail=[];
        tail = 0;
        score = 0;
        $("#score").text(score);
    }

    function checkSnakeInEdge(){
        //If the snake head touches one of the edges it will appear in the opposite one.
        if(snakeX > tileCount-1 ){
            snakeX = 0;
        }
        if(snakeX < 0 ){
            snakeX = tileCount-1;
        }
        if(snakeY > tileCount-1 ){
            snakeY = 0;
        }
        if(snakeY < 0 ){
            snakeY = tileCount-1;
        }
    }

    function checkDeath(trailX, snakeX, trailY, snakeY){
        //Check if the snake head is in the same position of one piece of tail.
        if(trailX == snakeX && trailY == snakeY){
            generateInitialValues();
        }
    }

    function drawGame(){
        //Fill the background
        canvasContext.fillStyle = "black";
        //x coordinate, y coordinate, width in pixels, height in pixel
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        //Add border to the canvas.
        $("#snakeCanvas").css("border","solid 15px #00ff00");

        //Draw the snake head.
        canvasContext.fillStyle = "#00ff00";
        canvasContext.fillRect(snakeX*tileSize,snakeY*tileSize,tileSize-2,tileSize-2);

        //Draw the snake tail.
        for(var i = 0; i < trail.length; i++){
            canvasContext.fillRect(trail[i].x*tileSize,trail[i].y*tileSize,tileSize-2,tileSize-2);

            checkDeath(trail[i].x, snakeX, trail[i].y, snakeY);
        }

    }

    function checkAndGenerateApple(){
        if(snakeX == appleX && snakeY == appleY){
            tail++;
            score++;
            $("#score").text(score);
            $("#snakeCanvas").css("border","solid 15px red");

            //Check that the apple doesn't appear above the snake head or tails.
            do{
                overlappedApple = false;
                appleX = Math.floor((Math.random() * 100))%tileCount;//Generate an X value between 0 and the number of tiles.
                appleY = Math.floor((Math.random() * 100))%tileCount;//Generate an Y value between 0 and the number of tiles.
                for(var i = 0; i < trail.length; i++){
                    if(appleX === trail[i].x && appleY === trail[i].y){
                        overlappedApple = true;
                        console.log("Rotten apple!");
                    }
                }
            }while(overlappedApple);
        }
    }



    //Event listener for the keyboard.
    $("html").keydown(function(event){
        var pulsedKey = event.which;
        //This switch checks what key is being pulsed and the direction 
        //in order to not let the player move the opposite direction.
        switch(true){
            case (pulsedKey == 37 || pulsedKey == 65) && xDirection != 1://Code for left-arrow and A.
                xDirection = -1;
                yDirection = 0;
                pause = false;
                break;
            case (pulsedKey == 38 || pulsedKey == 87) && yDirection != 1://Code for up-arrow and W.
                xDirection = 0;
                yDirection = -1;
                pause = false;
                break;
            case (pulsedKey == 39 || pulsedKey == 68) && xDirection != -1://Code for right-arrow and D.
                xDirection = 1;
                yDirection = 0;
                pause = false;
                break;
            case (pulsedKey == 40 || pulsedKey == 83) && yDirection != -1://Code for down-arrow and S.
                xDirection = 0;
                yDirection = 1;
                pause = false;
                break;
            case pulsedKey == 80://Key P pressed. For pause the game.

                console.log("Pause Game.");
                //xDirection = 0;
                //yDirection = 0;
                break;
            case pulsedKey == 107://Key + pressed. Increase speed.
            //easy 5; normal 10; hard 15; super-hard 20.

                if(speed < 35){
                    clearInterval(interval);
                    speed+=5;
                    interval = setInterval(game,1000/speed);
                    console.log("Snake's movement speed has been increased.");
                }else{
                    console.log("Snake is alredy moving at maximum speed.");
                }
                break;
            case pulsedKey == 109://Key - pressed. Decrease speed.
                if(speed > 5){
                    clearInterval(interval);
                    speed-=5;
                    interval = setInterval(game,1000/speed);
                    console.log("Snake's movement speed has been decreased.");
                }else{
                    console.log("Snake is alredy moving at minimum speed.");
                }
                break;
            default:
                //console.log("No arrow-key was pressed");
                //console.log("Key pressed -> " +event.which);
        }
    });

})(jQuery);
