var firstModule=angular.module('sendSMS',[]); 

firstModule.controller('FirstController',function($scope){
	var vm = this; 
	vm.selecteHotel = 'http://j.map.baidu.com/gJsKB';
	vm.hotels = [
		{hotelName:'东方曼哈顿', value:'http://j.map.baidu.com/gJsKB'},
		{hotelName:'名仕苑', value:'http://j.map.baidu.com/xOzV9'},
		{hotelName:'香梅花园', value:'http://j.map.baidu.com/ffsKB'},
		{hotelName:'陆家嘴中央公寓', value:'http://j.map.baidu.com/9usKB'},
		{hotelName:'莱诗邸', value:'http://j.map.baidu.com/bhsKB'}
	];
	vm.isCheckinSms = false;
	vm.reservedTime = moment(new Date()).format('YYYY-MM-DD HH:MM');
	vm.checkOutTime = moment(new Date()).add(3,'days').format('YYYY-MM-DD HH:MM');;
	vm.sendSMS = function(){
		AV.initialize('nra0oIK78C1abdSfPNXP6jK5-gzGzoHsz','naPjzrIDx6Kdj77lE9TJGucM');
		AV.Cloud.requestSmsCode({
		  mobilePhoneNumber: vm.cellphone,
		  template: 'Greeting',
		  name: vm.hotel.hotelName,
		  baidu: vm.selecteHotel
		}).then(function(){
		 //发送成功
		 alert('短信发送成功');
		 vm.reset();
		}, function(err){
		 //发送失败
		 alert(err);
		});
	}

	vm.getHotel = function(){
		vm.hotels.map(function(item){
			if(item.value == vm.selecteHotel)
				vm.hotel = item;
		})

		return vm.hotel.hotelName;
	}

	vm.setisCheckinSms =function(isCheckinSms){
		vm.isCheckinSms = isCheckinSms;
		console.log("set to ",vm.isCheckinSms);
	}

	vm.reset =function(){
		vm.reservedTime = moment(new Date()).format('YYYY-MM-DD HH:MM');
		vm.selecteHotel = 'http://j.map.baidu.com/gJsKB';
		vm.customerName = '';
		vm.cellphone = '';
	}

});