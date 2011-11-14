jomMobile browser version for developers
================================

What is it?
---------------------------------------
A stripped down version of the [jomMobile app](http://jommobile.com/).
It is ready for 3rd party developers to develop plugins for their extensions.

How do I use it?
-----------------------------

1. Install [com_jm](http://jommobile.com/media/downloads/com_jm-latest.zip) on your Joomla 1.7 site
2. Create a token for your user through the `com_jm` component
2. Check out this repository, you can either checkout the repository into the www folder of your localhost or create a symlink of the www folder. If you use MAMP you could do something like this: `ln -s /path/to/github/repo/www /Applications/MAMP/htdocs/joomla-app-browser`
3. Rename the file located at `assets/js/my.conf-sample.js` to `assets/js/my.conf.js`
4. Change the configuration variables inside the `my.conf.js` file, you must enter an API token and the URL to your Joomla site.
5. Visit the repository through your browser. Example: `http://localhost/path-to-install-git-directory/index.html`

It is important that you use localhost if your Joomla! site is installed in your localhost otherwise ajax calls will not work due to cross domain policies.


