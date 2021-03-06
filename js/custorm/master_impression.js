Zepto(document).ready(function() {
	var http_url = serveUrl();
	var uid = zcGetAndSetUid();
	// var dauid = zcGetLocationParm('dauid');
	var dauid = getDauid();
	var list_json = { //列表接口所需的json,需转换
		'uid':dauid
	};

	var initList = function() { //初始化列表
		bindEvt(); // 绑定事件
		getLineList(list_json);//获取列表
		checkIos(); // 检查ios top 20px

	};
	var checkIos = function () {
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		if(isIOS){
			$(".h_top").css("padding-top","20px");
			$('.imp_list_wp').css("padding-top","3.1rem");
		}
	}

	var bindEvt = function() {
		$('.dropload_list_wp').on('click','.evy_impression_wp',onEvyThmTap);//点击进入详情页
		$('.header').on('click','.goback',onGoDaren);//点击回到达人页
	};
	var onEvyThmTap = function() { //跳转至详情页
		var tid = $(this).attr('data-id');
		window.location.href = 'impression_detail.html?tid='+tid+'&item_type=7&from_app=master_impression.html';
	};
	var onGoDaren = function(){
		//window.location.href = 'master.html?druid='+dauid+'';
		window.history.go(-1)
	}

	var getLineList = function(json_data,zc_dropload) { // 印象列表数据
		//console.log(json_data,1111,zc_dropload)
		var ajax_url = http_url+'/api/theme/implist';
//		var ajax_data_str = JSON.stringify(json_data);
//		console.log(ajax_data_str)
		$.ajax({
			url:ajax_url,
			data:json_data,
			type:'get',
			contentType:"application/json;charset=UTF-8",
			success:onGetLineListSuccess,
			timeout:5000,//超过5秒数
			error:function(xhr) {
				console.log('ajax error');
			},
			complete:function(xhr,status) {
					if(status=='timeout') { //超过5秒数据不返回
						if(pgNum==1) {
							showNoWlan();
						}else if(pgNum>1) {
							myDropload.resetload();
							$('.dropload-refresh').html('木有了，快放手'); //内容待定
							myDropload.lock('down');
						}
					}
				}
		});

		function onGetLineListSuccess(res) { //遍历印象列表
//			console.log(res);
			var data = [];
			var list_arr = [];
			if(res.code=='0') {
				data = res.data;
				if(data.length==0) {  //TODO
					console.log('请求成功但是没有数据');
					return;
				}
				$.each(data,function(index, obj) {
					var tags_arr = obj.tag;
					list_arr.push(
						'<div class="evy_impression_wp" data-id='+obj.impId+'>',
							'<div class="pic_wp"><img src='+obj.pic+'></div>',
							'<div class="itm_scan_wp">',
								'<h2>'+obj.name+'</h2>',
								'<p>'+obj.des+'</p>',
							'</div>',
							'<div class="see_box">',
								'<span class="see">'+obj.readCount+'</span><span class="zan">'+obj.goodCount+'</span>',
							'</div>',
						'</div>'
					);
				});

					$('.dropload_list_wp').html(list_arr.join(''));//填充列表数据
			} else {
				console.log('what ??')
			}
		}
	};

initList();
})