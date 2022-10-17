let bg_day, bird_anim_1, pipe_down_img, pipe_up_img, game_over_img, score_img;
let coin_img, medal_img_2, medal_img_3, medal_img_4, pause_img;
let bird, pipe_down, pipe_up, pipe_down_2, pipe_up_2, game_over, score_tab;
let score, coins, medal_2, medal_3, medal_4, pause_btn, bonus;
let hit, point, wing;
let fRate;
let playingGame = false;

function preload() {
    bg_day = loadImage("img/background_day.png");

    bird_anim_1 = loadAnimation("img/bird.png", "img/bird_2.png", "img/bird_3.png");

    pipe_down_img = loadImage("img/pipe_down.png");
    pipe_up_img = loadImage("img/pipe_up.png");

    game_over_img = loadImage("img/game_over.png");
    score_img = loadImage("img/score.png");
    pause_img = loadImage("img/pause.png");

    coin_img = loadImage("img/price_1.png");
    medal_img_2 = loadImage("img/price_2.png");
    medal_img_3 = loadImage("img/price_3.png");
    medal_img_4 = loadImage("img/price_4.png");

    wing = loadSound("sound/sfx_wing.wav");
    hit = loadSound("sound/sfx_hit.wav");
    point = loadSound("sound/sfx_point.wav");
}

function setup() {
    createCanvas(287, 507);                                 // playing area
    fRate = frameRate(30);

    bird = createSprite(80, 250);                           // bird start position
    bird.addAnimation("base", bird_anim_1);
    bird.friction = 0.1;                                    // resistance

    pipe_up = createSprite(120, 50);                        // pipe start position
    pipe_up.addImage(pipe_up_img);
    pipe_up.velocity.x = -4;                                // pipe start position

    pipe_down = createSprite(120, 500);                     // pipe start position
    pipe_down.addImage(pipe_down_img);
    pipe_down.velocity.x = -4;                              // pipe start position

    pipe_up_2 = createSprite(260, 60);
    pipe_up_2.addImage(pipe_up_img);
    pipe_up_2.velocity.x = -4;

    pipe_down_2 = createSprite(260, 450);
    pipe_down_2.addImage(pipe_down_img);
    pipe_down_2.velocity.x = -4;

    coins = new Group();

    score = 0;                                              // score start game
    bonus = 0;                                              // bonus start game
}

function draw() {
    image(bg_day, 0, 0);                                    // background

    pipes();                                                // new pipes

    collision();

    move();

    bird.position.y = constrain(bird.position.y, 0, height);// bird range up/down

    difficulty();

    bird.collide(coins, coinsHit);                          // collision bird coin

    if (frameCount % 150 === 0){                            // new coin every 5 seconds
        createCoin();
    }

    drawSprites();

    drawInfo();                                             // show info
}

function keyPressed() {                                     // pause game
    if (keyCode === 80) {
        if(playingGame) {
            fRate.noLoop();
            playingGame = false;
            pause_btn = createSprite(140, 250);             // pause image
            pause_btn.addImage(pause_img);
        } else {
            fRate.loop();
            playingGame = true;
            pause_btn.remove();
        }
    }
    if (keyCode === 32) {                                   // bird move up
        bird.velocity.y = -7;
        wing.play();
    }
}

function createCoin() {
    let coin = createSprite(300, random(20, 400));          // coin position
    coin.addImage(coin_img);
    coin.velocity.x = -4;                                   // coin speed
    coin.setCollider("circle", 0, 0, 20);

    if (score >= 20 && score <= 49) {
        coin.velocity.x = -5;
    }
    if (score >= 50 && score <= 99) {
        coin.velocity.x = -6;
    }
    if (score >= 100 && score <= 149) {
        coin.velocity.x = -8;
    }
    if (score >= 150) {
        coin.velocity.x = -10;
    }

    coins.add(coin);
}

function randomNumber(min, max) {                           // random pipe position
    return Math.random() * (max - min) + min;
}

function pipes() {
    if (pipe_up.position.x < -50) {                         // new pipe up
        pipe_up.position.x = 300;
        pipe_up.position.y = randomNumber(-140, 70);
    }

    if (pipe_down.position.x < -50) {                       // new pipe down
        pipe_down.position.x = 300;
        pipe_down.position.y = randomNumber(430, 630);
        score = score + 1;                                  // add score
    }

    if (pipe_up_2.position.x < -50) {                       // new pipe up
        pipe_up_2.position.x = 300;
        pipe_up_2.position.y = randomNumber(-120, 80);
    }

    if (pipe_down_2.position.x < -50) {                     // new pipe down
        pipe_down_2.position.x = 300;
        pipe_down_2.position.y = randomNumber(430, 580);
        score = score + 1;                                  // add score
    }
}

function coinsHit(bird, coins) {                            // collision
    coins.life = 1;
    bonus = bonus + 10;
    point.play();
}

function drawInfo() {
    fill(255, 255, 255);
    textSize(15);
    textStyle(BOLD);
    text("Score " + score, 200, 20);                        // show score
    fill(255,215,0);
    text("Bonus " + bonus, 200, 40);                        // show bonus
    fill(255, 255, 255);
    text("play/pause - P", 10, 460);
    text("move - space", 10, 480);
    text("again - F5", 10, 500);
}

function difficulty() {
    if (score === 20) {                                     // increase of pipe speed
        pipe_down.velocity.x = -5;
        pipe_up.velocity.x = -5;
        pipe_down_2.velocity.x = -5;
        pipe_up_2.velocity.x = -5;
    }

    if (score === 50) {
        pipe_down.velocity.x = -6;
        pipe_up.velocity.x = -6;
        pipe_down_2.velocity.x = -6;
        pipe_up_2.velocity.x = -6;
    }

    if (score === 100) {
        pipe_down.velocity.x = -8;
        pipe_up.velocity.x = -8;
        pipe_down_2.velocity.x = -8;
        pipe_up_2.velocity.x = -8;
    }

    if (score === 150) {
        pipe_down.velocity.x = -10;
        pipe_up.velocity.x = -10;
        pipe_down_2.velocity.x = -10;
        pipe_up_2.velocity.x = -10;
    }
}

function move() {
    bird.addSpeed(1, 90);                                   // bird gravity
}

function collision() {                                      // game over
    if (bird.overlap(pipe_up) === true || bird.overlap(pipe_down) === true || bird.overlap(pipe_up_2) === true || bird.overlap(pipe_down_2) === true) {
        noLoop();
        hit.play();
        game_over = createSprite(150, 150);                 // game over image
        game_over.addImage(game_over_img);
        score_tab = createSprite(150, 280);                 // score image
        score_tab.addImage(score_img);

        if (score >= 10 && score <= 99) {                   // medal
            medal_2 = createSprite(150, 285);
            medal_2.addImage(medal_img_2);
        } else if (score >= 100 && score <= 199) {
            medal_3 = createSprite(150, 285);
            medal_3.addImage(medal_img_3);
        } else if (score >= 200) {
            medal_4 = createSprite(150, 285);
            medal_4.addImage(medal_img_4);
        }
    }
}

