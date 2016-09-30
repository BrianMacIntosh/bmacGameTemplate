
export namespace AudioManager
{
	/**
	 * Set to false to disable audio.
	 * @type {boolean}
	 */
	export var enabled: boolean = true;
	
	/**
	 * Pooled audio sources, indexed by URL.
	 */
	var pool: { [s: string]: HTMLAudioElement[] } = {};

	/**
	 * Set the position of the audio listener.
	 * @param {THREE.Vector3} position
	 */
	export function setListener(position: THREE.Vector3): void
	{
		listener = position;
	};

	//TODO: call this every frame
	export function _updateVolume(clip: HTMLAudioElement): void
	{
		//Do ranges
		if (clip.position && listener)
		{
			var dist = clip.position.subtracted(listener).lengthSq();
			if (dist < audibleRange * audibleRange)
			{
				if (dist < dropoffRange * dropoffRange)
					clip.volume = 1;
				else
					clip.volume = 1 - (Math.sqrt(dist) - dropoffRange) / (audibleRange - dropoffRange);
			}
			else
				clip.volume = 0;
		}
		else
		{
			clip.volume = 1;
		}
	};

	//TODO: test me
	export function preloadSound(url: string|string[]): void
	{
		// server-side fail silent
		if (typeof Audio === "undefined") return;
		
		if (url instanceof Array)
		{
			for (var c = 0; c < url.length; c++)
				preloadSound(url[c]);
		}
		else
		{
			var clip = new Audio(url);
			clip.play();
			clip.pause();
			clip.relativeSrc = url;
			_addToPool(clip);
		}
	};

	/**
	 * Starts playing a sound.
	 * @param {string} url URL of the sound to play.
	 * @param {number} vol Volume (0.0 - 1.0).
	 * @returns {Audio}
	 */
	export function playSound(urlParam: string|string[], vol: number): HTMLAudioElement
	{
		// server-side fail silent
		if (typeof Audio === "undefined") return null;
		
		if (url === undefined) return null;
		if (!enabled) return null;
		
		var url: string;
		if (urlParam instanceof Array)
		{
			url = urlParam[Math.floor(Math.random() * urlParam.length)];
		}
		else
		{
			url = urlParam;
		}
		
		var clip: HTMLAudioElement;
		if (pool[url] && pool[url].length > 0)
		{
			//Use a pooled clip
			var last = pool[url].length-1;
			clip = pool[url][last];
			clip.currentTime = 0;
			clip.volume = vol || 1.0;
			clip.playbackRate = 1.0;
			pool[url].length = last;
		}
		else
		{
			//Make a new clip
			clip = new Audio(url);
			clip.relativeSrc = url;
			clip.volume = vol || 1.0;
			clip.addEventListener("ended", function() { _addToPool(clip); });
		}
		clip.play();
		return clip;
	};

	/**
 	 * Stops and pools the specified clip.
 	 * @param {Audio} clip
 	 */
 	export function stop(clip: HTMLAudioElement): void
 	{
 		clip.pause();
 		clip.currentTime = 0;
 		_addToPool(clip);
	};

	/**
	 * Returns the specified clip to the pool.
	 * @param {Audio} clip
	 */
	function _addToPool(clip: HTMLAudioElement): void
	{
		var url = clip.relativeSrc;
		if (!pool[url])
		{
			pool[url] = [];
		}
		if (!pool[url].contains(clip))
		{
			pool[url].push(clip);
		}
	};
}
