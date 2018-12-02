const Validate = {

    /**
     * @param {string} string
     * 
     * @return validated string
     */
    validateString: function(string) {

    },

    /**
     * @param {string} email
     *  
     * @return validated email
     */
    validateEmail: function(email) {

    },

    /**
     * @param {object} date
     * 
     * @return validated date
     */
    validateDate: function(date) {
        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const day = newDate.getDate();

        return `${day}-${month}-${year}`;
    }

}

export default Validate;