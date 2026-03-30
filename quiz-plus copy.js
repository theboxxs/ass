import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const app = initializeApp(firebaseConfig); // استخدم نفس الإعدادات أعلاه
const db = getDatabase(app);

// دالة جلب البيانات حسب القسم (جمع، طرح، ضرب، قسمة)
window.loadLeaderboard = async function(mode = 'addition') {
    const tableBody = document.getElementById("leaderboardBody");
    tableBody.innerHTML = "<tr><td colspan='3'>جاري تحميل الأبطال...</td></tr>";

    const dbRef = query(ref(db, `leaderboard/${mode}`), orderByChild("score"), limitToLast(10));

    try {
        const snapshot = await get(dbRef);
        tableBody.innerHTML = ""; // مسح الجدول للتحميل الجديد
        
        if (snapshot.exists()) {
            let players = [];
            snapshot.forEach((child) => {
                players.push(child.val());
            });

            // ترتيب من الأعلى للأقل
            players.reverse().forEach((player, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${player.name}</td>
                        <td>${player.score}</td>
                    </tr>`;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='3'>لا توجد نتائج بعد في هذا القسم</td></tr>";
        }
    } catch (error) {
        console.error(error);
        tableBody.innerHTML = "<tr><td colspan='3'>خطأ في الاتصال بالخادم</td></tr>";
    }
}

// تشغيل الجمع افتراضياً عند فتح الصفحة
window.onload = () => loadLeaderboard('addition');
