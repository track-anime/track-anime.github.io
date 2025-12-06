
(function( $ ) {

    $.fn.lightsOn = function( options ) {

        var settings = $.extend({
            initCycle: 300,
            lampWidth: 70,
            classArray: ['blue', 'green', 'red', 'white', 'lilac', 'yellow_']
        }, options );

        this.append('<div class="lamp-holder"></div>');
        var rootElement = $('.lamp-holder');

        function init(){

            var lampCount = parseInt($(window).width()/settings.lampWidth);

            rootElement.children().remove();

            for (var i=0; i<=lampCount-1; i++) {

                var randClass = Math.floor(Math.random() * settings.classArray.length);

                var boomCircles = '';
                for (var c=0; c<5; c++) {
                    boomCircles = boomCircles +
                        '<div class="circle ' + settings.classArray[randClass] + '"></div>'
                }
                rootElement.prepend(
                    '<div class="lamp ' + settings.classArray[randClass] +
                    '" id="lamp' + i + '" style="left: ' +
                    (i*settings.lampWidth) + 'px;"></div>' +
                    '<div class="circle-holder" style="left: ' +
                    (i*settings.lampWidth + settings.lampWidth/2) + 'px;">' +
                    boomCircles +
                    '</div>'
                );

            }

            window.interval = window.setInterval(function() {

                var workingLampCount = Math.floor(Math.random() * 6) + 1;

                for (var j=0; j<=workingLampCount-1; j++) {

                    var randUp = Math.floor(Math.random() * lampCount);
                    var workingLamp = $('#lamp' + randUp);

                    lightOn(workingLamp);
                    animationOn(workingLamp);
                }

            }, settings.initCycle)
        }

        function lightOff(obj){

            var randTime = Math.floor(Math.random() * 800) + 500;

            setTimeout(function(){

                obj.removeClass('lighton');

            }, randTime);

        }

        function lightOn(obj){

            if (!obj.hasClass('broken')){

                var randTime = Math.floor(Math.random() * 500) + 300;

                setTimeout(function(){

                    obj.addClass('lighton');
                    lightOff(obj);

                }, randTime);
            }
        }

        function animationOn(obj){

            var randTimeR = Math.floor(Math.random() * 10000) + 500;

            if ((!obj.hasClass('swing')) && (randTimeR < 1000)){

                setTimeout(function(){

                    obj.addClass('swing');

                    setTimeout(function(){

                        obj.removeClass('swing');

                    }, 1000);

                }, randTimeR);
            }
        }

        function bubbleBoom(bubbles){

            for (var i=0; i<=bubbles.length-1; i++){
                bubbles[i].addClass('animation' + i);
            }
        }

        rootElement.on('mouseover', '.lamp', function(){

            var lamp = $(this);

            lamp.addClass('broken');

            setTimeout(function(){
                lamp.removeClass('broken');

                lamp.next().children().each(function(){
                    var classes = $(this).attr('class').split(' ');
                    if (classes[classes.length - 1].indexOf('animation') != -1){
                        $(this).removeClass(classes[classes.length - 1]);
                    }
                })
            }, 1000);

            var bubbles = [];

            lamp.next().children().each(function(){
                bubbles.push($(this));
            });

            bubbleBoom(bubbles);
        });

        $(window).resize(function () {

            clearInterval(window.interval);
            init();
        });

        init();
        return this;
    };

}( jQuery ));
