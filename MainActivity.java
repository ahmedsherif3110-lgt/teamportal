package com.teamportal.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends AppCompatActivity {
    public static WebView webView;
    private static final String URL = "https://team-portal2027.web.app/";
    private static final String CHANNEL_ID = "team_portal_notifications";

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createChannel();
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 100);
        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true);
        webView.setWebViewClient(new WebViewClient(){ @Override public void onPageFinished(WebView v, String url){ sendTokenToPage(); } });
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        setContentView(webView); webView.loadUrl(URL);
        FirebaseMessaging.getInstance().getToken().addOnSuccessListener(token -> { saveToken(token); if(webView!=null) webView.post(() -> sendTokenToPage()); });
    }
    public static void saveToken(String token){ if(webView!=null) webView.getContext().getSharedPreferences("teamportal",0).edit().putString("fcm",token).apply(); }
    public static void sendTokenToPage(){
        if(webView==null) return;
        FirebaseMessaging.getInstance().getToken().addOnSuccessListener(token -> { saveToken(token); webView.post(() -> webView.evaluateJavascript("window.onNativeFcmToken && window.onNativeFcmToken(" + quote(token) + ");", null)); });
    }
    private void createChannel(){ if(Build.VERSION.SDK_INT>=26){ NotificationChannel c=new NotificationChannel(CHANNEL_ID,"إشعارات البوابة",NotificationManager.IMPORTANCE_HIGH); ((NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(c); } }
    public class AndroidBridge {
        @JavascriptInterface public String getFcmToken(){
            if(webView==null) return "";
            return webView.getContext().getSharedPreferences("teamportal",0).getString("fcm","");
        }
    }
    private static String quote(String s){ return "\""+s.replace("\\","\\\\").replace("\"","\\\"")+"\""; }
}
