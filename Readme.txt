﻿Краткая инструкция по установке скрипта Православного календаря на сайт. Версия 2.4.5 
=====================================================================================


1. Скопируйте содержимое этого архива в какую-нибудь папку на Вашем сайте.

2. Откройте файл js/year.js в любом текстовом редакторе. В конце файла Вы обнаружите
несколько строк для инициализации скрипта

/***************************************************************
	Блок процедур, инициирующих календарь и формирующих
	кнопку вызова календаря
****************************************************************/
	var domenUrl = window.location.protocol.toString() + "//" +window.location.host.toString(); 
    var baseUrl =  domenUrl + "/calendar/";         // Указать папку, в которой размещаются файлы календаря
	var popmenu =[									// Удалите, перегруппируйте или переименуйте пункты меню, если потребуется
					{name: "Официальный календарь РПЦ", type: 1},
					{name: "Календарь на Православие.Ru", type: 2},
					{name: "Богослужебные указания", type: 3},
					{name: "Этот день в календаре", type: 101},
					{name: "Текущий день", type: 1001},
					{name: "Выбор имени по Месяцеслову", type: 1002}
				];
	var dblClick = 2;								// Пункт меню при двойном щелчке по дате (варианты см. выше)										
	var dayLink = 2;								// Ссылка при нажатии на дату в описании дня (календарь списком, текущий день, выбор имени)
													// Варианты: 1, 2, 3, 101

	loadXML(); 										// Загрузка данных для календаря
/*** При необходимости закоментировать 5 строк ниже                           ***/
	bscal.init();									// Инициация картинки календаря
	naming.init();									// Инициация месяцеслова
	today.init();									// Инициация всплывающего календаря
	document.write ('<input name="date0" type="hidden" id="date0">');
	document.write ('<input type="button" id="b0" name="b0" name="Button" value=" Календарь на год " onClick="bscal.show(\'date0\', \'b0\');">');

Во второй строке укажите путь к Вашей папке с календарем относительно корневой папки сайта. При необходимости измените значения переменных dblClick и/или dayLink, 
первая переменноя позволяет указать, какой сайт будет открыт при двойном щелчке по дате в календаре, вторая - какой сайт будет открыт при двойном щелчке по ссылке 
в календаре списком, текущем дне или в окне выбора имени.

3. В том месте страницы или виджета (например, в WordPress), где Вы хотите видеть кнопку запуска календаря, 
поместите три строчки кода:

	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/MemoryDays.js"></script>
	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/Naming.js"></script>
	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/year.js"></script>

Заменив http://hpf.ru.com/calendar/ на то, что Вы указали в переменной baseUrl.

Если календарь размещается на обычной HTML странице, рекомендую указанные выше 5 строк закомментировать в файле year.js,
и поместить их в тело страницы: 

<html>
<head>
	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/MemoryDays.js"></script>
	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/Naming.js"></script>
	<script type="text/javascript" src="http://hpf.ru.com/calendar/js/year.js"></script>
</head>
<body>
	<script type="text/javascript">
		bscal.init();					// Инициация картинки календаря
		naming.init();					// Инициация месяцеслова
		today.init();					// Инициация всплывающего календаря
	</script>
	<input name="date0" type="hidden" id="date0">
	<input type="button" id="b0" name="b0" name="Button" value=" Календарь на год " onClick="bscal.show('date0', 'b0');">
</body>
</html>


4. Для настройки цветовой гаммы отредактируйте файлы css/bs_calendar.css, css/st_names.css и sl_psaltir.css

5. База данных календаря представляет собой XML-файл с простой структурой, описания события:

  <event>
    <s_month>0</s_month>
    <s_date>57</s_date>
    <f_month>6</f_month>
    <f_date>28</f_date>
    <name>Петров (Апоcтольский) пост</name>
    <type>10</type>
  </event>

где	s_month - месяц начала события;
	s_date - день начала события;
	f_month - месяц окончания события;
	f_date - день окончания события;
	name - название события;
	type - тип события;

Даты указываем по старому стилю. 
Если номер месяца 0, то отсчет ведем от Пасхи (в этом случае день может иметь отрицательное значение - 
для событий предшествеющих Светлому Христову Воскресению, например для Входа Господня в Иерусалим -7).

<event>
	<s_month>0</s_month>
	<s_date>-7</s_date>
	<f_month>0</f_month>
	<f_date>-7</f_date>
	<name>Вход Господень в Иерусалим</name>
	<type>1</type>
</event>

Если номер месяца -1, то это Сб./Вс. перед/после праздника (даты по ст.ст. (поля finish)). Например:

<event>
	<s_month>-1</s_month>
	<s_date>6</s_date>
	<f_month>1</f_month>
	<f_date>6</f_date>
	<name>Суббота пo Богоявлении</name>
	<type>8</type>
</event>

Если номер месяца -2, то это Праздник в Сб./Вс. перед/после даты (даты по ст.ст. (поля finish)). Например:

<event>
	<s_month>-2</s_month>
	<s_date>-1</s_date>
	<f_month>10</f_month>
	<f_date>26</f_date>
	<name>Димитриевская родительская суббота</name>
	<type>9</type>
</event>

События s_month=-1 и s_month=-2 отличаются лишь тем, что в случае s_month=-1 при совпадении праздничного дня с указанным событием, 
событие в календаре не отображается. То есть если Богоявление случается в субботу, то событие "Суббота по Богоявлению" в календаре не отображается.
В случае s_month=-2 событие отображается всегда.

s_date
	-1		суббота перед датой
	 0		воскресенье перед датой
	 6		суббота после даты
	 7		воскресенье после даты

Возможны следующие типы событий:

Тип	Наименование
0	Светлое Христово Воскресение. Пасха
1	Двунадесятые праздники 
2	Великие праздники
3	Средние бденные праздники
4	Средние полиелейные праздники
5	Малые славословные праздники
6	Малые шестиричные праздники
7	Вседневные праздники
8	Памятные даты
9	Дни особого поминовения усопших
10	Посты (многодневные и однодневные)
17	Дни почитания икон
18	Дни памяти святых
19	Дни памяти новомученников и исповедников российских
20	Браковенчание не совершается
100	Сплошные седмицы

6. Запуск православного календаря в виде списки из адресной строки браузера.
Чтобы вывести на экран православный календарь в виде списка достаточно в адресной строке браузера указать ссылку на папку с файлами календаря. 
В нашем примере это "http://hpf.ru.com/calendar/". В этом случае в новом окне браузера появится православный календарь на текущий год. 
Чтобы вывести на экран календарь на любой год, необходимо указать этот год в параметре year:
http://hpf.ru.com/calendar/index.html?year=1958
Если год не указан, или указан не корректно, то отображается календарь на текущий год.
Чтобы вывести на экран календарь только на один месяц, используйте параметр month:
http://hpf.ru.com/calendar/index.html?year=1958&month=12
Если месяц не указан, или указан не корректно, то отображается календарь на текущий месяц, заданного года. Например,
http://hpf.ru.com/calendar/index.html?year=1958&month в апреле 2013 г. будет показывать календарь на апрель 1958 г.
Существует также возможность вывести на экран календарь только на один день. Для этого используйте параметр date:
http://hpf.ru.com/calendar/index.html?year=1958&month=12&date=14
Если дата не указана, или указана не корректно, то отображается календарь на текущую дату. Причем, если указана дата, превосходящая количество дней в заданном месяце,
то отображается календарь на последний день месяца. Например,
http://hpf.ru.com/calendar/index.html?year=1958&month=2&date=31 показывает календарь на 28.02.1958

==============================================================================================================
Скрипт для православных, разумеется, абсолютно бесплатный. Единственное требование-просьба при его использовании 
не удалять ссылку на наш сайт.

Скрипт и БД будут развиваться и совершенствоваться, поэтому следите за обновлениями у нас на сайте. (возможно, если потребуется,
создам отдельный блог).
Если возникают вопросы или найдете баг, пишите: vadim.bogaiskov@gmail.com

Храни Вас Господь!






