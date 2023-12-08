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
export function convertTimeStringToTimestamp(timeString: string) {
    const currentTime = new Date();
    const currentDay = currentTime.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Map days of the week to their corresponding numbers (0 for Sunday, 1 for Monday, ...)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = daysOfWeek.indexOf(timeString.split("-")[0]);

    // Calculate the difference in days between the current day and the target day
    const dayDifference = dayIndex - currentDay + 7;

    // Set the time to the specified hour and minute
    const hour = timeString.split("-")[1].split(":")[0];
    currentTime.setHours(Number(hour), 0, 0, 0);

    // Adjust the date to the target day of the week
    currentTime.setDate(currentTime.getDate() + dayDifference);

    // Return the resulting timestamp
    return currentTime;
}

export function getCurrentWeekSchedule(schedule: string[]) {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const timestamps: Date[] = [];

    schedule.forEach((item) => {
        const [day, hour] = item.split("-");
        const dayIndex = daysOfWeek.indexOf(day);
        const timestamp = new Date(startOfWeek);
        timestamp.setDate(startOfWeek.getDate() + dayIndex);
        timestamp.setHours(parseInt(hour));
        timestamp.setMinutes(0);
        timestamp.setSeconds(0);

        if (timestamp >= startOfWeek && timestamp <= endOfWeek) {
            timestamps.push(timestamp);
        }
    });

    return timestamps;
}
