$( document ).ready(function() {




    function Scene()
    {
        this.parrot = undefined;

        this.data = undefined;

        this.load = function(url)
        {
            var that = this;
            $.get( url, function( data ) {
                that.data = data;
                that.createScene(0);
            });
        }

        this.createScene = function(ix) {


            var scene = this.data.scenes[ix];
            console.log("create",scene);

            $.each(scene.assets, function( index, value ) {
                $("#assets").append(value);
            });
          
            $.each(scene.entities, function( index, value ) {
                $("#scene").append(value);
            });

            if(ix + 1  < this.data.scenes.length)
            {
                var that = this;
                setTimeout(function() {
                    that.createScene(ix + 1);
                },100);
            }


        }


        this.cycle = function() {

            if(this.parrot == undefined) return;

            var position= this.parrot.getAttribute('position');
            position.x+= 0.1;
        }

        this.remove = function() {
            $("#scene").children().each(function( ) {
                var id = $(this).attr('id');
                if(!$(this).hasClass('entity') && !$(this).hasClass('base')) return;
                console.log("delete "+id);
                $( this ).remove();
            });

            this.data = undefined;
            this.parrot = undefined;
          
        }

        this.isPortal = function(position)
        {
            var x = position.x;
            var z = position.z;
            if(-6 < x && x < -4 && -6 < z && z < -4) return true;
            return false;
        }
    }



    var scene = new Scene();
    setInterval(scene.cycle,100);

    scene.load("/space/xxx");
    
    
   

  


var last_attr = "";
var counter = 0;


//update 
var camera = document.getElementById('head');
var container = document.getElementById('cameraRig');

function resetCameraPosition() {

    var position = camera.getAttribute('position');
    var rotation = camera.getAttribute('rotation');
    
  

    position.x = 0;
    position.y = 1;
    position.z = 0;

    console.log("resetCameraPosition "+ JSON.stringify(rotation) );

    rotation.x = 0;
    rotation.y = 0;
    rotation.z = 0;
    console.log("resetCameraPosition "+ JSON.stringify(rotation) );

}

//update camera position 
function updateCameraPosition() {
     var latestPosition = camera.getAttribute('position');
	 var latestRotation = camera.getAttribute('rotation');
	 
	 var containerPosition = container.getAttribute('position');
	 var containerRotation = container.getAttribute('rotation');


	 var position = Object.assign({}, latestPosition);

	 position.x += containerPosition.x;
	 position.y += containerPosition.y;
	 position.z += containerPosition.z;


    var attr = {
         position: position,
		 rotation: latestRotation,
		 containerPosition: containerPosition,
		 containerRotation: containerRotation
	};

	if(JSON.stringify(attr) != last_attr)
	{
	   last_attr = JSON.stringify(attr);
	   console.log("Changed position "+ JSON.stringify(attr) );
	}



    if(scene != undefined && scene.isPortal(position))
    {
        counter++;
        console.log("inside portal "+counter);
        if(counter > 4)
        {
            scene.remove();
            resetCameraPosition();
            scene.load("/space/xxx");
        }
    }
    else
    {
        counter = 0;
    }

};

setInterval(updateCameraPosition, 500);





});
