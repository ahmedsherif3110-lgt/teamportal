import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  arrayUnion,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaoVVdh18Z2nmVuzVtdgb4_2gKukXS7Hs",
  authDomain: "team-portal2027.firebaseapp.com",
  projectId: "team-portal2027",
  storageBucket: "team-portal2027.firebasestorage.app",
  messagingSenderId: "569191612562",
  appId: "1:569191612562:web:c8167ff705a44c1c40e64b"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const employeeCreatorApp = initializeApp(firebaseConfig, "employeeCreator");
const employeeAuth = getAuth(employeeCreatorApp);
const db = getFirestore(firebaseApp);

// Firebase Cloud Messaging Web Push public key.
// Paste the public key generated in Firebase Console -> Cloud Messaging -> Web Push certificates.
const FCM_VAPID_KEY = "BBPOXRvqCxmyMScSv1202NKq2NRxDGHLgjI61kh3zpd-IFKXhMwwQSiLvu2Nd7MsS65ZeHfRiizO5oa4D2Hdgfo";

const demo = {
  user: { id: "demo-leader", teamId: "demo-team", name: "يحيى زكريا السيد", email: "leader@example.com", role: "leader" },
  requests: [
    {id:1,type:"إجازة سنوية",date:"من 12 إلى 14 سبتمبر 2026",status:"pending",requesterName:"محمد أحمد"},
    {id:2,type:"إذن انصراف",date:"الأربعاء 9 سبتمبر 2026",status:"approved",requesterName:"يحيى زكريا السيد"}
  ],
  members:[{id:1,name:"يحيى زكريا السيد",email:"leader@example.com",role:"leader",active:true}]
};

const defaultInventory=[
 {key:"tissues",name:"مناديل مكتب",category:"الأدوات المكتبية",qty:0},
 {key:"blue_pen",name:"قلم أزرق",category:"الأدوات المكتبية",qty:0},{key:"red_pen",name:"قلم أحمر",category:"الأدوات المكتبية",qty:0},{key:"black_pen",name:"قلم أسود",category:"الأدوات المكتبية",qty:0},{key:"green_pen",name:"قلم أخضر",category:"الأدوات المكتبية",qty:0},{key:"pencil",name:"قلم رصاص",category:"الأدوات المكتبية",qty:0},{key:"highlighter",name:"قلم مظهر",category:"الأدوات المكتبية",qty:0},{key:"erasable_pen",name:"قلم طامس",category:"الأدوات المكتبية",qty:0},{key:"marker",name:"قلم مظلل",category:"الأدوات المكتبية",qty:0},{key:"archive_files",name:"ملفات أرشيف",category:"الأدوات المكتبية",qty:0},{key:"tape",name:"شريط لاصق",category:"الأدوات المكتبية",qty:0},{key:"ruler",name:"مسطرة",category:"الأدوات المكتبية",qty:0},{key:"envelopes",name:"أظرف",category:"الأدوات المكتبية",qty:0},{key:"eraser",name:"ممحاة",category:"الأدوات المكتبية",qty:0},{key:"sharpener",name:"براية أقلام",category:"الأدوات المكتبية",qty:0},{key:"staples",name:"دببابيس دباسة",category:"الأدوات المكتبية",qty:0},{key:"board_pen",name:"قلم صبورة",category:"الأدوات المكتبية",qty:0},{key:"glue",name:"صمغ",category:"الأدوات المكتبية",qty:0},{key:"notebook",name:"نوت بوك",category:"الأدوات المكتبية",qty:0},{key:"qatar",name:"سلاح قطر",category:"الأدوات المكتبية",qty:0},{key:"scissors",name:"مقص",category:"الأدوات المكتبية",qty:0},{key:"notepad",name:"نوت صلاق",category:"الأدوات المكتبية",qty:0},{key:"air_freshener",name:"معطر جو",category:"الأدوات المكتبية",qty:0},{key:"calculator",name:"آلة حاسبة",category:"الأدوات المكتبية",qty:0},
 {key:"review_requests",name:"طلبات المراجعة",category:"الأرشيف",qty:0},{key:"leave_forms",name:"نموذج أجازات وإضافي",category:"الأرشيف",qty:0},{key:"diaper_forms",name:"نموذج صرف حفاضات",category:"الأرشيف",qty:0},{key:"warning_forms",name:"نموذج خطاب لفت نظر",category:"الأرشيف",qty:0},{key:"evaluation_forms",name:"نموذج تقييم",category:"الأرشيف",qty:0},{key:"observer_guide",name:"نموذج دليل المراقب",category:"الأرشيف",qty:0},{key:"penalty_forms",name:"نموذج جزاء",category:"الأرشيف",qty:0},{key:"plastic_files",name:"فيلات بلاستيك",category:"الأرشيف",qty:0},
 {key:"staple_remover",name:"خالعة دبابيس",category:"العهدة",qty:0},{key:"large_batteries",name:"بطاريات كبيرة",category:"العهدة",qty:0},{key:"small_batteries",name:"بطاريات صغيرة",category:"العهدة",qty:0},{key:"screen_remote",name:"ريموت شاشة",category:"العهدة",qty:0},{key:"ac_remote",name:"ريموت تكييف",category:"العهدة",qty:0},{key:"tvs",name:"أجهزة تلفاز",category:"العهدة",qty:0},{key:"mouse",name:"أجهزة تحكم \"فأرة\"",category:"العهدة",qty:0},{key:"recorders",name:"أجهزة تسجيل",category:"العهدة",qty:0},{key:"cameras",name:"كاميرات",category:"العهدة",qty:0},{key:"mobile_phone",name:"هاتف محمول",category:"العهدة",qty:0},{key:"landline",name:"هاتف أرضي",category:"العهدة",qty:0},{key:"desktop",name:"حاسب مكتبي",category:"العهدة",qty:0},{key:"desk",name:"مكتب",category:"العهدة",qty:0},{key:"office_chairs",name:"كراسي مكتب",category:"العهدة",qty:0},{key:"guest_chairs",name:"كراسي ضيافة",category:"العهدة",qty:0},{key:"tissue_box",name:"علبة مناديل",category:"العهدة",qty:0},{key:"wooden_shannon",name:"شانون خشبي",category:"العهدة",qty:0},{key:"company_keys",name:"مفاتيح شركة",category:"العهدة",qty:0},{key:"water_kettle",name:"غلاية مياه",category:"العهدة",qty:0},{key:"coffee_kettle",name:"غلاية قهوة",category:"العهدة",qty:0},{key:"phone_charger",name:"شاحن هاتف",category:"العهدة",qty:0},{key:"paper_holder",name:"حامل أوراق",category:"العهدة",qty:0},{key:"pencil_case",name:"مقلمة",category:"العهدة",qty:0},
 {key:"tea",name:"شاي",category:"البوفيه",qty:0},{key:"green_tea",name:"شاي أخضر",category:"البوفيه",qty:0},{key:"sugar",name:"سكر",category:"البوفيه",qty:0},{key:"anise",name:"ينسون",category:"البوفيه",qty:0}
];
let state={user:null,page:"dashboard",authMode:"login",toast:"",loading:false,data:{requests:[],members:[],announcements:[],notifications:[],teamLeaves:[],inventory:[],config:{}},pendingAccess:false};
let deferredInstallPrompt=null;
let notificationTimer=null;
let notificationInitialized=false;
let lastNotificationIds=new Set();
let notificationUnsubscribe=null;
let inactivityTimer=null;
const IDLE_MS=5*60*1000;
const SESSION_KEY="teamPortalSession";
const app=document.querySelector("#app");
const statusLabel={pending:"قيد المراجعة",approved:"مقبول",rejected:"مرفوض",completed:"مكتمل"};
const DEFAULT_OPERATION_TYPES=[
 {code:"special",label:"طلب خاص"},{code:"all_employees",label:"طلب لجميع الموظفين"},{code:"annual",label:"إجازة — اعتيادي"},{code:"casual",label:"إجازة — عارضة"},{code:"sick",label:"إجازة — مرضي"},{code:"deduct",label:"إجازة — بالخصم"},{code:"leave_allowance",label:"إجازة بدل"},{code:"late",label:"إذن حضور متأخر"},{code:"exit",label:"إذن إنصراف مبكر"},{code:"admin_out",label:"صرف من الشئون الإدارية"},{code:"admin_in",label:"وارد إلى الشئون الإدارية"}
];
function operationTypes(){return Array.isArray(state.data.config?.operationTypes)&&state.data.config.operationTypes.length?state.data.config.operationTypes:DEFAULT_OPERATION_TYPES;}
function operationLabel(code){return operationTypes().find(x=>x.code===code)?.label||DEFAULT_OPERATION_TYPES.find(x=>x.code===code)?.label||code;}
function normalizeInventoryCategory(category){const value=String(category||"").trim();return value==="التموين"?"البوفيه":value;}
function inventoryCategories(){const base=["الأدوات المكتبية","الأرشيف","العهدة","البوفيه"];const extra=(state.data.inventory||[]).map(x=>normalizeInventoryCategory(x.category)).filter(Boolean);return [...new Set([...base,...extra])];}
async function ensureTeamConfig(){
 if(!state.user?.teamId)return;
 const ref=doc(db,"teamConfigs",state.user.teamId);
 const snap=await getDoc(ref);
 if(!snap.exists()){
   await setDoc(ref,{teamId:state.user.teamId,operationTypes:DEFAULT_OPERATION_TYPES,updatedAt:serverTimestamp()});
   state.data.config={operationTypes:DEFAULT_OPERATION_TYPES};
 }else{
   const data=snap.data()||{};
   state.data.config={...data,operationTypes:Array.isArray(data.operationTypes)&&data.operationTypes.length?data.operationTypes:DEFAULT_OPERATION_TYPES};
 }
}
async function saveOperationTypes(types){
 if(state.user?.role!=="leader")return;
 const clean=types.filter(x=>x?.code&&x?.label).map(x=>({code:String(x.code),label:String(x.label)}));
 await setDoc(doc(db,"teamConfigs",state.user.teamId),{teamId:state.user.teamId,operationTypes:clean,updatedAt:serverTimestamp()},{merge:true});
 state.data.config={...state.data.config,operationTypes:clean};
}


function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function initials(name="مستخدم"){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("")||"م"}
function fmtDate(v){try{return new Intl.DateTimeFormat("ar-EG",{day:"numeric",month:"long",year:"numeric"}).format(v?.toDate?v.toDate():new Date(v))}catch{return v||"اليوم"}}
function toast(msg){state.toast=msg;render();setTimeout(()=>{state.toast="";render()},2800)}
function isValidEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function currentUid(){return auth.currentUser?.uid||null}
function monthKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`}
function monthDiff(fromKey,toKey){if(!fromKey||!toKey)return 0;const [fy,fm]=fromKey.split("-").map(Number),[ty,tm]=toKey.split("-").map(Number);return (ty-fy)*12+(tm-fm)}
async function normalizeAllowance(uid,profile){
  const base=Math.max(0,Number(profile.allowedLeaveDays??2.75));
  const current=monthKey();
  let last=profile.allowanceLastMonth||current;
  let balance=profile.allowanceBalance;
  if(balance===undefined||balance===null||Number.isNaN(Number(balance)))balance=base;
  balance=Number(balance);
  const elapsed=Math.max(0,monthDiff(last,current));
  if(elapsed>0){balance+=elapsed*base;last=current;}
  if(last!==current)last=current;
  const patch={allowanceBalance:Math.max(0,balance),allowanceLastMonth:last,allowedLeaveDays:base};
  if(elapsed>0||profile.allowanceBalance===undefined||profile.allowanceLastMonth!==last){
    await updateDoc(doc(db,"users",uid),patch);
    const member=(state.data.members||[]).find(m=>m.userId===uid);
    if(member?.id)await updateDoc(doc(db,"members",member.id),patch);
  }
  return {...profile,...patch};
}

async function saveNativeNotificationToken(token){
  try{
    if(!state.user||!token)return false;
    await setDoc(doc(db,"notificationTokens",`${state.user.id}_android`),{uid:state.user.id,teamId:state.user.teamId,role:state.user.role,token,platform:"android",updatedAt:serverTimestamp()},{merge:true});
    return true;
  }catch(e){console.warn("native FCM token",e);return false;}
}
window.onNativeFcmToken=async function(token){
  if(!token)return false;
  return await saveNativeNotificationToken(token);
};
async function registerNativeNotificationToken(){
  try{
    if(!state.user||!window.AndroidBridge||typeof window.AndroidBridge.getFcmToken!=="function")return false;
    const token=window.AndroidBridge.getFcmToken();
    return await saveNativeNotificationToken(token);
  }catch(e){console.warn("native FCM token",e);return false;}
}
async function registerNotificationToken(ask=false){
  try{
    // داخل تطبيق Android نستخدم FCM الأصلي بدل Web Notification API.
    if(state.user&&window.AndroidBridge&&typeof window.AndroidBridge.getFcmToken==="function"){
      const nativeReady=await registerNativeNotificationToken();
      if(nativeReady)return true;
      return false;
    }
    if(!state.user||!("Notification" in window)||!("serviceWorker" in navigator)){
      alert("المتصفح الحالي لا يدعم إشعارات الموقع.");
      return false;
    }
    let permission=Notification.permission;
    if(permission!=="granted" && ask){
      permission=await Notification.requestPermission();
    }
    if(permission!=="granted"){
      let stateName="";
      try{stateName=(await navigator.permissions.query({name:"notifications"})).state||"";}catch(e){}
      alert("المتصفح ما زال يعتبر الإشعارات غير مسموحة.\n\nالحالة: "+permission+" / "+stateName);
      return;
    }

    if(!FCM_VAPID_KEY || FCM_VAPID_KEY==="PASTE_YOUR_WEB_PUSH_PUBLIC_KEY_HERE"){
      alert("مفتاح Web Push غير موجود في نسخة الموقع.");
      return;
    }

    const registrations=await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(r=>r.unregister()));
    try{
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }catch(e){}
    const registration=await navigator.serviceWorker.register("/firebase-messaging-sw.js?ver=8");
    await navigator.serviceWorker.ready;
    const messaging=getMessaging(firebaseApp);
    const token=await getToken(messaging,{
      serviceWorkerRegistration:registration,
      vapidKey:FCM_VAPID_KEY
    });

    if(!token){
      alert("لم يتم إنشاء رمز الجهاز. حاول مرة أخرى.");
      return;
    }

    await setDoc(
      doc(db,"notificationTokens",state.user.id),
      {
        uid:state.user.id,
        teamId:state.user.teamId,
        role:state.user.role,
        token,
        updatedAt:serverTimestamp()
      },
      {merge:true}
    );

    try{localStorage.setItem("teamPortalFcmToken",token);}catch(e){}
    try{await navigator.clipboard.writeText(token);}catch(e){}

    alert(
      "تم تفعيل الإشعارات بنجاح ✅\n\n" +
      "رمز الجهاز تم حفظه ونسخه تلقائيًا.\n\n" +
      "لو احتجناه للاختبار، هذا هو الرمز:\n\n" + token
    );

    if(!notificationInitialized){
      notificationInitialized=true;
      onMessage(messaging,payload=>{
        const title=payload.notification?.title||payload.data?.title||"إشعار جديد";
        const body=payload.notification?.body||payload.data?.body||"لديك إشعار جديد";
        if(document.visibilityState!=="visible"||Notification.permission==="granted"){
          try{new Notification(title,{body});}catch(e){}
        }
      });
    }
  }catch(e){
    console.error("FCM notification setup error",e);
    alert("حصل خطأ أثناء تفعيل الإشعارات.\n\n" + (e?.message || e));
  }
}

function startNotificationListener(){
  if(notificationUnsubscribe)notificationUnsubscribe();
  if(!state.user)return;
  const uid=state.user.id, role=state.user.role;
  const unsubs=[];
  const cache=new Map();
  const refresh=()=>{
    const rows=Array.from(cache.values()).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    if(notificationInitialized){for(const n of rows){if(!lastNotificationIds.has(n.id)){showBrowserNotification(n.title,n.body);toast(n.title||"إشعار جديد")}}}
    state.data.notifications=rows;
    lastNotificationIds=new Set(rows.map(n=>n.id));
    notificationInitialized=true;
    render();
  };
  try{
    const queries=role==='leader'
      ? [query(collection(db,"notifications"),where("teamId","==",state.user.teamId))]
      : [
          query(collection(db,"notifications"),where("teamId","==",state.user.teamId),where("audience","in",["all","employees"])),
          query(collection(db,"notifications"),where("teamId","==",state.user.teamId),where("audience","==","targeted"),where("targetUserIds","array-contains",uid))
        ];
    queries.forEach(q=>unsubs.push(onSnapshot(q,snap=>{snap.docs.forEach(d=>cache.set(d.id,{id:d.id,...d.data()}));refresh();},e=>console.warn("notification snapshot",e))));
    notificationUnsubscribe=()=>unsubs.forEach(fn=>fn());
  }catch(e){console.warn("notification listener",e)}
}
async function loadNotifications(){
  if(!state.user)return;
  try{
    const uid=state.user.id,role=state.user.role;
    const queries=role==='leader'
      ? [query(collection(db,"notifications"),where("teamId","==",state.user.teamId))]
      : [
          query(collection(db,"notifications"),where("teamId","==",state.user.teamId),where("audience","in",["all","employees"])),
          query(collection(db,"notifications"),where("teamId","==",state.user.teamId),where("audience","==","targeted"),where("targetUserIds","array-contains",uid))
        ];
    const snaps=await Promise.all(queries.map(getDocs));
    const rows=snaps.flatMap(s=>s.docs.map(d=>({id:d.id,...d.data()}))).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    if(notificationInitialized){for(const n of rows){if(!lastNotificationIds.has(n.id)){showBrowserNotification(n.title,n.body)}}}
    state.data.notifications=rows;
    lastNotificationIds=new Set(rows.map(n=>n.id));
    notificationInitialized=true;
  }catch(e){console.warn("load notifications",e)}
}
function showBrowserNotification(title,body){try{if(window.AndroidBridge)return;if("Notification" in window&&Notification.permission==="granted"&&document.visibilityState!=="visible")new Notification(title,{body,icon:"icon-192.png"})}catch(e){}}
async function createNotification(audience,title,body,requestId="",targetUserIds=[]){try{await addDoc(collection(db,"notifications"),{teamId:state.user.teamId,audience,title,body,requestId,targetUserIds,readBy:[],createdAt:serverTimestamp()})}catch(e){console.warn("create notification",e)}}
async function markNotification(id){try{await updateDoc(doc(db,"notifications",id),{readBy:arrayUnion(state.user.id)});await loadNotifications();render()}catch(e){console.warn(e)}}
async function markAllNotifications(){try{const unread=(state.data.notifications||[]).filter(n=>!(n.readBy||[]).includes(state.user.id));for(const n of unread)await updateDoc(doc(db,"notifications",n.id),{readBy:arrayUnion(state.user.id)});await loadNotifications();render()}catch(e){console.warn(e)}}
function notificationPanel(){const rows=state.data.notifications||[],unread=rows.filter(n=>!(n.readBy||[]).includes(state.user.id));return `<div class="card form-card" style="max-width:none;margin:0 0 16px"><div class="section-head"><div><h2>الإشعارات</h2><div class="muted">تنبيهات الطلبات والتوجيهات الخاصة بفريقك.</div></div>${unread.length?`<button class="tiny" data-action="mark-all-notifications">تعليم الكل كمقروء</button>`:""}</div>${rows.slice(0,10).map(n=>`<div class="request" style="${unread.some(x=>x.id===n.id)?"background:#f7fbf9":""}"><div class="rmain"><div class="avatar">🔔</div><div><strong>${escapeHtml(n.title||"إشعار")}</strong><small>${escapeHtml(n.body||"")}</small><small>${n.createdAt?fmtDate(n.createdAt):"الآن"}</small></div></div>${unread.some(x=>x.id===n.id)?`<div class="request-actions"><button class="tiny" data-action="mark-notification" data-id="${n.id}">تم الاطلاع</button></div>`:""}</div>`).join("")||`<div class="empty">لا توجد إشعارات جديدة.</div>`}</div>`}
function teamLeaveBoard(){
  const all=(state.data.teamLeaves||[]);
  const visible=all.filter(r=>r.leaveType&&["annual","annualHalf","casual","casualHalf","sick","replacement","exit","late"].includes(r.leaveType));
  const pendingLeaves=visible.filter(r=>r.status==="pending"&&["annual","annualHalf","casual","casualHalf","sick","replacement"].includes(r.leaveType)).length;
  return `<div class="card form-card" style="max-width:none;margin:0 0 16px">
    <div class="section-head"><div><h2>طلبات أعضاء الفريق ${pendingLeaves?`<span class="badge" style="background:#fff0f0;color:#b42318;margin-inline-start:8px">${pendingLeaves} إجازة جديدة</span>`:""}</h2><div class="muted">تظهر هنا طلبات الإجازات والأذونات الخاصة بباقي أعضاء الفريق، مع نوع الطلب والتاريخ والمدة وحالته.</div></div></div>
    ${visible.slice(0,30).map(r=>{
      const isPermission=["exit","late"].includes(r.leaveType);
      const dateText=r.fromDate?`${escapeHtml(r.fromDate)}${r.toDate&&r.toDate!==r.fromDate?` إلى ${escapeHtml(r.toDate)}`:""}`:"";
      const duration=isPermission?`${Number(r.quantity||0)} ساعة`:`${Number(r.days||0)} يوم`;
      return `<div class="request" style="${r.status==="pending"?"border-inline-start:4px solid #d97706":""}"><div class="rmain"><div class="avatar">${escapeHtml(initials(r.requesterName||"موظف"))}</div><div><strong>${escapeHtml(r.requesterName||"موظف")} — ${escapeHtml(r.type||"طلب")}</strong><small>${dateText}${dateText?" · ":""}${duration}${isPermission&&r.fromTime&&r.toTime?` · من ${escapeHtml(r.fromTime)} إلى ${escapeHtml(r.toTime)}`:""}</small></div></div>${reqPill(r.status)}</div>`;
    }).join("")||`<div class="empty">لا توجد طلبات إجازات أو أذونات للفريق.</div>`}
  </div>`;
}
async function getUserDoc(uid){const snap=await getDoc(doc(db,"users",uid));return snap.exists()?{id:snap.id,...snap.data()}:null}
async function loadData(){
  if(!state.user)return;
  await ensureTeamConfig();
  const aq=query(collection(db,"announcements"),where("teamId","==",state.user.teamId));
  const as=await getDocs(aq);
  state.data.announcements=as.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  await loadNotifications();
  try{
    const iq=query(collection(db,"inventory"),where("teamId","==",state.user.teamId));
    const is=await getDocs(iq);
    const saved=is.docs.map(d=>({id:d.id,...d.data(),category:normalizeInventoryCategory(d.data().category)}));
    const savedByKey=new Map(saved.map(x=>[String(x.id||x.key||''),x]));
    const savedByName=new Map(saved.map(x=>[String(x.name||''),x]));
    state.data.inventory=defaultInventory.map(base=>{
      const savedItem=savedByKey.get(base.key)||savedByName.get(base.name);
      return savedItem?{...base,...savedItem,id:savedItem.id||base.key}:{...base,id:base.key};
    });
    for(const item of saved){
      if(!state.data.inventory.some(x=>String(x.id)===String(item.id))){state.data.inventory.push(item);}
    }
  }catch(e){state.data.inventory=defaultInventory.map(x=>({...x,id:x.key}));}
  if(state.user.role==="leader"){
    const rq=query(collection(db,"requests"),where("teamId","==",state.user.teamId),orderBy("createdAt","desc"));
    const mq=query(collection(db,"members"),where("teamId","==",state.user.teamId),orderBy("createdAt","asc"));
    const [rs,ms]=await Promise.all([getDocs(rq),getDocs(mq)]);
    state.data.requests=rs.docs.map(d=>({id:d.id,...d.data()}));
    // ترحيل العمليات القديمة التي لم يكن لها حقل ظهور: العادية عامة، والطلب الخاص خاص.
    await Promise.all(state.data.requests.filter(r=>!r.visibility).map(r=>updateDoc(doc(db,"requests",r.id),{visibility:r.operationType==="special"?"private":"all"})));
    state.data.requests=state.data.requests.map(r=>({...r,visibility:r.visibility||(r.operationType==="special"?"private":"all")}));
    const rawMembers=ms.docs.map(d=>({id:d.id,...d.data()}));
    state.data.members=await Promise.all(rawMembers.map(async m=>{
      if(m.role==="leader"||!m.userId)return m;
      try{
        const snap=await getDoc(doc(db,"users",m.userId));
        if(!snap.exists())return m;
        const userProfile=await normalizeAllowance(m.userId,{id:m.userId,...snap.data()});
        const merged={...m,...userProfile,id:m.id};
        return merged;
      }catch(e){console.warn("member profile hydration",e);return m;}
    }));
    const ar=query(collection(db,"accessRequests"),where("status","==","pending"),orderBy("createdAt","asc"));
    const ars=await getDocs(ar);
    state.data.accessRequests=ars.docs.map(d=>({id:d.id,...d.data()}));
  }else{
    // الموظف يرى كل العمليات العامة، ويضيف إليها طلباته الخاصة فقط.
    const publicRq=query(collection(db,"requests"),where("teamId","==",state.user.teamId),where("visibility","==","all"));
    const ownRq=query(collection(db,"requests"),where("teamId","==",state.user.teamId),where("requesterId","==",state.user.id),orderBy("createdAt","desc"));
    const [publicRs,ownRs]=await Promise.all([getDocs(publicRq),getDocs(ownRq)]);
    const merged=new Map();
    publicRs.docs.forEach(d=>merged.set(d.id,{id:d.id,...d.data()}));
    ownRs.docs.forEach(d=>merged.set(d.id,{id:d.id,...d.data()}));
    state.data.requests=Array.from(merged.values()).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    state.data.teamLeaves=state.data.requests.filter(r=>["annual","annualHalf","casual","casualHalf","sick","replacement"].includes(r.leaveType)).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    const own=await getUserDoc(state.user.id);
    state.data.members=own?[{id:own.id,...own}]:[];
    if(own)state.user={...state.user,...own};
  }
}

async function hydrateUser(firebaseUser){
  if(!firebaseUser){state.user=null;state.pendingAccess=false;return}
  const profile=await getUserDoc(firebaseUser.uid);
  if(!profile){state.user=null;state.pendingAccess=true;render();return}
  if(profile.active===false){await signOut(auth);state.user=null;toast("تم إيقاف وصول هذا الحساب.");return}
  state.pendingAccess=false;
  state.user={id:firebaseUser.uid,email:firebaseUser.email,...profile};
  state.user=await normalizeAllowance(firebaseUser.uid,state.user);
  await loadData();
  startNotificationListener();
  registerNativeNotificationToken();
  registerNotificationToken(false);
}

function brandMark(){return `<div class="brandmark" aria-label="شعار كاميرا مراقبة"><svg viewBox="0 0 64 48" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 16.5 42 7c3.3-.9 6.6 1 7.5 4.3l2.3 8.1c.6 2.2-.6 4.6-2.8 5.2L16.7 35c-3.3.9-6.6-1-7.5-4.3L7 22.7c-.6-2.2.6-4.6 2.8-5.2Z"/><circle cx="18" cy="25" r="7.5" fill="#2b8b76"/><circle cx="18" cy="25" r="3.5" fill="currentColor"/><path fill="currentColor" d="m46 25 10 3.5v10L46 35zM42 34h7v5h-7z"/></svg></div>`}
function loginView(){
 return `<div class="portal-entry"><div class="entry-shell">
   <div class="entry-brand">${brandMark()}<div><strong>بوابة الخدمات الذاتية</strong><small>إدارة المراقبة بالكاميرات</small></div></div>
   <div class="entry-grid">
    <section class="entry-intro"><span class="eyebrow">بوابة الخدمات الذاتية</span><h1>خدمات الموظف<br><span>وقائد الفريق في مكان واحد.</span></h1><p>اختر نوع الدخول. الموظف يدخل بالكود الوظيفي والرقم السري، وقائد الفريق يدخل بالبريد الإلكتروني وكلمة المرور.</p><div class="entry-points"><div><b>01</b><span>بياناتك الوظيفية</span></div><div><b>02</b><span>أرصدة وإجازات</span></div><div><b>03</b><span>العمليات والشئون الإدارية</span></div></div></section>
    <section class="leader-login card">
      <div class="entry-points" style="margin:0 0 18px">
        <button class="${state.authMode==='employee'?'primary':'outline'}" data-action="switch-auth" data-mode="employee">دخول الموظف</button>
        <button class="${state.authMode==='leader'?'primary':'outline'}" data-action="switch-auth" data-mode="leader">دخول قائد الفريق</button>
      </div>
      ${state.authMode==='employee' ? `
        <div class="login-kicker">دخول الموظف</div><h2>أهلاً بك</h2><p>استخدم الكود الوظيفي والرقم السري المخصصين لك من قائد الفريق.</p>
        <div class="form-row"><label>الكود الوظيفي</label><input id="employeeCodeLogin" class="field" type="text" autocomplete="username" placeholder="مثال: EMP001"></div>
        <div class="form-row"><label>الرقم السري</label><input id="password" class="field" type="password" autocomplete="current-password" placeholder="••••••••"></div>
        <button class="primary wide" data-action="login">دخول الموظف ←</button>
      ` : `
        <div class="login-kicker">صلاحيات كاملة</div><h2>دخول قائد الفريق</h2><p>هذا الدخول مخصص لقائد الفريق لإدارة الموظفين والعمليات والإعدادات والمخزون.</p>
        <div class="form-row"><label>البريد الإلكتروني</label><input id="email" class="field" type="email" autocomplete="username" placeholder="leader@example.com"></div>
        <div class="form-row"><label>كلمة المرور</label><input id="password" class="field" type="password" autocomplete="current-password" placeholder="••••••••"></div>
        <button class="primary wide" data-action="login">دخول قائد الفريق ←</button>
        <button class="text-btn" data-action="forgot">نسيت كلمة المرور؟</button>
      `}
      <div class="entry-note"><span>i</span><div><strong>${state.authMode==='employee'?'دخول الموظف':'دخول قائد الفريق'}</strong><p>${state.authMode==='employee'?'الكود الوظيفي + الرقم السري يفتحان واجهة الموظف فقط بصلاحيات الموظف.':'البريد الإلكتروني + كلمة المرور يفتحان لوحة الإدارة والصلاحيات الكاملة.'}</p></div></div>
    </section>
   </div>
 </div></div>`
}
function pendingView(){return `<div class="portal-entry"><div class="entry-shell"><div class="entry-brand">${brandMark()}<div><strong>بوابة الخدمات الذاتية</strong><small>إدارة المراقبة بالكاميرات</small></div></div><div class="card pending-card"><span class="eyebrow">قيد الاعتماد</span><h1>الحساب يحتاج اعتماد قائد الفريق.</h1><p>هذه الصفحة تخص الحسابات التي تم إنشاؤها ولم يعتمدها قائد الفريق بعد.</p><button class="primary" data-action="logout">تسجيل الخروج</button></div></div></div>`}
function header(){
 const unread=(state.data.notifications||[]).filter(n=>!(n.readBy||[]).includes(state.user.id)).length;
 const unreadInstructions=(state.data.announcements||[]).filter(a=>!(a.seenBy||[]).includes(state.user.id)).length;
 const nav=state.user.role==='leader'
   ? [['dashboard','الرئيسية'],['requests','سجل العمليات'],['new','عملية جديدة'],['profile','بيانات الموظف'],['admin','الشئون الإدارية'],['instructions','تعليمات قائد الفريق'],['settings','الإعدادات']]
   : [['dashboard','الرئيسية'],['new','إضافة عملية جديدة'],['admin','الشئون الإدارية'],['instructions','تعليمات جديدة']];
 return `<header class="topbar"><div class="brand">${brandMark()}<div><strong>بوابة الخدمات الذاتية</strong><small>إدارة المراقبة بالكاميرات</small></div></div><div class="userbar"><div class="usertext"><strong>${escapeHtml(state.user.name||state.user.email)}</strong><span>${state.user.role==='leader'?'قائد الفريق':'الموظف'}</span></div><button class="tiny" data-action="install-app" id="installAppBtn" style="display:none">تثبيت التطبيق</button><button class="tiny" data-action="request-notification-permission">الإشعارات${unread?` <span class="nav-badge">${unread}</span>`:''}</button><button class="logout" data-action="logout">خروج</button></div></header>
 <nav class="main-nav">${nav.map(([id,label])=>`<button class="${state.page===id?'active':''}" data-action="nav" data-page="${id}">${label}${id==='instructions'&&unreadInstructions?` <span class="nav-badge">${unreadInstructions}</span>`:''}</button>`).join('')}</nav>`
}
function infoTile(label,value,sub=''){return `<div class="info-tile"><span>${label}</span><strong>${escapeHtml(value)}</strong>${sub?`<small>${escapeHtml(sub)}</small>`:''}</div>`}
function requestRow(r,leader=false){
 const status=r.status||"pending";
 const type=r.type||((r.operationType==="admin_out")?"صرف من الشئون الإدارية":(r.operationType==="admin_in"?"وارد إلى الشئون الإدارية":(r.leaveType?`إجازة — ${({annual:"اعتيادي",casual:"عارضة",sick:"مرضي",deduct:"بالخصم"}[r.leaveType]||r.leaveType)}`:"عملية جديدة")));
 const date=r.operationType==='leave_allowance'?`يوم الإجازة: ${r.leaveDate||r.fromDate||'—'} · بدل عن يوم: ${r.substituteDate||'—'}`:((r.fromDate&&r.toDate)?`من ${r.fromDate} إلى ${r.toDate}`:(r.fromDate||r.date||"—"));
 const leaveAllowanceDetails=r.operationType==='leave_allowance'?`بدل المواصلات: ${Number(r.transportAllowance||0).toFixed(2)} · بدل الوجبات: ${Number(r.mealAllowance||0).toFixed(2)}`:''; const details=r.operationType==='leave_allowance'?leaveAllowanceDetails:(r.itemName?`${r.itemName}${r.adminQuantity?` · الكمية ${Number(r.adminQuantity)}`:""}`:(r.days?`${Number(r.days)} يوم`:(r.fromTime&&r.toTime?`${r.fromTime} — ${r.toTime}`:(r.details||""))));
 const requester=r.requesterName?`<small class="requester-name">كاتب العملية: ${escapeHtml(r.requesterName)}</small>`:"";
 const actions=leader?`<div class="request-actions">${status==="pending"?`<button class="tiny" data-action="approve" data-id="${r.id}">قبول وتنفيذ</button><button class="tiny danger-btn" data-action="reject" data-id="${r.id}">رفض</button>`:''}<button class="tiny danger-btn" data-action="delete-request" data-id="${r.id}">حذف</button></div>`:"";
 return `<div class="request"><div class="rmain"><div class="avatar">${escapeHtml(initials(r.requesterName||type))}</div><div><strong>${escapeHtml(type)}</strong>${requester}<small>${escapeHtml(date)}</small>${details?`<small>${escapeHtml(details)}</small>`:""}</div></div><div class="request-meta"><span class="pill ${status==="pending"?"pending":(status==="rejected"?"rejected":"approved")}"><i class="status-dot"></i>${escapeHtml(statusLabel[status]||status)}</span>${actions}</div></div>`;
}
function leaveCard(title,total,remaining){return `<div class="balance-card"><span>${title}</span><strong>${Number(remaining||0)}</strong><small>المتبقي من ${Number(total||0)}</small></div>`}
function approvedAllowanceTotals(requests,userId){
 const rows=(requests||[]).filter(r=>r.requesterId===userId&&r.operationType==='leave_allowance'&&r.status==='approved');
 return rows.reduce((acc,r)=>({
   transport:acc.transport+Number(r.transportAllowance||0),
   meal:acc.meal+Number(r.mealAllowance||0),
   count:acc.count+1
 }),{transport:0,meal:0,count:0});
}
function employeeAllowancesPanel(u,requests){
 const a=approvedAllowanceTotals(requests,u.id);
 return `<section class="card allowance-section employee-allowances-panel"><div class="section-head"><div><span class="section-label">البدلات</span><h2>بدلاتي المعتمدة</h2></div><span class="summary-number">${a.count} إجازة بدل</span></div><div class="allowance-grid"><div><span>بدل المواصلات</span><strong>${a.transport.toFixed(2)}</strong><small>إجمالي البدلات المعتمدة</small></div><div><span>بدل الوجبات</span><strong>${a.meal.toFixed(2)}</strong><small>إجمالي البدلات المعتمدة</small></div></div><p class="section-note">تظهر هنا البدلات بعد موافقة قائد الفريق على إجازة البدل.</p></section>`;
}
function leaderAllowancesPanel(members,requests){
 const rows=(members||[]).filter(m=>m.role!=='leader'&&m.active!==false).map(m=>{
   const a=approvedAllowanceTotals(requests,m.userId||m.id);
   return `<div class="allowances-row"><div><strong>${escapeHtml(m.name||'موظف')}</strong><small>${escapeHtml(m.employeeCode||'—')}</small></div><strong>${a.transport.toFixed(2)}</strong><strong>${a.meal.toFixed(2)}</strong><span>${a.count} إجازة بدل</span></div>`;
 }).join('');
 return `<section class="card leader-panel leader-allowances-panel"><div class="section-head"><div><span class="section-label">البدلات</span><h2>بدلات الموظفين المعتمدة</h2></div></div><div class="allowances-table"><div class="allowances-row allowances-head"><span>الموظف</span><span>بدل المواصلات</span><span>بدل الوجبات</span><span>عدد إجازات البدل</span></div>${rows||`<div class="empty">لا توجد بدلات معتمدة حتى الآن.</div>`}</div><p class="section-note">القيم تظهر بعد موافقة قائد الفريق على إجازة البدل، ولا يتم إدخالها من الإعدادات.</p></section>`;
}
function employeeHome(){
 const u=state.user||{}, requests=state.data.requests||[], inv=state.data.inventory||[];
 const total=[u.annualLeave,u.casualLeave,u.sickLeave,u.remainingDeductLeave].reduce((n,x)=>n+Number(x||0),0);
 const remaining=[u.remainingAnnualLeave,u.remainingCasualLeave,u.remainingSickLeave,u.remainingDeductLeave].reduce((n,x)=>n+Number(x||0),0);
 const latest=requests.slice();
 const categories=inventoryCategories();
 return `<section class="employee-page">
   <div class="employee-hero"><div><span class="eyebrow">الصفحة الرئيسية</span><h1>أهلاً ${escapeHtml(u.name||'بك')}</h1><p>كل ما يخص يومك الوظيفي موجود هنا، بدون تعقيد.</p></div><div class="employee-code"><span>الكود الوظيفي</span><strong>${escapeHtml(u.employeeCode||'—')}</strong></div></div>
   <div class="employee-layout">
    <section class="card employee-profile"><div class="section-head"><div><span class="section-label">بيانات الموظف</span><h2>بياناتك الأساسية</h2></div></div><div class="profile-grid">${infoTile('الاسم',u.name||'—')}${infoTile('الكود الوظيفي',u.employeeCode||'—')}${infoTile('تاريخ التعيين',u.hireDate||'—')}${infoTile('هاتف الطوارئ',u.emergencyPhone||'—')}</div></section>
    <section class="card operation-history"><div class="section-head"><div><span class="section-label">المتابعة</span><h2>سجل العمليات وحالتها</h2></div><button class="outline" data-action="nav" data-page="requests">عرض السجل</button></div><div class="history-scroll">${latest.map(r=>requestRow(r,false)).join('')||`<div class="empty">لا توجد عمليات مسجلة حتى الآن.</div>`}</div></section>
    <section class="card leave-section"><div class="section-head"><div><span class="section-label">الإجازات</span><h2>أجازات الموظف الإجمالية</h2></div><span class="summary-number">${total} يوم</span></div><div class="balance-grid">${leaveCard('اعتيادي',u.annualLeave,u.annualLeave)}${leaveCard('عارضة',u.casualLeave,u.casualLeave)}${leaveCard('مرضي',u.sickLeave,u.sickLeave)}${leaveCard('بالخصم',u.remainingDeductLeave,u.remainingDeductLeave)}${leaveCard('إذن حضور متأخر',u.latePermissionBalance||0,u.latePermissionBalance||0)}${leaveCard('إذن إنصراف مبكر',u.earlyExitPermissionBalance||0,u.earlyExitPermissionBalance||0)}</div></section>
    <section class="card leave-section"><div class="section-head"><div><span class="section-label">الرصيد الحالي</span><h2>المتبقي من الأجازات</h2></div><span class="summary-number">${remaining} يوم</span></div><div class="balance-grid">${leaveCard('اعتيادي',u.annualLeave,u.remainingAnnualLeave)}${leaveCard('عارضة',u.casualLeave,u.remainingCasualLeave)}${leaveCard('مرضي',u.sickLeave,u.remainingSickLeave)}${leaveCard('بالخصم',u.remainingDeductLeave,u.remainingDeductLeave)}${leaveCard('إذن حضور متأخر',u.latePermissionBalance||0,u.latePermissionBalance||0)}${leaveCard('إذن إنصراف مبكر',u.earlyExitPermissionBalance||0,u.earlyExitPermissionBalance||0)}</div></section>
    <section class="card allowance-section"><div class="section-head"><div><span class="section-label">المتاح</span><h2>المسموح للاستخدام الشهر</h2></div><div class="month-allowance"><strong>${Number(u.allowanceBalance??u.allowedLeaveDays??0)}</strong><span>يوم</span></div></div><div class="allowance-line"><span>المسموح الشهري</span><b>${Number(u.allowedLeaveDays??0)} يوم</b><span>المتبقي هذا الشهر</span><b>${Number(u.allowanceBalance??0)} يوم</b></div></section>
    
    ${employeeAllowancesPanel(u,requests)}
    ${state.user.role!=="leader"?`<section class="card inventory-section"><div class="section-head"><div><span class="section-label">الشئون الإدارية</span><h2>محتويات الشئون الإدارية</h2></div></div><p class="section-note">اختر القسم لعرض محتوياته. يظهر لكل عنصر الاسم والعدد المتاح فقط.</p><div class="inventory-picker"><label for="employeeInventoryCategory">القسم</label><select id="employeeInventoryCategory" class="field">${categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}</select></div><div id="employeeInventoryList" class="inventory-horizontal-list">${inv.filter(x=>x.category==='الأدوات المكتبية').map(x=>`<div class="inventory-horizontal-item ${Number(x.qty||0)===0?'out':''}"><span>${escapeHtml(x.name)}</span><strong>${Number(x.qty||0)}</strong></div>`).join('')||`<div class="empty">لا توجد عناصر في هذا القسم.</div>`}</div></section>`:``}
   </div>
 </section>`;
}
function dashboard(){
 if(state.user?.role!=='leader')return employeeHome();
 const requests=state.data.requests||[],members=(state.data.members||[]).filter(m=>m.role!=='leader'),pending=requests.filter(r=>r.status==='pending').length,inv=state.data.inventory||[];
 return `<section class="leader-dashboard"><div class="leader-hero"><div><span class="eyebrow">لوحة قائد الفريق</span><h1>إدارة الفريق <span>من مكان واحد.</span></h1><p>الموظفون، العمليات، الإجازات، الشئون الإدارية والمخزون.</p></div><button class="primary" data-action="nav" data-page="settings">فتح الإعدادات ←</button></div>
 <div class="leader-stats"><div class="stat-card"><span>الموظفون</span><strong>${members.length}</strong></div><div class="stat-card"><span>قيد المراجعة</span><strong>${pending}</strong></div><div class="stat-card"><span>إجمالي العمليات</span><strong>${requests.length}</strong></div><div class="stat-card"><span>عناصر نافدة</span><strong>${inv.filter(x=>Number(x.qty||0)===0).length}</strong></div></div>
 <div class="leader-grid"><section class="card leader-panel"><div class="section-head"><div><span class="section-label">المتابعة</span><h2>آخر العمليات</h2></div><button class="outline" data-action="nav" data-page="requests">كل العمليات</button></div>${requests.slice(0,7).map(r=>requestRow(r,true)).join('')||`<div class="empty">لا توجد عمليات.</div>`}</section><section class="card leader-panel"><div class="section-head"><div><span class="section-label">الفريق</span><h2>الموظفون</h2></div><button class="outline" data-action="nav" data-page="settings">إدارة الموظفين</button></div>${members.slice(0,8).map(m=>`<div class="member-row"><div class="avatar">${escapeHtml(initials(m.name||'موظف'))}</div><div><strong>${escapeHtml(m.name||'موظف')}</strong><small>${escapeHtml(m.employeeCode||'—')}</small></div><span class="pill">نشط</span></div>`).join('')||`<div class="empty">لا يوجد موظفون.</div>`}</section></div>${leaderAllowancesPanel(members,requests)}</section>`;
}
function requestsPage(){const rows=state.data.requests||[],leader=state.user.role==='leader';return `<section class="page"><div class="page-title"><span class="eyebrow">سجل العمليات</span><h1>${leader?'عمليات الفريق':'سجل عملياتي'}</h1><p>${leader?'قائد الفريق يستطيع حذف المعاملات القديمة من السجل.':'العملية تبدأ بحالة قيد المراجعة، ويظهر قرار قائد الفريق بعد المراجعة.'}</p></div><div class="card requests">${rows.map(r=>requestRow(r,leader)).join('')||`<div class="empty">لا توجد عمليات.</div>`}</div></section>`}
function newPage(){const isLeader=state.user?.role==="leader";const availableOps=operationTypes().filter(x=>isLeader ? x.code!=="leave_allowance" : x.code!=="casual");const members=(state.data.members||[]).filter(m=>m.role!=="leader"&&m.active!==false);return `<section class="page"><div class="page-title"><span class="eyebrow">إضافة عملية جديدة</span><h1>أرسل <span>طلبك</span></h1><p>اختر نوع العملية، ثم أدخل البيانات المطلوبة. ستظهر فورًا في سجل العمليات.</p></div><div class="card form-card wide-form"><div class="form-row"><label>نوع العملية</label><select id="requestType" class="field"><option value="">اختر نوع العملية</option>${availableOps.map(x=>`<option value="${escapeHtml(x.code)}">${escapeHtml(x.label)}</option>`).join('')} </select><small id="requestTypeHint" class="muted">اختر نوع العملية.</small>${isLeader?`<div id="casualEmployeeWrap" class="form-row" style="display:none"><label>الموظف</label><select id="casualEmployee" class="field"><option value="">اختر الموظف</option>${members.map(m=>`<option value="${escapeHtml(m.id)}">${escapeHtml(m.name||"موظف")} — ${escapeHtml(m.employeeCode||"")}</option>`).join("")}</select></div>`:""}<div id="leaveWarning" class="leave-warning" style="display:none"></div></div><div id="dateFields" class="form-grid"><div class="form-row" id="fromDateWrap"><label id="fromDateLabel">من تاريخ</label><input id="fromDate" class="field" type="date"></div><div class="form-row" id="toDateWrap"><label id="toDateLabel">إلى تاريخ</label><input id="toDate" class="field" type="date"></div></div><div id="leaveAllowanceFields" class="form-grid" style="display:none"><div class="form-row"><label>يوم الإجازة</label><input id="leaveDate" class="field" type="date"></div><div class="form-row"><label>بدل عن يوم</label><input id="substituteDate" class="field" type="date"></div><div class="form-row"><label>بدل المواصلات (يحدده الموظف)</label><input id="leaveTransportAllowance" class="field" type="number" min="0" step="0.01" placeholder="اكتب بدل المواصلات"></div><div class="form-row"><label>بدل الوجبات (يحدده الموظف)</label><input id="leaveMealAllowance" class="field" type="number" min="0" step="0.01" placeholder="اكتب بدل الوجبات"></div></div><div id="timeFields" class="form-grid"><div class="form-row"><label>من الساعة</label><input id="fromTime" class="field" type="time"></div><div class="form-row"><label>إلى الساعة</label><input id="toTime" class="field" type="time"></div></div><div id="adminOptions" style="display:none"><div class="form-grid"><div class="form-row"><label>التصنيف</label><select id="adminCategory" class="field"><option value="">كل التصنيفات</option>${inventoryCategories().map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select></div><div class="form-row"><label>العنصر</label><select id="adminItem" class="field"><option value="">اختر العنصر</option></select><small id="stockHint" class="muted"></small></div></div><div class="form-row"><label>الكمية</label><input id="adminQuantity" class="field" type="number" min="1" value="1"></div></div><div id="specialDetails" class="form-row" style="display:none"><label id="requestDetailsLabel">تفاصيل الطلب</label><textarea id="requestDetails" class="field" placeholder="اكتب التفاصيل"></textarea></div><div id="quantityWrap" class="form-row"><label id="requestQuantityLabel">العدد / مدة الإذن</label><input id="requestQuantity" class="field" type="number" readonly><small id="requestQuantityHint" class="muted"></small></div><button class="primary" data-action="submit-request">إرسال العملية ←</button></div></section>`}
function profile(){return employeeHome()}
function renderEmployeeInventory(category){const inv=state.data.inventory||defaultInventory;const list=document.querySelector('#employeeInventoryList');if(!list)return;const items=inv.filter(x=>x.category===category);list.innerHTML=items.map(x=>`<div class="inventory-horizontal-item ${Number(x.qty||0)===0?'out':''}"><span>${escapeHtml(x.name)}</span><strong>${Number(x.qty||0)}</strong></div>`).join('')||`<div class="empty">لا توجد عناصر في هذا القسم.</div>`;}
function settings(){const members=state.data.members||[],inv=state.data.inventory||defaultInventory;const cats=inventoryCategories();const inventorySettings=cats.map(cat=>`<section class="card settings-card"><div class="section-head"><div><span class="section-label">الشئون الإدارية</span><h2>${cat}</h2></div></div>${inv.filter(x=>x.category===cat).map(x=>`<div class="inventory-admin-row"><div class="admin-item-name"><strong>${escapeHtml(x.name)}</strong></div><div class="admin-stock"><input class="inventory-qty-input" type="number" min="0" inputmode="numeric" placeholder="أدخل العدد" value="" data-inventory-id="${x.id||x.key}"><button class="tiny" data-action="save-inventory" data-id="${x.id||x.key}">حفظ</button><button class="tiny danger-btn" data-action="delete-inventory" data-id="${x.id||x.key}">حذف</button></div></div>`).join('')||`<div class="empty">لا توجد عناصر.</div>`}</section>`).join('');return `<section class="page"><div class="page-title"><span class="eyebrow">قائد الفريق فقط</span><h1>الإعدادات <span>والإدارة</span></h1><p>إدارة الموظفين وأنواع العمليات وإعدادات الفريق.</p></div><div class="settings-stack"><section class="card settings-card"><div class="section-head"><div><span class="section-label">قاعدة الموظفين</span><h2>إضافة وإدارة الموظفين</h2></div></div><div class="settings-form"><input id="memberName" class="field" placeholder="الاسم"><input id="employeeCode" class="field" placeholder="الكود الوظيفي"><input id="employeePassword" class="field" type="password" placeholder="الرقم السري للموظف (6 أحرف على الأقل)"><input id="hireDate" class="field" type="date"><input id="emergencyPhone" class="field" placeholder="هاتف الطوارئ"><input id="allowedLeaveDays" class="field" type="number" step="0.25" placeholder="المسموح للاستخدام الشهر"><input id="annualLeave" class="field" type="number" placeholder="إجمالي اعتيادي"><input id="remainingAnnualLeave" class="field" type="number" placeholder="متبقي اعتيادي"><input id="casualLeave" class="field" type="number" placeholder="إجمالي عارضة"><input id="remainingCasualLeave" class="field" type="number" placeholder="متبقي عارضة"><input id="sickLeave" class="field" type="number" placeholder="إجمالي مرضي"><input id="remainingSickLeave" class="field" type="number" placeholder="متبقي مرضي"><input id="deductLeave" class="field" type="number" placeholder="إجمالي بالخصم"><input id="remainingDeductLeave" class="field" type="number" placeholder="متبقي بالخصم"><input id="latePermissionBalance" class="field" type="number" placeholder="إجمالي إذن حضور متأخر"><input id="remainingLatePermissionBalance" class="field" type="number" placeholder="متبقي إذن حضور متأخر"><input id="earlyExitPermissionBalance" class="field" type="number" placeholder="إجمالي إذن إنصراف مبكر"><input id="remainingEarlyExitPermissionBalance" class="field" type="number" placeholder="متبقي إذن إنصراف مبكر"></div><button class="primary" data-action="add-member">إضافة الموظف +</button>${members.filter(m=>m.role!=='leader').map(m=>`<div class="member-admin-row"><div class="avatar">${escapeHtml(initials(m.name||'موظف'))}</div><div class="member-admin-main"><strong>${escapeHtml(m.name||'موظف')}</strong><small>كود: ${escapeHtml(m.employeeCode||'—')} · اعتيادي ${Number(m.remainingAnnualLeave||0)} · عارضة ${Number(m.remainingCasualLeave||0)} · مرضي ${Number(m.remainingSickLeave||0)}</small></div><div><button class="tiny" data-action="edit-member" data-id="${m.id}">تعديل</button><button class="tiny danger-btn" data-action="remove-member" data-id="${m.id}">حذف</button></div></div>`).join('')}</section><section class="card settings-card"><div class="section-head"><div><span class="section-label">العمليات</span><h2>أنواع العمليات</h2></div></div>${operationTypes().map(x=>`<div class="setting"><div><h3>${escapeHtml(x.label)}</h3><p>يبدأ الطلب بقيد المراجعة، ثم قبول وتنفيذ أو رفض.</p></div><button class="tiny danger-btn" data-action="remove-operation-type" data-code="${escapeHtml(x.code)}">حذف</button></div>`).join('')}<div class="settings-form" style="margin-top:12px"><input id="newOperationLabel" class="field" placeholder="اسم بند العملية الجديد"><button class="primary" data-action="add-operation-type">إضافة بند عملية +</button></div></section>${inventorySettings}<section class="card settings-card"><div class="section-head"><div><span class="section-label">الشئون الإدارية</span><h2>إضافة عنصر جديد</h2></div></div><p class="muted">يمكنك إضافة عنصر أو حذفه من الموقع، وسيظهر التغيير تلقائيًا في التطبيق المتصل بنفس Firebase.</p><button class="primary" data-action="add-inventory">إضافة عنصر +</button></section></div></section>`}
function instructionsPage(){
 const isLeader=state.user?.role==='leader';
 const list=state.data.announcements||[];
 if(isLeader){
   return `<section class="page"><div class="page-title"><span class="eyebrow">قائد الفريق</span><h1>تعليمات <span>قائد الفريق</span></h1><p>أرسل تعليمات جديدة للموظفين وتابع التعليمات المنشورة.</p></div><div class="card form-card"><div class="form-row"><label>عنوان التعليمات</label><input id="announcementTitle" class="field" placeholder="مثال: تعليمات العمل غدًا"></div><div class="form-row"><label>نص التعليمات</label><textarea id="announcementContent" class="field" rows="5" placeholder="اكتب التعليمات التي تريد إرسالها للموظفين"></textarea></div><button class="primary" data-action="create-announcement">إرسال التعليمات ←</button></div><div class="settings-stack">${list.map(a=>`<section class="card announcement-card"><div class="section-head"><div><span class="section-label">تعليمات منشورة</span><h2>${escapeHtml(a.title||'تعليمات')}</h2></div><small>${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleDateString('ar-EG'):''}</small></div><p>${escapeHtml(a.content||'')}</p></section>`).join('')||`<div class="empty">لا توجد تعليمات منشورة حتى الآن.</div>`}</div></section>`;
 }
 const unread=list.filter(a=>!(a.seenBy||[]).includes(state.user.id));
 return `<section class="page"><div class="page-title"><span class="eyebrow">تعليمات جديدة من قائد الفريق</span><h1>تعليمات <span>قائد الفريق</span>${unread.length?` <span class="nav-badge">${unread.length} جديدة</span>`:''}</h1><p>هنا تظهر التعليمات التي يرسلها قائد الفريق للموظفين.</p></div><div class="settings-stack">${list.map(a=>{const isUnread=!(a.seenBy||[]).includes(state.user.id);return `<section class="card announcement-card ${isUnread?'announcement-unread':''}"><div class="section-head"><div><span class="section-label">${isUnread?'تعليمات جديدة':'تعليمات سابقة'}</span><h2>${escapeHtml(a.title||'تعليمات')}</h2></div><div>${isUnread?`<span class="pill">جديدة</span>`:''}<small>${a.createdAt?.seconds?new Date(a.createdAt.seconds*1000).toLocaleDateString('ar-EG'):''}</small></div></div><p>${escapeHtml(a.content||'')}</p>${isUnread?`<button class="tiny" data-action="mark-announcement" data-id="${a.id}">تم الاطلاع</button>`:''}</section>`}).join('')||`<div class="empty">لا توجد تعليمات من قائد الفريق حتى الآن.</div>`}</div></section>`;
}
function adminAffairsPage(){const inv=state.data.inventory||defaultInventory;const cats=inventoryCategories();const rows=cat=>inv.filter(x=>x.category===cat).map(x=>{const qty=Number(x.qty||0);return `<div class="inventory-admin-row"><div class="admin-item-name"><strong>${escapeHtml(x.name)}</strong></div><div class="admin-stock admin-stock-readonly"><strong class="inventory-count ${qty===0?'inventory-count-out':''}">${qty}</strong>${qty===0?'<span class="inventory-warning">تحذير: نفاذ الكمية</span>':''}</div></div>`}).join('')||`<div class="empty">لا توجد عناصر.</div>`;return `<section class="page"><div class="page-title"><span class="eyebrow">الشئون الإدارية</span><h1>الشئون <span>الإدارية</span></h1><p>العناصر والكمية المتوفرة حاليًا. عند وصول أي كمية إلى صفر يظهر تحذير بنفاذ الكمية.</p></div><div class="settings-stack">${cats.map(cat=>`<section class="card settings-card"><div class="section-head"><div><span class="section-label">الشئون الإدارية</span><h2>${cat}</h2></div></div>${rows(cat)}</section>`).join('')}</div></section>`}

function render(){if(state.pendingAccess&&!state.user){app.innerHTML=pendingView();return}if(!state.user){app.innerHTML=loginView();return}if(state.user.role!=='leader'&&['settings','requests','profile'].includes(state.page))state.page='dashboard';let content=state.page==='dashboard'?dashboard():state.page==='requests'?requestsPage():state.page==='new'?newPage():state.page==='profile'?profile():state.page==='admin'?adminAffairsPage():state.page==='instructions'?instructionsPage():settings();app.innerHTML=`<div class="app"><div class="shell">${header()}${content}</div>${state.toast?`<div class="toast">${escapeHtml(state.toast)}</div>`:''}</div>`;const b=document.querySelector('#installAppBtn');if(b)b.style.display=deferredInstallPrompt?'inline-flex':'none'}

function employeeEmailFromCode(code){const normalized=String(code||"").trim().toUpperCase();return `employee.${btoa(unescape(encodeURIComponent(normalized))).replace(/=/g,"").toLowerCase()}@team-portal2027.firebaseapp.com`}
async function login(){
  const password=document.querySelector("#password")?.value||"";
  const raw=(state.authMode==="leader"?document.querySelector("#email")?.value:document.querySelector("#employeeCodeLogin")?.value)?.trim()||"";
  if(!raw||!password){toast(state.authMode==="employee"?"أدخل الكود الوظيفي والرقم السري":"أدخل البريد الإلكتروني وكلمة المرور");return}
  const isEmployee=state.authMode==="employee";
  const email=isEmployee?employeeEmailFromCode(raw):raw.toLowerCase();
  state.loading=true;render();
  try{
    await setPersistence(auth,browserSessionPersistence);
    sessionStorage.setItem(SESSION_KEY,isEmployee?"employee":"leader");
    await signInWithEmailAndPassword(auth,email,password);
  }catch(e){
    sessionStorage.removeItem(SESSION_KEY);
    console.error(e);
    toast(e.code==="auth/invalid-credential"?"الكود أو الرقم السري غير صحيح.":"تعذر تسجيل الدخول. تأكد من البيانات.")
  }
  finally{state.loading=false}
}
async function signup(){const email=document.querySelector("#email")?.value.trim().toLowerCase(),password=document.querySelector("#password")?.value,name=document.querySelector("#name")?.value.trim();if(!isValidEmail(email)||password?.length<6||!name){toast("أدخل الاسم والبريد وكلمة مرور 6 أحرف على الأقل");return}state.loading=true;render();try{const cred=await createUserWithEmailAndPassword(auth,email,password);await addDoc(collection(db,"accessRequests"),{uid:cred.user.uid,email,name,createdAt:serverTimestamp(),status:"pending"});state.pendingAccess=true;await signOut(auth);toast("تم إنشاء الحساب وإرسال طلب الاعتماد")}catch(e){console.error(e);toast(e.code==="auth/email-already-in-use"?"هذا البريد لديه حساب بالفعل.":"تعذر إنشاء الحساب.")}finally{state.loading=false;render()}}
async function forgot(){const email=document.querySelector("#email")?.value.trim().toLowerCase();if(!isValidEmail(email)){toast("اكتب بريدك أولاً");return}try{await sendPasswordResetEmail(auth,email);toast("تم إرسال رسالة إعادة تعيين كلمة المرور إذا كان الحساب موجودًا.")}catch(e){toast("تعذر إرسال رسالة الاستعادة.")}}
async function addMember(){const name=document.querySelector("#memberName")?.value.trim(),employeeCode=document.querySelector("#employeeCode")?.value.trim(),password=document.querySelector("#employeePassword")?.value||"",hireDate=document.querySelector("#hireDate")?.value,emergencyPhone=document.querySelector("#emergencyPhone")?.value.trim();const allowedLeaveDays=Number(document.querySelector("#allowedLeaveDays")?.value||2.75),annualLeaveOpening=Number(document.querySelector("#annualLeaveOpening")?.value||0),deductLeave=Number(document.querySelector("#deductLeave")?.value||0),remainingDeductLeave=Number(document.querySelector("#remainingDeductLeave")?.value||0),annualLeave=Number(document.querySelector("#annualLeave")?.value||0),casualLeave=Number(document.querySelector("#casualLeave")?.value||0),sickLeave=Number(document.querySelector("#sickLeave")?.value||0),remainingAnnualLeave=Number(document.querySelector("#remainingAnnualLeave")?.value||0),remainingCasualLeave=Number(document.querySelector("#remainingCasualLeave")?.value||0),remainingSickLeave=Number(document.querySelector("#remainingSickLeave")?.value||0),latePermissionBalance=Number(document.querySelector("#latePermissionBalance")?.value||0),remainingLatePermissionBalance=Number(document.querySelector("#remainingLatePermissionBalance")?.value||0),earlyExitPermissionBalance=Number(document.querySelector("#earlyExitPermissionBalance")?.value||0),remainingEarlyExitPermissionBalance=Number(document.querySelector("#remainingEarlyExitPermissionBalance")?.value||0);if(!name){toast("اكتب اسم الموظف بالكامل");return}if(!employeeCode){toast("اكتب الكود الوظيفي");return}if(password.length<6){toast("اكتب رقمًا سريًا للموظف لا يقل عن 6 أحرف");return}try{const email=employeeEmailFromCode(employeeCode);const cred=await createUserWithEmailAndPassword(employeeAuth,email,password);const employeeData={email,name,employeeCode,hireDate,emergencyPhone,annualLeaveOpening,annualLeave,casualLeave,sickLeave,deductLeave,remainingAnnualLeave,remainingCasualLeave,remainingSickLeave,remainingDeductLeave,latePermissionBalance,remainingLatePermissionBalance,earlyExitPermissionBalance,remainingEarlyExitPermissionBalance,allowedLeaveDays,allowanceBalance:allowedLeaveDays,allowanceLastMonth:monthKey(),role:"employee",active:true,teamId:state.user.teamId,createdAt:serverTimestamp(),userId:cred.user.uid};const key=`employee-${btoa(unescape(encodeURIComponent(String(employeeCode).trim().toUpperCase()))).replace(/=/g,"")}`;await setDoc(doc(db,"members",key),employeeData,{merge:true});await setDoc(doc(db,"users",cred.user.uid),employeeData);await signOut(employeeAuth);await loadData();render();toast("تمت إضافة الموظف. استخدم الكود الوظيفي والرقم السري الذي أدخلته الموظف عند الدخول.")}catch(e){console.error(e);toast(e.code==="auth/email-already-in-use"?"هذا الكود الوظيفي مستخدم بالفعل.":"تعذر إضافة الموظف. تأكد من صلاحيات Firestore.")}}
async function updateAccessRequest(id,status){try{await updateDoc(doc(db,"accessRequests",id),{status});await loadData();toast(status==="rejected"?"تم رفض الطلب":"تم تحديث الطلب");render()}catch(e){console.error(e);toast("تعذر تحديث الطلب")}}
async function approveAccess(id){const d=await getDoc(doc(db,"accessRequests",id));if(!d.exists())return;const x=d.data();const memberKey=btoa(unescape(encodeURIComponent(x.email))).replace(/=/g,"");await setDoc(doc(db,"members",memberKey),{email:x.email,name:x.name,employeeCode:x.employeeCode||"",hireDate:x.hireDate||"",emergencyPhone:x.emergencyPhone||"",transportAllowance:Number(x.transportAllowance||0),mealAllowance:Number(x.mealAllowance||0),annualLeaveOpening:Number(x.annualLeaveOpening||0),annualLeave:Number(x.annualLeave||0),casualLeave:Number(x.casualLeave||0),sickLeave:Number(x.sickLeave||0),remainingAnnualLeave:Number(x.remainingAnnualLeave||0),remainingCasualLeave:Number(x.remainingCasualLeave||0),remainingSickLeave:Number(x.remainingSickLeave||0),allowedLeaveDays:Number(x.allowedLeaveDays??2.75),allowanceBalance:Number(x.allowanceBalance??x.allowedLeaveDays??2.75),allowanceLastMonth:x.allowanceLastMonth||monthKey(),role:"employee",active:true,teamId:state.user.teamId,userId:x.uid,createdAt:serverTimestamp()},{merge:true});await setDoc(doc(db,"users",x.uid),{email:x.email,name:x.name,employeeCode:x.employeeCode||"",hireDate:x.hireDate||"",emergencyPhone:x.emergencyPhone||"",transportAllowance:Number(x.transportAllowance||0),mealAllowance:Number(x.mealAllowance||0),annualLeaveOpening:Number(x.annualLeaveOpening||0),annualLeave:Number(x.annualLeave||0),casualLeave:Number(x.casualLeave||0),sickLeave:Number(x.sickLeave||0),remainingAnnualLeave:Number(x.remainingAnnualLeave||0),remainingCasualLeave:Number(x.remainingCasualLeave||0),remainingSickLeave:Number(x.remainingSickLeave||0),allowedLeaveDays:Number(x.allowedLeaveDays??2.75),allowanceBalance:Number(x.allowanceBalance??x.allowedLeaveDays??2.75),allowanceLastMonth:x.allowanceLastMonth||monthKey(),role:"employee",teamId:state.user.teamId,active:true,createdAt:serverTimestamp()});await updateDoc(doc(db,"accessRequests",id),{status:"approved",teamId:state.user.teamId});toast("تم اعتماد العضو");render()}
function approvedLeaveDaysInMonth(monthDate){
 const d=new Date(monthDate);
 if(Number.isNaN(d.getTime())) return 0;
 const y=d.getFullYear(),m=d.getMonth(),monthStart=new Date(y,m,1),monthEnd=new Date(y,m+1,0);
 return (state.data.requests||[]).filter(r=>r.requesterId===state.user?.id&&r.status==='approved'&&['annual','casual','sick'].includes(r.leaveType)&&r.fromDate).reduce((sum,r)=>{
   const start=new Date(`${r.fromDate}T00:00:00`),end=new Date(`${(r.toDate||r.fromDate)}T00:00:00`);
   if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime())||end<monthStart||start>monthEnd)return sum;
   const a=start>monthStart?start:monthStart,b=end<monthEnd?end:monthEnd;
   return sum+Math.floor((b-a)/86400000)+1;
 },0);
}
function updateLeaveWarning(){
 const type=document.querySelector('#requestType')?.value,box=document.querySelector('#leaveWarning');
 if(!box)return;
 if(!['annual','casual','sick'].includes(type)){box.style.display='none';box.textContent='';return;}
 const from=document.querySelector('#fromDate')?.value,to=document.querySelector('#toDate')?.value||from;
 if(!from){box.style.display='none';box.textContent='';return;}
 const monthStart=new Date(`${from}T00:00:00`),used=approvedLeaveDaysInMonth(monthStart);
 let selected=0;
 if(to&&to>=from){const start=new Date(`${from}T00:00:00`),end=new Date(`${to}T00:00:00`),endMonth=new Date(start.getFullYear(),start.getMonth()+1,0),b=end<endMonth?end:endMonth;selected=Math.max(0,Math.floor((b-start)/86400000)+1);}
 const projected=used+selected;
 if(used>2){box.style.display='block';box.textContent=`تنبيه: تم استخدام ${used} يوم إجازة من الاعتيادي أو العارضة أو المرضي خلال هذا الشهر، أي أكثر من يومين.`;}
 else if(projected>2){box.style.display='block';box.textContent=`تنبيه: هذه الإجازة ستجعل إجمالي الإجازات المعتمدة من الاعتيادي أو العارضة أو المرضي هذا الشهر ${projected} يوم، أي أكثر من يومين.`;}
 else{box.style.display='none';box.textContent='';}
}
function updateRequestCalculation(){
 const type=document.querySelector('#requestType')?.value,casualEmployeeId=document.querySelector('#casualEmployee')?.value||'',fromDate=document.querySelector('#fromDate')?.value,toDate=document.querySelector('#toDate')?.value,fromTime=document.querySelector('#fromTime')?.value,toTime=document.querySelector('#toTime')?.value;
 const q=document.querySelector('#requestQuantity'), hint=document.querySelector('#requestTypeHint'), admin=document.querySelector('#adminOptions'), special=document.querySelector('#specialDetails'), dateBox=document.querySelector('#dateFields'), timeBox=document.querySelector('#timeFields'), qWrap=document.querySelector('#quantityWrap');
 const leave=['annual','casual','sick','deduct'], leaveAllowance=['leave_allowance'], perms=['late','exit']; const leaveAllowanceBox=document.querySelector('#leaveAllowanceFields'); if(leaveAllowanceBox)leaveAllowanceBox.style.display=leaveAllowance.includes(type)?'grid':'none';
 if(admin)admin.style.display=['admin_out','admin_in'].includes(type)?'block':'none';
 if(special){special.style.display=['special','all_employees'].includes(type)?'block':'none';const detailsLabel=document.querySelector('#requestDetailsLabel');if(detailsLabel)detailsLabel.textContent=type==='all_employees'?'بيانات الطلب':'تفاصيل الطلب';}
 if(dateBox)dateBox.style.display=(leave.includes(type)||perms.includes(type))?'grid':'none';
 const fromWrap=document.querySelector('#fromDateWrap'),toWrap=document.querySelector('#toDateWrap'),fromLabel=document.querySelector('#fromDateLabel'),toLabel=document.querySelector('#toDateLabel');
 if(perms.includes(type)){
   if(fromLabel)fromLabel.textContent='التاريخ';
   if(toWrap)toWrap.style.display='none';
   if(toLabel)toLabel.textContent='';
 }else{
   if(fromLabel)fromLabel.textContent=type==='leave_allowance'?'يوم الإجازة':'من تاريخ';
   if(toWrap)toWrap.style.display=leave.includes(type)?'block':'none';
   if(toLabel)toLabel.textContent='إلى تاريخ';
 }
 if(timeBox)timeBox.style.display=perms.includes(type)?'grid':'none';
 const casualEmployeeWrap=document.querySelector('#casualEmployeeWrap'); if(casualEmployeeWrap)casualEmployeeWrap.style.display=(state.user?.role==='leader'&&type==='casual')?'block':'none';
 const isLeaveAllowance=type==='leave_allowance'; const allowanceBox=document.querySelector('#leaveAllowanceFields'); if(allowanceBox)allowanceBox.style.display=isLeaveAllowance?'grid':'none';
 if(qWrap)qWrap.style.display=(leave.includes(type)||perms.includes(type))?'block':'none'; const qLabel=document.querySelector('#requestQuantityLabel'); if(qLabel)qLabel.textContent=isLeaveAllowance?'بدل عن يوم':leave.includes(type)?'عن يوم':perms.includes(type)?'مدة الإذن بالساعات':'العدد'; if(q)q.readOnly=!isLeaveAllowance;
 if(hint)hint.textContent=type==='admin_out'?'طلب صرف: الرصيد لا يتغير إلا بعد قبول وتنفيذ.':type==='admin_in'?'طلب وارد: الرصيد يزيد عند قبول وتنفيذ العملية.':type==='late'?'إذن حضور متأخر: من الساعة إلى الساعة فقط.':type==='exit'?'إذن إنصراف مبكر: من الساعة إلى الساعة فقط.':isLeaveAllowance?'إجازة بدل: يوم الإجازة + بدل عن يوم + بدل المواصلات + بدل الوجبات.':leave.includes(type)?'حدد تاريخ البداية والنهاية، وسيتم حساب «عن يوم» تلقائيًا.':type==='special'?'طلب خاص: يظهر لصاحب الطلب وقائد الفريق فقط.':type==='all_employees'?'طلب لجميع الموظفين: يظهر لجميع موظفي الفريق وقائد الفريق.':'اختر نوع العملية.';
 let value=(q?.value||'');
 if(leave.includes(type)&&fromDate&&toDate&&toDate>=fromDate)value=String(Math.floor((new Date(toDate)-new Date(fromDate))/86400000)+1);
 if(perms.includes(type)&&fromTime&&toTime){const [fh,fm]=fromTime.split(':').map(Number),[th,tm]=toTime.split(':').map(Number),mins=(th*60+tm)-(fh*60+fm);if(mins>0)value=String(Math.round(mins/60*100)/100)}
 if(q){if(type!==q.dataset.type)q.dataset.type=type; q.value=value;}
 const cat=document.querySelector('#adminCategory'), item=document.querySelector('#adminItem');
 if(cat&&item){const inv=state.data.inventory||defaultInventory;const previous=item.value;const filtered=inv.filter(x=>!cat.value||x.category===cat.value);item.innerHTML='<option value="">اختر العنصر</option>'+filtered.map(x=>`<option value="${escapeHtml(x.id||x.key)}">${escapeHtml(x.name)} — رصيد ${Number(x.qty||0)}</option>`).join('');if(previous&&filtered.some(x=>String(x.id||x.key)===String(previous)))item.value=previous;const selected=inv.find(x=>String(x.id||x.key)===String(item.value));const hintEl=document.querySelector('#stockHint');if(hintEl)hintEl.innerHTML=selected?(Number(selected.qty||0)===0?'<span class="warning">نفاذ هذا العنصر</span>':`الرصيد المتاح: ${Number(selected.qty||0)}`):'';}
 updateLeaveWarning();
}
async function submitRequest(){
 const type=document.querySelector('#requestType')?.value,casualEmployeeId=document.querySelector('#casualEmployee')?.value||'',fromDate=document.querySelector('#fromDate')?.value,toDate=document.querySelector('#toDate')?.value,fromTime=document.querySelector('#fromTime')?.value,toTime=document.querySelector('#toTime')?.value,leaveDate=document.querySelector('#leaveDate')?.value,substituteDate=document.querySelector('#substituteDate')?.value,details=document.querySelector('#requestDetails')?.value.trim()||'',quantity=Number(document.querySelector('#requestQuantity')?.value||0),itemId=document.querySelector('#adminItem')?.value,adminQuantity=Number(document.querySelector('#adminQuantity')?.value||0),transportAllowance=Number(document.querySelector('#leaveTransportAllowance')?.value||0),mealAllowance=Number(document.querySelector('#leaveMealAllowance')?.value||0);
 if(!type){toast('اختر نوع العملية');return}
 if(type==='casual'&&state.user?.role!=='leader'){toast('الإجازة العارضة يضيفها قائد الفريق فقط');return}
 if(type==='leave_allowance'&&state.user?.role==='leader'){toast('إجازة بدل يرسلها الموظف، وقائد الفريق يراجعها ويوافق عليها');return}
 if(type==='casual'&&state.user?.role==='leader'&&!casualEmployeeId){toast('اختر الموظف صاحب الإجازة العارضة');return}
 const leave=['annual','casual','sick','deduct'], leaveAllowance=['leave_allowance'], perms=['late','exit'];
 if(leave.includes(type)&&(!fromDate||!toDate||toDate<fromDate)){toast('حدد تاريخ البداية والنهاية');return}
 if(leaveAllowance.includes(type)&&(!leaveDate||!substituteDate)){toast('حدد تاريخ يوم الإجازة وتاريخ بدل عن يوم');return}
 if(leaveAllowance.includes(type)&&(!Number.isFinite(transportAllowance)||transportAllowance<0)){toast('أدخل قيمة بدل المواصلات');return}
 if(leaveAllowance.includes(type)&&(!Number.isFinite(mealAllowance)||mealAllowance<0)){toast('أدخل قيمة بدل الوجبات');return}
 if(perms.includes(type)&&(!fromDate||!fromTime||!toTime)){toast('حدد التاريخ ووقت البداية والنهاية');return}
 if(perms.includes(type)&&(quantity<1||quantity>24)){toast('مدة الإذن يجب أن تكون أكبر من صفر ولا تتجاوز 24 ساعة');return}
 if(leave.includes(type)&&quantity<=0){toast('يجب تحديد التواريخ ليتم حساب الأيام');return}
 if(['admin_out','admin_in'].includes(type)&&(!itemId||adminQuantity<1)){toast('اختر العنصر والكمية');return}
 const inv=(state.data.inventory||[]).find(x=>String(x.id||x.key)===String(itemId));
 if(type==='admin_out'&&inv&&Number(inv.qty||0)<adminQuantity){toast(`لا يمكن إرسال العملية: المتاح من ${inv.name} هو ${Number(inv.qty||0)} فقط`);return}
 const typeNames={annual:'إجازة — اعتيادي',casual:'إجازة — عارضة',sick:'إجازة — مرضي',deduct:'إجازة — بالخصم',leave_allowance:'إجازة بدل',late:'إذن حضور متأخر',exit:'إذن إنصراف مبكر',special:'طلب خاص',all_employees:'طلب لجميع الموظفين',admin_out:'صرف من الشئون الإدارية',admin_in:'وارد إلى الشئون الإدارية'};
 const days=leave.includes(type)?Math.floor((new Date(toDate)-new Date(fromDate))/86400000)+1:(leaveAllowance.includes(type)?1:0);
 const casualTarget=type==='casual'?(state.data.members||[]).find(m=>String(m.id)===String(casualEmployeeId)):null;
 const requesterId=casualTarget?.userId||state.user.id; const requesterName=casualTarget?.name||state.user.name; const requesterEmail=casualTarget?.email||state.user.email;
 try{
  const visibility=type==='special'?'private':'all';
  const effectiveToDate=leaveAllowance.includes(type)?(leaveDate||''):(perms.includes(type)?(fromDate||''):(toDate||''));
  const ref=await addDoc(collection(db,'requests'),{teamId:state.user.teamId,requesterId,requesterName,requesterEmail,type:typeNames[type],operationType:type,visibility,leaveType:type,fromDate:fromDate||'',toDate:effectiveToDate,leaveDate:leaveAllowance.includes(type)?(leaveDate||''):'',substituteDate:leaveAllowance.includes(type)?(substituteDate||''):'',fromTime:fromTime||'',toTime:toTime||'',days,quantity:perms.includes(type)?quantity:(leaveAllowance.includes(type)?quantity:days),dayAllowance:leaveAllowance.includes(type)?quantity:0,details:['special','all_employees'].includes(type)?details:'',itemId:itemId||'',itemName:inv?.name||'',category:inv?.category||'',adminQuantity:['admin_out','admin_in'].includes(type)?adminQuantity:0,transportAllowance:leaveAllowance.includes(type)?transportAllowance:0,mealAllowance:leaveAllowance.includes(type)?mealAllowance:0,status:'pending',createdAt:serverTimestamp()});
  const requestTitle=type==='special'?'طلب خاص جديد':'عملية جديدة قيد المراجعة';
  const requestBody=`${requesterName||'موظف'} أرسل ${typeNames[type]||operationLabel(type)}${inv?` — ${inv.name} × ${adminQuantity}`:''}`;
  if(type==='casual'&&state.user?.role==='leader'){}
  else if(type==='special') await createNotification('leader',requestTitle,requestBody,ref.id);
  else await createNotification('all',requestTitle,requestBody,ref.id);
  await loadData();state.page='requests';toast('تم إرسال العملية — قيد المراجعة');render();
 }catch(e){console.error(e);toast('حدث خطأ أثناء إرسال العملية')}
}
async function applyApprovedLeave(r){
  if(!["annual","casual","sick","deduct"].includes(r.leaveType)||!r.days)return;
  const baseType=r.leaveType;
  const field=baseType==="annual"?"remainingAnnualLeave":baseType==="casual"?"remainingCasualLeave":baseType==="sick"?"remainingSickLeave":"remainingDeductLeave";
  const userSnap=await getDoc(doc(db,"users",r.requesterId));
  if(!userSnap.exists())throw new Error("user-not-found");
  const raw=userSnap.data();
  const u=await normalizeAllowance(r.requesterId,{id:r.requesterId,...raw});
  const remaining=Number(u[field]||0),days=Number(r.days||0);
  if(remaining<days)throw new Error("insufficient-balance");
  const allowance=Number(u.allowanceBalance??u.allowedLeaveDays??2.75);
  if(allowance<days)throw new Error("monthly-allowance-exhausted");
  const usedField=baseType==="annual"?"usedAnnualLeave":baseType==="casual"?"usedCasualLeave":"usedSickLeave";
  const patch={[field]:remaining-days,[usedField]:Number(u[usedField]||0)+days,allowanceBalance:allowance-days,allowanceLastMonth:u.allowanceLastMonth||monthKey(),allowanceUpdatedAt:serverTimestamp()};
  await updateDoc(doc(db,"users",r.requesterId),patch);
  const m=state.data.members.find(x=>x.userId===r.requesterId);
  if(m?.id)await updateDoc(doc(db,"members",m.id),patch);
}
async function updateRequest(id,status){
 try{
  const snap=await getDoc(doc(db,'requests',id));if(!snap.exists())return;const r={id,...snap.data()};
  if(status==='approved'&&r.status!=='approved'){
   if(['annual','casual','sick','deduct'].includes(r.leaveType)) await applyApprovedLeave(r);
   if(['admin_out','admin_in'].includes(r.operationType)){
    const item=state.data.inventory.find(x=>String(x.id||x.key)===String(r.itemId));
    if(!item)throw new Error('inventory-not-found');
    const qty=Number(r.adminQuantity||0), current=Number(item.qty||0), next=r.operationType==='admin_out'?current-qty:current+qty;
    if(next<0)throw new Error('out-of-stock');
    const docId=item.id||item.key;await setDoc(doc(db,'inventory',docId),{name:item.name,category:item.category,qty:next,teamId:state.user.teamId,updatedAt:serverTimestamp()},{merge:true});
   }
  }
  await updateDoc(doc(db,'requests',id),{status,reviewedBy:state.user.id,reviewedAt:serverTimestamp(),executedAt:status==='approved'?serverTimestamp():null});
  await loadData();
  const statusTitle=status==='approved'?'تم قبول وتنفيذ العملية':'تم رفض العملية';
  const statusBody=`${r.type||operationLabel(r.operationType)||'العملية'}${r.operationType==='leave_allowance'?` — بدل المواصلات: ${Number(r.transportAllowance||0).toFixed(2)}، بدل الوجبات: ${Number(r.mealAllowance||0).toFixed(2)}`:''} — ${status==='approved'?'تم القبول والتنفيذ':'تم الرفض'}`;
  // قرار قائد الفريق (موافقة أو رفض) يصل إلى جميع الموظفين وقائد الفريق.
  await createNotification('all',statusTitle,statusBody,id);
  toast(status==='approved'?'تم قبول وتنفيذ العملية':'تم رفض العملية');render();
 }catch(e){console.error(e);toast(e.message==='out-of-stock'?'لا يمكن التنفيذ: نفاذ هذا العنصر.':e.message==='insufficient-balance'?'لا يمكن التنفيذ: الرصيد المتبقي غير كافٍ.':'تعذر تنفيذ العملية')}
}
async function deleteRequest(id){if(state.user?.role!=='leader')return;if(!confirm('هل تريد حذف هذه المعاملة القديمة نهائيًا؟'))return;try{await deleteDoc(doc(db,'requests',id));await loadData();toast('تم حذف المعاملة');render()}catch(e){console.error(e);toast('تعذر حذف المعاملة')}}
async function addOperationType(){
 if(state.user?.role!=="leader")return;
 const label=document.querySelector("#newOperationLabel")?.value.trim();
 if(!label){toast("اكتب اسم بند العملية");return;}
 const code=`custom_${Date.now()}`;
 try{await saveOperationTypes([...operationTypes(),{code,label}]);toast("تمت إضافة بند العملية");render();}catch(e){console.error(e);toast("تعذر إضافة بند العملية");}
}
async function removeOperationType(code){
 if(state.user?.role!=="leader")return;
 const item=operationTypes().find(x=>x.code===code);if(!item)return;
 if(!confirm(`هل تريد حذف بند «${item.label}» من العمليات الجديدة؟ المعاملات القديمة ستظل محفوظة.`))return;
 try{await saveOperationTypes(operationTypes().filter(x=>x.code!==code));toast("تم حذف بند العملية");render();}catch(e){console.error(e);toast("تعذر حذف بند العملية");}
}
async function createAnnouncement(){const title=document.querySelector("#announcementTitle")?.value.trim(),content=document.querySelector("#announcementContent")?.value.trim();if(!title||!content){toast("اكتب عنوان التوجيه ونصه");return}try{const targetUserIds=(state.data.members||[]).filter(m=>m.role!=="leader"&&m.active!==false&&m.userId).map(m=>m.userId);await addDoc(collection(db,"announcements"),{teamId:state.user.teamId,title,content,createdBy:state.user.id,targetUserIds,seenBy:[],createdAt:serverTimestamp()});await createNotification("employees","توجيه جديد من قائد الفريق",`${title}: ${content}`);await loadData();toast("تم نشر التوجيه بنجاح");render()}catch(e){console.error(e);toast("تعذر نشر التوجيه")}}
async function markAnnouncement(id){try{await updateDoc(doc(db,"announcements",id),{seenBy:arrayUnion(state.user.id)});const snap=await getDoc(doc(db,"announcements",id));const data=snap.exists()?snap.data():{};const targetUserIds=data.targetUserIds||[];const seen=data.seenBy||[];if(targetUserIds.length&&targetUserIds.every(uid=>seen.includes(uid)||uid===state.user.id))await deleteDoc(doc(db,"announcements",id));await loadData();render()}catch(e){console.error(e);toast("تعذر تسجيل الاطلاع")}}
async function editOwnProfile(){const u=state.user||{};const name=prompt("الاسم بالكامل",u.name||"");if(name===null)return;const employeeCode=prompt("الكود الوظيفي",u.employeeCode||"");if(employeeCode===null)return;const hireDate=prompt("تاريخ التعيين بصيغة YYYY-MM-DD",u.hireDate||"");if(hireDate===null)return;const emergencyPhone=prompt("هاتف الطوارئ",u.emergencyPhone||"");if(emergencyPhone===null)return;try{await updateDoc(doc(db,"users",u.id),{name:name.trim(),employeeCode:employeeCode.trim(),hireDate:hireDate.trim(),emergencyPhone:emergencyPhone.trim()});state.user={...state.user,name:name.trim(),employeeCode:employeeCode.trim(),hireDate:hireDate.trim(),emergencyPhone:emergencyPhone.trim()};toast("تم تحديث بيانات قائد الفريق");render()}catch(e){console.error(e);toast("تعذر تحديث البيانات")}}
async function editMember(id){const m=state.data.members.find(x=>x.id===id);if(!m)return;const name=prompt('اسم الموظف بالكامل',m.name||'');if(name===null)return;const hireDate=prompt('تاريخ التعيين بصيغة YYYY-MM-DD',m.hireDate||'');if(hireDate===null)return;const emergencyPhone=prompt('هاتف الطوارئ',m.emergencyPhone||'');if(emergencyPhone===null)return;const annual=prompt('المتبقي الاعتيادي',m.remainingAnnualLeave??0);if(annual===null)return;const casual=prompt('المتبقي العارضة',m.remainingCasualLeave??0);if(casual===null)return;const sick=prompt('المتبقي المرضي',m.remainingSickLeave??0);if(sick===null)return;const deduct=prompt('المتبقي بالخصم',m.remainingDeductLeave??0);if(deduct===null)return;const data={name:name.trim(),hireDate:hireDate.trim(),emergencyPhone:emergencyPhone.trim(),remainingAnnualLeave:Number(annual),remainingCasualLeave:Number(casual),remainingSickLeave:Number(sick),remainingDeductLeave:Number(deduct)};try{await updateDoc(doc(db,'members',id),data);if(m.userId)await updateDoc(doc(db,'users',m.userId),data);await loadData();toast('تم تحديث بيانات الموظف');render()}catch(e){console.error(e);toast('تعذر تحديث بيانات الموظف')}}
async function removeMember(id){if(!confirm("هل تريد حذف هذا الموظف نهائيًا من قائمة الموظفين؟"))return;try{const m=state.data.members.find(x=>x.id===id);await deleteDoc(doc(db,"members",id));if(m?.userId)await deleteDoc(doc(db,"users",m.userId));await loadData();toast("تم حذف الموظف من قائمة الموظفين");render()}catch(e){console.error(e);toast("تعذر حذف الموظف. تأكد من صلاحيات قائد الفريق")}}
async function addInventoryItem(){
 const name=prompt('اسم العنصر');if(!name)return;const category=prompt('التصنيف: الأدوات المكتبية / الأرشيف / العهدة / البوفيه','الأدوات المكتبية');if(!category)return;const qty=Number(prompt('الرصيد الابتدائي','0')||0);const id='item-'+Date.now();try{await setDoc(doc(db,'inventory',id),{name:name.trim(),category:normalizeInventoryCategory(category),qty,teamId:state.user.teamId,createdAt:serverTimestamp()});await loadData();toast('تمت إضافة العنصر');render()}catch(e){toast('تعذر إضافة العنصر')}}
async function deleteInventoryItem(id){
 if(state.user?.role!=="leader")return;
 const item=(state.data.inventory||[]).find(x=>String(x.id||x.key)===String(id));if(!item)return;
 if(!confirm(`هل تريد حذف العنصر «${item.name}»؟`))return;
 try{await deleteDoc(doc(db,"inventory",item.id||item.key));await loadData();toast("تم حذف العنصر");render();}catch(e){console.error(e);toast("تعذر حذف العنصر");}
}
async function saveInventoryItem(id){const item=(state.data.inventory||[]).find(x=>String(x.id||x.key)===String(id));if(!item)return;const input=document.querySelector(`.inventory-qty-input[data-inventory-id=\"${CSS.escape(String(id))}\"]`);const raw=input?.value.trim()||'';if(raw===''){toast('أدخل العدد أولاً');return}const qty=Number(raw);if(!Number.isFinite(qty)||qty<0){toast('العدد غير صحيح');return}try{await setDoc(doc(db,'inventory',item.id||item.key),{name:item.name,category:normalizeInventoryCategory(item.category),qty,teamId:state.user.teamId,updatedAt:serverTimestamp()},{merge:true});await loadData();toast(`تم حفظ عدد ${item.name}`);render()}catch(e){console.error(e);toast('تعذر حفظ العدد')}}
function clearInactivityTimer(){if(inactivityTimer){clearTimeout(inactivityTimer);inactivityTimer=null}}
function startInactivityTimer(){
  clearInactivityTimer();
  if(!state.user)return;
  const role=state.user.role;
  inactivityTimer=setTimeout(async()=>{
    inactivityTimer=null;
    sessionStorage.removeItem(SESSION_KEY);
    if(notificationUnsubscribe)notificationUnsubscribe();
    notificationUnsubscribe=null;
    try{await signOut(auth)}catch(e){console.error(e)}
    state.user=null;state.pendingAccess=false;state.page="dashboard";state.authMode=role==="leader"?"leader":"employee";
    render();
    toast("انتهت الجلسة بعد 5 دقائق بدون نشاط. أدخل بيانات الدخول مرة أخرى.");
  },IDLE_MS);
}
function resetInactivityTimer(){if(state.user)startInactivityTimer()}
async function logout(){clearInactivityTimer();sessionStorage.removeItem(SESSION_KEY);if(notificationUnsubscribe)notificationUnsubscribe();notificationUnsubscribe=null;await signOut(auth);state.user=null;state.pendingAccess=false;state.page="dashboard";state.authMode="employee";render()}

const employeeActivityEvents=["click","keydown","mousemove","mousedown","touchstart","scroll","wheel"];
employeeActivityEvents.forEach(type=>document.addEventListener(type,()=>{if(state.user)resetInactivityTimer()},{passive:true}));

document.addEventListener("input",e=>{if(["requestType","fromDate","toDate","fromTime","toTime","leaveDate","substituteDate","leaveTransportAllowance","leaveMealAllowance"].includes(e.target?.id))updateRequestCalculation();});
document.addEventListener("change",e=>{if(["requestType","fromDate","toDate","fromTime","toTime","leaveDate","substituteDate","leaveTransportAllowance","leaveMealAllowance","adminCategory","adminItem"].includes(e.target?.id))updateRequestCalculation();if(e.target?.id==="employeeInventoryCategory")renderEmployeeInventory(e.target.value);});

 document.addEventListener("click",async e=>{const el=e.target.closest("[data-action]");if(!el)return;const a=el.dataset.action;if(a==="nav"){state.page=el.dataset.page;render()}else if(a==="login")await login();else if(a==="signup")await signup();else if(a==="forgot")await forgot();else if(a==="toggle-auth"){state.authMode=state.authMode==="login"?"signup":"login";render()}else if(a==="switch-auth"){state.authMode=el.dataset.mode||"employee";render()}else if(a==="logout")await logout();else if(a==="add-member")await addMember();else if(a==="add-inventory")await addInventoryItem();else if(a==="save-inventory")await saveInventoryItem(el.dataset.id);else if(a==="delete-inventory")await deleteInventoryItem(el.dataset.id);else if(a==="create-announcement")await createAnnouncement();else if(a==="add-operation-type")await addOperationType();else if(a==="remove-operation-type")await removeOperationType(el.dataset.code);else if(a==="mark-announcement")await markAnnouncement(el.dataset.id);else if(a==="edit-own-profile")await editOwnProfile();else if(a==="edit-member")await editMember(el.dataset.id);else if(a==="submit-request")await submitRequest();else if(a==="approve")await updateRequest(el.dataset.id,"approved");else if(a==="reject")await updateRequest(el.dataset.id,"rejected");else if(a==="delete-request")await deleteRequest(el.dataset.id);else if(a==="remove-member")await removeMember(el.dataset.id);else if(a==="approve-access")await approveAccess(el.dataset.id);else if(a==="reject-access")await updateAccessRequest(el.dataset.id,"rejected");else if(a==="mark-notification")await markNotification(el.dataset.id);else if(a==="mark-all-notifications")await markAllNotifications();else if(a==="request-notification-permission")await registerNotificationToken();else if(a==="install-app"){if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;document.querySelector("#installAppBtn")?.style.setProperty("display","none")}}});

window.addEventListener("beforeinstallprompt",e=>{deferredInstallPrompt=e;const b=document.querySelector("#installAppBtn");if(b)b.style.display="inline-flex"});
window.addEventListener("appinstalled",()=>{deferredInstallPrompt=null});
onAuthStateChanged(auth,async user=>{
  if(user){
    const profile=await getUserDoc(user.uid);
    const sessionRole=sessionStorage.getItem(SESSION_KEY);
    if(!sessionRole){
      await signOut(auth);
      state.user=null;state.pendingAccess=false;state.authMode=profile?.role==="leader"?"leader":"employee";render();
      return;
    }
    await hydrateUser(user);
    render();
    startInactivityTimer();
  }else if(!state.pendingAccess){
    clearInactivityTimer();
    state.user=null;
    render();
  }
});
