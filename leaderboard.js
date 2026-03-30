import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// دالة جلب البيانات وعرضها
async function loadLeaderboard(mode) {
    const tbody = document.getElementById("leaderboardBody");
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='3' style='color:#8b8b9a'>جاري التحميل...</td></tr>";

    try {
        const scoresRef = query(ref(db, `leaderboard/${mode}`), orderByChild("score"), limitToLast(10));
        const snapshot = await get(scoresRef);
        
        tbody.innerHTML = "";

        if (snapshot.exists()) {
            let data = [];
            snapshot.forEach(child => {
                data.push(child.val());
            });

            // ترتيب تنازلي (الأعلى أولاً)
            data.sort((a, b) => b.score - a.score);

            data.forEach((item, i) => {
                const rankClass = i === 0 ? 'rank-1' : (i === 1 ? 'rank-2' : (i === 2 ? 'rank-3' : ''));
                tbody.innerHTML += `
                    <tr>
                        <td class="${rankClass}">${i + 1}</td>
                        <td>${item.name || "لاعب مجهول"}</td>
                        <td>${item.score}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3'>لا توجد نتائج مسجلة لهذا الطور.</td></tr>";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        tbody.innerHTML = "<tr><td colspan='3' style='color:red'>خطأ في الاتصال بقاعدة البيانات</td></tr>";
    }
}

// إعداد التنقل بين الأقسام (Tabs)
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // إزالة الحالة النشطة من الجميع
            tabs.forEach(t => t.classList.remove('active'));
            // إضافة الحالة النشطة للزر المضغوط
            tab.classList.add('active');
            
            // تحديد الطور بناءً على النص أو الخاصية
            const mode = tab.getAttribute('data-mode') || "addition"; 
            loadLeaderboard(mode);
        });
    });

    // تحميل طور "الجمع" افتراضياً عند فتح الصفحة
    loadLeaderboard('addition');
});
