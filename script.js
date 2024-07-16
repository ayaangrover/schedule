// Wrap the code in a function
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

      // Find the current and next classes
      let currentClass, nextClass;
      for (let i = 0; i < data.schedule.length; i++) {
        const classStart = parseInt(data.schedule[i].start.slice(11, 13) + data.schedule[i].start.slice(14, 16));
        const classEnd = parseInt(data.schedule[i].end.slice(11, 13) + data.schedule[i].end.slice(14, 16));

        if (classEnd < currentMilitaryTime) {
          // Class has ended, check the next class
          continue;
        }

        if (classStart <= currentMilitaryTime && classEnd >= currentMilitaryTime) {
          // Current class
          currentClass = data.schedule[i];

          const minutesLeftInClass = Math.max(0, classEnd - currentMilitaryTime);
          currentClass.name += ` (Ends in ${Math.floor(minutesLeftInClass / 60)} hours and ${minutesLeftInClass % 60} minutes)`;

          break;
        }

        if (classStart > currentMilitaryTime) {
          // Next class
          nextClass = data.schedule[i];
          break;
        }
      }

      // Clear the #scheduleContainer
      document.getElementById('scheduleContainer').innerHTML = '';

      if (currentClass) {
        // Display the current class
        const currentClassItem = document.createElement('div');
        currentClassItem.innerHTML = `<strong>Current class:</strong> ${currentClass.name} (${currentClass.start.slice(11, 16)} - ${currentClass.end.slice(11, 16)})`;
        document.getElementById('scheduleContainer').appendChild(currentClassItem);

        // Display the ends in part below the current class line
        const endsInItem = document.createElement('div');
        endsInItem.innerHTML = `Ends in ${Math.floor(minutesLeftInClass / 60)} hours and ${minutesLeftInClass % 60} minutes`;
        document.getElementById('scheduleContainer').appendChild(endsInItem);
      } else if (nextClass) {
        // Display the next class
        const nextClassItem = document.createElement('div');
        nextClassItem.innerHTML = `<strong>Next class:</strong> ${nextClass.name} starts at ${nextClass.start.slice(11, 16)}`;
        document.getElementById('scheduleContainer').appendChild(nextClassItem);
      } else {
        // Display message if the day is over
        const dayOverMsg = document.createElement('div');
        dayOverMsg.innerHTML = `<strong>The day has ended, see you tomorrow!</strong>`;
        document.getElementById('scheduleContainer').appendChild(dayOverMsg);
      }
    })
    .catch(error => {
      // Handle any errors here
      console.error('Error:', error);
    });
}

// Function call
fetchSchedule();
