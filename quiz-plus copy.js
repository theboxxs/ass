import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 1. إعدادات Firebase
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

let score = 0, tries = 0, num1, num2, rightAnswer, startTime;

// 2. تفعيل زر Enter (حل مشكلة التعليق وعدم الاستجابة)
// نربط الحدث بمجرد تحميل الصفحة
window.onload = function() {
    const input = document.getElementById("answerInput");
    if (input) {
        input.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault(); // منع أي سلوك افتراضي للمتصفح
                checkAnswer(); // تنفيذ التحقق فوراً
            }
        });
    }
};

// 3. دالة بدء الاختبار
window.startQuiz = function() {
    score = 0; 
    tries = 0;
    startTime = Date.now();
    document.getElementById("startSection").style.display = "none";
    document.getElementById("questionSection").style.display = "block";
    newQuestion();
};

// 4. دالة إنشاء سؤال ضرب جديد
function newQuestion() {
    num1 = Math.floor(Math.random() * 10) + 1; 
    num2 = Math.floor(Math.random() * 10) + 1;
    rightAnswer = num1 * num2;
    
    document.getElementById("equationText").innerText = `${num1} × ${num2} = ?`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus(); // وضع الماوس داخل الخانة تلقائياً
}

// 5. دالة التحقق من الإجابة
window.checkAnswer = function() {
    const userInp = document.getElementById("answerInput");
    const val = userInp.value.trim();

    if (val === "") return; // تجاهل إذا كانت الخانة فارغة

    if (parseInt(val) === rightAnswer) {
        score++;
    }

    tries++;
    document.getElementById("triesCount").innerText = tries;
    document.getElementById("scoreCount").innerText = score;

    if (tries < 10) {
        newQuestion();
    } else {
        finishQuiz();
    }
};

// 6. إنهاء الاختبار وحفظ النتيجة في مسار الضرب (Multiplication)
function finishQuiz() {
    const timeTaken = (Date.now() - startTime) / 1000;
    let finalPoints = 0;
    
    if (score > 0) {
        // معادلة النقاط (كل ما كنت أسرع كانت النقاط أعلى)
        finalPoints = Math.floor((score * 10000) / timeTaken);
    }

    document.getElementById("questionSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    document.getElementById("finalResult").innerText = finalPoints.toLocaleString() + " نقطة";

    const name = localStorage.getItem('activeUser') || "بطل أُسُس";
    
    // الحفظ في Firebase تحت مسار الضرب تحديداً
    push(ref(db, 'leaderboard/multiplication'), {
        name: name,
        score: finalPoints,
        time: new Date().toLocaleString()
    }).then(() => {
        console.log("تم تحديث قائمة أبطال الضرب!");
    }).catch((error) => {
        console.error("خطأ في الحفظ:", error);
    });
}
