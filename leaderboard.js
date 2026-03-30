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

async function loadData(mode) {
    const tbody = document.getElementById("leaderboardBody");
    tbody.innerHTML = "<tr><td colspan='3' style='color:#8b8b9a'>جاري تحميل البيانات...</td></tr>";

    try {
        const scoresRef = query(ref(db, 'leaderboard/' + mode), orderByChild("score"), limitToLast(10));
        const snapshot = await get(scoresRef);
        
        tbody.innerHTML = "";

        if (snapshot.exists()) {
            let data = [];
            snapshot.forEach(child => {
                data.push(child.val());
            });

            // ترتيب البيانات من الأعلى للأقل
            data.sort((a, b) => b.score - a.score);

            data.forEach((item, i) => {
                const rankClass = i === 0 ? 'rank-1' : '';
                tbody.innerHTML += `
                    <tr>
                        <td class="${rankClass}">${i + 1}</td>
                        <td>${item.name || "لاعب مجهول"}</td>
                        <td>${item.score}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3'>لا توجد نتائج مسجلة بعد.</td></tr>";
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = "<tr><td colspan='3' style='color:red'>خطأ في الاتصال (قد تحتاج VPN في بعض المناطق)</td></tr>";
    }
}

// ربط الأزرار بطريقة احترافية
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // تحديث شكل الأزرار
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // جلب البيانات بناءً على data-mode
        const mode = this.getAttribute('data-mode');
        loadData(mode);
    });
});

// تشغيل وضع "الجمع" عند فتح الصفحة مباشرة
loadData('addition');
