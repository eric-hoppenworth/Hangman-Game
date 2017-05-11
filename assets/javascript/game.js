//plant class will store each plant's growthstage and condition
class Plant {
	constructor(row,col) {
		this.stage = 0;
		this.condition = 0;
		this.type = "tomato";
		this.image = "assets/images/plant" + this.stage + ".png";
		this.row = row;
		this.col = col;
	}

	grow() {
 		alert(this.type + " is growing");
 		//change the growth stage and image
 		this.stage += 1;
 		if (this.stage > 4 ){
 			this.stage = 3;
 		}
		this.image = "assets/images/plant" + this.stage + ".png";
		document.getElementById("row" + this.row).children[this.col].src = this.image;
	}
}

var myPlant = new Plant(5,0);
