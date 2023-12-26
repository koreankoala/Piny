const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const menuItems = document.querySelectorAll('.menu-item');

// SIDEBAR

// remove active class from all menu items
const changeActiveItem = ()=> {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', ()=> {
        changeActiveItem();
        item.classList.add('active');
    })
})

// show sidebar
menuBtn.addEventListener('click',() => {
    sideMenu.style.display = 'block';
})

// close sidebar
closeBtn.addEventListener('click', ()=> {
    sideMenu.style.display = 'none';
})

// change theme
const themetoggler = document.querySelector('.theme-toggler');
// let isDarkMode = localStorage.getItem('theme') === 'dark' || false; //
let isDarkMode = localStorage.getItem('theme') === 'dark'; // Declare isDarkMode in a wider scope

// Function to set the theme based on user preference
function setThemePreference() {
    
    document.body.classList.toggle('dark-theme-variables', isDarkMode);
    themetoggler.querySelector('span:nth-child(1)').classList.toggle('active', !isDarkMode);
    themetoggler.querySelector('span:nth-child(2)').classList.toggle('active', isDarkMode);
}

// Set the theme preference when the page loads
document.addEventListener('DOMContentLoaded', setThemePreference);

// Add a click event listener to the theme toggler
themetoggler.addEventListener('click', () => {
    // Toggle the theme class on the body
    document.body.classList.toggle('dark-theme-variables');

    // Toggle the 'active' class on the theme toggler icons
    themetoggler.querySelector('span:nth-child(1)').classList.toggle('active', isDarkMode);
    themetoggler.querySelector('span:nth-child(2)').classList.toggle('active', !isDarkMode);

    // Update isDarkMode based on the current body class
    isDarkMode = document.body.classList.contains('dark-theme-variables');

    // Store the current theme preference in localStorage
    const newTheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
});

    document.addEventListener("DOMContentLoaded", function() {
        
        document.getElementById("btnPrevCalendar").addEventListener("click", function(event) {
            prevCalendar();
        });
        
        document.getElementById("nextNextCalendar").addEventListener("click", function(event) {
            nextCalendar();
        });
    });

  function updateTableWithData(storageList) {
    const tbody = document.getElementById('tbody');

    // 기존 테이블 내용 초기화
    tbody.innerHTML = '';

    // 받은 storageList를 반복하여 테이블에 추가
    storageList.forEach(function(storage) {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${storage.idx}</td>
          <td>${storage.record_start}</td>
          <td>
              ${storage.confirmed == 0 ? 
                  `<i class="fa-sharp fa-solid fa-circle-xmark" style="color: #"></i>` : 
                  `<i class="fa-solid fa-circle-check" style="color: #00ff7b;"></i>`
              }
              <span style="display: none;">${storage.confirmed}</span>
          </td>
          <td style="display: none;">${storage.video_path}</td>
          <td><a href="storage/${storage.video_path}">Play Video</a></td>
        `;


        // 테이블에 새로운 행 추가
        tbody.appendChild(row);
    });
}  

// Calendar
let calendarDays = document.querySelector('.calendar-days');

calendarDays.addEventListener('click', function(event) {

    // 클릭한 요소의 값을 콘솔에 출력
    var year = document.getElementById('year').innerText;
    var month = document.getElementById('month-picker').innerText;

    if(month == 'January'){var m = '01';}
    if(month == 'February'){var m = '02';}
    if(month == 'March'){var m = '03';}
    if(month == 'April'){var m = '04';}
    if(month == 'May'){var m = '05';}
    if(month == 'June'){var m = '06';}
    if(month == 'July'){var m = '07';}
    if(month == 'August'){var m = '08';}
    if(month == 'September'){var m = '09';}
    if(month == 'October'){var m = '10';}
    if(month == 'November'){var m = '11';}
    if(month == 'December'){var m = '12';}

    // 일의 자리 정수를 두 자리로 표시하는 함수
    function formatNumber(number) {
        return number < 10 ? `0${number}` : `${number}`;
    }
    
    var date = year+'-'+m+'-'+formatNumber(parseInt(event.target.textContent));

    console.log(date);
    
    // AJAX 요청
    $.ajax({
        url: '/calendarchange',
        type: 'POST',
        data: { checkdate: date },
        success: function(response) {
          
          let storageList = response.storageList;
          let smokeCount = response.smokeCount;
          let calendarCount = response.calendarCount;

          const countSmoke = smokeCount +' 건';
          const countCheckCalendar = calendarCount +' 건';
  
          const countSmokeElement = document.getElementById('countSmoke');
          const countSmokeDayElement = document.getElementById('countSmokeDay');
          const countCheckCalendarElement = document.getElementById('countCheck');
  
          countSmokeDayElement.textContent = date+' 총 적발 건수';
          countSmokeElement.textContent = countSmoke;
          countCheckCalendarElement.textContent = countCheckCalendar;

          updateTableWithData(storageList);
        },
        error: function(xhr, status, error) {
            // alert('달력 로드 불가');
        }
    });
    

    });

const isLeapYear = (year) => {
    return (
      (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
      (year % 100 === 0 && year % 400 === 0)
    );
  };
  const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
  };
  let calendar = document.querySelector('.calendar');
  const month_names = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let month_picker = document.querySelector('#month-picker');
  const dayTextFormate = document.querySelector('.day-text-formate');
  const timeFormate = document.querySelector('.time-formate');
  const dateFormate = document.querySelector('.date-formate');
  
  month_picker.onclick = () => {
    month_list.classList.remove('hideonce');
    month_list.classList.remove('hide');
    month_list.classList.add('show');
    dayTextFormate.classList.remove('showtime');
    dayTextFormate.classList.add('hidetime');
    timeFormate.classList.remove('showtime');
    timeFormate.classList.add('hideTime');
    dateFormate.classList.remove('showtime');
    dateFormate.classList.add('hideTime');
  };
  
  const generateCalendar = (month, year) => {
    let calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = '';
    let calendar_header_year = document.querySelector('#year');
    let days_of_month = [
      31,
      getFebDays(year),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];  
    
    let currentDate = new Date();
    
    month_picker.innerHTML = month_names[month];
    
    calendar_header_year.innerHTML = year;
    
    let first_day = new Date(year, month);
  
  
  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
  
      let day = document.createElement('div');
  
      if (i >= first_day.getDay()) {
        day.innerHTML = i - first_day.getDay() + 1;

        if (i - first_day.getDay() + 1 === currentDate.getDate() &&
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth()
        ) {
          day.classList.add('current-date');
        }
      }
      calendar_days.appendChild(day);
    }
  };
  
  let month_list = calendar.querySelector('.month-list');
  month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`;
  
    month_list.append(month);
    month.onclick = () => {
      currentMonth.value = index;
      generateCalendar(currentMonth.value, currentYear.value);
      month_list.classList.replace('show', 'hide');
      dayTextFormate.classList.remove('hideTime');
      dayTextFormate.classList.add('showtime');
      timeFormate.classList.remove('hideTime');
      timeFormate.classList.add('showtime');
      dateFormate.classList.remove('hideTime');
      dateFormate.classList.add('showtime');
    };
  });
  
  (function () {
    month_list.classList.add('hideonce');
  })();
  document.querySelector('#pre-year').onclick = () => {
    --currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  document.querySelector('#next-year').onclick = () => {
    ++currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
  };
  
  let currentDate = new Date();
  let currentMonth = { value: currentDate.getMonth() };
  let currentYear = { value: currentDate.getFullYear() };
  generateCalendar(currentMonth.value, currentYear.value);

  const todayShowTime = document.querySelector('.time-formate');
  const todayShowDate = document.querySelector('.date-formate');
  
  const currshowDate = new Date();
  const showCurrentDateOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const currentDateFormate = new Intl.DateTimeFormat(
    'en-US',
    showCurrentDateOption
  ).format(currshowDate);
  todayShowDate.textContent = currentDateFormate;
  setInterval(() => {
    const timer = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
    let time = `${`${timer.getHours()}`.padStart(
      2,
      '0'
    )}:${`${timer.getMinutes()}`.padStart(
      2,
      '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
    todayShowTime.textContent = formateTimer;
  }, 1000);