jomMobile browser version for developers
================================

What is it?
---------------------------------------
A stripped down version of the [jomMobile app](http://jommobile.com/).
It is ready for 3rd party developers to develop plugins for their extensions.

Set up
-----------------------------

1. Install [com_jm](https://github.com/downloads/rcorral/jommobile-browser/com_jm-developers.zip) on your Joomla 1.7 site
2. (optional) Install K2 so that you can see the K2 plugin in action, it is a very good and simple example
3. Create a token for your user through the `com_jm` component
4. Check out this repository, you can either checkout the repository into the www folder of your localhost or create a symlink of the www folder. If you use MAMP it is an 'htdocs' folder, you could do something like this: `ln -s /path/to/github/repo/www /Applications/MAMP/htdocs/joomla-app-browser`
5. Rename the file located at `assets/js/my.conf-sample.js` to `assets/js/my.conf.js`
6. Change the configuration variables inside the `my.conf.js` file, you must enter an API token and the URL to your Joomla site.
7. Visit the repository through your browser. Example: `http://localhost/path-to-install-git-directory/index.html`

**Notes**  
It is important that you use localhost if your Joomla! site is installed in your localhost otherwise ajax calls will not work due to cross domain policies.

Developing a plugin
--------------------------
The best example of a plugin will be the K2 plugin, the browser version of jomMobile already has the K2 [HTML files](https://github.com/rcorral/jommobile-browser/tree/master/www/k2) installed.

This plugin shows you the best structure to layout your plugin.

There are two parts to every plugin, 'html/css/js' and the server side which is 'php'.

For an example of a jomMobile Joomla plugin see the [K2 plugin](https://github.com/downloads/rcorral/jommobile-browser/plg_jm_k2.zip).

This is how jomMobile will use any 3rd party plugin:

1. Connect to Joomla website and asks if there are any jomMobile plugins.
2. Your plugin will register itself and tell the com_jm component that it is available for download.
3. The device will then download the 'html' folder in the plugin (see K2 plugin for example).
4. Saves the files to the device and adds a new extension for the user to click on the device.

**Notes**  
- For the purposes of development, the browser cannot download HTML files from a website, so you will need to manually create a folder with the name of your Joomla plugin in the www/ folder of this repo.  
- When packaging the plugin for release, you will need to copy the contents of this plugins folder into a 'html' folder inside your Joomla plugin, these files will be downloaded by the device.

Contributing
----------------------------
**Improving the `com_jm` component**  
If you want to make a change or improve the the com_jm component, check out the [com_jm repo](https://github.com/rcorral/com_jm), make a fork and do a pull request to the **staging** branch.

**Improving/Contributing plugins**  
If you would like to contribute any of your plugins or improve already created ones, you can check out the [com_jm-plugins repo](https://github.com/rcorral/com_jm-plugins), make a form and do a pull request to the **staging** branch.

Any other changes, please use our [contact form](http://jommobile.com/contact-us)
