// JavaScript Document
Date.prototype.dateDiff = function(interval, objDate2) {
	var d = this,
		i = {},
		t = d.getTime(),
		t2 = objDate2.getTime();
	i['y'] = objDate2.getFullYear() - d.getFullYear();
	i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
	i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
	i['ms'] = objDate2.getTime() - d.getTime();
	i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
	i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
	i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
	i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
	i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
	return i[interval];
}

Date.prototype.DateAdd = function(strInterval, Number) {
	var dtTmp = this;
	switch(strInterval) {
		case 's':
			return new Date(Date.parse(dtTmp) + (1000 * Number));
		case 'n':
			return new Date(Date.parse(dtTmp) + (60000 * Number));
		case 'h':
			return new Date(Date.parse(dtTmp) + (3600000 * Number));
		case 'd':
			return new Date(Date.parse(dtTmp) + (86400000 * Number));
		case 'w':
			return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
		case 'q':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'm':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		case 'y':
			return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
}

Date.prototype.DateToParse = function() {
	var d = this;
	return Date.parse(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
}

function CreateCalendar(para, paraJsonName) { //c:容器,y:年,m:月,a:出发时间json,f:是否显示双日历,clickfu:点击事件回调函数,showFu:在日历里显示附加内容的回调函数
	var c = para.c;
	var y = para.y;
	var m = para.m;
	if(arguments.length != 3) {
		var m = para.m;
	} else if(arguments[2] == "pre") {
		var m = para.m = para.m - 1;
	} else if(arguments[2] == "next") {
		var m = para.m = para.m + 1;
	} else {
		var m = para.m;
	}

	var a = para.a;
	var f = para.f;
	var clickfu = para.clickfu;
	var showFu = para.showFu;

	var today = new Date();
	today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	if(y == 0 || m == 0) {
		y = today.getFullYear();
		m = today.getMonth() + 1;
	};
	//var dmin=Date.parse(a.first().attr('d').replace(/-/g, '/')),dmax =Date.parse(a.last().attr('d').replace(/-/g, '/'));
	var dmin = a.d1.replace(/-/g, "/"),
		dmax = a.d2.replace(/-/g, "/");

	var i1 = 0,
		i2 = 0,
		i3 = 0,
		d2;
	var d1 = new Date(dmin),
		today = today.DateToParse();
	if(Date.parse(d1.getFullYear() + '/' + (d1.getMonth() + 1) + '/1') > Date.parse(new Date(y, m - 1, 1))) {
		y = d1.getFullYear();
		m = d1.getMonth() + 1;
	}
	$('#' + c).html('');
	//农历
	var ca = new Calendar();
	tmp = '';
	for(var i = 0; i <= f; i++) {
		if(i==1 || i==0){
			d1 = new Date(y, m - 1 + i);
			y = d1.getFullYear();
			m = d1.getMonth() + 1;
		}else{
			d1 = new Date(y,m);
			y = d1.getFullYear();
			m = d1.getMonth() + 1;
		}

		tmp += '<ul>';
		tmp += '<li class="month"><div class="clearfix">';
		tmp += '<div class="dates"><em>' + y + '</em>年<em>' + m + '</em>月</div>';
		tmp += '</div></li>';
	/*	tmp += '  <li class="week">';
		tmp += '    <span class="weekEnd">日</span>';
		tmp += '    <span>一</span>';
		tmp += '    <span>二</span>';
		tmp += '    <span>三</span>';
		tmp += '    <span>四</span>';
		tmp += '    <span>五</span>';
		tmp += '    <span class="weekEnd">六</span>';
		tmp += '  </li>'; */ // 取消显示 星期一二等的显示
		var maxdays = (new Date(Date.parse(new Date(y, m, 1)) - 86400000)).getDate(); //当前月的天数
		d1 = new Date(y, m - 1); //要显示的日期
		i1 = d1.getDay(); //这个月的第一天是星期几
		for(var j = 1; j <= 6; j++) {
			tmp += '<li>';
			for(var k = 1; k <= 7; k++) {
				i2 = (j - 1) * 7 + k - i1;
				if(i2 < 1 || i2 > maxdays) {
					tmp += '<span></span>';
				} else {
					i3 = Date.parse(new Date(y, m - 1, i2));
					d1 = new Date(i3);
					//农历(ll的值为农历)
					//ca=new Calendar(y,m-1,i2)
					var ll = ca.getlf(d1);
					if(ll == '') {
						ll = ca.getsf(d1);
						if(ll == '') {
							ll = ca.getst(d1);
							if(ll == '') ll = ca.getls(d1)[3];
						}
					}
					tmp += '<span'
					if(today == i3) {
						tmp += ' class="cur"'
					};
					if(i3 < dmin || i3 > dmax) {
						tmp += '>' + i2 + '</span>';
					} 
					else {
						tmp += ' week="' + (k - 1) + '" id="' + y + '-' + m + '-' + i2 + '" title="' + ca.getl(d1, false) + ' ' + ca.getst(d1) + ' ' + ca.getsf(d1) + ' ' + ca.getlf(d1) + '">' + i2 + (function(t) {
							if($.isFunction(showFu)) {
								return showFu(t);
							} else {
								return ""
							}
						}(new Date(y, m - 1, i2))) + '</span>';

					}
				}
			}
			tmp += '</li>';
		}
		tmp += '</ul>';
	};
	$('#' + c).append(tmp);
	if($.isFunction(clickfu)) {
		// $('#' + c + ' span').click(function(){clickfu(this)});//@zc170525
		$('#' + c + ' span').click(function() {

			$(this).removeClass("hover");
			if($(this).hasClass("disabled")) {
				// layer.open({
				//     content: '日期不可选'
				//     ,skin: 'msg'
				//     ,time: 2 //2秒后自动关闭
				//   });
				return false;
			} else if($(this).hasClass("blank")) {
				return false;
			} else {
//				点击可选区域td 背景变绿色
				$(this).addClass("hover").siblings("span").removeClass("hover").parent("li").siblings("li").find("span").removeClass("hover");
				$(this).addClass("hover").parents("ul").siblings("ul").find("span").removeClass("hover");
				var thisId = $(this).attr('id'); 
			}
		})
	};
}