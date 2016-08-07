
/**
 * @namespace
 */
AudioManager = 
{
	/**
	 * Set to false to disable audio.
	 * @type {Boolean}
	 */
	enabled: true,
	
	/**
	 * Pooled audio sources, indexed by URL.
	 */
	pool: {},

	/**
	 * Set the position of the audio listener.
	 * @param {THREE.Vector3} position
	 */
	setListener: function(position)
	{
		this.listener = position;
	},

	//TODO: call this every frame
	_updateVolume: function(clip)
	{
		//Do ranges
		if (clip.position && this.listener)
		{
			var dist = clip.position.subtracted(this.listener).lengthSq();
			if (dist < audibleRange * audibleRange)
			{
				if (dist < dropoffRange * dropoffRange)
					clip.volume = 1;
				else
					clip.volume = 1 - (Math.sqrt(dist) - dropoffRange) / (audibleRange-dropoffRange);
			}
			else
				clip.volume = 0;
		}
		else
		{
			clip.volume = 1;
		}
	},

	//TODO: I don't think this works.
	preloadSound: function(url)
	{
		// server-side fail silent
		if (typeof Audio === "undefined") return;
		
		if (url instanceof Array)
		{
			for (var c = 0; c < url.length; c++)
				this.preloadSound(url[c]);
		}
		else
		{
			soundEndCallback(new Audio(url), url);
		}
	},

	/**
	 * Starts playing a sound.
	 * @param {String} url URL of the sound to play.
	 * @param {Number} vol Volume (0.0 - 1.0).
	 * @returns {Audio}
	 */
	playSound: function(url, vol)
	{
		// server-side fail silent
		if (typeof Audio === "undefined") return;
		
		if (url === undefined) return;
		if (!this.enabled) return;
		
		if (url instanceof Array)
			url = url[Math.floor(Math.random() * url.length)];
		
		if (this.pool[url] && this.pool[url].length > 0)
		{
			//Use a pooled clip
			var last = this.pool[url].length-1;
			var clip = this.pool[url][last];
			clip.currentTime = 0;
			clip.volume = vol || 1.0;
			clip.playbackRate = 1.0;
			this.pool[url].length = last;
		}
		else
		{
			//Make a new clip
			var clip = new Audio(url);
			clip.volume = vol || 1.0;
			clip.addEventListener("ended", this._soundEndCallback(clip, url));
		}
		clip.play();
		return clip;
	},

	/**
	 * @callback
	 */
	_soundEndCallback: function(clip, url)
	{
		return function(event)
		{
			if (!AudioManager.pool[url])
			{
				AudioManager.pool[url] = [];
			}
			AudioManager.pool[url].push(clip);
		}
	},
}

module.exports = AudioManager;
