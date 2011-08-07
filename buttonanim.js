/*  Button Animation Class for CommandFusion
===============================================================================

AUTHOR:		Jarrod Bell, CommandFusion
CONTACT:	support@commandfusion.com

=========================================================================
HELP:

1. Place this script in your project via Project Properties > Script Manager
2. Attach animation calls to buttons via the script property of the button
3. Animation call examples:
	- Anims.bulge(join)
	- Anims.bulge(join, 0.1)
	- Anims.bulge(join, 0.1, 0.3)
	- Anims.bulge(join, 0.1, 0.3, 0.1)
	- Anims.imagePulse(join)

=========================================================================
*/

// Used to see if an array contains an object on a specific join
Array.prototype.containsJoin = function(join) {
    var i = this.length;
    while (i--) {
        if (this[i].join == join) {
            return true;
        }
    }
    return false;
}
// Used to get an object from an array on a specific join
Array.prototype.getJoin = function(join) {
    var i = this.length;
    while (i--) {
        if (this[i].join == join) {
            return this[i];
        }
    }
    return false;
}

/* CLASS: Animations
--------------------
Instantiate this once in your project to use any of it's animations.
-----------------------------------------------------------------------------
- imagePulse	= Increase the size of an image below a button, creating a pulse effect.
- bulge			= Increase then decrease the size of the object, creating a bulge effect.
----------------------------------------------------------------------------- */
var Animations = function(params) {
	var self = {
		origPos:		[] // This array is used to store the original position/size/etc of an object to reset an animation
	};

	
	/* ANIMATION: imagePulse
	------------------------
	Increase the size of an image below a button, creating a pulse effect.
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of a button.
					  There must be an image using the same join number, but serial, which will be object we animate
	- increaseBy	= the pixel amount to increase the size of the image (default 30)
	- duration		= the duration of the animation (default 0.5 seconds)
	----------------------------------------------------------------------------- */
	self.imagePulse = function(join, increaseBy, duration) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 30;
		}
		if (duration === undefined) {
			duration = 0.5;
		}
		// Change from the digital join of the button, to the serial join of the image below it
		join = "s"+join.substr(1);
		// Get the original position and size of the button if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.imagePulseAnimate(j.join, increaseBy, duration);
			});
		} else {
			self.imagePulseAnimate(join, increaseBy, duration);
		}
	};
	// This is where the actual animation happens.
	self.imagePulseAnimate = function(join, increaseBy, duration) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, x: defaultState.x, y: defaultState.y, w: defaultState.w, h: defaultState.h, opacity: 0.8}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, x: defaultState.x-(increaseBy/2), y: defaultState.y-(increaseBy/2), w: defaultState.w+increaseBy, h: defaultState.h+increaseBy, opacity: 0.0}, 0.0, duration);
		});
	};

	/* ANIMATION: bulge
	------------------------
	Increase then decrease the size of the object, creating a bulge effect.
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of an object to bulge.
	- increaseBy	= the pixel amount to increase the size of the image (default 0.1)
	- duration		= the duration of the size increase animation (default 0.2 seconds)
	- durationOut	= the duration of the size decrease animation (default 0.2 seconds)
	----------------------------------------------------------------------------- */
	self.bulge = function(join, increaseBy, duration, durationOut) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 0.1;
		}
		if (duration === undefined) {
			duration = 0.2;
		}
		if (durationOut === undefined) {
			durationOut = duration;
		}
		// Get the original position and size of the object if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.bulgeAnimate(j.join, increaseBy, duration, durationOut);
			});
		} else {
			self.bulgeAnimate(join, increaseBy, duration, durationOut);
		}
	};
	// This is where the actual animation happens.
	self.bulgeAnimate = function(join, increaseBy, duration, durationOut) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, scale: defaultState.scale+increaseBy, opacity: 1.0}, 0.0, duration, CF.AnimationCurveEaseOut, function() {
				// Reverse the animation
				CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, durationOut, CF.AnimationCurveEaseOut);
			});
		});
	};

	/* ANIMATION: bounce
	------------------------
	Create a bounce effect using a chain of animations with precise timing
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of an object to bounce.
	- increaseBy	= the amount to scale the bounce (default 0.1)
	- duration		= the duration of the total animation (default 0.6 seconds)
	----------------------------------------------------------------------------- */
	self.bounce = function(join, increaseBy, duration) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 0.1;
		}
		if (duration === undefined) {
			duration = 0.6;
		}
		// Get the original position and size of the object if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.bounceAnimate(j.join, increaseBy, duration);
			});
		} else {
			self.bounceAnimate(join, increaseBy, duration);
		}
	};
	// This is where the actual animation happens.
	self.bounceAnimate = function(join, increaseBy, duration) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, scale: defaultState.scale+increaseBy}, 0.0, duration/4, CF.AnimationCurveEaseOut, function () {
				CF.setProperties({join: join, scale: defaultState.scale-(increaseBy/2)}, 0.0, duration/4, CF.AnimationCurveEaseIn, function () {
					CF.setProperties({join: join, scale: defaultState.scale+(increaseBy/2)}, 0.0, duration/4, CF.AnimationCurveEaseIn, function () {
						CF.setProperties({join: join, scale: 1.0}, 0.0, duration/4, CF.AnimationCurveEaseInOut);
					});
				});
			});
		});
	};

	return self;
};
// Instatiated here, no need to instantiate in your project anywhere else
var Anims = new Animations();