var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'YanXuan');

db.on('error', function() {
	console.log("error")
});
db.once('open', function() {

	console.log("shopping connected");
	var cartSchema = new mongoose.Schema({
		userID: String,
		goodsList: Array
	});

	cartModel = db.model("carts", cartSchema);
	addCart();
	var orderSchema = new mongoose.Schema({
		orderID: String,
		userID: String,
		goodsList: Array,
		expressNumber: Number,
		expressCompany: String,
		address: Array,
		orderState: Number,
		payID: String,
		totalFee: Number
	});

	orderModel = db.model("orders", orderSchema);

	var commentSchema = new mongoose.Schema({
		goodsID: Number,
		userID: String,
		content: String,
		picture: Array,
		commentDate: String,
		type: String
	});
	commentModel = db.model("comments", commentSchema);
	addComment();
})

function addOrder() {
	var orderEntity = ({
		orderID: "14234",
		userID: "1",
		goodsList: [{
			ID: "123",
			number: 1,
			type: "Asd"
		}],
		expressNumber: 123123,
		expressCompany: "saddas",
		address: ['asd'],
		orderState: 0,
		payID: "Asfasf",
		totalFee: 13
	})
	orderEntity.save();
}

function addCart() {
	var arr = [];
	for(var i = 0; i < 5; i++) {
		var obj = {
			ID: i,
			type: "1",
			number: 1
		}
		arr.push(obj);
	}
	var cartEntity = new cartModel({
		userID: 0,
		goodsList: arr
	});
	cartEntity.save();

}
//function addOrder(){
//	
//}
//function CH

function addComment() {
	var commentEntity = new commentModel({
		goodsID: 1,
		userID: "1",
		content: "物超所值，对于不愿弯腰干活的人拖把真的是福音啊，简单易操作。",
		picture: ["/static/img/commentImage/0/1/1.jpg"],
		commentDate: new Date().getTime(),
		type: "1套装 伸缩杆懒人拖把+懒人抹布 4卷装+40片装 地板清洁湿巾 3包装"
	})
	commentEntity.save();
}

function getCart(userID, cb) {
	cartModel.findOne({
		userID: userID
	}, function(err, docs) {
		if(docs) {
			cb("success", docs.goodsList);
		} else {
			cb("err", "");
		}

	})
}

function addToCart(obj, cb) {
	cartModel.findOne({
		userID: obj.userID
	}, function(err, docs) {
		if(docs) {
			var i;
			for(i = 0; i < docs.goodsList.length; i++) {
				if(docs.goodsList[i].ID == obj.ID && docs.goodsList[i].type == obj.type) {
					break;
				}
			}

			if(i == docs.goodsList.length) {
				console.log(1);
				var newobj = {
					ID: obj.ID,
					type: obj.type,
					number: obj.number
				}
				docs.goodsList.push(newobj);
				docs.markModified('goodsList');
				docs.save();
				cb("success", docs.goodsList);
			} else {
				console.log(2);
				docs.goodsList[i].number += parseInt(obj.number);
				docs.save();
				cb("success", docs.goodsList);
			}
		} else {
			console.log(obj)
			console.log(3);
			var newobj = {
				ID: obj.ID,
				type: obj.type,
				number: obj.number
			}
			var arr = [];
			arr.push(newobj);
			console.log(obj.userID);
			var cartEntity = new cartModel({
				userID: obj.userID,
				goodsList: arr
			});
			cartEntity.save();
			cb("success", arr);
		}

	})
}

function deleteItemFromCart(userID, goodsID, cb) {
	cartModel.findOne({
		userID: userID
	}, function(err, docs) {
		if(docs) {
			var arr = docs.goodsList;
			var i = 0;
			for(i = 0; i < arr.length; i++) {
				if(arr[i].ID == goodsID) {
					break;
				}
			}
			if(i == arr.length) {
				cb("error", "");
			} else {
				arr.splice(i, 1);
				docs.save();
				cb("success", arr);
			}
		} else {
			cb("error", "");
		}

	})
}

function changeItemInCart(userID, goodsID, type, number, cb) {
	cartModel.findOne({
		userID: userID
	}, function(err, docs) {
		var arr = docs.goodsList;
		var i = 0;
		for(i = 0; i < arr.length; i++) {
			if(arr[i].ID == goodsID && arr[i].type == type) {
				break;
			}
		}
		if(i == arr.length) {
			cb("error", "");
		} else {
			arr[i].number = parseInt(number);
			docs.save();
			cb("success", arr);
		}

	})
}

function changeCartList(userID, cartList,cb) {
	console.log(userID);
	cartModel.findOne({
		userID: parseInt(userID)
	}, function(err, docs) {
		console.log(docs)
		if(docs) {
			docs.goodsList = cartList;
			docs.markModified('goodsList');
			docs.save();
			cb("success", "")
		} else {
			cb("error", "")
		}

	})
}

function makeOrder(obj, cb) {
	var i;
	for(i = 0; i < obj.goodsList.length; i++) {
		var newobj = obj.goodsList[i];
		goodsModel.findByID(newobj.ID, function(err, docs) {
			var goods = docs[0];
			var j;
			for(j = 0; j < goods.type.length; j++) {
				if(obj.type == goods.type[j]) {
					break;
				}
			}
			if(goods.inventory[j] > 0) {
				goods.inventory[j] -= 1;
				goods.sale += 1;
				docs.markModified('inventory');
				docs.save();
			} else {
				break;
			}
		})
	}
	if(i < obj.goodsList.length) { //有些商品库存不够，返回错误
		for(var k = 0; k < i; k++) {
			var newobj = obj.goodsList[i];
			goodsModel.findByID(newobj.ID, function(err, docs) {
				var goods = docs[0];
				var j;
				for(j = 0; j < goods.type.length; j++) {
					if(obj.type == goods.type[j]) {
						break;
					}
				}
				goods.inventory[j] += 1;
				goods.sale -= 1;
				docs.markModified('inventory');
				docs.save();
			})
		}
		cb("error", obj.goodsList[i].ID);
	} else {
		var order = new Date().getTime() + obj.userID;
		var orderEntity = new orderModel({
			orderID: order,
			userID: obj.userID,
			goodsList: obj.goodsList,
			expressNumber: 0,
			expressCompany: "",
			address: obj.address,
			orderState: 0,
			payID: "0",
			totalFee: obj.totalFee
		})
		orderEntity.save();
		cb("success", order);
	}
}

function getOrder(orderid, cb) {
	orderModel.find({
		orderID: orderid
	}, cb);

}

function pay(orderid, payid, cb) {
	orderModel.find({
		orderID: orderid
	}, function(err, docs) {
		var obj = docs[0];
		obj.payID = payid;
		obj.orderState = 1;
		docs.save();
		cb("success", "");
	})
}

function deliverGoods(orderid, expressCompany, expressNumber, cb) {
	orderModel.find({
		orderID: orderid
	}, function(err, docs) {
		var obj = docs[0];
		obj.expressCompany = expressCompany;
		obj.expressNumber = expressNumber;
		obj.orderState = 2;
		docs.save();
		cb("success", "");
	})
}

function deliverComment(obj, cb) {
	orderModel.find({
		orderID: obj.orderID
	}, function(err, docs) {
		docs[0].orderState = 4;
		docs.save();
		var commentEntity = new commentModel({
			goodsID: obj.goodsID,
			userID: obj.userID,
			content: obj.content,
			picture: obj.picture,
			commentDate: obj.commentDate,
			type: obj.type
		})
		commentEntity.save();
		cb("success", "");
	})
}

function confirmGoods(orderid, cb) {
	orderModel.find({
		orderID: orderid
	}, function(err, docs) {
		var obj = docs[0];
		obj.orderState = 3;
		obj.save();
		cb("success", "");
	})
}

module.exports.getCart = getCart;
module.exports.addToCart = addToCart;
module.exports.deleteItemFromCart = deleteItemFromCart;
module.exports.makeOrder = makeOrder;
module.exports.changeItemInCart = changeItemInCart;
module.exports.changeCartList = changeCartList;
module.exports.getOrder = getOrder;
module.exports.pay = pay;
module.exports.deliverGoods = deliverGoods;
module.exports.confirmGoods = confirmGoods;
module.exports.deliverComment = deliverComment;