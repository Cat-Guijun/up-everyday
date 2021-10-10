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
    cancel(type) {
        delete this.eventPool[type];
    }
}
let strategy={
    notEmpty:({val,errmsg})=>{
        return ()=>{
			 if(val==='')return errmsg;
        };
    },
    minLength:({val,len,errmsg})=>{
        return ()=>{
            if(val.length<=len) {
                return errmsg;
            }
        };
    },
    correctPwd({val,errmsg}) {
        return ()=>{
            let reg1=/^1(3|0)\d{9}$/;
            if(!reg1.test(val)) {
                return errmsg;
            }
        };
    }
};

class Validator extends MyEvent {
    constructor(el) {
        super();
	    this.formDom=document.querySelector(el);
    }
    add(dom,...rules) {
        //dom是某一个dom,rules他的规则
        let val=this.formDom[dom].value;
        for(let rule of rules) {
            let type=rule.type;
            delete rule.type;
            this.listen(dom,strategy[type]({...rule,val}));
        }
    }
}
let validator=new Validator('form');


validator.formDom.onsubmit=(eve)=>{
    validator.add('username',{type:'notEmpty',errmsg:'不能为空 '},{type:'minLength',errmsg:'长度不够',len:6});
    validator.add('password',{type:'notEmpty',errmsg:'不能为空 '},{type:'minLength',errmsg:'长度不够',len:6},{type:'correctPwd',errmsg:'密码格式不对'});
    let result1=validator.trigger('username');
    let result2=validator.trigger('password');
    console.log(result1);
    console.log(result2);
    validator.cancel('username');
    validator.cancel('password');
    eve.preventDefault();
};