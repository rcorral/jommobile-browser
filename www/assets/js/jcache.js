/**
 * Proxy for localStorage
 */
var jcache = {
	// Public method to get value by key
	get: function( key ) {
		if ( !this.has( key, true ) ) {
			return null;
		}

		// Retrieve value
		var value = window.localStorage.getItem( key );
		var meta = this._get_meta( key );

		var now = new Date();
		if ( meta.expiry && Date.parse( meta.expiry ) <= now ) {
			// Key has expired, remove
			this.remove( key, true );
			this.remove( key + '.meta', true );
			return null;
		} else if ( !value ) {
			// In case there was no value found
			return null;
		} else {
			if ( meta.isjson ) {
				return eval( '(' + value + ')' );
			} else {
				return value;
			}
		}
	},

	// Public method to store key/value
	set: function( key, value, opts ) {
		meta = {
			expiry: false,
			isjson: true,
			overwrite: true
		};

		if ( typeof opts != 'undefined' ) {
			meta = this._merge_objects( meta, opts );
		} else {
			// Check if our value is an object
			if ( typeof value != 'object' ) {
				meta.isjson = false;
			}
		}

		if ( !meta.overwrite && jcache.get( key, true ) ) {
			return;
		}
		delete meta.overwrite;

		if ( meta.isjson ) {
			// Always serialize as JSON
			value = JSON.stringify( value );
		}

		window.localStorage.setItem( key, value );

		// Set meta
		meta.expiry = this._make_valid_expiry( meta.expiry );
		this._set_meta( key, meta );
	},

	// Check if given key exists
	has: function( key ) {
		var value = window.localStorage.getItem( key );

		return ( value != null && value != undefined );
	},

	// Copies the value of the first key to the second key.
	copy: function( source, target ) {
		// Copy value
		var value = this.get( source );
		this.set( target, value );

		// Copy meta
		var meta = this.get( source + '.meta' );
		this.set( target + '.meta', meta );
	},

	// Renames the first key to the second key.
	rename: function( source, target ) {
		var value = this.get( source );
		this.set( target, value );
		var meta = this.get( source + '.meta' );
		this.set( target + '.meta', meta );

		this.remove( source );
		this.remove( source + '.meta' );
	},

	// Removes the given key
	remove: function( key ) {
		window.localStorage.removeItem( key );
	},

	// Public method to wipe LS
	clear: function() {
		window.localStorage.clear();
	},

	/* Private methods */

	_get_meta: function( key ) {
		meta = window.localStorage.getItem( key + '.meta' );
		if ( !meta ) {
			meta = '{}';
		}

		return eval( '(' + meta + ')' );
	},

	_set_meta: function( key, value ) {
		value = JSON.stringify( value );
		window.localStorage.setItem( key + '.meta', value );
	},

	/**
	 * Gets the expiry date for given key
	 * @param key string. The key to get
	 * @return mixed, value for key or NULL if no such key
	 */
	_get_expiry: function( key ) {
		var meta = this._get_meta( key );
		if ( meta.expiry != false && meta.expiry != null ) {
			meta = new Date( meta.expiry );
		} else {
			meta = false;
		}

		return meta;
	},

	/**
	 * Sets the expiry date for given key
	 * @param key string. The key to set
	 * @param expiry; RFC1123 date or false for no expiry
	 * @return mixed, value for key or NULL if no such key
	 */
	_set_expiry: function( key, expiry ) {
		if ( this.has( key, true ) ) {
			date = this._make_valid_expiry( expiry );
			meta = this._get_meta( key );
			meta.expiry = date;
			this._set_meta( key, meta );
			return this._get_expiry( key );
		} else {
			return null;
		}
	},

	_make_valid_expiry: function( expiry ) {
		if ( !expiry ) {
			// no expiry given; change from "undefined" to false - this value does not expire.
			// expiry = false;
			// Default to tomorrow
			expiry = date_times.seconds( date_times.day );
		} else {
			// force to date type
			expiry = new Date( expiry );
		}

		return expiry;
	},

	_merge_objects: function( obj1, obj2 ) {
		var obj3 = {};

		for ( var attrname in obj1 ) { obj3[attrname] = obj1[attrname]; }
		for ( var attrname in obj2 ) { obj3[attrname] = obj2[attrname]; }

		return obj3;
	}
};
