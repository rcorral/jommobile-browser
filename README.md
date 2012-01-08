jomMobile browser version for developers
================================

What is it?
---------------------------------------
A stripped down version of the [jomMobile app](http://jommobile.com/) that runs on any browser.
It is an SDK that allows developers to build plugins for their Joomla extensions that can run in the jomMobile app.

**Why in the browser?**
Developing plugins in your browser will make development faster as Joomla developers are already used to the web languages, also debuggins is much easier when using a browser. Read the 'Test your plugin on a device' section if you want to develop using your mobile device.

Background
-------------------------------
The jomMobile app is built in a Web View, and we use PhoneGap as the mobile framework on the mobile device.
We use web languages such as html, css and javascript to develop jomMobile. We did this to allow 3rd party Joomla developers create plugins for jomMobile to allow their users to manage their components from their mobile device.

It is very easy to create a jomMobile plugin. You can see the K2 plugin that was created [here](https://github.com/rcorral/com_jm-plugins/tree/master/code/plugins/jm/k2). If you look through the PHP code, you can see that we use functions that have already been built, it is just about integrating the RESTful jomMobile API and code that has already been written.

Set up
-----------------------------

1. Install [com_jm](http://jommobile.com/media/downloads/com_api-latest.zip) on your Joomla 1.7 site
2. (optional) Install K2 so that you can see the [K2 plugin](http://jommobile.com/media/downloads/plg_jm_k2-latest.zip) in action, it is a very good and simple example
3. Create a token for your user through the `com_jm` component
4. Check out this repository, you can either checkout the repository into the www folder of your localhost or create a symlink of the www folder. If you use MAMP it is an 'htdocs' folder, you could do something like this: `ln -s /path/to/github/repo/www /Applications/MAMP/htdocs/joomla-app-browser`
5. Rename the file located at `assets/js/my.conf-sample.js` to `assets/js/my.conf.js`
6. Change the configuration variables inside the `my.conf.js` file, you must enter an API token and the URL to your Joomla site.
7. Visit the repository through your browser. Example: `http://localhost/path-to-install-git-directory/index.html`

**Notes**  
It is important that you use localhost if your Joomla! site is installed in your localhost otherwise ajax calls will not work due to cross domain policies.

Developing a plugin
--------------------------
The best example of a plugin will be the [K2 plugin](https://github.com/rcorral/com_jm-plugins/tree/master/code/plugins/jm/k2), the browser version of jomMobile already has the K2 [HTML files](https://github.com/rcorral/jommobile-browser/tree/master/www/k2) installed.

This plugin shows you the best structure to layout your plugin.

There are two parts to every plugin, mobile assets which are **html, css and js** files and the server side files which allows the jomMobile app to communicate with the server.

For an example of a jomMobile Joomla plugin see the [K2 plugin](http://jommobile.com/media/downloads/plg_jm_k2-latest.zip).

This is how jomMobile will use any 3rd party plugin:

1. Connect to Joomla website and asks if there are any jomMobile plugins.
2. Your plugin will register itself and tell the com_jm component that it has files for the device to download.
3. The device will then download the 'html' folder in the plugin (see K2 plugin for example).
4. Saves the files to the device and adds a new extension for the user to click on the device.

**Notes**  
- For the purposes of development, the browser cannot download HTML files from a website, so you will need to manually create a folder with the name of your Joomla plugin in the www/ folder of this repo.
- When packaging the plugin for release, you will need to copy the contents of your plugins folder into a 'html' folder inside your Joomla plugin, these files will be downloaded by the device.

Publishing
----------------------------
Once you are done building your plugin you can fork this repo and send us a pull request with it and we will add it to our [plugins page](http://jommobile.com/joomla-plugins).

Test your plugin on a device
---------------------------------------
[Contact us](http://jommobile.com/contact-us) and we can send you a development version of jomMobile for you to test on your iOS or Android device.
Only iOS and Android are supported.

Contributing
----------------------------
**Improving the `com_jm` component**  
If you want to make a change or improve the the com_jm component, check out the [com_jm repo](https://github.com/rcorral/com_jm), make a fork and do a pull request to the **staging** branch.

**Improving/Contributing plugins**  
If you would like to contribute any of your plugins or improve already created ones, you can check out the [com_jm-plugins repo](https://github.com/rcorral/com_jm-plugins), make a form and do a pull request to the **staging** branch.

Any other changes, please use our [contact form](http://jommobile.com/contact-us)
