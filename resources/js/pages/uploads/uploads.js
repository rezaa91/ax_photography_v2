if (document.querySelector('.upload-wrapper')) {

    function init() {
        appendEventToRadioBtns();
    }

    /**
     * DOM Elements
     */
    const DOMElements = {
        albumTypeRadioBtns: document.forms[0].elements.album_type,
        selectAlbumSection: document.querySelector('#select_album'),
        createAlbumSection: document.querySelector('#create_album')
    };

    /**
     * add a change event on radio buttons in the album type form section
     */
    function appendEventToRadioBtns() {
        const {albumTypeRadioBtns} = DOMElements;
        
        albumTypeRadioBtns.forEach(btn => {
            btn.addEventListener('change', (e) => toggleAlbumType(e));
        })
    }

    /**
     * Toggle the album type form element depending on whether user chooses an existing or new album
     */
    function toggleAlbumType(e) {
        const {selectAlbumSection, createAlbumSection} = DOMElements;
        const target = e.target;
        const btnValue = e.target.value.toLowerCase();

        if (target.checked) {
            switch (btnValue) {
                case 'existing':
                    selectAlbumSection.hasAttribute('class', 'hide') && selectAlbumSection.classList.remove('hide');
                    createAlbumSection.hasAttribute('class', 'hide') && createAlbumSection.classList.add('hide');
                    break;
                
                case 'new':
                    selectAlbumSection.hasAttribute('class', 'hide') && selectAlbumSection.classList.add('hide');
                    createAlbumSection.hasAttribute('class', 'hide') && createAlbumSection.classList.remove('hide');
                    break;
            }
        }
    }

    /**
     * Run the initialisation function declared at the top of this script
     */
    init();
}
