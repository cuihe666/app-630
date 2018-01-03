/**
 * 日期加减
 * @param {Date} date 日期
 * @param {Number} day 需要加减数
 */
var addDate = function(date, day){
	var lDate = date.valueOf();
	//console.log(lDate) // 时间戳
	var addDate = lDate + day * 24 * 60 * 60 * 1000
//	console.log(addDate); // 时间戳
	return new Date(addDate);
}

/**
 * 格式化日期，形如：yyyy-mm-dd
 * @param {Date} date 需要格式的日期
 */
var getDateString = function(date){
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()//日期获取的时间从0开始  格式为 2018-01-10
}

$(function() {
	/*i是td的id*/
	var ID = [];
	$(".calendar span").each(function(index, dom) {
		if($(dom).attr("id")) {
			ID.push($(dom).attr("id"));
			// console.log(ID);
			$(dom).addClass("enableDate");
		} else {
			// 没有日期的表格
			$(dom).addClass("blank");
		}
	})
	var dNow = new Date();
	var sNow = getDateString(dNow);
	//console.log(sNow); // 当前日期
	for(var i = 0; i < ID.length; i++) {
		var sCanlender = ID[i]; /*"格式为 2016-11-7"*/ 
		//console.log(sCanlender);  //选择范围的日期
		var aCanlender = sCanlender.split("-");
		var dd=new Date()

        var dDate = new Date(aCanlender[0], parseInt(aCanlender[1] - 1), aCanlender[2]);//["2016","11","7"]
        // console.log(dDate) // 选择范围的 标准时间
//		var dDate = new Date(sCanlender);

		if(addDate(dDate, 0) < dNow) {  // 当前天的后几天  -2 代表当前天后的两天
			//console.log("小于：" + sCanlender);
			$("#" + sCanlender).addClass("disabled")
			if(sCanlender == sNow) {
//				console.log("今天" + sCanlender)
			}
		}
	}
})
