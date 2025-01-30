
class DateUtil {

    /**
     * 
     * @returns '30/01/2025'
     */
    static currentDateToFormat1(date = new Date()) {
        return date.toJSON().slice(0, 10).split('-').reverse().join('/');
    }

    /**
     * 
     * @returns '2025/01/30'
     */
    static currentDateToFormat2(date = new Date()) {
        return date.toJSON().slice(0, 10).split('-').join('/');
    }

    /**
     * 
     * @returns '2025-01-30'
     */
    static currentDateToFormat3(date = new Date()) {
        return date.toJSON().slice(0, 10);
    }


    static currentDateToISO(date = new Date()) {
        return date.toISOString();
    }

    static isoToLocalDate(date = new Date()) {
        return new Date(date).toJSON().slice(0, 19).replace("T", " ");
    }




}

export default DateUtil;