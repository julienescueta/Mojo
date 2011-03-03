(function(c,b){var a=function(){};a.controllers={};a.applications={};a.options={};a._loaded=[];a._resolvedNamespace=function(e){return a._namespace._provided[""+e];};a.resolve=function(e){if(!a._namespace._provided[e]){return e.replace(/\./gi,"/");}return false;};a._namespace=function(h){var j=(""+h).split(/\./),l=j.length,k=[],g=window||{};if(!a._namespace._provided){a._namespace._provided={};}if(a._namespace._provided[h]==h){throw new Error(h+" has already been defined.");}for(var f=0;f<l;f+=1){var e=j[f];if(!g[e]){k[f]=e;g[e]=function(){};a._namespace._provided[k.join(".")]=g[e];}g=g[e];}return g;};a.query=function(){return jQuery.apply(this,arguments);};a.queryFirst=function(){return a.query.apply(this,arguments)[0];};a.require=function(h,m){if(!$.isArray(h)){h=[h];}var g=h.length,k=a.options.baseSrc,l=0;for(var f=0;f<g;f++){var j=h[f];var k=a.options.baseSrc+a.resolve(j)+".js";a._loaded.push(h[f]);$.getScript(k,function(){l++;});}var e=setInterval(function(){if(m&&l==g){clearInterval(e);m.call(this);}},25);};a.fetch=function(e,f){$.getScript(e,function(){if(f){f.apply(this,arguments);}});};a.define=function d(){var g=arguments,e=g.length;for(var h=0;h<e;h++){if(typeof g[h]=="function"){g[h]=g[h].call(this);}}var f;if(e>2){f=g[2];}else{if($.isArray(g[0])){a.require(g[0],function(){console.log("Anonymous Module");});}else{if(typeof g[1]=="object"){f=g[1];}}}if(typeof g[0]=="string"){a._namespace(g[0]);a._loaded[""+g[0]]=f;a.controllers[g[0]]=f;}};a.create=function(e){if(typeof e=="undefined"){e={};if(!e.baseSrc){e.baseSrc="js/";}if(!e.mojoSrc){e.mojoSrc="../src";}}$.extend(this.options,e);return new Application();};window.MOJO=a;})(window,document);MOJO.define("Request",["Controller"],function(){function a(e,b,d,c){this.paramsObj=e;this.callerObj=b;this.eventObj=d;this.controllerObj=c;}a.prototype.getController=function(){return this.controllerObj;};a.prototype.getContextElement=function(){return this.getController().getContextElement();};a.prototype.getCaller=function(){return this.callerObj;};a.prototype.getEvent=function(){return this.eventObj;};window.Request=a;return a;});MOJO.define("Controller",["Request"],function(){function a(){this.contextElement=null;this.controllerClass=null;this.events;}a.prototype.onInit=function(){};a.prototype.onParamChange=function(){};a.prototype.initialize=function(c,d,e){var b=this;b.contextElement=c;b.controllerClass=d;b.params=e;$(b.events).each(function(j,i){var g=$(document),l=i[0],f=i[1],h=i[2],k=i[3];if(l=="context"){g=$(c);}$(g).delegate(f,h,function(m){var n=new Request({},this,m,b);if(typeof b.before!="undefined"&&typeof b.before[k]!="undefined"){b.before[k].call(b,n);}b.methods[k].call(b,n);if(typeof b.after!="undefined"&&typeof b.after[k]!="undefined"){b.after[k].call(b,n);}});});b.onInit();};a.prototype.getContextElement=function(){if(!this.contextElement){return null;}return this.contextElement;};a.prototype.param=function(b,c){if(arguments.length>1){this.params[b]=c;this.onParamChange();return this;}else{return this.params[b];}};window.Controller=a;return a;});MOJO.define("Application",["Controller"],function(){function a(){if(!this.options){this.options={};}var b=this,c=b.options;c.locale="en_CA";c.plugins=[];c.pluginSrc="js/lib/plugins/";c.environment="dev";c.selector=jQuery||(function(){throw new Error("Unable to find jQuery");})();b.siteMap=[];}a.prototype.onComplete=function(){};a.prototype.configure=function(b,d){if(arguments.length>1){this.options[b]=d;try{console.info("Configure: ",b," -> ",d);}catch(c){}return this;}else{return this.options[b];}};a.prototype.map=function(b,e){var c=this;var d=$(b);d.each(function(f,g){c.siteMap.push({context:g,init:e});});e.call(this,c);return this;};a.prototype.heal=function(){return this;};a.prototype.setupController=function(c,b,g){var e=$(c);var d=MOJO.controllers[b],f=new Controller(),d=$.extend(d,f);MOJO.controllers[b]=d;if(typeof d=="undefined"){throw new Error("Undefined Controller @ ",b);}d.initialize(c,b,g);if(typeof d.after!="undefined"&&d.after.Start!="undefined"){d.after.Start.call(d,null);}};a.prototype.disconnectControllers=function(c){var b=this;$(b.siteMap).each(function(d,e){$(e.context).unbind().undelegate();});c.apply(b);};a.prototype.connectControllers=function(){var b=this,c=[];$(b.siteMap).each(function(e,d){var f=d.init.call(this);$(f).each(function(g,h){if(!MOJO._loaded.length||$.inArray(h.controller,MOJO._loaded)==-1){c.push(h.controller);}else{MOJO._loaded.push(h.controller);}});});MOJO.require($.unique(c),function(){$(b.siteMap).each(function(e,d){if(b.options.environment=="dev"){try{console.log("Mapping: ",d.context);}catch(g){}}var f=d.init.call(this);$(f).each(function(h,j){b.setupController(d.context,j.controller,j.params);});});});};a.prototype.on=function(b,c){return function(){};};a.prototype.getPlugins=function(d){var b=this,c=b.options.pluginSrc;$(b.options.plugins).each(function(e,f){MOJO.fetch(c+f+".js");});d.call(b);};a.prototype.start=function(){var b=this;$(document).ready(function(){b.disconnectControllers(function(){if(b.options.plugins.length){b.getPlugins(function(){b.connectControllers();});}else{b.connectControllers();}b.onComplete();});});};window.Application=a;return a;});MOJO.define("Service",[],function(){function a(c,d,b){if(typeof b=="undefined"){b={};}var e={method:b.method||function(){var f="get";if(c.match(/^get/i)){f="get";}else{if(c.match(/^add|del|update/i)){f="post";}}return f;}(),template:false};this.name=c;this.uri=d;this.options=$.extend({},e,b);}a.prototype.invoke=function(g,i,e){var b=this;var d=this.getOptions()||{},h=d.method,f=b.getURI(),c=d.responseType||"JSON";if(d.template){f=$.tmpl(f,g);g=null;}$.ajaxSetup({dataTypeString:c,type:h,cache:d.cache||"false",contentType:"application/json; charset=utf-8"});$.ajax({url:f,data:g}).success(function(j){if(c=="JSON"){j=$.parseJSON(j);}if(typeof i=="function"){i.call(e,null,j);}else{e[i](null,j);}}).error(function(){i.call(e,"Unable to execute XHR",arguments);});};a.prototype.getName=function(){return this.name;};a.prototype.getURI=function(){return this.uri;};a.prototype.getOptions=function(){return this.options;};a.prototype.option=function(){if(arguments.length>1){this.options[arguments[0]]=arguments[1];}else{return this.options[arguments[0]];}};window.Service=a;return a;});MOJO.define("ServiceLocator",[],function(){var a={services:{},addService:function(b){this.services[b.name]=b;return this;},getService:function(b){return this.services[b];},removeService:function(b){delete this.services[b];},removeServices:function(){this.services={};}};window.ServiceLocator=a;return a;});/* 
 * @class   Login Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.LoginController', {
  events: [
      ['context', '.btn-login', 'click', 'Login']
    , ['context', '.btn-logout', 'click', 'Logout']
    , ['context', '.btn-ajax-test', '', 'LoginServiceCall']
    
  ],
  methods: {
    Login: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("Logged in from " + this.controllerClass);
    },
    Logout: function(requestObj) {
      alert("Logged out from " + this.controllerClass);
    }
  },
  before: {
    Login: function() {
      console.log("[intercept] Before Login");
    }
  },
  after: {
    Start: function() {
      //Initialization
    },
    Login: function() {
      console.log("[intercept] After Login");
    }
  }
});/* 
 * @class   Registration Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.RegistrationController', {
  events: [
      ['context', '.btn-submit-registration', 'click', 'Register']
    , ['dom', '.btn-test-outside', 'click', 'Register']
  ],
  methods: {
    Register: function(requestObj) {
      var context = requestObj.getContextElement();
      alert("REGISTER from " + this.controllerClass);
    }
  }
});/*
 * Small example on how to use jquery plugins inside your
 * controllers
 *  
 * @class   Gallery Controller
 * @author  Jaime Bueza
 */
MOJO.define('ExampleApp.GalleryController', {
  events: [
  
  ],
  methods: {

  },
  after: {
    Start: function() {
      //initialize!
      $("#mycarousel", this.getContextElement()).jcarousel();
    }
  }
});MOJO.define('ExampleApp.member.ProfileController', {
  events: [
    [ 'context', '.btn-save-profile', 'click', 'Save' ]
  ],
  methods: {
    Save: function(requestObj) {  
      var params = {};
      $("input[type=text], textarea").each(function(i, input) {
        input = $(input);
        params[input.attr('name')] = input.val();
      });
      ServiceLocator.getService('UpdateProfile').invoke(params, function(err, data) {
        console.log("Success!");
        $(".success", this.getContextElement()).show('fast');
      }, this);
    }
  },
  after: {
    Start: function() {
      var self = this;
      $.each(this.params, function(key, value) {
        $("input[name='" + key + "']", self.getContextElement()).val(value);
      });
    }
  }
});