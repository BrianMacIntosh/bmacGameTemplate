"use strict";
var AudioManager;
(function (AudioManager) {
    /**
     * Set to false to disable audio.
     * @type {boolean}
     */
    AudioManager.enabled = true;
    /**
     * Pooled audio sources, indexed by URL.
     */
    var pool = {};
    /**
     * Set the position of the audio listener.
     * @param {THREE.Vector3} position
     */
    function setListener(position) {
        listener = position;
    }
    AudioManager.setListener = setListener;
    ;
    //TODO: call this every frame
    function _updateVolume(clip) {
        //Do ranges
        if (clip.position && listener) {
            var dist = clip.position.subtracted(listener).lengthSq();
            if (dist < audibleRange * audibleRange) {
                if (dist < dropoffRange * dropoffRange)
                    clip.volume = 1;
                else
                    clip.volume = 1 - (Math.sqrt(dist) - dropoffRange) / (audibleRange - dropoffRange);
            }
            else
                clip.volume = 0;
        }
        else {
            clip.volume = 1;
        }
    }
    AudioManager._updateVolume = _updateVolume;
    ;
    //TODO: test me
    function preloadSound(url) {
        // server-side fail silent
        if (typeof Audio === "undefined")
            return;
        if (url instanceof Array) {
            for (var c = 0; c < url.length; c++)
                preloadSound(url[c]);
        }
        else {
            var clip = new Audio(url);
            clip.play();
            clip.pause();
            clip.relativeSrc = url;
            _addToPool(clip);
        }
    }
    AudioManager.preloadSound = preloadSound;
    ;
    /**
     * Starts playing a sound.
     * @param {string} url URL of the sound to play.
     * @param {number} vol Volume (0.0 - 1.0).
     * @returns {Audio}
     */
    function playSound(urlParam, vol) {
        // server-side fail silent
        if (typeof Audio === "undefined")
            return null;
        if (url === undefined)
            return null;
        if (!AudioManager.enabled)
            return null;
        var url;
        if (urlParam instanceof Array) {
            url = urlParam[Math.floor(Math.random() * urlParam.length)];
        }
        else {
            url = urlParam;
        }
        var clip;
        if (pool[url] && pool[url].length > 0) {
            //Use a pooled clip
            var last = pool[url].length - 1;
            clip = pool[url][last];
            clip.currentTime = 0;
            clip.volume = vol || 1.0;
            clip.playbackRate = 1.0;
            pool[url].length = last;
        }
        else {
            //Make a new clip
            clip = new Audio(url);
            clip.relativeSrc = url;
            clip.volume = vol || 1.0;
            clip.addEventListener("ended", function () { _addToPool(clip); });
        }
        clip.play();
        return clip;
    }
    AudioManager.playSound = playSound;
    ;
    /**
     * Stops and pools the specified clip.
     * @param {Audio} clip
     */
    function stop(clip) {
        clip.pause();
        clip.currentTime = 0;
        _addToPool(clip);
    }
    AudioManager.stop = stop;
    ;
    /**
     * Returns the specified clip to the pool.
     * @param {Audio} clip
     */
    function _addToPool(clip) {
        var url = clip.relativeSrc;
        if (!pool[url]) {
            pool[url] = [];
        }
        if (!pool[url].contains(clip)) {
            pool[url].push(clip);
        }
    }
    ;
})(AudioManager = exports.AudioManager || (exports.AudioManager = {}));
