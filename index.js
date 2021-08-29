const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const friends = [];
const friendslist = document.querySelector("#data-pannel");
const searchForm = document.querySelector('#search')
const searchInput = document.querySelector('#search-input')
const genderFilter = document.querySelector("#gender-select")
const searchCategories = document.querySelector("#category-select")
const paginator = document.querySelector("#pagination")
const friend_modal = document.querySelector("#friend-modal")
const friends_per_page = 20
let gendervalue = "All Gender" //起始值
let currentallfilterfriends = []
let selectedcategory = "Name"
let searchfilterfriends = []
let genderfilterfriends = []
let currentgenderfilterfriends = []

//動態渲染朋友資料
function renderFriends(data) {
  const favoritelist = JSON.parse(localStorage.getItem("favorite-friend")) || [];
  let rawHTML = "";
  let genderHTML = ""
  let heartHTML = ""
  data.forEach((friend) => {
    if (friend.gender === "male") {
      genderHTML = `<i class="fas fa-lg fa-mars"></i>`
    } else {
      genderHTML = `<i class="fas fa-lg  fa-venus"></i>`
    }
    if (Object.values(favoritelist).some(favoritefriend => favoritefriend.id === friend.id)) {
      heartHTML = `<i class="fas fa-heart ml-1"></i>`
    } else {
      heartHTML = ""
    }
    rawHTML += `
    <div class="col-xl-3 mb-2">
        <div class="card">
           <a  data-toggle="modal" data-target="#friend-modal" data-id = "${friend.id
      }"><img 
            src="${friend.avatar}"
            class="card-img-top img-modal" alt="Movie Poster"></a>
          <div class="card-body card-${friend.id} d-flex justify-content-sm-between align-items-center">
            <h10 class="card_title ">${friend.fullname}</h10>`
    rawHTML += `${genderHTML}`
    rawHTML += heartHTML
    rawHTML += `</div>
        </div>
      </div>`;
  });
  friendslist.innerHTML = rawHTML;
}
//利用axios抓API資料
axios
  .get(BASE_URL)
  .then((response) => {
    friends.push(...response.data.results);
    friends.forEach(friend => {
      friend.fullname = friend.name + " " + friend.surname
    })
    renderPaginator(friends.length)
    renderFriends(getfriendsbypage(1));
  })
  .catch((error) => {
    console.log(error);
  });

function getfriendsbypage(page) {
  const data = currentallfilterfriends.length ? currentallfilterfriends : friends;
  const startpage = (page - 1) * friends_per_page;
  const page_friends = data.slice(startpage, startpage + friends_per_page);
  return page_friends;
}
//讓程式計算要製作多少分頁，並且動態炫染
function renderPaginator(amount) {
  let rawHTML = "";
  const pages = Math.ceil(amount / friends_per_page);
  rawHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>`
  for (let page = 1; page <= pages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  rawHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>`
  //放回 HTML
  paginator.innerHTML = rawHTML;
}
//函式動態渲染朋友詳細資訊
function showFriendModal(id) {
  const modalTitle = document.querySelector("#friend-modal-title");
  const modalImage = document.querySelector(".img-thumbnail");
  const modalBirth = document.querySelector("#friend-modal-birthday");
  const modalAge = document.querySelector("#friend-modal-age");
  const modalGender = document.querySelector("#friend-modal-gender");
  const modalEmail = document.querySelector("#friend-modal-email");
  const modalRegion = document.querySelector("#friend-modal-region")
  const modalFooter = document.querySelector(".modal-friend-footer");
  axios.get(BASE_URL + id).then((response) => {
    const data = response.data;
    console.log(response);
    modalTitle.innerText = `${data.name + " " + data.surname}`;
    modalImage.src = data.avatar;
    modalBirth.innerText = "Birthday : " + data.birthday;
    modalAge.innerHTML = "Age : " + data.age;
    modalGender.innerHTML = "Gender : " + data.gender;
    modalEmail.innerHTML = "Email : " + data.email;
    modalRegion.innerHTML = "Region : " + data.region;
    modalFooter.dataset.id = data.id
  });
}
//在client端儲存喜愛電影資料，localStorage
function addFavoriteFriends(id) {
  const favoritelist = JSON.parse(localStorage.getItem("favorite-friend")) || [];
  const favoritefriend = friends.find((friend) => friend.id === id);
  if (favoritelist.some((friend) => friend.id === id)) {
    return alert("此朋友已加入最愛");
  }
  favoritelist.push(favoritefriend)
  localStorage.setItem("favorite-friend", JSON.stringify(favoritelist))
}
//監聽like按鈕
friend_modal.addEventListener("click", (event) => {
  let target = event.target
  console.log(target)
  if (target.matches(".btn-like-friend")) {
    const id = target.parentElement.dataset.id
    addFavoriteFriends(Number(id))
    const friend_card_info = document.querySelector(`.card-${id}`)
    //如果childnodes的長度為4，代表已被加入最愛，所以有愛心圖樣
    if (friend_card_info.childNodes.length === 4) {
      return
    } else {
      friend_card_info.innerHTML += `<i class="fas fa-heart ml-1"></i>`
    }
  }
})
//顯示詳細資料modal
friendslist.addEventListener("click", function datapannelCliked(event) {
  let target = event.target;
  console.log(target);
  if (target.matches(".img-modal")) {
    showFriendModal(target.parentElement.dataset.id);
  }
});
//搜尋種類函示
searchCategories.addEventListener("change", (event) => {
  selectedcategory = event.target.value
  console.log(event.target.value)
  console.log(selectedcategory)
})

//搜尋功能，先把name和surname串起來得到串起來得到
searchForm.addEventListener("click", function searchFormClicked(event) {
  event.preventDefault()
  // const currentfilterfriends = JSON.parse(localStorage.getItem("current-filter-friends")) || []
  if (genderfilterfriends.length === 0 || genderfilterfriends === friends) {
    if (selectedcategory === "Name") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = friends.filter((friend) => friend.fullname.toLowerCase().includes(keyword));
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該名稱的用戶`);
      }
    } else if (selectedcategory === "Country") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = friends.filter((friend) => friend.region.toLowerCase().includes(keyword));
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該國家的用戶`);
      }
    }
    currentallfilterfriends = searchfilterfriends
  } else {
    if (selectedcategory === "Name") {
      const keyword = searchInput.value.trim().toLowerCase();
      console.log(gendervalue)
      searchfilterfriends = friends.filter((friend) => friend.fullname.toLowerCase().includes(keyword));
      console.log(searchfilterfriends)
      gendersearchfilterfriends = searchfilterfriends.filter((friend) => friend.gender === `${gendervalue.toLowerCase()}`);
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該名稱的用戶`);
      }
    } else if (selectedcategory === "Country") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = friends.filter((friend) => friend.region.toLowerCase().includes(keyword))
      gendersearchfilterfriends = searchfilterfriends.filter((friend) => friend.gender === `${gendervalue.toLowerCase()}`);
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該國家的用戶`);
      }
    }
    currentallfilterfriends = gendersearchfilterfriends

  }
  renderPaginator(currentallfilterfriends.length)
  renderFriends(getfriendsbypage(1))
})
searchInput.addEventListener('input', function SearchFormInput(event) {
  event.preventDefault()
  if (searchInput.value.trim().toLowerCase().length === 0) {
    console.log(gendervalue)
    searchfilterfriends = []
    if (gendervalue === "Male") {
      genderfilterfriends = friends.filter((friend) => friend.gender === "male")
    } else if (gendervalue === "Female") {
      genderfilterfriends = friends.filter((friend) => friend.gender === "female")
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = friends
    }
    currentallfilterfriends = genderfilterfriends
    renderPaginator(currentallfilterfriends.length)
    renderFriends(getfriendsbypage(1))
  }
})
//性別分類功能
genderFilter.addEventListener("change", (event) => {
  gendervalue = event.target.value
  console.log(searchfilterfriends.length)
  if (searchfilterfriends.length === 0) {
    if (gendervalue === "Male") {
      genderfilterfriends = friends.filter((friend) => friend.gender === "male")
    } else if (gendervalue === "Female") {
      genderfilterfriends = friends.filter((friend) => friend.gender === "female")
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = friends
    }
    currentgenderfilterfriends = genderfilterfriends
    currentallfilterfriends = genderfilterfriends
  } else {

    console.log(searchfilterfriends)
    console.log(gendervalue)
    if (gendervalue === "Male") {
      genderfilterfriends = searchfilterfriends.filter((friend) => friend.gender === "male")
      if (genderfilterfriends.length === 0){
        alert("沒有男性為此名稱")
        return
      }
    } else if (gendervalue === "Female") {
      genderfilterfriends = searchfilterfriends.filter((friend) => friend.gender === "female")
      if (genderfilterfriends.length === 0) {
        alert("沒有女性為此名稱")
        return
      }
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = searchfilterfriends
    }
    currentallfilterfriends = genderfilterfriends
  }
  renderPaginator(currentallfilterfriends.length)
  renderFriends(getfriendsbypage(1))

})
//監聽分頁事件
paginator.addEventListener("click", function onPaginationClicked(event) {
  console.log(event.target.innerText);
  if (event.target.tagName !== "A") return;
  //用來顯示目前在哪分頁，以紅色數字顯現
  const page_link = document.querySelectorAll(".page-link")
  for (const page of page_link) {
    if (page.matches(".text-danger")) {
      page.classList.toggle("text-danger")
    }
  }
  event.target.classList.toggle("text-danger")
  currentpage = event.target.dataset.page;
  renderFriends(getfriendsbypage(Number(currentpage)));
});
//底下要開發聊天室功能，還在研究
