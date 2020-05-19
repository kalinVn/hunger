
import * as PIXI from 'pixi.js';
import Helper from "../components/Helper.js";
import Hunger from "../components/Hunger.js";


class Game{
	constructor(){
		this.app;
		this.app = new PIXI.Application( {width : 960, height : 950,backgroundColor: 0xffffff});
		document.body.appendChild(this.app.view);
	}
	
	init(){
		this.HunderCoord = [];
		let hunger = new Hunger();
		this.HunderCoord  = hunger.getHungCord();
		this.words = [
			"besenica",
			"accumulator",
			"sunglasses",
			"television",
			"soldier",
			"refrigerator",
			"programmer"
		
		];
		
		let word = this.words[Math.floor(Math.random() * this.words.length)];
		let wordChars = {};
		let regex = /(?<!^).(?!$)/g;
		this.censored = word.replace(regex, '*');
		this.addedChars = [];
		this.addWord(this.censored);
		let wordOrigin = word;
		
		while(word.length > 0){
			let charWord7 = word.charAt(0);
			wordChars[charWord7] = {};
			wordChars[charWord7].indexPosition = [];
			let  re3 = new RegExp('(' + charWord7 + ')', 'g');
			let match;
			while ((match = re3.exec(wordOrigin)) != null) {
				wordChars[charWord7].indexPosition.push(match.index);
			}
			word = word.replace(re3, '');
		}
		document.body.onkeypress  = evt => this.onKeyPressEvent(evt, wordChars)
				
	}
	
	
	reset() {
		this.line =  null;
		while(this.app.stage.children.length > 0){   
			var child = this.app.stage.getChildAt(0);
			this.app.stage.removeChild(child);
		}
		this.init();
	
	}
	
	async onKeyPressEvent(evt, wordChars){
		
		var charCode = (evt.which) ? evt.which : evt.keyCode
			if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8){
				var n = this.addedChars.includes(evt.key);
				
				if(!wordChars.hasOwnProperty(evt.key) ){
					this.addedChars.push(evt.key);
					 this.drawHunger();
					 if(this.HunderCoord.length == 0){
						setTimeout(() => {
						alert("Game over");
						this.reset();
						}, 100);
					}
					return;
				}
				if(n){
					alert("You press this char before");
					return;
				}else{
					this.addedChars.push(evt.key);
					
					var res = this.censored.split("");
					let re3 = new RegExp('(' + evt.key + ')', 'g');
					wordChars[evt.key].indexPosition.forEach( (el, index) => {
						res[el] = evt.key;
					});
					this.censored = res.join('');
					this.addWord(this.censored);
					let rgx  = /([*])/g;
					if(!rgx.test(this.censored )){
						setTimeout(() => {
						this.reset();
						alert("You win")
						}, 100);
					}
				}
				
			}else{
				alert("You must add only letters");
			}
	}
	
	async drawHunger (){
			if(this.HunderCoord.length == 0){
				return;
			}
			
			let hungerCoord = this.HunderCoord[0];
			if(!hungerCoord.circle){
				if(hungerCoord.lineTo.x > hungerCoord.maxWidth && hungerCoord.speedX && hungerCoord.maxWidth > 0){
					this.HunderCoord.shift();
					return;
				}
				if(hungerCoord.lineTo.y > hungerCoord.maxWidth && hungerCoord.speedY && hungerCoord.maxWidth > 0 ){
					this.HunderCoord.shift();
					return;
				}
			}
			if(this.line){
				this.app.stage.addChild(this.line);
			}
			this.line = new PIXI.Graphics();
			if(hungerCoord.circle){
					this.line.beginFill(0x000000);
					this.line.lineStyle(0);
					this.line.drawCircle(hungerCoord.positionSet.x, hungerCoord.positionSet.y, 12);
					this.line.endFill();
					this.app.stage.addChild(this.line);
					this.HunderCoord.shift();
				return;
			}
			
			
			this.line.lineStyle(5, 0x000000, 1);
			this.line.position.x = hungerCoord.positionSet.x;
			this.line.position.y = hungerCoord.positionSet.y;
			this.line.moveTo(hungerCoord.moveTo.x, hungerCoord.moveTo.y);
			this.line.lineTo(hungerCoord.lineTo.x, hungerCoord.lineTo.y);
			
			this.app.stage.addChild(this.line);
			
			if(hungerCoord.speedX)
				hungerCoord.lineTo.x += hungerCoord.speedX;
				
			else if(hungerCoord.speedY )
				hungerCoord.lineTo.y += hungerCoord.speedY;
			if(hungerCoord.maxWidth > 0){
				requestAnimationFrame( () => this.drawHunger() );
			}else{
				this.HunderCoord.shift();
				
			}
			
		
	}
	
	addWord(censored){
		if(this.container){
			this.app.stage.removeChild(this.container);
		}
		
		let helper = new Helper();
		let propText = {
			label : censored,
			fontFamily : 'Arial',
			fontSize : 36,
		};
		this.container = new PIXI.Container();
		this.container.x = 20;
		this.container.y = 100;
		let text = helper.addWord(propText, this.container);
		this.app.stage.addChild(this.container);
	}
	
}
export default  Game;