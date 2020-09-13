function () { 
	var parrot = document.getElementById('parrot'); 
	if(parrot == undefined) return; 
	var position= parrot.getAttribute('position'); 
	position.x+= 0.1; 
}

