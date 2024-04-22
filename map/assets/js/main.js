const myLocaIcon = new kakao.maps.MarkerImage(
    'assets/img/my-location.png',
    new kakao.maps.Size(30, 30));

const allIcon = new kakao.maps.MarkerImage(
    'assets/img/all.png',
    new kakao.maps.Size(30, 30));

const cgvIcon = new kakao.maps.MarkerImage(
    'assets/img/cgv.png',
    new kakao.maps.Size(30, 30));

const lotteIcon = new kakao.maps.MarkerImage(
    'assets/img/lotte-cinema.png',
    new kakao.maps.Size(30, 30));

const megaIcon = new kakao.maps.MarkerImage(
    'assets/img/mega-box.png',
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

let infoOverlays = [];

const centerLoc = document.querySelector('.center-location');

// 지도에 마커를 표시하는 함수입니다
function displayMarker(locPosition) {

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        image: myLocaIcon
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
            console.log("marker");            
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
    let content = '<div class="customoverlay">' +
    '    <span class="title">' + placeName + '</span>' +
    '</div>';

    // 커스텀 오버레이를 생성합니다
    let customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        position: position,
        content: content,
        yAnchor: 0,
        zIndex:3
    });

    customOverlay.setVisible(false);

    infoOverlays.push(customOverlay);

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
    for (let i = 0; i < infoOverlays.length; i++ ) {
        infoOverlays[i].setMap(null);
    }   
    infoOverlays = [];
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
    const title = this.title,
        className = this.className;

    if (className.includes('selected')) {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = title;
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

document.querySelector('.go-back').addEventListener('click', () => {
    location.href = '../asset/index.html';
})


let drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
let moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
let clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
let distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
let dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.



// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 선 그리기가 시작됩니다 그려진 선이 있으면 지우고 다시 그립니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {

    console.log("map");
    if(isPreparedToClose){
        deleteClickLine();
        deleteCircleDot(); 
        deleteDistnce();
        isPreparedToClose = false;
        return;
    }

    // 마우스로 클릭한 위치입니다 
    let clickPosition = mouseEvent.latLng;

    // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
    if (!drawingFlag) {

        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
        drawingFlag = true;
        
        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
        deleteClickLine();
        
        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
        deleteDistnce();

        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
        deleteCircleDot();
    
        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
        clickLine = new kakao.maps.Polyline({
            map: map, // 선을 표시할 지도입니다 
            path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
            strokeWeight: 3, // 선의 두께입니다 
            strokeColor: '#db4040', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
        });
        
        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
        moveLine = new kakao.maps.Polyline({
            strokeWeight: 3, // 선의 두께입니다 
            strokeColor: '#db4040', // 선의 색깔입니다
            strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다    
        });
    
        // 클릭한 지점에 대한 정보를 지도에 표시합니다
        displayCircleDot(clickPosition, 0);

            
    } else { // 선이 그려지고 있는 상태이면

        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
        let path = clickLine.getPath();

        // 좌표 배열에 클릭한 위치를 추가합니다
        path.push(clickPosition);
        
        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
        clickLine.setPath(path);

        let distance = Math.round(clickLine.getLength());
        displayCircleDot(clickPosition, distance);
    }
});
    
// 지도에 마우스무브 이벤트를 등록합니다
// 선을 그리고있는 상태에서 마우스무브 이벤트가 발생하면 그려질 선의 위치를 동적으로 보여주도록 합니다
kakao.maps.event.addListener(map, 'mousemove', function (mouseEvent) {

    // 지도 마우스무브 이벤트가 발생했는데 선을 그리고있는 상태이면
    if (drawingFlag){
        
        // 마우스 커서의 현재 위치를 얻어옵니다 
        let mousePosition = mouseEvent.latLng; 

        // 마우스 클릭으로 그려진 선의 좌표 배열을 얻어옵니다
        let path = clickLine.getPath();
        
        // 마우스 클릭으로 그려진 마지막 좌표와 마우스 커서 위치의 좌표로 선을 표시합니다
        let movepath = [path[path.length-1], mousePosition];
        moveLine.setPath(movepath);    
        moveLine.setMap(map);
        
        let distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
            content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다
        
        // 거리정보를 지도에 표시합니다
        showDistance(content, mousePosition);   
    }             
});                 

// 지도에 마우스 오른쪽 클릭 이벤트를 등록합니다
// 선을 그리고있는 상태에서 마우스 오른쪽 클릭 이벤트가 발생하면 선 그리기를 종료합니다
kakao.maps.event.addListener(map, 'rightclick', function (mouseEvent) {

    // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
    if (drawingFlag) {
        
        // 마우스무브로 그려진 선은 지도에서 제거합니다
        moveLine.setMap(null);
        moveLine = null;  
        
        // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
        let path = clickLine.getPath();
    
        // 선을 구성하는 좌표의 개수가 2개 이상이면
        if (path.length > 1) {

            // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
            if (dots[dots.length-1].distance) {
                dots[dots.length-1].distance.setMap(null);
                dots[dots.length-1].distance = null;    
            }

            let distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
                content = getTimeHTML(distance); // 커스텀오버레이에 추가될 내용입니다
                
            // 그려진 선의 거리정보를 지도에 표시합니다
            showDistance(content, path[path.length-1]);  

            console.log(distanceOverlay)

        } else {

            // 선을 구성하는 좌표의 개수가 1개 이하이면 
            // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
            deleteClickLine();
            deleteCircleDot(); 
            deleteDistnce();

        }
        
        // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
        drawingFlag = false;          
    }  
});    

// 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
function deleteClickLine() {
    if (clickLine) {
        clickLine.setMap(null);    
        clickLine = null;        
    }
}



// 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
// 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
function showDistance(content, position) {
    
    if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
        
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);
        
    } else { // 커스텀 오버레이가 생성되지 않은 상태이면
        
        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        distanceOverlay = new kakao.maps.CustomOverlay({
            map: map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 2
        });     
        
    }

}

// 그려지고 있는 선의 총거리 정보와 
// 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
function deleteDistnce () {
    if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
    }
}

// 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여 
// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
function displayCircleDot(position, distance) {

    // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
    let circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1
    });

    // 지도에 표시합니다
    circleOverlay.setMap(map);

    if (distance > 0) {
        // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
        var distanceOverlay = new kakao.maps.CustomOverlay({
            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
            position: position,
            yAnchor: 1,
            zIndex: 2,
            clickable: true
        });

        // 지도에 표시합니다
        distanceOverlay.setMap(map);
    }

    // 배열에 추가합니다
    dots.push({circle:circleOverlay, distance: distanceOverlay});
}

// 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
function deleteCircleDot() {
    let i;

    for ( i = 0; i < dots.length; i++ ){
        if (dots[i].circle) { 
            dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
            dots[i].distance.setMap(null);
        }
    }

    dots = [];
}

// 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여 
// 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
// HTML Content를 만들어 리턴하는 함수입니다
function getTimeHTML(distance) {

    // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
    let walkkTime = distance / 67 | 0;
    let walkHour = '', walkMin = '';

    // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
    if (walkkTime > 60) {
        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
    }
    walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

    // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
    let bycicleTime = distance / 227 | 0;
    let bycicleHour = '', bycicleMin = '';

    // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
    if (bycicleTime > 60) {
        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
    }
    bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

    // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
    let content = '<ul class="dotOverlay distanceInfo">';
    content += '    <li>';
    content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m<div class="close" onmouseover="prepareClose()" onmouseout="cancelClose()"></div>';
    content += '    </li>';
    content += '    <li>';
    content += '        <span class="label">도보</span>' + walkHour + walkMin;
    content += '    </li>';
    content += '    <li>';
    content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
    content += '    </li>';
    content += '</ul>'

    return content;
}

let isPreparedToClose = false;

function prepareClose(){
    isPreparedToClose = true;
}

function cancelClose(){
    isPreparedToClose = false;
}