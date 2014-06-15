window.addEventListener('load', function () {
    $('.help-content').prev().click(function () {
        $('.help-content').toggle();
    });

    $('.start-game-menu-list').on('click', 'a', function (e) {
        e.stopPropagation();
        var option = $(this).attr('data-difficulty');
        if (option) {
            startGame(option);
        }
    });

    function startGame(opt) {
        $('#game-wrapper').css('background-image',"url('../images/GameBackground.png')").show();
        $('#start-game-menu-container').remove();
        createGame('#game-wrapper', opt);
    }
});