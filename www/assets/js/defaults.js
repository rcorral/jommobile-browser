/**
 * Object that contains all public methods
 * Get familiarized with this object as it has many methods that you can reuse
 */
var japp = {
	init: function() {
		prefix = '';

		if ( typeof jm_is_core == 'undefined' || jm_is_core == false ) {
			prefix = '../';
		}

		this.requires_api_version = 0.1;
		this.ajax_loader = prefix + 'assets/images/ajax-loader.gif';
		this.is_loading = {};
		this.available = true;
		this.cache = true;

		// Set default cache types
		this.cache_types = {
			'category': {
				0: 'joomla.category.{0}.id.{1}',
				1: 'joomla.parentcategories.{0}.id.{1}',
				2: 'joomla.categories.*'
				}
			};
		this.load_tries = new Array();

		// This is just for the browser version
		this.api_key = japp_browser.api_key;
		this.site_url = japp_browser.site_url;
		this.cache = japp_browser.cache;
	},

	/* Exntensions */
	load_extensions: function( fresh ) {
		plugins = this.get_plugins( fresh );

		// Remove all previous extensions in list
		jQuery('#extension-list li.extension-plugin').each(function(){
			jQuery(this).remove();
		});

		el = jQuery('#extension-list ul');
		for ( _plugin in plugins ) {
			plugin = plugins[_plugin];

			jQuery(el).append('<li class="extension-plugin"><a href="' + _plugin
				+ '/index.html" data-ajax="false">'
				+ plugin.title
				+ '</a></li>');
		}

		jQuery(el).listview('refresh');
		japp._stop_loader();
	},

	/**
	 * Gets a list of plugins from the server
	 * In this example it should get the K2 plugin and display it in the extensions page
	 */
	get_plugins: function( fresh ) {
		var context = 'api.plugins';
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'api',
				resource: 'extensions'
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'api_plugins', '',
						function(){ japp.get_plugins( fresh ); });
				} else {
					jcache.set( context, data, { expiry: date_times.seconds( date_times.week ) } );
				}
			}, { async: false });

		return jcache.get( context );
	},

	/* Core Joomla */
	get_joomla_accesslevels: function( fresh ) {
		var context = 'joomla.accesslevel';
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'accesslevel'
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_accesslevel', '',
						function(){ japp.get_joomla_accesslevels( fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_joomla_categories_list: function( extension, fresh ) {
		var context = 'joomla.categorieslist.' + extension;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'categories',
				extension: extension
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_categories', extension,
						function(){ japp.get_joomla_categories_list( extension, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_joomla_parentcategories: function( id, extension, fresh ) {
		var context = 'joomla.parentcategories.' + extension + '.id.' + id;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'categoryparent',
				id: id,
				extension: extension
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'get_joomla_parentcategories', id,
						function(){ japp.get_joomla_parentcategories( id, extension, fresh ) } );
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_content_language: function( fresh ) {
		var context = 'joomla.contentlanguage';
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'contentlanguage'
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'content_language', '',
				 		function(){ japp.get_content_language( fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_component_layout: function( extension, view, client, template, fresh ) {
		if ( typeof template == 'undefined' ) {
			template = '';
		}

		var context = 'joomla.componentlayout.' + extension + '.view.' + view + '.client.'
			+ client + '.template.' + template;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'componentlayout',
				client_id: client,
				extension: extension,
				_view: view,
				template: template
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'componentlayout' + client + extension,
						view + template,
					 	function(){
							japp.get_component_layout( extension, view, client, template, fresh );
						});
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_template_style: function( client, template, fresh ) {
		if ( typeof client == 'undefined' ) {
			client = '';
		}

		if ( typeof template == 'undefined' ) {
			template = '';
		}

		var context = 'joomla.templatestyle.client.' + client + '.template.' + template;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'templatestyle',
				client: client,
				template: template
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'templatestyle' + client, template,
					 	function(){
							japp.get_template_style( client, template, fresh );
						});
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_joomla_users_list: function( columns, fresh ) {
		if ( typeof columns == 'undefined' ) {
			columns = '';
		}

		var context = 'joomla.userslist.' + columns;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'users',
				resource: 'userslist',
				columns: columns
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_userslist', columns,
					 	function(){ japp.get_joomla_users_list( columns, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_joomla_menus_list: function( fresh ) {
		var context = 'joomla.menus.list';
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'jhtml',
				type: 'menu.menus'
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomlamenuslist', '',
					 	function(){
							japp.get_joomla_menus_list( fresh );
						});
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_joomla_menuparent_list: function( menutype, id, fresh ) {
		var context = 'joomla.menuparent.list';
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'menuparent',
				menutype: menutype,
				id: id
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomlamenuparent' + menutype, id,
					 	function(){
							japp.get_joomla_menuparent_list( menutype, id, fresh );
						});
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_languages_list: function( client, _default, fresh ) {
		if ( typeof client == 'undefined' ) {
			client = 'site';
		}

		if ( typeof _default == 'undefined' ) {
			_default = 1;
		}

		var context = 'joomla.languages.' + client + '.' + _default;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'language',
				resource: 'languages',
				client: client,
				default: _default
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'content_languages', client,
				 		function(){ japp.get_languages_list( client, _default, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_editors_list: function( _default, fresh ) {
		if ( typeof _default == 'undefined' ) {
			_default = 1;
		}

		var context = 'joomla.editors.' + _default;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'editors',
				default: _default
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_editors', _default,
				 		function(){ japp.get_editors_list( _default, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_helpsite_list: function( _default, fresh ) {
		if ( typeof _default == 'undefined' ) {
			_default = 1;
		}

		var context = 'joomla.helpsite.' + _default;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'helpsite',
				default: _default
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_helpsite', _default,
				 		function(){ japp.get_helpsite_list( _default, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	get_timezone_list: function( _default, field_name, field_id, fresh ) {
		if ( typeof _default == 'undefined' ) {
			_default = 1;
		}

		var context = 'joomla.timezone.' + _default + '.' + field_name + '.' + field_id;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'core',
				resource: 'timezone',
				default: _default,
				field_name: field_name,
				field_id: field_id
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'joomla_timezone', '',
				 		function(){
					 		japp.get_timezone_list( _default, field_name, field_id, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	/* Categories */
	load_categories: function( element, extension, limitstart, limit, fresh ) {
		if ( this._is_loading('categories') || !element || !extension ) {
			return false;
		}

		var el = jQuery(element);
		this._started_loading('categories');
		
		if ( typeof limitstart == 'undefined' ) { limitstart = jQuery(el).attr('g:limitstart') || 0; }
		if ( typeof limit == 'undefined' ) { limit = 20; }

		var func = function( data ) {
			jQuery('#ajax-loading-img').remove();
			jcache.set( context, data, {expiry: date_times.seconds( date_times.hour/2 )} );

			// We reached the end of articles
			if ( !data.length ) {
				japp.unbind_scroll_listener();
				japp._stopped_loading('categories', true);
				return;
			}

			el = jQuery(el);

			jQuery(data).each(function(){
				level = '';
				if ( Number(this.level) > 1 ) {
					for (var i=1; i < this.level; i++) {
						level += '<span class="gi">|&mdash;</span>';
					};
				}
				state = japp.get_item_state( this.published );
				jQuery(el).append('<li><a href="category.html?id=' + this.id + '">'
					+ '<h3>' + level + this.title + '</h3>'
					+ '<p><span class="item-author">' + this.author_name
					+ '</span> / <span class="item-' + state.toLowerCase() + '">'
					+ state + '</span> / <span class="item-'
					+ this.access_level.toLowerCase() + '">'
					+ this.access_level + '</span></p>'
					+ '</a></li>');
			});

			jQuery(el).listview('refresh').attr('g:limitstart',
				parseInt( limitstart ) + parseInt( limit ) );

			// Add loading animation
			jQuery(el).append('<li id="ajax-loading-img"><img src="'
				+ japp.ajax_loader + '" /></li>');

			// Add scroll listener
			if ( 0 == limitstart ) {
				japp.scroll_bottom_listener( '#ajax-loading-img',
					function(){ japp.load_categories( element, extension ); } );
			}

			japp._stopped_loading('categories', true);
		};

		var context = 'joomla.categories.' + extension + '.' + limitstart + '.' + limit;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			func( jcache.get( context ) );
		} else {
			this._ajax(
				{
					app: 'categories',
					resource: 'categories',
					extension: extension,
					limitstart: limitstart,
					limit: limit
				}, func );
		}
	},

	load_category: function( id, extension ) {
		category = this.get_category( id, extension );

		// Populate all category fields
		jQuery('#category-title').val(category.title);
		jQuery('#category-alias').val(category.alias);
		jQuery('#category-parent-id').val(category.parent_id).selectmenu();
		jQuery('#category-published').val(category.published).selectmenu('refresh');
		jQuery('#category-featured').val(category.featured).slider('refresh');
		jQuery('#category-access').val(category.access).selectmenu();
		jQuery('#category-language').val(category.langugae).selectmenu();
		jQuery('#category-description').val( category.description );
		jQuery('#category-created-user-id').val(category.created_by).selectmenu();
		jQuery('#category-category-layout').val(category.params.category_layout).selectmenu();
		jQuery('#category-note').val(category.note);
		jQuery('#category-meta-description').val(category.metadesc);
		jQuery('#category-meta-keywords').val(category.metakey);
		jQuery('#category-metadata-robots').val(category.metadata.robots);
		jQuery('#category-metadata-author').val(category.metadata.author);
		jQuery('#category-extension').val(category.extension);
		jQuery('#category-id').val(category.id);

		this._stop_loader();
	},

	get_category: function( id, extension, fresh ) {
		var context = 'joomla.category.' + extension + '.id.' + id;
		if ( japp.cache && !fresh && jcache.get( context ) ) {
			return jcache.get( context );
		}

		this._ajax(
			{
				app: 'categories',
				resource: 'category',
				id: id,
				extension: extension
			},
		 	function( data ) {
				// Try again?
				if ( japp._object_empty( data ) ) {
					japp._try_server_request_again( 'content_category', id,
						function(){ japp.get_category( id, extension, fresh ); });
				} else {
					jcache.set( context, data );
				}
			}, { async: false });

		return jcache.get( context );
	},

	save_category: function( postdata ) {
		if ( typeof postdata == 'undefined' ) {
			_data = jQuery('#category-form').serialize();
			postdata = jQuery.deparam( _data );
		}

		// Add defaults
		postdata.app = 'categories';
		postdata.resource = 'category';
		postdata.jform['extension'] = 'com_content';

		this._ajax(
			postdata,
			function( data ) {
				japp._stop_loader();
				if ( data.success ) {
					_alert( data.message, null, 'Success' );
					jQuery('#category-id').val(data.id);
					jQuery('#category-delete').css('display', 'block');

					japp.clear_cache( 'category', postdata.jform['extension'], data.id );
				} else {
					_alert( data.message, null, 'Error' );
				}
			}, { async: false, type: ( ( postdata.jform.id ) ? 'PUT' : 'POST' ) });
	},

	delete_category: function() {
		id = jQuery('#category-id').val();

		if ( !id ) {
			japp._stop_loader();
			_alert( 'Category not found' );
			return false;
		}

		var answer = confirm( 'Are you sure you want to delete this category?' );
		if ( !answer ) {
			japp._stop_loader();
			return false;
		}

		this._ajax(
			{
				app: 'categories',
				resource: 'categories',
				task: 'delete',
				cid: { 0: id }
			},
		 	function( data ) {
				japp._stop_loader();
				if ( data.success ) {
					jQuery('#categories-list ul').html('');
					limit = jQuery('#categories-list ul').attr('g:limitstart') || 20;

					if ( data.message ) {
						_alert( data.message, null, 'Success' );
					}

					japp.clear_cache( 'category', 'com_content', id );
					jQuery('#page-category .ui-header a:first').trigger('click');
				} else {
					_alert( data.message, null, 'Error' );
				}
			}, { async: false, type: 'DELETE' });
	},

	/* Other */
	/**
	 * Will set japp.api_user after the framework has loaded
	 * There shouldn't be a need for you to call this method on your plugin
	 * Use japp.api_user
	 */
	get_api_user: function( func, _data ) {
		this._ajax(
			{
				app: 'api',
				resource: 'user'
			},
		 	function( data ) {
				if ( data.success ) {
					// Lets run our success function
					func( data, _data );
				} else {
					japp._stop_loader();
					_alert( data.message, null, 'Error' );
				}
			}, { async: false });
	},

	/* Utilities */
	get_item_state: function( state ) {
		switch( Number( state ) ) {
			case 1:
				state = 'Published';
				break;
			case 0:
				state = 'Unpublished';
				break;
			case 2:
				state = 'Archived';
				break;
			default:
				state = 'Trash';
				break;
		}

		return state;
	},

	/**
	 * Sets a listener that gets triggered when an element comes into view
	 */
	scroll_bottom_listener: function( element, func ) {
		this.unbind_scroll_listener();
		jQuery(window).bind('scroll.removable', function(){
			if ( !japp.belowthefold(element) && !japp.rightoffold(element) ) {
				if ( typeof func == 'function' ) {
					func();
				} else {
					eval( func + '()' );
				}
			}
		});

		setTimeout(function(){
			if ( !japp.belowthefold(element) && !japp.rightoffold(element) ) {
				if ( typeof func == 'function' ) {
					func();
				} else {
					eval( func + '()' );
				}
			}}, 100);
	},

	/**
	 * Removes all scroll listeners
	 */
	unbind_scroll_listener: function() {
		jQuery(window).unbind('scroll.removable');
	},

	belowthefold: function( element ) {
		var fold = jQuery(window).height() + jQuery(window).scrollTop();

		return fold <= jQuery(element).offset().top + 20;
    },

    rightoffold: function( element, settings ) {
		var fold = jQuery(window).width() + jQuery(window).scrollLeft();

		return fold <= jQuery(element).offset().left - 0;
    },

	/**
	 * Adds cache types
	 * There are 3 different types of values that you can give to a cache type:
	 * Full: k2.tags
	 * Wildcard: k2.items.*
	 * Parameter: k2.item.{0} - Where {0} would be replaced by the first argument passed to japp.clar_cache
	 */
	add_cache_type: function( type, caches ) {
		obj = {};
		obj[type] = caches;
		this.cache_types = this._merge_objects( this.cache_types, obj );
	},

	/**
	 * Clears all cache for a specified cache type.
	 * See japp.add_cache_type() for more information
	 */
	clear_cache: function( type ) {
		types = this.cache_types[type];

		if ( !types ) {
			return;
		}

		args = Array.prototype.slice.call( arguments, 1 );

		for ( var key in types ) {
			type = types[key];

			// Check for wildcard
			i = (type + '').indexOf('*', 0);
			if ( i !== -1 ) {
				// Find all caches that match
				regex = new RegExp(
					'^site\\.\\d\\.' + type.replace(/\./g, '\\\.').replace('*', '.*'), 'i' );
				for ( var s in localStorage ) {
					// In case the Android decides to be temperamental again.
					// p = s.toString();

					matches = s.match(regex);

					if ( null == matches ) {
						continue;
					}

					// The .meta key will also get catched anyways, so no need here
					jcache.remove( matches[0], true );
				}
			} else {
				key = String.prototype.format.apply( type, args );
				jcache.remove( key );
				jcache.remove( key + '.meta' );
			}
		}

		return true;
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
	},

	/**
	 * Starts loader popup
	 * It doesn't allow the user to click or scroll, until loader is gone
	 * Loader will automatically disapear after 30 seconds, to prevent the app from locking that way
	 */
	_start_loader: function( msg, callback ) {
		if ( this.is_loading.loader ) {
			return false;
		}

		if ( typeof msg != 'undefined' ) {
			jQuery.mobile.loadingMessage = msg;
		}

		this.is_loading.loader = true;
		jQuery.mobile.showPageLoadingMsg();
		// Just in case
		this.loadMsgDelay = setTimeout("japp._stop_loader();", 30000);

		if ( typeof callback == 'function' ) {
			setTimeout(function(){callback();}, 250);
		}
	},

	/**
	 * Stops loader manually
	 */
	_stop_loader: function() {
		if ( this.is_loading.loader ) {
			clearTimeout( this.loadMsgDelay );
			this.is_loading.loader = false;
			jQuery.mobile.hidePageLoadingMsg();

			// Reset message
			jQuery.mobile.loadingMessage = 'Loading';
		}
	},

	_started_loading: function(type) {
		this.is_loading[type] = true;
	},

	_is_loading: function(type) {
		if ( this.is_loading[type] ) {
			return true;
		}

		return false;
	},

	_stopped_loading: function(type, stop_loader) {
		this.is_loading[type] = false;
		if ( stop_loader ) {
			this._stop_loader();
		}
	},

	/**
	 * Make ajax calls and executes callback on success
	 * 
	 * @param object An object of key/value pairs to send to server as parameters
	 * @param function A call back function to be executed if request is successful
	 * @param object An object of options
	 */
	_ajax: function( data, callback, opts ) {
		options = {
			// Site URL
			url: this.site_url,
			// Request asynchronous?
			async: true,
			// Request type, think of a RESTful api, make sure your requests describe what they do
			// GET: Gets data, POST: Creates item, PUT: Updates, DELETE: Deletes
			type: 'GET',
			// Data type that you expect back
			dataType: 'json',
			// Error handler, best not to mess with this one
			error: function(jxhr){
				japp._stop_loader();
				if ( typeof jxhr.responseText == 'undefined' || !jxhr.responseText ) {
					if ( japp._check_device_connection() ) {
						// Show error if device connected to internet but no connection to server
						_alert( 'An error ocurred: There was no response from the server. 444.', null, 'Error' );
					}
					return;
				}

				try {
					t = jQuery.parseJSON( jxhr.responseText );
					if ( t.message ) {
						_alert( t.message, null, 'Error' );
					} else {
						_alert( 'An error ocurred: There was no response from the server.', null, 'Error' );
					}
				} catch(e) {
					_alert( 'An error ocurred: There was no response from the server. 409.', null, 'Error' );
				}
			}
		};

		if ( typeof opts != 'undefined' ) {
			options = this._merge_objects( options, opts );
		}

		// Add default data parameters
		if ( typeof data.option == 'undefined' ) {
			data.option = 'com_jm';
		}
		if ( typeof data.key == 'undefined' ) {
			data.key = this.api_key;
		}

		return jQuery.ajax({
			url: options.url,
			dataType: options.dataType,
			cache: false,
			async: options.async,
			type: options.type,
			data: data,
			success: callback,
			error: options.error
		}).responseText;
	},

	_try_server_request_again: function( filter1, filter2, func ) {
		if ( !filter2 ) {
			if ( typeof japp.load_tries[filter1] == 'undefined' ) {
				japp.load_tries[filter1] = 1;
			} else {
				japp.load_tries[filter1]++;
			}

			if ( japp.load_tries[filter1] >= 3 ) {
				alert( 'There is an error connecting to the server, please try again.' );
				japp.load_tries[filter1] = 0;

				return false;
			}
		} else {
			if ( typeof japp.load_tries[filter1][filter2] == 'undefined' ) {
			    japp.load_tries[filter1][filter2] = 1;
			} else {
			    japp.load_tries[filter1][filter2]++;
			}
                
			if ( japp.load_tries[filter1][filter2] >= 3 ) {
			    alert( 'There is an error connecting to the server, please try again.' );
			    japp.load_tries[filter1][filter2] = 0;
                
			    return false;
			}
		}
		
		try {
			if ( typeof func == 'string' ) {
				japp.func();
			} else {
				func();
			}
		} catch(e) {}

		return true;
	},

	_object_empty: function( ob ) {
		for ( var i in ob ) {
			return false;
		}

		return true;
	},

	_merge_objects: function( obj1, obj2 ) {
	    var obj3 = {};

	    for ( var attrname in obj1 ) { obj3[attrname] = obj1[attrname]; }
	    for ( var attrname in obj2 ) { obj3[attrname] = obj2[attrname]; }

	    return obj3;
	},

	/**
	 * Trigger a dialog
	 * http://jquerymobile.com/demos/1.0rc3/docs/pages/page-dialogs.html
	 */
	_trigger_dialog: function(dialogtype) {
		japp.dialogtype = dialogtype;

		jQuery('.customdialog-link').trigger('click');

		return false;
	},

	_db_success: function(){},
	_db_error: function(){}	
};

japp.init();

jQuery(document).ready(function(){
	japp.get_api_user(function(data, _data){japp.api_user = data.user;});
});

/**
 * Populates select with an array, similar to JHtml::_('select.genericlist')
 * 
 * @param string The selector for the dropdown
 * @param object Contains a list of options
 * @param string The value of the object for each option to use as the value of option
 * @param string The value of the object for each option to use as the name of option
 * @param object Extra options
 */
function _populate_select( selector, obj, _key, _value, opts ) {
	options = {
		show_default: false,
		default_value: 0,
		default_text: '-- Select --',
		select_option: false,
		selected_value: 0,
		refresh: false,
		rebuild: false
	};

	if ( typeof opts != 'undefined' ) {
		options = japp._merge_objects( options, opts );
	}

	el = jQuery(selector);
	el.html('');
	html = '';

	if ( options.show_default ) {
		html += '<option value="' + options.default_value + '">'
			+ options.default_text + '</option>';
	}

	jQuery.each(obj, function( key, row ){
		html += '<option value="' + eval( _key ) + '">' + eval( _value ) + '</option>';
	});

	el.html(html);

	if ( options.refresh ) {
		el.selectmenu('refresh');
	}

	if ( options.select_option ) {
		el.val(options.selected_value);
		el[0].value = options.selected_value;
	}

	if ( options.refresh ) {
		if ( options.rebuild ) {
			el.selectmenu('refresh', true);
		} else {
			el.selectmenu('refresh');
		}
	}
}

/**
 * Populates select with an array, similar to JHtml::_('select.groupedlist')
 * 
 * @param string The selector for the dropdown
 * @param object Contains a list of options
 * @param string The value of the object for each option to use as the value of option
 * @param string The value of the object for each option to use as the name of option
 * @param object Extra options
 */
function _populate_group_select( selector, obj, _key, _value, opts ) {
	options = {
		opt_grp_items: 'items',
		select_option: false,
		selected_value: 0,
		refresh: false,
		rebuild: false,
		singlevalue: '',
		singletext: ''
	};

	if ( typeof opts != 'undefined' ) {
		options = japp._merge_objects( options, opts );
	}

	el = jQuery(selector);
	el.html('');
	html = '';
	counter = 0;

	jQuery.each(obj, function( opt_grp_key, opt_grp ) {
		// Check to see if this value is a single option and not in an optgroup
		singlevalue = eval( options.singlevalue );
		singletext  = eval( options.singletext );
		if ( typeof singlevalue != 'undefined' && singletext ) {
			html += '<option value="' + singlevalue + '">' + singletext + '</option>';
			return;
		}

		// Get label
		opt_grp_label = opt_grp['text'] || opt_grp_key;

		// Create option group warpper
		html += '<optgroup label="' + opt_grp_label + '">';
		jQuery.each( (options.opt_grp_items)
			? eval( 'opt_grp[\'' + options.opt_grp_items + '\']' )
			: opt_grp,
			function( key, row ) {
				html += '<option value="' + eval( _key ) + '">' + eval( _value ) + '</option>';
		});
		html += '</optgroup>';
	});

	el.html(html);

	if ( options.refresh ) {
		el.selectmenu('refresh');
	}

	if ( options.select_option ) {
		el.val(options.selected_value);
		el[0].value = options.selected_value;
	}

	if ( options.refresh ) {
		if ( options.rebuild ) {
			el.selectmenu('refresh', true);
		} else {
			el.selectmenu('refresh');
		}
	}
}

/**
 * Uses a datetime formatted date, and creates a javascript Date object from it
 *
 * @returns object
 */
function _datetime_to_date( datetime ) {
	//function parses mysql datetime string and returns javascript Date object
	//input has to be in this format: 2007-06-05 15:26:02
	var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
	var parts = datetime.replace( regex, '$1 $2 $3 $4 $5 $6' ).split( ' ' );
	return new Date( parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5] );
}

var date_times = {
	minute: 60,
	hour: 3600,
	day: 86400,
	week: 604800,

	seconds: function( seconds ) {
		var now = new Date();
		var future = new Date();
		future.setSeconds( seconds );

		return future;
	}
};

/**
 * Fixes text areas to match the hight of all of the text inside of them
 */
function _fix_textarea_height( el ) {
	extraLineHeight = 15;
	scrollHeight = el[0].scrollHeight;
	clientHeight = el[0].clientHeight;
	if ( clientHeight < scrollHeight ) {
		el.css({
			height: (scrollHeight + extraLineHeight)
		});
	}
}

/**
 * Any alerts sent to user should be done through this method
 */
function _alert( msg, func, title, btn ) {
	alert(msg);

	if ( typeof func == 'function' ) {
		func();
	};

	// Read more for device notification:
	// http://docs.phonegap.com/en/1.1.0/phonegap_notification_notification.md.html#notification.alert
}

/**
 * Any javascript confirm calls should go throught this methods
 * Limitations: It won't work if the callback function does an ajax call, fails every time
 */
function _confirm( msg, func, title, btn ) {
	var answer = confirm( msg );
	
	// This is not the correct implementation of what happens on the phone,
	// please read the link below for more information.
	if ( typeof func == 'function' ) {
		func( answer );
	};

	// Read more for device notification:
	// http://docs.phonegap.com/en/1.1.0/phonegap_notification_notification.md.html#notification.confirm
}

/**
 * Get the value of a URL parameter
 */
function _gup( name, loc ) {
	_name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]" + _name + "=([^&#]*)";
	var regex = new RegExp( regexS );

	var hash_test = false;
	if ( window.location.hash && !loc ) {
		loc = window.location.hash
		hash_test = true;
	}

	if ( !loc ) {
		loc = window.location.href;
	}

	var results = regex.exec( loc );

	if ( results == null ) {
		if ( hash_test ) {
			return _gup( name, window.location.href );
		}
		return '';
	} else {
		return results[1];
	}
}

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};
