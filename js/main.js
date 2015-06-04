var Media, media;
(function(){

	Media = media = function( selector, target ){

		return new player( selector, target );
	};

	var player = function( selector, target ){

		var player = document.getElementById( selector );
		this.player = player;
		var self = this;

		var controls = document.getElementsByClassName( target );

		this.player.addEventListener('loadedmetadata', function(){

			for(i = 0; i < controls.length; i++){

				events( controls[i] );
			}
		});

		function events( control ){

			switch( control.getAttribute("data-control") ){

				case "volume":
					control.addEventListener("input", function(){
						self.volume(this.value);
					});

					this.player.addEventListener("volumechange", function(){
						control.value = self.player.volume;
					});
					break;				
				case "seek":

					switch( control.tagName ){

						case "INPUT":
							control.setAttribute("max", self.player.duration);

							control.addEventListener("input", function(e){

								var val = (self.player.duration / this.offsetWidth);
								self.player.currentTime = this.value;
							});
							break;

						case "PROGRESS":
							control.setAttribute("max", self.player.duration);

							control.addEventListener("click", function(e){

								var val = (self.player.duration / this.offsetWidth);
								this.value = e.offsetX * val;
								self.player.currentTime = this.value;
							});
							break;

						case "DIV":

							control.addEventListener("click", function(e){

								var val = (self.player.duration / this.offsetWidth);
								console.log(this.children[0].style.width = e.offsetX + "px");
								self.player.currentTime = (this.offsetWidth / e.offsetWidth) * val;
							});
							break;

						
					}


					this.player.addEventListener("timeupdate", function(){

						control.value = self.player.currentTime;
					});
					break;
				case "toggle":
						pausedClassCheck = new RegExp("paused");
						playingClassCheck = new RegExp("paused");
						if( !pausedClassCheck.exec( control.className ) && this.player.paused === true){
							control.className = control.className + " paused";
						}else if( !playingClassCheck.exec( control.className ) && this.player.paused === false ){
							control.className = control.className + " playing";
						}
						control.addEventListener("click" ,function(){
							self.toggle( control );
						});
					break;
				default:

					control.addEventListener("click", function(){

						self[ this.getAttribute("data-control") ]();
					});
					break;
			}
		}

		if( this.player.paused === true ){
			this.state = "paused";
		}else if( this.player.paused === false ){
			this.state = "playing";
		}

		return this;
	};

	player.fn = player.prototype = {

		debug: function(){

			console.log(this);
		},
		play: function(){

			this.player.play();
			this.state = "playing";
			return this;
		},
		pause: function(){

			this.player.pause();
			this.state = "paused";
			return this;
		},
		stop: function(){

			this.player.pause();
			this.player.currentTime = 0;
		},
		toggle: function( elem ){

			if(this.player.paused === true){
				this.player.play();
				this.state = "playing";
				elem.className = elem.className.replace("paused", "playing");
			}else{
				this.player.pause();
				this.state = "paused";
				elem.className = elem.className.replace("playing", "paused");
			}
		},
		length: function(){

			var min = Math.floor(this.player.duration / 60);
			var sec = Math.ceil(this.player.duration %60);
			return parseFloat(min+"."+sec);
		},
		getTime: function(){

			return this.player.currentTime;
		},
		setTime: function( setTime ){

			var newTime = (setTime.replace(':', '.') * 60);
			this.player.currentTime = newTime;
		},
		volume: function( value ){

			this.player.volume = value;
		},
		mute: function(){

			if(this.player.volume === 0){
				this.player.volume = this.lastVolume;
			}else{
				this.lastVolume = this.player.volume;
				this.player.volume = 0;
			}
		},
		changeSong: function( newSong ){

			this.player.src = newSong;
		},
		event: function( event, funcs ){
		}
	};
}());