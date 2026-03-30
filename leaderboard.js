import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAj8bNAd5axoXs9EnvGso7kBF1S9dgUEqM",
    authDomain: "asss-d3452.firebaseapp.com",
    databaseURL: "https://asss-d3452-default-rtdb.firebaseio.com",
    projectId: "asss-d3452",
    storageBucket: "asss-d3452.firebasestorage.app",
    messagingSenderId: "169933688004",
    appId: "1:169933688004:web:3d367c0127d12242414d91"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// دالة جلب البيانات
async function loadData(mode) {
    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "<tr><td colspan='3'>جاري التحميل...</td></tr>";

    const scoresRef = query(ref(db, 'leaderboard/' + mode), orderByChild("score"), limitToLast(10));
    const snapshot = await get(scoresRef);
    tbody.innerHTML = "";

    if (snapshot.exists()) {
        let data = [];
        snapshot.forEach(c => data.push(c.val()));
        data.sort((a,b) => b.score - a.score).forEach((item, i) => {
            tbody.innerHTML += `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.score}</td></tr>`;
        });
    }
}

// ربط الأزرار يدوياً (بدون onclick في الـ HTML)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // تغيير اللون للأحمر الفاقع
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // جلب البيانات بناءً على نص الزر
        const modeMap = { "الجمع ➕": "addition", "الطرح ➖": "minus", "الضرب ✖": "multiplication", "القسمة ➗": "division" };
        loadData(modeMap[this.innerText.trim()]);
    });
});

// تشغيل الجمع عند البداية
loadData('addition');
window.switchTab = async function(mode, btn) {
    const tbody = document.getElementById("leaderboardBody");
    
    // تغيير الألوان للأحمر الفاقع (سيشتغل حتى بدون إنترنت)
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    tbody.innerHTML = "<tr><td colspan='3'>جاري المحاولة (تحتاج VPN)...</td></tr>";

    // بيانات تجريبية تظهر إذا تأخر الرد (عشان تشوف التصميم)
    setTimeout(() => {
        if(tbody.innerHTML.includes("جاري المحاولة")) {
             tbody.innerHTML = `
                <tr class="top-3"><td>1</td><td>بطل تجريبي</td><td>9999</td></tr>
                <tr><td>2</td><td>إدريس (مبرمج الموقع)</td><td>8500</td></tr>
             `;
        }
    }, 3000);

    // الكود الحقيقي الذي يحتاج VPN
    // اجعل الدالة عالمية ليفهمها المتصفح في الجوال
window.switchTab = async function(mode, btn) {
    const tbody = document.getElementById("leaderboardBody");
    
    // 1. تغيير الألوان للأحمر الفاقع فوراً (حتى لو النت ضعيف)
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    tbody.innerHTML = "<tr><td colspan='3' style='color:#8b8b9a'>جاري التحميل...</td></tr>";

    // 2. جلب البيانات من فايربيس
    try {
        // ... كود الفايربيس اللي كتبناه سابقاً ...
        // (تأكد من وضع الإعدادات FirebaseConfig هنا)
    } catch (e) {
        tbody.innerHTML = "<tr><td colspan='3'>خطأ في الاتصال!</td></tr>";
    }
}
