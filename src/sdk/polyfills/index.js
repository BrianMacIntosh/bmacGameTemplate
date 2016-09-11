Math.sign = Math.sign || function(val)
{
	if (val < 0)
		return -1;
	else if (val > 0)
		return 1;
	else
		return 0;
}

Math.clamp = Math.clamp || function(val, a, b)
{
	if (val < a) return a;
	if (val > b) return b;
	return val;
}

Math.randomInt = function(upperBoundExclusive)
{
	return Math.floor(Math.random() * upperBoundExclusive);
}

Math.randomRange = function(minInclusive, maxExclusive)
{
	return Math.randomInt(maxExclusive-minInclusive)+minInclusive;
}

/**
 * Converts the specified angle in radians to degrees.
 * @param {Number} rad
 */
Math.rad2Deg = function(rad)
{
	return (rad / Math.PI) * 180;
}

/**
 * Converts the specified angle in degrees to radians.
 * @param {Number} deg
 */
Math.deg2Rad = function(deg)
{
	return (deg / 180) * Math.PI;
}

//Robert Eisele
Math.angleBetween = function(n, a, b)
{
	var circle = Math.PI*2;
	n = (circle + (n % circle)) % circle;
	a = (circle*100 + a) % circle;
	b = (circle*100 + b) % circle;
	
	if (a < b)
		return a <= n && n <= b;
	return a <= n || n <= b;
}

String.prototype.trim = String.prototype.trim || function trim()
{
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

Array.prototype.remove = Array.prototype.remove || function remove(object)
{
	for (var c = 0; c < this.length; c++)
	{
		if (this[c] === object)
		{
			this.splice(c, 1);
			return;
		}
	}
};

Array.prototype.contains = Array.prototype.contains || function contains(object)
{
	for (var c = 0; c < this.length; c++)
	{
		if (this[c] === object)
			return true;
	}
	return false;
};

//http://stackoverflow.com/questions/1248302/javascript-object-size
Object.getRoughSize = function(obj)
{
	var objectList = [];
	var stack = [obj];
	var bytes = 0;

	while (stack.length)
	{
		var value = stack.pop();

		if (typeof value === 'boolean')
		{
			bytes += 4;
		}
		else if (typeof value === 'string')
		{
			bytes += value.length * 2;
		}
		else if (typeof value === 'number')
		{
			bytes += 8;
		}
		else if (typeof value === 'object'
			&& objectList.indexOf( value ) === -1)
		{
			objectList.push(value);
			for (var i in value)
			{
				stack.push(value[i]);
			}
		}
	}
	return bytes;
}
