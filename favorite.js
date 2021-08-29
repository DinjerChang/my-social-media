const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const favoritefriends = JSON.parse(localStorage.getItem("favorite-friend")) || [];
const friendslist = document.querySelector("#data-pannel");
const searchForm = document.querySelector('#search')
const searchInput = document.querySelector('#search-input')
const genderFilter = document.querySelector("#gender-select")
const searchCategories = document.querySelector("#category-select")
const friend_modal = document.querySelector("#friend-modal")

let selectedcategory = "Name"
let searchfilterfriends = []
let genderfilterfriends = []
let currentgenderfilterfriends = []
//動態渲染朋友資料
function renderFriends(data) {
  let rawHTML = "";
  let genderHTML = ""
  data.forEach((friend) => {
    if (friend.gender === "male") {
      genderHTML = `<i class="fas fa-lg fa-mars"></i>`
    } else {
      genderHTML = `<i class="fas fa-lg  fa-venus"></i>`
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
    rawHTML += `</div>
        </div>
      </div>`;
  });
  friendslist.innerHTML = rawHTML;
}
//利用axios抓API資料
renderFriends(favoritefriends)
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
function DeleteFavoriteFriends(id) {
  if (!favoritefriends)
    return
  const deletefriendIndex = favoritefriends.findIndex(friend => friend.id === id)
  if (deletefriendIndex === -1)
    return
  favoritefriends.splice(deletefriendIndex, 1)
  localStorage.setItem("favorite-friend", JSON.stringify(favoritefriends))
  renderFriends(favoritefriends)
}
//監聽delete按鈕
friend_modal.addEventListener("click", (event) => {
  let target = event.target
  console.log(target)
  if (target.matches(".btn-delete-friend")) {
    const id = target.parentElement.dataset.id
    const friend_card_info = document.querySelector(`.card-${id}`)
    //移除愛心圖樣
    friend_card_info.innerHTML -= `<i class="fas fa-heart ml-1"></i>`
    DeleteFavoriteFriends(Number(id))
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
  if (genderfilterfriends.length === 0 || genderfilterfriends === favoritefriends) {
    if (selectedcategory === "Name") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = favoritefriends.filter((friend) => friend.fullname.toLowerCase().includes(keyword));
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該名稱的用戶`);
      }
    } else if (selectedcategory === "Country") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = favoritefriends.filter((friend) => friend.region.toLowerCase().includes(keyword));
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該國家的用戶`);
      }
    }
    renderFriends(searchfilterfriends)
  } else {
    if (selectedcategory === "Name") {
      const keyword = searchInput.value.trim().toLowerCase();
      console.log(gendervalue)
      searchfilterfriends = favoritefriends.filter((friend) => friend.fullname.toLowerCase().includes(keyword));
      console.log(searchfilterfriends)
      gendersearchfilterfriends = searchfilterfriends.filter((friend) => friend.gender === `${gendervalue.toLowerCase()}`);
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該名稱的用戶`);
      }
    } else if (selectedcategory === "Country") {
      const keyword = searchInput.value.trim().toLowerCase();
      searchfilterfriends = favoriteriends.filter((friend) => friend.region.toLowerCase().includes(keyword))
      gendersearchfilterfriends = searchfilterfriends.filter((friend) => friend.gender === `${gendervalue.toLowerCase()}`);
      if ((searchfilterfriends.length === 0) | (keyword.length === 0)) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合該國家的用戶`);
      }
    }
    renderFriends(gendersearchfilterfriends)
  }

})
searchInput.addEventListener('input', function SearchFormInput(event) {
  event.preventDefault()
  if (searchInput.value.trim().toLowerCase().length === 0) {
    console.log(gendervalue)
    searchfilterfriends = []
    if (gendervalue === "Male") {
      genderfilterfriends = favoritefriends.filter((friend) => friend.gender === "male")
    } else if (gendervalue === "Female") {
      genderfilterfriends = favoritefriends.filter((friend) => friend.gender === "female")
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = favoritefriends
    }
    renderFriends(genderfilterfriends)
  }
})
//性別分類功能
genderFilter.addEventListener("change", (event) => {
  gendervalue = event.target.value
  if (searchfilterfriends.length === 0) {
    if (gendervalue === "Male") {
      genderfilterfriends = favoritefriends.filter((friend) => friend.gender === "male")
    } else if (gendervalue === "Female") {
      genderfilterfriends = favoritefriends.filter((friend) => friend.gender === "female")
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = favoritefriends
    }
    currentgenderfilterfriends = genderfilterfriends
  } else {
    currentgenderfilterfriends = genderfilterfriends
    if (gendervalue === "Male") {
      genderfilterfriends = searchfilterfriends.filter((friend) => friend.gender === "male")
    } else if (gendervalue === "Female") {
      genderfilterfriends = searchfilterfriends.filter((friend) => friend.gender === "female")
    } else if (gendervalue === "All Gender") {
      genderfilterfriends = searchfilterfriends
    }
  }
  renderFriends(genderfilterfriends)

})