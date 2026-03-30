import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 1. إعدادات Firebase الخاصة بمشروع ASSS
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

// دالة بدء التحدي
window.startQuiz = function() {
    score = 0; 
    tries = 0;
    startTime = Date.now();
    document.getElementById("startSection").style.display = "none";
    document.getElementById("questionSection").style.display = "block";
    newQuestion();
};

// إنشاء سؤال طرح جديد (تأكد أن الرقم الأول أكبر من الثاني)
function newQuestion() {
    num1 = Math.floor(Math.random() * 20) + 10; 
    num2 = Math.floor(Math.random() * 10) + 1;
    rightAnswer = num1 - num2;
    
    document.getElementById("equationText").innerText = `${num1} - ${num2} = ?`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();
}

// تفعيل زر Enter للإجابة السريعة
document.getElementById("answerInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});

// التحقق من الإجابة
window.checkAnswer = function() {
    const inputField = document.getElementById("answerInput");
    const val = inputField.value.trim();

    if (val === "") return;

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

// إنهاء التحدي وإرسال البيانات للقاعدة (المسار: leaderboard/minus)
function finishQuiz() {
    const timeTaken = (Date.now() - startTime) / 1000;
    let finalPoints = 0;
    
    if (score > 0) {
        finalPoints = Math.floor((score * 10000) / timeTaken);
    }

    document.getElementById("questionSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    document.getElementById("finalResult").innerText = finalPoints.toLocaleString() + " نقطة";

    const name = localStorage.getItem('activeUser') || "بطل أُسُس";
    
    // إرسال البيانات لمجلد الطرح حصراً
    push(ref(db, 'leaderboard/minus'), {
        name: name,
        score: finalPoints,
        time: new Date().toLocaleString()
    }).then(() => {
        console.log("تم حفظ نتيجة الناقص بنجاح!");
    }).catch((error) => {
        console.error("فشل في إرسال البيانات:", error);
    });
}
