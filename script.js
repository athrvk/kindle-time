let size = 86;
let columns = Array.from(document.getElementsByClassName('column'));
let d, c;
let classList = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
let use24HourClock = true;

const toggleSeconds = document.getElementById("toggleSeconds");
const seconds = document.getElementById("seconds");

toggleSeconds.addEventListener("click", () => {
  if (seconds.style.display === "none") {
    seconds.style.display = "inline";
  } else {
    seconds.style.display = "none";
  }
});

const rotateButton = document.getElementById("rotate");
const clock = document.getElementById("clock");
let rotation = 0;

rotateButton.addEventListener("click", () => {
  rotation += 90; // Increment rotation by 90 degrees
  clock.style.transform = `rotate(${rotation}deg)`;
});

function padClock(p, n) {
  return p + ('0' + n).slice(-2);
}

async function getCurrentTimezoneByIp() {
  const api = "https://worldtimeapi.org/api/ip";
  let timezone;
  try {
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const jsonData = await response.json();
    timezone = jsonData.timezone;
  } catch (error) {
    console.error("Error fetching time:", error);
  }
  return timezone;
}

function changeTimezone(date, ianatz) {

  // suppose the date is 12:00 UTC
  var invdate = new Date(date.toLocaleString('en-US', {
    timeZone: ianatz
  }));

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract

}


function getClock(timezone) {
  d = new Date();
  d = changeTimezone(d, timezone)
  return [
    use24HourClock ? d.getHours() : d.getHours() % 12 || 12,
    d.getMinutes(),
    d.getSeconds()].

    reduce(padClock, '');
}

function getClass(n, i2) {
  return classList.find((class_, classIndex) => Math.abs(n - i2) === classIndex) || '';
}

getCurrentTimezoneByIp()
  .then((timezone) => {
    c = getClock(timezone);
    columns.forEach((ele, i) => {
      let n = +c[i];
      let offset = -n * size;
      ele.style.transform = `translateY(calc(50vh + ${offset}px - ${size / 2}px))`;
      Array.from(ele.children).forEach((ele2, i2) => {
        ele2.className = 'num ' + getClass(n, i2);
      });
    });
  });

let loop = setInterval(() => {
  getCurrentTimezoneByIp()
    .then((timezone) => {
      c = getClock(timezone);
      columns.forEach((ele, i) => {
        let n = +c[i];
        let offset = -n * size;
        ele.style.transform = `translateY(calc(50vh + ${offset}px - ${size / 2}px))`;
        Array.from(ele.children).forEach((ele2, i2) => {
          ele2.className = 'num ' + getClass(n, i2);
        });
      });
    });

}, 2 * 1000);
// 200 + Math.E * 10 for microseconds

