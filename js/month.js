var bscal = {
    left : 0,
    top  : 0,
    width: 0,
    height: 0,
    format: "%d.%m.%Y",

    wds  : new Array("Пн","Вт","Ср","Чт","Пт","Сб","Вс"),
    mns  : new Array("Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"),
    mnr  : new Array(" января"," февраля"," марта"," апреля"," мая"," июня"," июля"," августа"," сентября"," октября"," ноября"," декабря"),
    dim  : new Array(31,28,31,30,31,30,31,31,30,31,30,31),

    nowD : new Date().getDate(),
    nowM : new Date().getMonth()+1,
    nowY : new Date().getFullYear(),

	curD : null,
    curM : null,
    curY : null,

//	minY : new Date().getFullYear() - 20,
	minY : 0,
//    maxY : new Date().getFullYear() + 20,
    maxY : 48099,

    css  : document.createElement("link"),
    div  : document.createElement("div"),
    vmn  : document.createElement("div"),
	
    msel : null,
    ysel : null,
    obj  : null,
    id_to: null,
    hover: null,
	
	sDate: new Date(),
	
	init : function()
	{
		bscal.css.rel = "stylesheet";
		bscal.css.href= baseUrl+"css/bs_calendar.css";
		document.body.appendChild(bscal.css);

		bscal.div.style.left = "0px";
		bscal.div.style.top  = "0px";
		bscal.div.style.width  = "210px";
        bscal.div.id = 'bscal';
        bscal.div.innerHTML = bscal.html();
        bscal.div.style.display = "none";
		document.body.appendChild(bscal.div);

		bscal.vmn.style.left = "0px";
		bscal.vmn.style.top  = "0px";
        bscal.vmn.id = 'v-menu';
        bscal.vmn.name = 'v-menu';
        bscal.vmn.innerHTML = bscal.htmlMenu();
        bscal.vmn.style.display = "none";
        document.body.appendChild(bscal.vmn);
		document.body.onclick = function() {
			t=event.target||event.srcElement; 
			if (t.className!='over' && t.className!='bot') bscal.hideMenu();
		}

        bscal.msel = document.getElementById("bs_month");
        bscal.msel.style.width = "100%";
        for (var i=0;i<bscal.mns.length;i++)
			bscal.msel.options[i] = new Option(bscal.mns[i], i+1);
        bscal.ysel = document.getElementById("bs_year");
        bscal.ysel.style.width = "100%";
        for (var i=0;i<=bscal.maxY-bscal.minY;i++)
			bscal.ysel.options[i] = new Option(bscal.maxY-i, bscal.maxY-i);

	},
	draw : function()
	{
		bscal.hideMenu();
		md = memory_days(bscal.curY);
		var beginY=new Date(0);
		beginY.setFullYear(bscal.curY-1, 11, 31);
		var one_day=1000*60*60*24;	//1 день в милисекундах
		var num_day=0;
		var m=bscal.curM;
		var sd, fd;
		
		//очищаем дни

      for (i=0; i<bscal.curM-1; i++) {
        num_day += bscal.dim[i];
      }
      if (m > 2 && bscal.isLeap(bscal.curY)) num_day++;
    	for (var y=1;y<=6;y++)
			for (var x=1;x<=7;x++){
				var el = document.getElementById("cell_"+y+"_"+x)
				el.className = "day";
				el.style.cursor = 'default';
				el.innerHTML   = "&nbsp;";
			}
    	all_days = (m == 2 && bscal.isLeap(bscal.curY)) ? 29 : bscal.dim[m-1];
    	var beginM = new Date(0);
		beginM.setFullYear(bscal.curY,m-1,1);
		begin = beginM.getDay();
		
	    //заполняем месяц
         y=1; x=begin!=0 ? begin:7;
         for (c=1;c<=all_days;c++)
         {
			var el = document.getElementById("cell_"+y+"_"+x)
			num_day++;
			if (x > 6) {el.className = "weekend";}				// Воскресение
			if (x == 3 || x == 5) {el.className = "post";}		// Пост по средам и пятницам

// Проверяем и отмечаем памятные дни
		
			el.title = "";
			for (k = 0; k < md.length; k++) {
				if (md[k].name == "") continue;	
				if (md[k].type == 9) {
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {						// Дни особого поминовения усопших. (Тип 9)
						if(el.className == "post") {el.className = "post_memory";}						
						else {el.className = "memory";}
						el.title = md[k].name;
					} 
				}
			}
			for (k = 0; k < md.length; k++) {
				if (md[k].name == "") continue;	
				if (md[k].type == 8) {																		// Памятные дни (Типы 8)
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {
						el.title = (el.title == "")? md[k].name : md[k].name+',\n'+el.title;
					} 
				}
				else if (md[k].type == 1 || md[k].type == 2) {												// ДВУНАДЕСЯТЫЕ И ВЕЛИКИЕ ПРАЗДНИКИ (Тип 1 и 2)
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {
						if(el.className == "post") {el.className = "post_holidays";}						
						else {el.className = "holidays";}
						el.title = (el.title == "")? md[k].name : md[k].name+',\n'+el.title;
					} 
				}
				else if (md[k].type >= 3 && md[k].type <= 7) {												// СРЕДНИЕ, МАЛЫЕ и другие ПРАЗДНИКИ (Типы 3-7)
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {
						el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
					} 
				}
				else if (md[k].type == 17) {																//  Дни почитания икон (Тип 17)
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {
						el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
					} 
				}
			}
			for (k = 0; k < md.length; k++) {
				if (md[k].name == "") continue;	
				if (md[k].type == 0) {
					if (md[k].start.getDate() == c && md[k].start.getMonth() == m-1) {						// Светлое Христово Воскресение. Пасха. (Тип 0)
						el.className = "easter";
						el.title = (el.title == "")? md[k].name : md[k].name+',\n'+el.title;
					} 	
				}
			}
			for (k = 0; k < md.length; k++) {
				if (md[k].name == "") continue;	
				if (md[k].type == 100) {
					sd = Math.round((md[k].start.getTime()-beginY.getTime())/(one_day));
					fd = Math.round((md[k].finish.getTime()-beginY.getTime())/(one_day));
					
					if (num_day >= sd && num_day <= fd) {										// Сплошные седмицы. (Тип 100)
						if (el.className == "post_memory") {
							el.className = "memory";
							if (md[k].name != "") el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
						else if (el.className == "post_holidays") {
							el.className = "holidays";
							if (md[k].name != "") el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}

						else if (el.className == "day" || el.className == "post") {
							el.className = "day";
							if (md[k].name != "") el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
						else  {
							if (md[k].name != "") el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
					} 
				}
			}
			for (k = 0; k < md.length; k++) {
				if (md[k].name == "") continue;	
				if (md[k].type == 10) {
					sd = Math.round((md[k].start.getTime()-beginY.getTime())/(one_day));
					fd = Math.round((md[k].finish.getTime()-beginY.getTime())/(one_day));
					
					if ((num_day >= sd && num_day <= fd)) {						// Многодневные и однодневные посты.  (Тип 10) && Не забываем про окончание Филлипова поста в начале года
						if (el.className == "holidays") {
							el.className = "post_holidays";
							el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
						else if (el.className == "memory") {
							el.className = "post_memory";
							el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
						else if (el.className == "weekend") {
							el.className = "post_weekend";
							el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
						else if (el.className == "day" || el.className == "post") {
							el.className = "post";
							el.title = (el.title == "")? md[k].name : el.title+',\n'+md[k].name;
						}
					} 
				}
			}
// конец проверки памятных дней

			if (bscal.istoday(c)){el.className="today";}
			el.innerHTML   = c;
			el.style.cursor = 'pointer';

// Браковенчание не совершается
			el.className = el.className + " wedding_off";
			var nowedding = "Браковенчание не совершается";
			if (x == 2 || x == 4 || x == 6) {								// Не совершается браковенчание накануне среды и пятницы всего года (вторник и четверг), и воскресных дней (суббота)
				el.title = (el.title == "")? nowedding : el.title+',\n'+nowedding;
				el.className = el.className.replace(" wedding_off", " nowedding_off");
			}
			else {
				for (k = 0; k < md.length; k++) {																// А также не совершается браковенчание накануне двунадесятых, храмовых и великих праздников
					if (md[k].name == "") continue;																// в продолжение постов Великого, Петрова, Успенского и Рождественского; 
					if (md[k].type == 20) {																		// в продолжение Святок с 7 января (25 декабря) по 19 (6) января; сырной седмицы (масленицы),
						sd = Math.round((md[k].start.getTime()-beginY.getTime())/(one_day));					// начиная с Недели мясопустной и в Неделю сыропустную; в течение Пасхальной (Светлой) седмицы;
						fd = Math.round((md[k].finish.getTime()-beginY.getTime())/(one_day));					// в дни (и накануне) Усекновения главы Иоана Предтечи - 11 сентября (29 августа) и 
																												// Воздвижения Креста Господня - 27 (12) сентября.
						if (num_day >= sd && num_day <= fd) {													// Тип 20 && Не забываем про окончание Филлипова поста в начале года
							el.title = (el.title == "")? nowedding : el.title+',\n'+nowedding;
							el.className = el.className.replace(" wedding_off", " nowedding_off");
							break;
						}
					}
				}
			}
// Седмица
			var d = new Date (bscal.curY, m-1, c);
			var t = Sedmica(d);
			if (t !="") el.title = t + ".,\n" + el.title;

// Дата по старому стилю			
			var od = new Date(0);
			d.setFullYear(bscal.curY);
			OldStyle(od, d);
			el.title = d.getDate()+bscal.mnr[d.getMonth()]+" ("+od.getDate()+bscal.mnr[od.getMonth()]+" ст.ст.),\n" + el.title;
			
			x++; if (x>7){x=1;y++;}
         }
		}
		if (document.getElementById('weddingID').checked == true) bscal.changeWedding();
	},
	showList : function(){
		var link = baseUrl+'index.html';
		var y = document.getElementById('bs_year').value;
		if (y != "") link += '?year='+y;
		window.open(link);
		bscal.hide();
	},
	retD : function(r_day){
        if (!r_day || r_day=="&nbsp;") return false;
        res = bscal.format;
	    res = res.replace("%d",(r_day < 10 ? "0":"") + r_day);
	    res = res.replace("%m",(bscal.curM<10?"0":"") + bscal.curM);
	    res = res.replace("%Y",bscal.curY);
//	    bscal.obj.value = res;
		document.getElementById(bscal.id_to).value = res;
		var d = new Date(0);
		d.setFullYear(bscal.curY, bscal.curM-1, r_day);
		bscal.link(d, dblClick);
	},
	retMenu : function(r_day, obj){
        if (!r_day || r_day=="&nbsp;") return false;
        res = bscal.format;
	    res = res.replace("%d",(r_day < 10 ? "0":"") + r_day);
	    res = res.replace("%m",(bscal.curM<10?"0":"") + bscal.curM);
	    res = res.replace("%Y",bscal.curY);
//	    bscal.obj.value = res;
		document.getElementById(bscal.id_to).value = res;
		bscal.sDate.setFullYear(bscal.curY, bscal.curM-1, r_day);
		bscal.showMenu(obj);
	},
// Выход 2
	retOffset : function(r_day){
		if (!r_day || r_day=="&nbsp;") return false;
		
		var msec=24*60*60*1000;
         var d = new Date(0);
		d.setFullYear(bscal.curY, bscal.curM-1, r_day);
		today = new Date();
		d.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);
		offset = Math.round((d.getTime() - today.getTime())/msec);
	    currentday(offset);
	    bscal.hide();
		location.reload();
	},
	istoday : function(day){
		return (bscal.nowD==day && bscal.curM==bscal.nowM && bscal.curY == bscal.nowY) ? true : false;
	},

    dover : function(el){
		if (el.innerHTML=='&nbsp;') return false;
		bscal.hover = el.className;
		el.className = 'over';
    },
    dout  : function(el){
		if (el.innerHTML=='&nbsp;') return false;
		el.className = bscal.hover;
		bscal.hover = null;
    },
	today : function(){
    	bscal.curD = bscal.nowD;
    	bscal.curM = bscal.nowM;
    	bscal.curY = bscal.nowY;
        bscal.scroll_M(0);
	},
	change_M : function (dir){

    	bscal.curM = dir*1;

    	bscal.scroll_Y(0);

	},
    scroll_M : function (dir){
	    bscal.curM = bscal.curM + dir;
	    if (bscal.curM < 1) {
	        bscal.curM = 12;
	        bscal.curY -= 1;
	    }
	    if (bscal.curM > 12) {
	        bscal.curM = 1;
	        bscal.curY += 1;
	    }
        document.getElementById('bs_month').selectedIndex=bscal.curM-1
	    bscal.scroll_Y(0);
	},
    change_Y : function (dir){
		if (dir.length != 4) return false;
		bscal.curY = dir*1;
		bscal.scroll_Y(0);
    },
	scroll_Y : function (dir){
    	bscal.curY+= dir;
    	if (bscal.curY < bscal.minY) bscal.curY = bscal.minY;
    	if (bscal.curY > bscal.maxY) bscal.curY = bscal.maxY;
		document.getElementById('bs_year').value = bscal.curY;
		bscal.draw();
	},

    isLeap : function (year) {
		return (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) ? true : false },

	html : function()
	{
	    var res  = "";
        res += "<table cellpadding=0 cellspacing=0 border=0 width='100%'>\n";
	    res += "<tr class='top'><td>Выберите дату</td><td onclick='bscal.hide();' align=right style='cursor:pointer'>x</td></tr>\n";
	    res += "</table>";
	    res += "<table cellpadding=0 cellspacing=0 width=100% unselectable=on>\n";
	    res += "<tr unselectable=on>"+
			   "<td class=arrow onClick=bscal.scroll_M(-1);>&lt;&lt;</td>\n"+
			   "<td colspan=3 unselectable=on><select id='bs_month' onchange=\"bscal.change_M(this.value);bscal.div.focus();\"></select></td>"+
			   "<td colspan=2 unselectable=on><select id='bs_year' type='text' style='width:100%' onchange=\"bscal.change_Y(this.value);\" onkeyup=\"bscal.change_Y(this.value);\"></select></td>"+
	           "<td class=arrow onClick=bscal.scroll_M(1);>&gt;&gt;</td>"+
			   "</tr>\n";
	    res += "<tr unselectable=on align=center>\n";
	    for (var x=0;x<7;x++)
			res += "<TD class=week width=30 unselectable=on>"+bscal.wds[x]+"</TD>\n";
	    res += "</tr>";
	    for (var y=1;y<=6;y++)
	    {
			res += "<TR align=center unselectable=on>\n";
	        for (var x=1;x<=7;x++){
				res += "<td id='cell_"+y+"_"+x+"' onmouseover=\"bscal.dover(this);\" onmouseout=\"bscal.dout(this);\" onclick=\"bscal.retOffset(this.innerHTML);\" unselectable=on>"+y+"_"+x+"</td>\n";
	        }
			res += "</TR>\n";
	    }
	    res += "<tr class=top align=center>\n"+
	           "<td colspan=3 class=bot onClick=\"bscal.today();bscal.retOffset("+bscal.nowD+");\">сегодня</td>\n"+
	           "<td class=bot>/</td>"+
	           "<td colspan=3 class=bot onClick=\"bscal.today();bscal.retOffset("+(bscal.nowD+1)+");\">завтра</td>\n"+
	           "</tr>\n";
	    res += "</table>";
	return res;
	},
	htmlMenu : function() {
// А теперь добавим всплывающее меню
		var hr = false;
		var res  = "<ul>";
		res += "<div id='onlyThisYear'>";
		for (var i=0; i<popmenu.length; i++) {
			if (popmenu[i].type < 100) {			// Только текущий год
				res += "<li onclick='bscal.link(bscal.sDate, "+popmenu[i].type+")'>"+popmenu[i].name+"</li>";
				hr = true;
			}
		}
		if (hr) res += "<hr>";
		res += "</div>";
		for (var i=0; i<popmenu.length; i++) {
			if (popmenu[i].type >= 100) {
				res += "<li onclick='bscal.link(bscal.sDate, "+popmenu[i].type+")'>"+popmenu[i].name+"</li>";
			}
		}
		res += "</ul>";
		return res;
	},
	changeWedding: function () {
        var m=0;
		for (var j=1; j<=4; j++)
		for (var i=1; i<=3; i++)
		{
			m++;
			for (var y=1;y<=6;y++)
			for (var x=1;x<=7;x++){
				var el = document.getElementById("cell_"+m+"_"+y+"_"+x);
				if (el.className.indexOf(" wedding_off") > -1) el.className = el.className.replace(" wedding_off", " wedding_on");
				else if (el.className.indexOf(" wedding_on") > -1) {el.className = el.className.replace(" wedding_on", " wedding_off"); }
			}
		}
	},
	show : function(id_to) {
    	if (id_to==bscal.id_to){
			bscal.hide(); return false;
    	}
        bscal.id_to = id_to;
		bscal.obj = document.getElementById(id_to);
    	var pos = bscal.pos(bscal.obj);
		bscal.today();
		bscal.div.style.display = "block";
		pos.x += bscal.obj.offsetWidth - bscal.div.offsetWidth + bscal.left;
   		pos.y += bscal.obj.offsetHeight + bscal.top;
		if (pos.y < 0) pos.y = 0;
		if (pos.x < 0) pos.x -= bscal.obj.offsetWidth-bscal.div.offsetWidth;
		bscal.width  = bscal.div.offsetWidth;
		bscal.height = bscal.div.offsetHeight;	
		bscal.div.style.left = pos.x+"px";
		bscal.div.style.top = pos.y+"px";
	},
	hide : function() {
        bscal.id_to = null;
        bscal.obj = null;
    	bscal.div.style.display = "none";
		bscal.hideMenu();
	},
    pos  : function (el) {
        var r = { x: el.offsetLeft, y: el.offsetTop };
        if (el.offsetParent) {
                var tmp = bscal.pos(el.offsetParent);
                r.x += tmp.x;
                r.y += tmp.y;
        }
	return r;
	},
	showMenu: function (obj){
		var pos = bscal.pos(obj);
		bscal.vmn.style.display="block";
//		bscal.vmn.backgroundPosition="top";

		pos.y += obj.offsetHeight;
		if (pos.x > bscal.div.offsetLeft+bscal.div.offsetWidth-bscal.vmn.offsetWidth) {
			pos.x += obj.offsetWidth - bscal.vmn.offsetWidth;
		}
		bscal.vmn.style.left = pos.x+"px";
		bscal.vmn.style.top  = pos.y+"px";
		
	// Отображать пункты меню предназначенные только для текущего года
		var now = new Date();
		var el = document.getElementById("onlyThisYear");
		if (bscal.curY==now.getFullYear()) {
			el.style.display="block";
		} else {
			el.style.display="none";
		}
	},
	hideMenu : function() {
		if (bscal.vmn.style.display=="block") bscal.vmn.style.display="none";
	},
	link: function (d, type) {
		bscal.hideMenu();
		switch(type) {
		case 1001:
			today.show(d, 'bscal');
			break;
		case 1002:
			naming.show(d, 'bscal');
			break;
		default:
			var l = getLink(d, type);
			if (l) {
				window.open(l);
				bscal.hide();
			}
			break;
		}
	}
	
 };

