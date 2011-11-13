var jm_loader = {
	load_jm_assets: function() {
		prefix = '';

		if ( typeof jm_is_core == 'undefined' || jm_is_core == false ) {
			prefix = '../';
		}

		css = ['jquery.mobile-1.0rc2.css', 'customSwatch.css'];
		for ( var i = 0; i < css.length; i++ ) {
			this._load_asset( prefix + 'assets/css/' + css[i], 'css' );
		}

		js = ['jquery-1.6.4.js', 'jquery.ba-bbq.min.js',
			'json2.js', 'jcache.js', 'my.conf.js', 'defaults.js', 'main.js', 'jquery.mobile-1.0rc2.js'];
		for ( var i = 0; i < js.length; i++ ) {
			this._load_asset( prefix + 'assets/js/' + js[i], 'js' );
		}

		if ( typeof jm_assets != 'undefined' && ( jm_assets['css'] || jm_assets['js'] ) ) {
			for ( _key in ['css', 'js'] ) {
				type = ['css', 'js'][_key];
				if ( typeof jm_assets[type] != 'undefined' && jm_assets[type].length ) {
					for ( var i = 0; i < jm_assets[type].length; i++ ) {
						this._load_asset( jm_assets[type][i], type );
					};
				}
			}
		}

		if ( typeof jm_is_core == 'undefined' || jm_is_core == false ) {
			this._load_asset( 'assets/js/main.js', 'js' );
		}
	},

	_load_asset: function( filename, filetype, async ) {
		if ( 'js' == filetype ) {
			var sc = document.createElement('script');
			sc.setAttribute( 'type', 'text/javascript' );
			sc.setAttribute( 'src', filename );
		} else if ( 'css' == filetype ) {
			var sc=document.createElement( 'link' );
			sc.setAttribute( 'rel', 'stylesheet' );
			sc.setAttribute( 'type', 'text/css' );
			sc.setAttribute( 'href', filename );
		}

		if ( async ) {
			sc.async = true;
		} else {
			sc.async = false;
		}

		if ( typeof sc != 'undefined' )
			document.getElementsByTagName('head')[0].appendChild( sc );
	}
}

jm_loader.load_jm_assets();