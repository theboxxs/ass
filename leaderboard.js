import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// إعدادات Firebase الخاصة بمشروعك (أُسُس)
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

// دالة تبديل الأقسام (الجمع، الطرح، إلخ)
window.switchTab = async function(mode, btn) {
    const tbody = document.getElementById("leaderboardBody");
    
    // 1. تحديث شكل الأزرار (إضافة الكلاس active للزر المختار)
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tbody.innerHTML = "<tr><td colspan='3'>جاري التحميل...</td></tr>";

    // 2. جلب البيانات من المسار الصحيح في Firebase
    const scoresRef = query(ref(db, 'leaderboard/' + mode), orderByChild("score"), limitToLast(10));

    try {
        const snapshot = await get(scoresRef);
        tbody.innerHTML = "";

        if (snapshot.exists()) {
            let data = [];
            snapshot.forEach(child => {
                data.push(child.val());
            });

            // ترتيب تنازلي (من الأعلى للأقل)
            data.sort((a, b) => b.score - a.score).forEach((item, index) => {
                // تلوين المركز الأول بالذهبي كما في الـ CSS الخاص بك
                let rankClass = index === 0 ? 'rank-1' : '';
                
                tbody.innerHTML += `
                    <tr>
                        <td class="${rankClass}">${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.score.toLocaleString()}</td>
                    </tr>`;
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='3'>لا توجد نتائج بعد في هذا التحدي.</td></tr>";
        }
    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='3' style='color:red;'>خطأ في الاتصال بالشبكة!</td></tr>";
    }
}

// تشغيل قسم الجمع تلقائياً عند فتح الصفحة لأول مرة
window.onload = () => {
    const firstBtn = document.querySelector('.tab-btn');
    if(firstBtn) switchTab('addition', firstBtn);
};
