(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e,a,t){e.exports=t.p+"static/media/threetree_90.8428407b.png"},22:function(e,a,t){e.exports=t(34)},29:function(e,a,t){},33:function(e,a,t){},34:function(e,a,t){"use strict";t.r(a);var n=t(9),r=t.n(n),c=t(15),l=t(0),i=t.n(l),o=t(16),s=t(36),u=t(37),m=t(38),d=t(39),p=t(40),f=t(50),E=t(51),h=(t(29),t(18)),x=t.n(h),v=function(e){return i.a.createElement("div",{id:"login"},i.a.createElement(s.a,{"aria-label":"header"},i.a.createElement(u.a,{href:"#",prefix:"FC"},"Watcher")),i.a.createElement(m.a,null,i.a.createElement(d.a,null,i.a.createElement(p.a,{id:"leftBox",sm:{span:4,offset:0},md:{span:4,offset:1},lg:{span:4,offset:2}},i.a.createElement("h1",{className:"bx--type-semibold"},"Sign in to your account"),i.a.createElement(f.a,{id:"email",labelText:"Email"}),i.a.createElement(f.a.PasswordInput,{id:"password",labelText:"Password"}),i.a.createElement(E.a,{size:"small",onClick:e.handler},"Log in")),i.a.createElement(p.a,{id:"rightBox",sm:{span:0},md:{span:2},lg:{span:4}},i.a.createElement("img",{src:x.a,alt:"fractel"})))))},b=t(41),g=t(52),k=t(42),w=t(43),y=t(44),j=t(53),O=t(45),S=t(46),L=t(47),C=t(49),I=t(54),T=t(48),B=(t(33),function(){return i.a.createElement("div",{id:"page"},i.a.createElement(b.a,{render:function(e){var a=e.isSideNavExpanded,t=e.onClickSideNavExpand;return i.a.createElement(i.a.Fragment,null,i.a.createElement(s.a,{"aria-label":"IBM Platform Name"},i.a.createElement(g.a,{"aria-label":"Open menu",isCollapsible:!0,onClick:t,isActive:a}),i.a.createElement(u.a,{href:"#",prefix:"FC"},"Watcher"),i.a.createElement(k.a,{"aria-label":"FC Watcher"},i.a.createElement(w.a,{href:"#"},"Link 1"),i.a.createElement(w.a,{href:"#"},"Link 2"),i.a.createElement(y.a,{"aria-label":"Link 3",menuLinkName:"Link 3"},i.a.createElement(w.a,{href:"#one"},"Sub-link 1"),i.a.createElement(w.a,{href:"#two"},"Sub-link 2"),i.a.createElement(w.a,{href:"#three"},"Sub-link 3"))),i.a.createElement(j.a,null,"Welcome"),i.a.createElement(O.a,{"aria-label":"Side navigation",isRail:!0,expanded:a},i.a.createElement(S.a,null,i.a.createElement(L.a,{renderIcon:T.a,title:"Category title"},i.a.createElement(C.a,{"aria-current":"page",href:"javascript:void(0)"},"Link"),i.a.createElement(C.a,{href:"javascript:void(0)"},"Link"),i.a.createElement(C.a,{href:"javascript:void(0)"},"Link")),i.a.createElement(I.a,{"aria-current":"page",renderIcon:T.a,href:"javascript:void(0)"},"Link"),i.a.createElement(I.a,{renderIcon:T.a,href:"javascript:void(0)"},"Link")))))}}))}),N="https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod",J=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a={credentials:"include"},e.next=3,fetch("".concat(N,"/user"),a);case 3:return t=e.sent,e.next=6,t.text();case 6:return n=e.sent,e.abrupt("return",JSON.parse(n));case 8:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),P=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n,c,l,s,u;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return document.getElementById("email").value,document.getElementById("password").value,"felixchen1998@gmail.com","dude",a={email:"felixchen1998@gmail.com",password:"dude"},t={method:"POST",credentials:"include",body:JSON.stringify(a),headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=8,fetch("".concat(N,"/login"),t);case 8:return n=e.sent,e.next=11,n.text();case 11:if(c=e.sent,l=JSON.parse(c),s=l.success,l.accessToken,l.accessTokenExpiry,l.refreshTokenExpiry,l.refreshToken,console.log(c),s){e.next=18;break}alert("Bad Login"),e.next=23;break;case 18:return e.next=20,J();case 20:u=e.sent,console.log(u),Object(o.render)(i.a.createElement(B,null),document.getElementById("root"));case 23:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();if(function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n,c,l;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=3,fetch("".concat(N,"/refresh"),a);case 3:return t=e.sent,e.next=6,t.text();case 6:return n=e.sent,c=JSON.parse(n),l=c.success,e.abrupt("return",l);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()()){var F=J();console.log(F),Object(o.render)(i.a.createElement(B,null),document.getElementById("root"))}else Object(o.render)(i.a.createElement(v,{handler:P}),document.getElementById("root"))}},[[22,1,2]]]);
//# sourceMappingURL=main.6354d45e.chunk.js.map