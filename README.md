jomMobile browser version for developers
================================

What is it?
---------------------------------------
A stripped down version of the [jomMobile app](http://jommobile.com/).
It is ready for 3rd party developers to develop plugins for their extensions.

Set up
-----------------------------

1. Install [com_jm](https://github.com/downloads/rcorral/jommobile-browser/com_jm-developers.zip) on your Joomla 1.7 site
2. (option) Install K2 so that you can see the K2 plugin in action, it is a very good and simple example
3. Create a token for your user through the `com_jm` component
4. Check out this repository, you can either checkout the repository into the www folder of your localhost or create a symlink of the www folder. If you use MAMP it is an 'htdocs' folder, you could do something like this: `ln -s /path/to/github/repo/www /Applications/MAMP/htdocs/joomla-app-browser`
5. Rename the file located at `assets/js/my.conf-sample.js` to `assets/js/my.conf.js`
6. Change the configuration variables inside the `my.conf.js` file, you must enter an API token and the URL to your Joomla site.
7. Visit the repository through your browser. Example: `http://localhost/path-to-install-git-directory/index.html`

**Notes**
It is important that you use localhost if your Joomla! site is installed in your localhost otherwise ajax calls will not work due to cross domain policies.

Developing
--------------------------
The best example of a plugin will be the K2 plugin. It shows you the best structure to lay out your plugin.
There are two parts to every plugin, html/css/js and php. The first will be downloaded to the end-users device, and the later will be a plugin for Joomla, which will contain the html/css/js files for the device to download.

Contributing
----------------------------
**Improving the `com_jm` component**
If you want to make a change or improve the the com_jm component, check out the [com_jm repo](https://github.com/rcorral/com_jm), make a fork and do a pull request to the **staging** branch.

**Improving/Contributing plugins**
If you would like to contribute any of your plugins or improve already created ones, you can check out the [com_jm-plugins repo](https://github.com/rcorral/com_jm-plugins), make a form and do a pull request to the **staging** branch.

Any other changes, please use our [contact form](http://jommobile.com/contact-us)
