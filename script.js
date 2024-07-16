function fetchSchedule() {
  fetch('https://msbell-backend.harker.xyz/api/schedule?month=' + (new Date().getMonth() + 1) + '&day=' + new Date().getDate() + '&year=' + new Date().getFullYear(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Get today's date and time
      const currentTime = new Date();
      const currentMilitaryTime = currentTime.getHours() * 100 + currentTime.getMinutes();

      let currentClass, nextClass;
      for (let i = 0; i < data.schedule.length; i++) {
        const classStart = parseInt(data.schedule[i].start.slice(11, 13) + data.schedule[i].start.slice(14, 16));
        const classEnd = parseInt(data.schedule[i].end.slice(11, 13) + data.schedule[i].end.slice(14, 16));
