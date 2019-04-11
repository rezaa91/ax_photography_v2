const Validate = {
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],

    /**
     * @param {string} string
     *
     * @return validated string
     */
    validateString: function(string) {},

    /**
     * @param {string} email
     *
     * @return validated email
     */
    validateEmail: function(email) {},

    /**
     * @param {object|string} date
     *
     * @return validated date
     */
    validateDate: function(date) {
        if (!date || (typeof date !== 'string' && !(date instanceof Date))) {
            return null;
        }

        const newDate = new Date(date);
        const year = newDate.getFullYear();
        const month = this.months[newDate.getMonth()];
        const day = newDate.getDate();

        return `${day}-${month}-${year}`;
    }
};

export default Validate;
