
import displayBottomNavBarMobile from './utilities/displayBottmNavBarMobile';

/** Require dependencies and helpers */
require('./bootstrap');

/** Require layouts */
require('./layouts/navigation');

window.addEventListener('load', function() {
    displayBottomNavBarMobile();
})

/** Require pages */
require('./pages/homepage/homepage');
require('./pages/albums/albums');
require('./pages/about/about');
require('./pages/contact/contact');
require('./pages/dashboard/dashboard');
require('./pages/uploads/uploads');
require('./pages/individualAlbum/individualAlbum');
