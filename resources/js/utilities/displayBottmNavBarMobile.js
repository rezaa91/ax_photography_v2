const windowWidth = window.innerWidth;
const maxDeviceWidth = 760;

function positionNavBarToBottom() {
    const bottomNavBar = document.querySelector('.navigation-right');

    // do not force nav to bottom if user viewing on a large device i.e. laptop/desktop
    if ((windowWidth >= maxDeviceWidth) || !bottomNavBar) {
        return;
    }
    
    const windowHeight = window.innerHeight;
    const bottomBarHeight = bottomNavBar.offsetHeight;
    bottomNavBar.style.top = `${windowHeight - bottomBarHeight}px`;
}

export default function displayBottomNavBarMobile() {
    positionNavBarToBottom();
    window.addEventListener('scroll', positionNavBarToBottom)
    window.addEventListener('resize', positionNavBarToBottom)
}