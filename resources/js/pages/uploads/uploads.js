if (document.querySelector('.upload-wrapper')) {

    function init() {
        appendEventToRadioBtns();
        radioDefaultValue();
        setupEventListeners();
    }

    /**
     * DOM Elements
     */
    const DOMElements = {
        form: document.querySelector('#form'),
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
     * Set album radio value to existing on page load 
     */
    function radioDefaultValue() {
        const {form} = DOMElements;
        form.album_type.value = 'existing';
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
     * set the existing album select box value back to default
     */
    function setExistingAlbumValueToDefault() {
        const {form} = DOMElements;
        const selectedExistingAlbum = form['album'];
        
        if (selectedExistingAlbum.value !== 'default') {
            selectedExistingAlbum.value = 'default';
        }
    }

    /**
     * Remove value from create album field when user changes existing album option
     */
    function removeCreateAlbumValue() {
        const {form} = DOMElements;
        const createAlbumInput = form['create_album'];
        createAlbumInput.value = '';
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        const {form} = DOMElements;
        const createAlbumInput = form['create_album'];
        const selectedExistingAlbum = form['album'];

        // Set the select box value of current albums to default if user begins to typing in to new album field
        createAlbumInput.addEventListener('input', setExistingAlbumValueToDefault);
        selectedExistingAlbum.addEventListener('change', removeCreateAlbumValue);
    }

    /**
     * Run the initialisation function declared at the top of this script
     */
    init();
}
