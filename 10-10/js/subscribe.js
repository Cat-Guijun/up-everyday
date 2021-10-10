//模仿像addEventListener('click',function) 这样的发布订阅模式
class MyEvent {
    constructor() {
	   this.eventPool={}; 
    }
    listen(type,func) {
        if(this.eventPool[type]) {
            this.eventPool[type].push(func);
        }else{
            this.eventPool[type]=[func];
        }
    }
    trigger(type,...args) {
        let result=[];
        if(this.eventPool[type]) {
            let events=this.eventPool[type];
            for(let func of events) {
                result.push(func.apply(this,args));
            }
        }
        //按照注册的顺序放回结果
        return result;
    }
}

class SendHouse extends MyEvent {
    constructor() {
	    super();
    }
}

let s1=new SendHouse();
function func1(price,square) {
    console.log(price,square);
}

s1.listen('expensive',func1);

s1.trigger('expensive',100,'200m^2');
