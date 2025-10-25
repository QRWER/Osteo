const config = require('../../config');

class TimeHandler {

  static workingDays = [
    1, // Monday
    2, // Tuesday
    3, // Wednesday
    4, // Thursday
    5  // Friday
  ]

  static isTimeOverlap(start1, end1, start2, end2) {
    return start1 < end2 && end1 > start2;
  }
  

  static filterAvailableSlots(allSlots, busySlots) {
    return allSlots.filter(slot => {
      return !busySlots.some(busy => 
        this.isTimeOverlap(slot.start, slot.end, busy.start, busy.end)
      );
    });
  }


  static formatTimeSlot(start, end) {
    const formatTime = (date) => {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  }


  static getWorkingHours(date) {
    const dayOfWeek = new Date(date).getDay();
    const result = { start: config.business.time.startWorking, end: config.business.time.endWorking, working: false }

    if (TimeHandler.workingDays.includes(dayOfWeek)) {
      result.working = true
    }

    return result
  }
}

module.exports = TimeHandler;