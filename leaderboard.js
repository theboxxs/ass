import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// إعداداتك (تأكد أنها صحيحة كما هي عندك)
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

// أهم سطر: ربط الدالة بـ window لكي تعمل الأزرار
window.switchTab = async function(mode, btn) {
    const tbody = document.getElementById("leaderboardBody");
    
    // تحديث شكل الأزرار (إزالة الـ active من الجميع وإضافته للضغطت عليه)
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    tbody.innerHTML = "<tr><td colspan='3'>جاري جلب الأبطال...</td></tr>";

    const scoresRef = query(ref(db, 'leaderboard/' + mode), orderByChild("score"), limitToLast(10));

    try {
        const snapshot = await get(scoresRef);
        tbody.innerHTML = "";

        if (snapshot.exists()) {
            let data = [];
            snapshot.forEach(child => data.push(child.val()));

            // ترتيب تنازلي
            data.sort((a, b) => b.score - a.score).forEach((item, index) => {
                let rankClass = index === 0 ? 'rank-1' : '';
                tbody.innerHTML += `
                    <tr>
                        <td class="${rankClass}">${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.score.toLocaleString()}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3'>لا يوجد متصدرين في هذا القسم.</td></tr>";
        }
    } catch (err) {
        tbody.innerHTML = "<tr><td colspan='3' style='color:red;'>خطأ في الاتصال!</td></tr>";
    }
};

// تشغيل أول قسم تلقائياً عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
    const defaultBtn = document.querySelector('.tab-btn');
    if(defaultBtn) window.switchTab('addition', defaultBtn);
});
