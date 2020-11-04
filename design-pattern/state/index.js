'use strict';

// class Light {
//     constructor() {
//         this.state = 'off';
//         this.button = null;
//     }

//     init() {
//         const _this = this;
//         const button = document.createElement('button');
//         button.innerText = '开关';
//         this.button = document.body.appendChild(button);
//         this.button.onClick = function() {
//             console.log('button click');
//             _this.buttonWasPressed();
//         }
//     }

//     buttonWasPressed() {
//         console.log('click');
//         if (this.state === 'off') {
//             console.log('turn on');
//             this.state = 'on';
//         } else if (this.state = 'on') {
//             console.log('turn off');
//             this.state = 'off';
//         }
//     }
// }

var Light = function(){
    this.state = 'off'; // 给电灯设置初始状态 off
    this.button = null; // 电灯开关按钮
};

Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
        self = this;
    button.innerHTML = '开关';
    this.button = document.body.appendChild( button );
    this.button.onclick = function(){
        self.buttonWasPressed();
    }
};

Light.prototype.buttonWasPressed = function(){
    if ( this.state === 'off' ){
        console.log( '开灯' );
        this.state = 'on';
    }else if ( this.state === 'on' ){
        console.log( '关灯' );
        this.state = 'off';
    }
};

const l = new Light();
l.init();

// 假如，灯不再仅仅有开关两种状态？？关-弱光-强光
// buttonWasPressed违反了封闭开放原则，每增加一种状态，都需要对其进行改动。随着状态的增加，代码将会越来越难以维护；
// 无法直接知道目前一共有多少种状态
// Light.prototype.buttonWasPressed = function(){
//     if ( this.state === 'off' ){
//         console.log( '弱光' );
//         this.state = 'weak';
//     }else if ( this.state === 'weak' ){
//         console.log( '强光' );
//         this.state = 'strong';
//     } else if (this.state === 'strong') {
//         console.log('关灯');
//         this.state = 'off';
//     }
// };


// 状态模式登场

// 状态模式的关键是将事物的所有状态都封装成单独的类，跟此种状态有关的行为封装在类的内部

function OffLightState(light) {
    this.light = light;
}

OffLightState.prototype.buttonWasPressed = function() {
    console.log('弱光'); // action
    this.light.setState(this.light.weakLightState); // state switch
}

function WeakLightState(light) {
    this.light = light;
}

WeakLightState.prototype.buttonWasPressed = function() {
    console.log('强光');
    this.light.setState(this.light.strongLightState);
}

function StrongLightState(light) {
    this.light = light;
}

StrongLightState.prototype.buttonWasPressed = function() {
    console.log('关灯');
    this.light.setState(this.light.offLightState);
}

function Light() {
    this.offLightState = new OffLightState(this);
    this.weakLightState = new WeakLightState(this);
    this.strongLightState = new StrongLightState(this);
}