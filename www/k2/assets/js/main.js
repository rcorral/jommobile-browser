/* Page listeners */
jQuery('#page-k2-items').live('pageshow',function(event){
	try { // Wrap in try/catch in case there is a JS error, the app won't crash
	el = jQuery('#k2-items-list ul');
	if ( !el.html() ) {
		japp._start_loader();
		japp.load_k2_items();
	}
	} catch(e){japp._stop_loader();}
});
jQuery('#page-category').live('pageshow',function(event){
	try {
	func = function() {
		id = _gup( 'id' );

		parentcat = japp.get_joomla_parentcategories( id, 'com_content' );
		access = japp.get_joomla_accesslevels();
		languages = japp.get_content_language();
		users = japp.get_joomla_users_list();
		layouts = japp.get_component_layout( 'com_content', 'category', 0 );

		_populate_select( '#category-parent-id', parentcat, 'row.value', 'row.text' );
		_populate_select( '#category-access', access, 'row.value', 'row.text' );
		_populate_select( '#category-language', languages, 'row.value', 'row.text' );
		_populate_select( '#category-created-user-id', users, 'key', 'row.name',
			{ select_option: true, selected_value: japp.api_user.id });
		_populate_group_select( '#category-category-layout', layouts, 'row[\'value\']',
			'row[\'text\']' );

		// New article
		if ( !id ) {
			japp._stop_loader();
			jQuery('#category-parent-id,#category-access,#category-language,'
				+ '#category-created-user-id,#category-category-layout')
				.selectmenu();

			return;
		}

		japp.load_category( id, 'com_content' );

		// Set page title
		jQuery('#page-title').html( 'Edit category' );

		jQuery('#category-delete').css('display', 'block');
	}

	japp._start_loader();
	setTimeout('func();', 250);
	} catch(e){japp._stop_loader();}
});

/* Declare methods to load/add/edit/delete */

// Load k2 items into list for items.html
japp.load_k2_items = function( limitstart, limit, fresh ) {
	if ( this._is_loading('k2_items') ) {
		return false;
	}

	var el = jQuery('#k2-item-list ul');
	this._started_loading('k2_items');

	if ( typeof limitstart == 'undefined' ) { limitstart = jQuery(el).attr('g:limitstart') || 0; }
	if ( typeof limit == 'undefined' ) { limit = 20; }

	var func = function( data ) {
		jQuery('#ajax-loading-img').remove();
		jcache.set( context, data, {expiry: date_times.seconds( date_times.hour/2 )} );

		// We reached the end of the items
		if ( !data.length ) {
			japp.unbind_scroll_listener();
			japp._stopped_loading('k2_items', true);
			return;
		}

		el = jQuery(el);

		jQuery(data).each(function(){
			state = japp.get_item_state( this.published );
			date = _datetime_to_date( this.created );
			jQuery(el).append('<li><a href="item.html?id=' + this.id + '">'
				+ '<h3>' + this.title + '</h3>'
				+ '<p><span class="item-author">' + this.author
				+ '</span> / <span class="item-' + state.toLowerCase() + '">'
				+ state + '</span> / <span class="item-'
				+ this.groupname.toLowerCase() + '">'
				+ this.groupname + '</span></p>'
				+ '<p class="ui-li-aside"><strong>' + date.toLocaleDateString() + '</strong></p>'
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
				function(){ japp.load_k2_items(); } );
		}

		japp._stopped_loading('k2_items', true);
	};

	var context = 'joomla.k2.items.' + limitstart + '.' + limit;
	if ( japp.cache && !fresh && jcache.get( context ) ) {
		func( jcache.get( context ) );
	} else {
		this._ajax(
			{
				app: 'k2',
				resource: 'items',
				limitstart: limitstart,
				limit: limit
			}, func );
	}
};
