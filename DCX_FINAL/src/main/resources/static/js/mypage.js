// mypage 회원탈퇴
const modal = document.querySelector(".modal");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");

openModal.addEventListener('click',() => {
  modal.style.display = 'block';
  console.log('클릭됨')
})

closeModal.addEventListener('click', ()=> {
  modal.style.display = 'none';
})

// 동의해야 탈퇴 가능
function handleCheckbox() {
    var checkBox = document.getElementById("check");

    // 체크 상태 확인
    if (checkBox.checked) {
        // 체크됐을 때 실행할 동작 작성
        console.log("Checkbox is checked!");
        
        document.getElementById("deleteBtn").disabled = false;
        document.getElementById("deleteBtn").classList.remove("disabledButton1");

    } else {
        // 체크가 해제됐을 때 실행할 동작 작성
        console.log("Checkbox is not checked!");

        document.getElementById("deleteBtn").disabled = true;
        document.getElementById("deleteBtn").classList.add("disabledButton1");
    }
}

// checkbox 상태 변화 감지
document.getElementById("check").addEventListener("change", handleCheckbox);


// SIDEBAR
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const menuItems = document.querySelectorAll('.menu-item');

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