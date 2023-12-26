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

function updateTableWithData(data) {
    var tableBody = $('#tbody'); // 테이블 body 요소 선택
    tableBody.empty(); // 테이블 body 비우기

    // 받아온 데이터로 테이블 새로 그리기
    data.forEach(function(storage) {
      var row = '<tr>' +
      '<td>' + storage.idx + '</td>' +
      '<td>' + storage.record_start + '</td>';
  
      // storage.confirmed 값에 따라 다르게 추가
      if (storage.confirmed == 0) {
          row += '<td class="primary"><i class="fa-sharp fa-solid fa-circle-xmark"></i>' +
              '<span style="display: none;">' + storage.confirmed + '</span></td>';
      } else if (storage.confirmed == 1) {
          row += '<td><i class="fa-solid fa-circle-check" style="color: #00ff7b;"></i></td>';
      }
      
      row += '<td style="display: none;">' + storage.video_path + '</td>' +
          '<td><a href="storage/' + storage.video_path + '">Play Video</a></td>' +
          '</tr>';  

        tableBody.append(row); // 새로운 행 추가
    });
  }

let search = document.querySelector('#search');
let searchdate = document.querySelector('#searchdate');


search.addEventListener('click', function(event) {

    console.log('search 클릭');
    console.log(searchdate.value);

    $.ajax({
        url: '/search',
        type: 'POST',
        data: { searchdate : searchdate.value },
        success: function(data) {
            updateTableWithData(data);
        },
        error: function(data) {
            // 뭔가 잘못되었을 때;
        }
    });
})