// console.log("Harvey Calendar plugin loaded");
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
dayjs.extend(dayjs_plugin_isBetween);

//全域變數宣告區
let
    nationalHoliday = [],
    pallet = {},
    booked = [],
    myCalender = null,
    tableData = { //初始的表格資料
        totalPrice: 0, // 總價
        normalCount: 0, // 平日入住數
        holidayCount: 0, // 平日入住數
        pallet: { //營位資料 => 標題名稱、可賣數量、預約日金、小計、訂購數
            aArea: { title: '河畔 × A 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            bArea: { title: '山間 × B 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            cArea: { title: '平原 × C 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 },
            dArea: { title: '車屋 × D 區', sellCount: 0, sellInfo: '<div></div>', sumPrice: 0, orderCount: 0 }
        }

    };

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
        chooseDates = [null, null],
        initTableDataStr = JSON.stringify(tableData),
        changeMonth = (num) => {
            theDay = theDay.add(num, 'month');
            objL.thisDate = theDay;
            objR.thisDate = theDay.add(1, 'month');

            objL.listBox = '';
            objR.listBox = '';
            listPrint();
        },
        selectHandler = (node) => {
            // 負責處理使用者點擊可選日期的動作
            if (!chooseDates[0] && !chooseDates[1]) {
                // 當前沒有選擇任何日期
                chooseDates[0] = node;
                node.classList.add('selectHead');
            } else if (chooseDates[0] && !chooseDates[1]) {
                if (chooseDates[0] === node) return;
                // 當下只有選第一個日期
                chooseDates[1] = node;
                if (dayjs(chooseDates[0].dataset.date).isAfter(dayjs(chooseDates[1].dataset.date))) {
                    // 如果第二個日期比第一個日期還早，則交換兩者
                    chooseDates[0] = classList.replace('selectHead', 'selectFoot');
                    chooseDates[1] = classList.add('selectHead');
                    [chooseDates[0], chooseDates[1]] = [chooseDates[1], chooseDates[0]];
                } else
                    node.classList.add('selectFoot');

                /*document.querySelectorAll('.selectDay').forEach(node => {
                    const isBetween = dayjs(node.dataset.date).isBetween(
                        chooseDates[0].dataset.date
                        chooseDates[1].dataset.date
                    );
                    if (isBetween) node.classList.add('selectConnect');
                });*/
                document.querySelectorAll('.selectDay').forEach(n => dayjs(n.dataset.date).isBetween(chooseDates[0].dataset.date, chooseDates[1].dataset.date) && n.classList.add('selectConnect'));

                tableMaker();
            } else {
                chooseDates[0].classList.remove('selectHead');
                chooseDates[1].classList.remove('selectFoot');

                document.querySelectorAll('.selectConnect').forEach(node => {
                    node.classList.remove('selectConnect');
                });

                chooseDates[0] = node;
                chooseDates[1] = null;
                node.classList.add('selectHead');
            }

        },
        listMaker = (obj) => {
            // 負責將指定的 obj，利用obj.thisDate 來產生標題與列表內容
            const firstDay = obj.thisDate.date(1).day();
            for (let i = 1; i < (firstDay || 7); i++) {
                obj.listBox += '<li class="JsCal"></li>';
            }
            const totalDays = obj.thisDate.daysInMonth();
            for (let i = 1; i <= totalDays; i++) {
                let className = 'JsCal';
                const theDayFormatStr = obj.thisDate.date(i).format('YYYY-MM-DD');
                if (obj.thisDate.date(i).isSameOrBefore(today)) className += ' delDay';
                else {
                    className += ' selectDay';
                    const isHoliday = (i + firstDay) % 7 < 2 || nationalHoliday.includes(theDayFormatStr);
                    if (isHoliday) className += ' holiday';

                    const checkDateBooked = booked.find((item) => item.date === theDayFormatStr);
                    /*if (checkDateBooked) {
                        const sellTotal = checkDateBooked.sellout.aArea + checkDateBooked.sellout.bArea + checkDateBooked.sellout.cArea + checkDateBooked.sellout.dArea;
                        if (pallet.count === sellTotal) className += ' fullDay';
                    }*/
                    if (checkDateBooked && Object.values(checkDateBooked.sellout).reduce((acc, cur) => acc + cur, 0) === pallet.count) className += ' fullDay';
                }
                obj.listBox += `<li class="${className}" data-date="${theDayFormatStr}">${i}</li>`;
            }
            obj.title = `${obj.thisDate.year()} ${dayjs.monthsShort()[obj.thisDate.month()]}`;

            return obj;
        },
        listPrint = () => {
            // 負責DOM操作，把產生的標題與列表內容印到畫面上
            document.querySelector('.leftDayList').innerHTML = listMaker(objL).listBox;
            document.querySelector('.leftBar>h4').innerHTML = objL.title;

            document.querySelector('.rightDayList').innerHTML = listMaker(objR).listBox;
            document.querySelector('.rightBar>h4').innerHTML = objR.title;

            document.querySelectorAll('.selectDay').forEach(node => {
                node.addEventListener('click', () => selectHandler(node));
            });
        },

        tableMaker = () => {
            tableData = JSON.parse(initTableDataStr);  //乾淨的tableData

            for (const key in tableData.pallet) {
                tableData.pallet[key].sellCount = pallet[key].total;
            }

            document.querySelectorAll('li.selectHead, li.selectConnect').forEach(item => {
                for (const key in tableData.pallet) {
                    const hasOrder = booked.find(bookItem => bookItem.date === item.dataset.date);

                    //如果後端有找到當日訂單，更新房況剩餘數
                    if (hasOrder) {
                        tableData.pallet[key].sellCount = Math.min(tableData.pallet[key].sellCount, pallet[key].total - hasOrder.sellout[key]);
                    }

                    //如果房況有剩，提供該key的販售資訊
                    if (tableData.pallet[key].sellCount) {
                        //const dayPrice = item.classList.contains('holiday') ? pallet[key].holidayPrice : pallet[key].normalPrice;
                        const dayPrice = pallet[key][item.classList.contains('holiday') ? 'holidayPrice' : 'normalPrice'];

                        //console.log(item.dataset.date, dayPrice);
                        tableData.pallet[key].sellInfo += `<div>${item.dataset.date} (${dayPrice})</div>`;
                        tableData.pallet[key].sumPrice += dayPrice;
                    } else {
                        tableData.pallet[key].sellInfo = `<div>已售完</div>`;
                        tableData.pallet[key].sumPrice = 0;
                    }
                }

                //item.classList.contains('holiday') ? tableData.holidayCount++ : tableData.normalCount++;
                tableData[item.classList.contains('holiday') ? 'holidayCount' : 'normalCount']++;
            });

            tablePrint();
        },

        tablePrint = () => {
            //console.log('tableData做成HTML');
            document.querySelectorAll('form select').forEach(nodeSelect => {
                let optStr = '';
                const countOption = tableData.pallet[nodeSelect.name].sellCount;

                for (let i = 0; i <= countOption; i++) {
                    optStr += `<option value"${i}">${i}</option>`;
                }
                nodeSelect.innerHTML = optStr;
                nodeSelect.disabled = countOption === 0;

                const tdSellInfo = nodeSelect.parentElement.previousElementSibling;
                tdSellInfo.innerHTML = tableData.pallet[nodeSelect.name].sellInfo;

                const tdRemain = tdSellInfo.previousElementSibling.querySelector('span');
                tdRemain.textContent = countOption;

                document.querySelector('#selectPallet h3').textContent = `$${tableData.totalPrice} / ${tableData.normalCount}晚平日，${tableData.holidayCount}晚假日`;
            });
        }


    //listPrint();

    return {
        print: () => listPrint(),
        add: () => {
            changeMonth(1);
        },
        sub: () => {
            changeMonth(-1);
        },
        choose: item => {
            if (item.classList.contains('selectHead') && !userChooseDays[1]) return;
            chooseList(item);
        },
        tableRefresh: () => tablePrint()
    }
}