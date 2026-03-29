// 1. استيراد المكتبات المطلوبة من روابط CDN الرسمية (الإصدار الأخير)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// 2. إعدادات مشروع Firebase الخاص بك (ASSS)
const firebaseConfig = {
    apiKey: "AIzaSyAj8bNAd5axoXs9EnvGso7kBF1S9dgUEqM",
    authDomain: "asss-d3452.firebaseapp.com",
    databaseURL: "https://asss-d3452-default-rtdb.firebaseio.com",
    projectId: "asss-d3452",
    storageBucket: "asss-d3452.firebasestorage.app",
    messagingSenderId: "169933688004",
    appId: "1:169933688004:web:3d367c0127d12242414d91",
    measurementId: "G-DGYTPPMQ88"
};

// 3. تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let isLoginMode = true;

// --- دالة التبديل بين تسجيل الدخول وإنشاء الحساب ---
window.toggleAuth = function() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('authTitle');
    const btn = document.getElementById('authBtn');
    const toggleText = document.getElementById('toggleText');
    const toggleBtn = document.getElementById('toggleBtn');

    if (title) title.innerText = isLoginMode ? "تسجيل الدخول" : "إنشاء حساب جديد";
    if (btn) btn.innerText = isLoginMode ? "دخول" : "إنشاء حساب";
    if (toggleText) toggleText.innerText = isLoginMode ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟";
    if (toggleBtn) toggleBtn.innerText = isLoginMode ? "سجل الآن" : "سجل دخولك";
}

// --- دالة التنفيذ (دخول / تسجيل) مع حماية أمنية مشددة ---
window.handleAuth = async function() {
    const userField = document.getElementById('username');
    const passField = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');

    const userRaw = userField.value.trim();
    const passRaw = passField.value;

    // 1. حماية ضد المدخلات الفارغة
    if (!userRaw || !passRaw) {
        errorMsg.innerText = "يرجى ملء جميع الحقول";
        return;
    }

    // 2. حماية الاسم (منع الرموز الغريبة والاختراق بالكونسول)
    const nameRegex = /^[a-zA-Z0-9\u0600-\u06FF\s]+$/; 
    if (!nameRegex.test(userRaw)) {
        errorMsg.innerText = "الاسم مسموح بالحروف والأرقام فقط!";
        return;
    }

    if (userRaw.length < 3 || userRaw.length > 15) {
        errorMsg.innerText = "الاسم يجب أن يكون بين 3 و 15 حرفاً";
        return;
    }

    // 3. حماية كلمة المرور
    if (passRaw.length < 6) {
        errorMsg.innerText = "كلمة المرور يجب أن تكون 6 أرقام أو أكثر";
        return;
    }

    // تحويل الاسم إلى إيميل وهمي للتعامل مع Firebase Auth
    const email = userRaw.toLowerCase().replace(/\s/g, '') + "@asss.com";

    try {
        errorMsg.style.color = "blue";
        errorMsg.innerText = "جاري التحقق من البيانات...";

        if (isLoginMode) {
            // تسجيل الدخول (مشفر تلقائياً بواسطة Firebase)
            await signInWithEmailAndPassword(auth, email, passRaw);
        } else {
            // إنشاء حساب جديد
            const userCredential = await createUserWithEmailAndPassword(auth, email, passRaw);
            
            // ربط الاسم "الحقيقي" بملف المستخدم في السيرفر (أمان إضافي)
            await updateProfile(userCredential.user, {
                displayName: userRaw
            });
        }
        
        // حفظ الاسم في الذاكرة المحلية لاستخدامه في لوحة الصدارة
        localStorage.setItem('activeUser', userRaw);
        
        // الانتقال للرئيسية
        window.location.href = "home.html";
        
    } catch (error) {
        console.error("Firebase Error:", error.code);
        errorMsg.style.color = "red";
        
        // رسائل خطأ واضحة للمستخدم
        switch (error.code) {
            case "auth/invalid-credential":
                errorMsg.innerText = "اسم المستخدم أو كلمة المرور غير صحيحة";
                break;
            case "auth/email-already-in-use":
                errorMsg.innerText = "هذا الاسم محجوز لبطل آخر، اختر اسماً جديداً";
                break;
            case "auth/network-request-failed":
                errorMsg.innerText = "مشكلة في الإنترنت، تأكد من اتصالك";
                break;
            default:
                errorMsg.innerText = "حدث خطأ غير متوقع، حاول ثانية";
        }
    }
}