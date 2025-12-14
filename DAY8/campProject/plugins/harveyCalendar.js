console.log("Harvey Calendar plugin loaded");
/*fetch('./db.json', { method: 'GET' }).then((function (response) {
    return response.json();
})).then((function (data) {
    console.log("Fetched data:", data);
}));*/

//使用 async/await語法重寫上述 fetch 範例
/*async function fetchData() {
    try {
        const response = await fetch('./db.json', { method: 'GET' });
        const data = await response.json();
        console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}*/

//dayjs 套件設定區
//dayjs.locale('zh-tw');
dayjs.extend(dayjs_plugin_localeData);
dayjs.extend(dayjs_plugin_isSameOrBefore);

//全域變數宣告區
let
    nationalHoliday = [],
    pallet = {},
    booked = [];

//初次執行項目
async function init() {
    const response = await fetch('./db.json', { method: 'GET' });
    const data = await response.json();

    ({ nationalHoliday, pallet, booked } = data);
    const service = calenderService();
    service.print();

    document.querySelector('a[href="#prevCtrl"]').addEventListener('click', (e) => {
        e.preventDefault();
        service.sub();
    });

    document.querySelector('a[href="#nextCtrl"]').addEventListener('click', (e) => {
        e.preventDefault();
        service.add();
    });
}

init();



const calenderService = () => {
    let theDay = dayjs();

    const
        today = dayjs(),
        objL = {
            listBox: '',
            title: '',
            thisDate: theDay
        },
        objR = {
            listBox: '',
            title: '',
            thisDate: theDay.add(1, 'month')
        },
        listMaker = (obj) => {
            // 負責將指定的 obj，利用obj.thisDate 來產生標題與列表內容
            const firstDay = obj.thisDate.date(1).day();
            for (let i = 1; i < (firstDay || 7); i++) {
                obj.listBox += '<li class="JsCal"></li>';
            }
            const totalDays = obj.thisDate.daysInMonth();
            for (let j = 1; j <= totalDays; j++) {
                let className = 'JsCal';
                if (obj.thisDate.date(j).isSameOrBefore(today)) className += ' delDay';
                else {
                    const theDayFormatStr = obj.thisDate.date(j).format('YYYY-MM-DD');

                    const isHoliday = (j + firstDay) % 7 < 2 || nationalHoliday.includes(obj.thisDate.date(j).format('YYYY-MM-DD'));
                    if (isHoliday) className += ' holiDay';

                    const checkDateBooked = booked.find(item => item.date === theDayFormatStr);
                    if (checkDateBooked) {
                        const sellTotal = checkDateBooked.sellout.aArea + checkDateBooked.sellout.bArea + checkDateBooked.sellout.cArea + checkDateBooked.sellout.dArea;
                        if (pallet.count === sellTotal) className += ' fullDay';
                    }
                }
                obj.listBox += `<li class="JsCal">${j}</li>`;
            }
            obj.title = `${obj.thisDate.year()} 年 ${obj.thisDate.month() + 1} 月`;

            return obj;
        },

        listPrint = () => {
            // 負責DOM操作，把產生的標題與列表內容印到畫面上
            document.querySelector('.leftDayList').innerHTML = listMaker(objL).listBox;
            document.querySelector('.leftBar>h4').innerHTML = objL.title;

            document.querySelector('.rightDayList').innerHTML = listMaker(objR).listBox;
            document.querySelector('.rightBar>h4').innerHTML = objR.title;
        };

    //listPrint();

    return {
        print: () => listPrint(),
        add: () => {

        },
        sub: () => {

        }
    };
}