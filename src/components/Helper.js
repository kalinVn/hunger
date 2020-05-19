import * as PIXI from 'pixi.js';
class Helper {

	constructor(){
	
	}
	
	addWord(propText, container) {
		let label = propText.label;
		let fontFamily = propText.fontFamily;
		let fontSize = propText.fontSize;
		let lineHeight = propText.lineHeight;
		
		let x = 120;
		let y = 200;
		let text = new PIXI.Text(label,{fontFamily : fontFamily, fontSize: fontSize});
		text.x = x;
		text.y = y;
		container.addChild(text);
	}

}
export default  Helper;