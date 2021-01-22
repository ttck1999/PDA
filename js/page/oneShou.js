//所有plus api都应该在此事件发生后调用，否则会出现plus is undefined
document.addEventListener("plusready", plusReady, false)

function plusReady() {        
	var main = plus.android.runtimeMainActivity(); //获取activity  
	var context = plus.android.importClass('android.content.Context'); //上下文  
    var  receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {  
		onReceive: getReceive //实现onReceiver回调函数  
	});  
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	var filter = new IntentFilter();
	filter.addAction("com.barcode.sendBroadcast"); //广播名
	main.registerReceiver(receiver, filter); //注册广播
}  
function getReceive (context, intent) {  
	//实现onReceiver回调函数
	plus.android.importClass(intent); 
	var m_barcode = intent.getStringExtra("BARCODE");//数据标识
	//var ul = document.getElementById("myList");
	if(m_barcode != "") {
		$("#bizNo").val(m_barcode);
	
	}
	main.unregisterReceiver(receiver);//取消监听 
}  

// 返回按钮
function back() {
	window.location.href="memu.html";
}

var numArr =[];
function  tableData(page,bizNo){
	$(".search-tbody").html('')

	// 表格的接口
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/codeScannNumberList",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		data: {
			codeScannList:bizNo,
			page:page,
			rows:10
		},
		dataType:"json",
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		success:function(data) {
			$(".search-tbody").html('')
			
			for(var i=0;i<data.rows.length;i++){
				var rowData=JSON.stringify(data.rows[i]).replace(/"/g,"\'");//将row对象的数据转换为字符串，而且必须替换双引号为单引号，分开comp里的双引号
			  $('<tr>'+
				'<td class="xuhao"><span>'+numArr[i]+'</span></td>'+
				'<td><a href="#" style="color: #2391E7;text-decoration: none;" onclick="delBizNo('+rowData+')">移除</a></td>'+
				'<td>'+data.rows[i].bizNo+'</td>'+
				'<td>'+data.rows[i].msName+'</td>'+
				'<td>'+data.rows[i].msCode+'</td>'+
				'<td>'+data.rows[i].masterCode+'</td>'+
				'<td>'+data.rows[i].scanCode+'</td>'+
				'<td>'+data.rows[i].produceNo+'</td>'+
				'<td>'+data.rows[i].produceDate+'</td>'+
				'<td>'+data.rows[i].expDate+'</td>'+
				'<td>'+data.rows[i].unitRatio+'</td>'+
				'<td>'+data.rows[i].packageUnit+'</td>'+
			  '</tr>').appendTo(".search-tbody");
			}
			
			$('#bizNo').val("")
		} 
	})
}

// 移除
function delBizNo(rowData){
	var bizNo = rowData.bizNo
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/delCodeScann",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		data: JSON.stringify(bizNo),
		dataType: "json",
		contentType:"application/json; charset=utf-8",
		success: function(result){
			document.getElementById("bizNo").focus();
			if(result.code == "200"){
				fanYe()
			}else{
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('失败!')
				}
				
			}
		}
	})
}

// 提交按钮
function yiShou(){
	if($(".search-tbody").html() == ''){
		if($('#toast-container').html() == null || $('#toast-container').html() == ''){
			toastr.warning('无验收数据!')
		}
		
		return;
	} 
	
	
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/batchCheckAcceptance",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		dataType: "json",
		contentType:"application/json",
		success: function (data) {
				if(data.code == 200){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.success('成功!')
					}
					
					fanYe()
				}else{
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning(data.msg)
					}
					
				}
		}
	});
}

function fanYe(){
	var dataSourceArr = []
	// 翻页总数据
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/codeScannNumberList",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		data: {
			codeScannList:'',
			page:1,
			rows:10
		},
		dataType:"json",
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		success:function(data) {
			 document.getElementById("bizNo").focus();
			for(var i=0;i<data.total;i++){
			  dataSourceArr.push(i+1)
			}
			
			$('.M-box1').pagination({
				dataSource: dataSourceArr,
				pageSize: 10,
				callback: function(data, pagination) {
					document.getElementById("bizNo").focus();
					numArr = data;
					tableData(pagination.pageNumber,'')
				}
			})
		},
	})
}
function seatchInfo(){
	if($.trim($("#bizNo").val()) == ''){
		if($('#toast-container').html() == null || $('#toast-container').html() == ''){
			toastr.warning('单号不能为空!')
		}
		return;
	}
	var codeScannList = [];
	codeScannList.push($.trim($("#bizNo").val()));
	var  bizNo = $.trim($("#bizNo").val())
	var dataSourceArr=[];
	document.getElementById("bizNo").focus();
	//查询接口
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/codeScannNumberCheck",
		beforeSend: function(request) {
			request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		data: JSON.stringify(codeScannList),
		dataType: "json",
		contentType:"application/json",
		success: function(result){
			if(result){
				if(result.code=='450'){
					if($('#toast-container').html() == null || $('#toast-container').html() == ''){
						toastr.warning('此单号已验收!')
					}
					
					fanYe()
				}else{
					// 翻页总数据
					$.ajax({
						type: "post",
						url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/codeScannNumberList",
						beforeSend: function(request) {
							request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
						},
						data: {
							codeScannList:bizNo,
							page:1,
							rows:10
						},
						dataType:"json",
						contentType:"application/x-www-form-urlencoded; charset=utf-8",
						success:function(data) {
							for(var i=0;i<data.total;i++){
							  dataSourceArr.push(i+1)
							}
							
							$('.M-box1').pagination({
								dataSource: dataSourceArr,
								pageSize: 10,
								callback: function(data, pagination) {
									numArr = data;
									tableData(pagination.pageNumber,bizNo)
								}
							})
						},
					})
					
				}
			}else{
				$('#bizNo').val('')
				if($('#toast-container').html() == null || $('#toast-container').html() == ''){
					toastr.warning('单号不存在!')
				}
				
			}
			
		}
	})
}
$(function(){
	$(".search-tbody").html('')
	
	// 禁止手输
	// var timearr = [0,0];
	// $('#bizNo').keyup(function(e){
	 
	//     if($(this).val().length%2 != 0 ){
	// 		//求余数不为0是奇数
	// 	    	timearr[0] = new Date().getTime();
	//     	}else{
	// 	    	timearr[1] = new Date().getTime();
	// 	}
	// 	    //当输入第二位时判断两次输入的间隔，判断是否为手动输入，间隔过长清空值
	//     if($(this).val().length > 1 && Math.abs(timearr[1] - timearr[0]) > 40){
	// 	   	$(this).val('')
	//      }
	// })
	
	//清空列表接口
	$.ajax({
		type: "post",
		url: pathUrl()+"/spd-sys/admin/spd/spdMedSupsOrder/codeScannCheckClearList",
		beforeSend: function(request) {
		 request.setRequestHeader("PADSESSION", sessionStorage.getItem("PADSESSION"));
		},
		data: JSON.stringify("1"),
		dataType: "json",
		contentType:"application/json",
		success: function(result){
		},
	})
	
	fanYe()
	document.getElementById("bizNo").focus();
	
	// $('#bizNo').change(function(){
		
	// })
	
	toastr.options = {
		"closeButton": false, //是否显示关闭按钮
		"debug": false, //是否使用debug模式
		"positionClass": "toast-center-center",//弹出窗的位置
		"showDuration": "300",//显示的动画时间
		"hideDuration": "1000",//消失的动画时间
		"timeOut": "1000", //展现时间
		"extendedTimeOut": "1000",//加长展示时间
		"showEasing": "swing",//显示时的动画缓冲方式
		"hideEasing": "linear",//消失时的动画缓冲方式
		"showMethod": "fadeIn",//显示时的动画方式
		"hideMethod": "fadeOut" //消失时的动画方式
	};
	
})