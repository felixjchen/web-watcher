(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{20:function(e,a,t){e.exports=t.p+"static/media/threetree_90.8428407b.png"},22:function(e,a,t){e.exports=t(34)},29:function(e,a,t){},33:function(e,a,t){},34:function(e,a,t){"use strict";t.r(a);var n=t(8),r=t.n(n),c=t(13),l=t(0),i=t.n(l),s=t(57),o=t(16),u=t(37),m=t(38),d=t(39),p=t(40),f=t(41),E=t(53),x=t(54),b=(t(29),t(20)),h=t.n(b),k=function(e){return i.a.createElement("div",{id:"login"},i.a.createElement(u.a,{"aria-label":"header"},i.a.createElement(m.a,{href:"#",prefix:"Web"},"Watcher")),i.a.createElement(d.a,null,i.a.createElement(p.a,null,i.a.createElement(f.a,{id:"leftBox",sm:{span:4,offset:0},md:{span:4,offset:1},lg:{span:4,offset:2}},i.a.createElement("h1",{className:"bx--type-semibold"},"Sign in to your account"),i.a.createElement(E.a,{id:"email",labelText:"Email"}),i.a.createElement(E.a.PasswordInput,{id:"password",labelText:"Password"}),i.a.createElement(x.a,{size:"small",onClick:e.handler},"Log in")),i.a.createElement(f.a,{id:"rightBox",sm:{span:0},md:{span:2},lg:{span:4}},i.a.createElement("img",{src:h.a,alt:"fractel"})))))},g=t(42),v=t(43),w=t(44),y=t(45),O=t(46),S=t(55),L=t(47),T=t(48),j=t(49),I=t(56),C=t(51),N=t(52),B=t(35),J=t(50),P=(t(33),function(e){return i.a.createElement("div",{id:"page"},i.a.createElement(g.a,{render:function(a){var t=a.isSideNavExpanded,n=a.onClickSideNavExpand;return i.a.createElement(i.a.Fragment,null,i.a.createElement(u.a,{"aria-label":"IBM Platform Name"},i.a.createElement(v.a,{"aria-label":"Open menu",isCollapsible:!0,onClick:n,isActive:t}),i.a.createElement(m.a,{prefix:"Web"},"Watcher"),i.a.createElement(w.a,{"aria-label":"FC Watcher"},i.a.createElement(y.a,null,"Link 1"),i.a.createElement(y.a,null,"Link 2"),i.a.createElement(O.a,{"aria-label":"Link 3",menuLinkName:"Link 3"},i.a.createElement(y.a,null,"Sub-link 1"),i.a.createElement(y.a,null,"Sub-link 2"),i.a.createElement(y.a,null,"Sub-link 3"))),i.a.createElement(S.a,null,i.a.createElement(L.a,{"aria-label":"Logout",onClick:e.logoutHandler},i.a.createElement(B.a,null))),i.a.createElement(T.a,{"aria-label":"Side navigation",isRail:!0,expanded:t},i.a.createElement(j.a,null,i.a.createElement(I.a,{"aria-current":"page",renderIcon:J.a},"Link"),i.a.createElement(I.a,{renderIcon:J.a},"Link"),i.a.createElement(C.a,{renderIcon:J.a,title:"Category title"},i.a.createElement(N.a,{"aria-current":"page"},"Link"),i.a.createElement(N.a,null,"Link"),i.a.createElement(N.a,null,"Link"))))))}}))}),W="https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod",z=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n,c,l,i,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return document.getElementById("email").value,document.getElementById("password").value,"felixchen1998@gmail.com","dude",a={email:"felixchen1998@gmail.com",password:"dude"},t={method:"POST",credentials:"include",body:JSON.stringify(a),headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=8,fetch("".concat(W,"/login"),t);case 8:return n=e.sent,e.next=11,n.text();case 11:if(c=e.sent,l=JSON.parse(c),i=l.success,s=l.accessTokenExpiry,console.log(c),i){e.next=18;break}alert("Bad Login"),e.next=21;break;case 18:return e.next=20,H();case 20:setTimeout(A,1e3*(s-2));case 21:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),F=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=3,fetch("".concat(W,"/logout"),a);case 3:return t=e.sent,e.next=6,t.text();case 6:return n=e.sent,Object(o.render)(i.a.createElement(k,{handler:z}),document.getElementById("root")),e.abrupt("return",JSON.parse(n).success);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),H=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a={credentials:"include"},e.next=3,fetch("".concat(W,"/user"),a);case 3:return t=e.sent,e.next=6,t.text();case 6:n=e.sent,console.log(JSON.parse(n)),Object(o.render)(i.a.createElement(P,{logoutHandler:F}),document.getElementById("root"));case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),A=function(){var e=Object(c.a)(r.a.mark(function e(){var a,t,n,c,l,i;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=3,fetch("".concat(W,"/refresh"),a);case 3:return t=e.sent,e.next=6,t.text();case 6:if(n=e.sent,c=JSON.parse(n),l=c.success,i=c.accessTokenExpiry,l){e.next=13;break}return e.next=11,F();case 11:e.next=14;break;case 13:setTimeout(A,1e3*(i-2));case 14:return e.abrupt("return",l);case 15:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),M=function(){var e=Object(c.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,A();case 3:if(!e.sent){e.next=7;break}return e.next=7,H();case 7:e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log("Initial silent refresh fail "+e.t0);case 12:case"end":return e.stop()}},e,null,[[0,9]])}));return function(){return e.apply(this,arguments)}}();Object(o.render)(i.a.createElement(s.a,null),document.getElementById("root")),M()}},[[22,1,2]]]);
//# sourceMappingURL=main.f2a35690.chunk.js.map