/* Categories */
jQuery('#page-categories').live('pageshow',function(event){
	try {
	el = jQuery('#categories-list ul');
	if ( !el.html() ) {
		japp._start_loader();
		japp.load_categories('#categories-list ul', 'com_content');
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

/* Utils */
jQuery('#page-customdialog').live('pageshow',function(event){
	try {
	type = japp.dialogtype;

	types = {
		comingsoon: {
			title: 'In the works!',
			content: 'This feature will be available in future versions!<br />Please stay tuned.'
		},
		addnewsite: {
			title: 'No can do!',
			content: 'For this free version, we only allow 1 site. Sorry.'
		},
		newbie: {
			title: 'Hi!',
			content: 'Thank you for installing!<br /><br />Did you like the legs?<br />We are pretty hip like that.<br /><br />Anyway...<br />To use this app for your website, you need to install the API component. You may download this from our website at this address:<br /><a href="http://jommobile.com/" target="_blank">http://jommobile.com/</a>'
		}
	}

	jQuery('#page-customdialog .dialog-title').html(types[type].title);
	jQuery('#page-customdialog .dialog-content').html(types[type].content);
	} catch(e){}
});
// Toolbars
jQuery(document).bind('mobileinit',function(){
	jQuery.mobile.fixedToolbars.setTouchToggleEnabled(false);
	jQuery.mobile.listview.prototype.options.filterPlaceholder = 'Filter list...';
	jQuery.mobile.pushStateEnabled = false;
});
var japp_form_focused = false;
jQuery('form :input:not(:button, :submit, :reset, :hidden)').live('focus',function(event){
	japp_form_focused = true;
	jQuery.mobile.fixedToolbars.hide();
}).live('blur',function(event){
	japp_form_focused = false;
	setTimeout(function(){
		if ( !japp_form_focused ) {
			jQuery.mobile.fixedToolbars.show();
		}
	}, 25);
});
// Fix the textarea height when clicked
jQuery('textarea').live('click',function(){
	_fix_textarea_height(jQuery(this));
});
// Remove any scroll hooks when a page is changed
jQuery('.ui-mobile').live('pagebeforehide',function(event, ui){
	japp.unbind_scroll_listener();
}).live('pagebeforechange',function(){ // Hide toolbars before page change to avoid clunkyness
	jQuery.mobile.fixedToolbars.hide();
}).live('pageshow',function(){
	jQuery.mobile.fixedToolbars.show();
});
