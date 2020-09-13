$( document ).ready(function() {

    function Beam(elm)
    {
        this.elm = elm;
        this.counter = 0;

        this.setCounter = function(counter) {
            this.counter = counter;
        }

        this.getCounter = function() {
            return this.counter;
        }

        this.getUrl = function() {
            return this.elm.data("url");
        }
        
        this.setOpacity = function(value) {
            var material = this.elm[0].getAttribute('material');

            material.opacity = value;

            this.elm[0].setAttribute('material',material);

        }

        this.match = function(position) {
            var x = position.x;
            var z = position.z;



            var elmPosition = this.elm.attr('position');
            var elmRadius = parseInt(this.elm.attr('radius'));

            if(elmPosition.x - elmRadius < x && 
                x < elmPosition.x + elmRadius && 
                elmPosition.z - elmRadius < z && 
                z < elmPosition.z + elmRadius) 
                {
                    return true;
                }
            return false;
        }
    }

    function Scene()
    {
        this.data = undefined;
        this.cycleFunction = undefined;
        this.beams = [];

        this.load = function(url)
        {
            var that = this;
            $.get( url, function( data ) {
                that.data = data;
                eval("that.cycleFunction = "+data.cycle);
                that.createScene(0);
            });
        }

        this.createScene = function(ix) {

            var that = this;
            var scene = this.data.scenes[ix];
            console.log("create",scene);

            $.each(scene.assets, function( index, value ) {
                var elm = $(value);
                elm.addClass("asset");
                $("#assets").append(elm);
            });
          
            $.each(scene.entities, function( index, value ) {
                var elm = $(value);
                elm.addClass("entity");
                if(elm.hasClass("beam"))
                {
                    that.beams.push(new Beam(elm));
                }
                $("#scene").append(elm);
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

          if(this.cycleFunction == undefined) return;
          this.cycleFunction();

        }

        this.remove = function() {
            $("#scene").children().each(function( ) {
                var id = $(this).attr('id');
                if(!$(this).hasClass('entity') && !$(this).hasClass('assat')) return;
                console.log("delete "+id);
                $( this ).remove();
            });

            this.data = undefined;
            this.cycleFunction = undefined;
            this.beams = [];
        }

        this.getPortal = function(position)
        {
         
            var portal = undefined;

            $.each(this.beams, function( index, beam ) {

                if(beam.match(position))
                {
                    var counter = beam.getCounter();
                    counter++;
                    beam.setOpacity(0.2 + counter * 0.2);

                    if(counter > 4)
                    {
                        portal = beam.getUrl();
                    }
                    beam.setCounter(counter);
                }
                else
                {
                    beam.setOpacity(0.2);
                    beam.setCounter(0);
                }


            });


            return portal;
        }
    }



    var scene = new Scene();
    setInterval(function() { scene.cycle(); },100);

    scene.load("/space/hall");
    
    
   

  


var last_attr = "";


//update 
var camera = document.getElementById('head');
var container = document.getElementById('cameraRig');

function resetCameraPosition() {

    var position = camera.getAttribute('position');
    var rotation = camera.getAttribute('rotation');
    
    var containerPosition = container.getAttribute('position');
    var containerRotation = container.getAttribute('rotation');

    position.x = 0;
    position.y = 1;
    position.z = 0;

    rotation.x = 0;
    rotation.y = 0;
    rotation.z = 0;

    
    containerPosition.x = 0;
    containerPosition.y = 0;
    containerPosition.z = 0;

    containerRotation.x = 0;
    containerRotation.y = 0;
    containerRotation.z = 0;

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


       $.ajax( "/position/xxx", {
        data : last_attr,
        contentType : 'application/json',
        type : 'POST',
       });

    

	}



   
    var nextPortal = scene.getPortal(position);
    if(nextPortal != undefined)
    {
        scene.remove();
        resetCameraPosition();
        scene.load(nextPortal);
    }

};

setInterval(updateCameraPosition, 500);



});
