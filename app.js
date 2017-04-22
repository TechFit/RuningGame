/**
 * Created by barvinok on 07.04.17.
 */
/** @type {Phaser.Game} */
var game = new Phaser.Game(
    800,
    600,
    Phaser.AUTO,
    'game',
    {
        preload: preload,
        create: create,
        update: update
    }
);

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {

    // Подключил в игру физику, ARCADE - по умолчанию.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Фон
    game.add.sprite(0, 0, 'sky');

    // Группа для выступов по которым будем прыгать
    platforms = game.add.group();

    //  Физика для всех объектов группы
    platforms.enableBody = true;

    // Пол(поверхность)
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    // Подгоняем размер пола по размерам игры (оригинальный спрайт размером 400x32)
    ground.scale.setTo(2,2);

    // //  Предотвращаем "перемещение" пола
    ground.body.immovable = true;

    //  Создаем два выступа и предотвращаем их "перемещение"
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // Персонаж и настройки для него
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;

    player.body.gravity.y = 300;

    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);

    player.animations.add('right', [5, 6, 7, 8], 10, true);

    stars = game.add.group();

    stars.enableBody = true;

    //  Создаем 12 звезд с отступами между ними
    for (var i = 0; i < 12; i++)
    {
        //  Создаем звезду и добавляем его в группу "stars"
        var star = stars.create(i * 70, 0, 'star');

        //  Добавляем гравитацию
        star.body.gravity.y = 100;

        // Для каждой звезды указываем свою амплитуду отскока
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    var score = 0;
    var scoreText;

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);


    player.body.velocity.x = 0;

    if (cursors.left.isDown){
        //  Движение влево
        player.body.velocity.x = -150;

        player.animations.play('left');

    }else if (cursors.right.isDown){
        //  Движение вправо
        player.body.velocity.x = 150;

        player.animations.play('right');
    }else{
        //  Состояние покоя
        player.animations.stop();

        player.frame = 4;
    }
    //  Высота прыжка
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;

        player.animations.play('jump');
    }

    function collectStar (player, star) {
        score += 10;
        scoreText.text = 'Score: ' + score;

        // Removes the star from the screen
        star.kill();

    }
}

function clearGameCache () {
    game.cache = new Phaser.Cache(game);
    game.load.reset();
    game.load.removeAll();
}