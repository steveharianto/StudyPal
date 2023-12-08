export function parseDate(dateString: string) {
    /* 
    Input -> December 12, 2023 at 07:00 PM
    Output -> Date()
    */

    // Split the string into parts
    const parts = dateString.split(" at ");
    const datePart = parts[0];
    const timePart = parts[1];

    // Use the Date constructor to parse the date part
    const date = new Date(datePart);

    // Parse the time part
    const time = timePart.match(/(\d+):(\d+) (AM|PM)/);
    if (!time) {
        return null;
    }
    let hour = parseInt(time[1]);
    const minute = parseInt(time[2]);
    const period = time[3];

    // Adjust the hour if it's PM
    if (period === "PM" && hour !== 12) {
        hour += 12;
    }

    // Set the time components in the Date object
    date.setHours(hour, minute);

    return date;
}
