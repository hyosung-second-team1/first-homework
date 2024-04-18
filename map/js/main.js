const myLocaIcon = new kakao.maps.MarkerImage(
    '../img/my-location.png',
    new kakao.maps.Size(30, 30));

const allIcon = new kakao.maps.MarkerImage(
    '../img/all.png',
    new kakao.maps.Size(30, 30));

const cgvIcon = new kakao.maps.MarkerImage(
    '../img/cgv.png',
    new kakao.maps.Size(30, 30));

const lotteIcon = new kakao.maps.MarkerImage(
    '../img/lotte-cinema.png',
    new kakao.maps.Size(30, 30));

const megaIcon = new kakao.maps.MarkerImage(
    '../img/mega-box.png',
    new kakao.maps.Size(30, 30));
 

const iconArr = [
    allIcon,
    cgvIcon,
    lotteIcon,
    megaIcon
]

const mapWrap = document.getElementById('map'); // 지도를 표시할 div 
const mapOption = { 
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 6 // 지도의 확대 레벨 
}; 

const map = new kakao.maps.Map(mapWrap, mapOption); // 지도를 생성합니다  
let locPosition = new kakao.maps.LatLng(33.450701, 126.570667);

let markers = []; // 마커를 담을 배열입니다
let currCategory = '영화관'; // 현재 선택된 카테고리를 가지고 있을 변수입니다

// 장소 검색 객체를 생성합니다
const ps = new kakao.maps.services.Places(map);

const list = document.querySelector('.list');

let overlays = [];

const centerLoc = document.querySelector('.center-location');

// 지도에 마커를 표시하는 함수입니다
function displayMarker(locPosition) {

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        image: myLocaIcon,
        clickable: false
    }); 
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}   

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
    if (!currCategory) {
        return;
    }

    // 지도에 표시되고 있는 마커와 오버레이를 제거합니다
    removeMarker();
    removeOverlay();
    
    ps.keywordSearch(currCategory, placesSearchCB, 
        {
            category_group_code: 'CT1',
            useMapBounds: true
        }); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    displayPlaces(data);
}

// 지도에 마커를 표출하는 함수입니다
function displayPlaces(places) {
    
    list.innerHTML = "";
    list.scrollTop = 0;

    for (let i = 0; i < places.length; i++ ) {
        const placeName = places[i].place_name.split(" ")[0].toLowerCase();
        let order = 0;
        if(document.getElementById(placeName)){
            order = document.getElementById(placeName).getAttribute('data-order');
        }
        // 마커를 생성하고 지도에 표시합니다
        const marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);
        // 오버레이를 생성합니다
        const overlay = addOverlay(places[i].place_name, marker.getPosition());
        // 목록을 생성합니다
        const listItem = addList(places[i]);
            
        
        kakao.maps.event.addListener(marker, 'mouseover', function() {
            overlay.setVisible(true);
        });

        kakao.maps.event.addListener(marker, 'mouseout', function() {
            overlay.setVisible(false);
        });

        kakao.maps.event.addListener(marker, 'click', function() {            
            list.childNodes.forEach(node => node.classList.remove('selected'));
            listItem.classList.toggle('selected'); 

            // 스크롤 이동
            const listItemOffsetTop = listItem.offsetTop;
            const listItemHeight = listItem.offsetHeight;
            const listScrollTop = list.scrollTop;
            const listHeight = list.offsetHeight;

            const scrollToOptions = {
                top: listItemOffsetTop,
                behavior: 'smooth' // 부드러운 스크롤 효과를 위해 behavior 옵션 추가
            };

            if (listItemOffsetTop < listScrollTop) {
                list.scrollTo(scrollToOptions);
            } else if (listItemOffsetTop + listItemHeight > listScrollTop + listHeight) {
                scrollToOptions.top = listItemOffsetTop + listItemHeight - listHeight;
                list.scrollTo(scrollToOptions);
            }
        });

        listItem.addEventListener('mouseover', ()=>{
            overlay.setVisible(true);
        })

        listItem.addEventListener('mouseout', ()=>{
            overlay.setVisible(false);
        })
        
    }
}



function addOverlay(placeName, position){
    // 커스텀 오버레이에 표출될 내용
    var content = '<div class="customoverlay">' +
    '    <span class="title">' + placeName + '</span>' +
    '</div>';

    // 커스텀 오버레이를 생성합니다
    var customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 0,
        zIndex:3
    });

    customOverlay.setVisible(false);

    overlays.push(customOverlay);

    return customOverlay;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, order) {
    const marker = new kakao.maps.Marker({  
        map: map, 
        position: position,
        image: iconArr[order],
    }); 
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다
    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (let i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 오버레이를 모두 제거합니다
function removeOverlay() {
    for (let i = 0; i < overlays.length; i++ ) {
        overlays[i].setMap(null);
    }   
    overlays = [];
}

// 각 카테고리에 클릭 이벤트를 등록합니다
function addCategoryClickEvent() {
    const category = document.querySelector('.categories'),
        children = category.children;

    for (let i = 0; i < children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickCategory() {
    const id = this.id,
        className = this.className;

    if (className.includes('selected')) {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
    }
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
    let category = document.querySelector('.categories'),
        children = category.children,
        i;

    for (i = 0; i < children.length; i++ ) {
        children[i].classList.remove('selected');
    }

    if (el) {
        el.classList.add('selected');
    } 
} 

function addList(place) {
    const listItem = document.createElement('li');
    listItem.classList.add('item');

    const link = document.createElement('a');
    link.href = place.place_url;
    link.target = '_blank';
    link.title = place.place_name;

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = place.place_name;
    link.appendChild(title);

    if (place.road_address_name) {
        const roadAddress = document.createElement('span');
        roadAddress.title = place.road_address_name;
        roadAddress.textContent = place.road_address_name;
        link.appendChild(roadAddress);

        const jibun = document.createElement('span');
        jibun.classList.add('jibun');
        jibun.title = place.address_name;
        jibun.textContent = '(지번 : ' + place.address_name + ')';
        link.appendChild(jibun);
    } else {
        const address = document.createElement('span');
        address.title = place.address_name;
        address.textContent = place.address_name;
        link.appendChild(address);
    }

    const tel = document.createElement('span');
    tel.classList.add('tel');
    tel.textContent = place.phone;
    link.appendChild(tel);

    listItem.appendChild(link);

    list.appendChild(listItem);

    return listItem;
}

function addListClickEvent(){
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            if(!item.classList.contains('selected')){
                for(let i = 0; i < items.length; i++){
                    console.log(1);
                    items[i].classList.remove('selected');
                }
                item.classList.add('selected');
            }else{
                item.classList.remove('selected');
            }
        })
    })
}

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        const lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition);
            
      });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    displayMarker(locPosition);
}

// 지도에 idle 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', searchPlaces);

// 각 카테고리에 클릭 이벤트를 등록합니다
addCategoryClickEvent();

centerLoc.addEventListener('click', ()=>{
    map.setCenter(locPosition);      
})