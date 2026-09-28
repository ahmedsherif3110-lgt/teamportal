package com.teamportal.app;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
public class TeamFirebaseMessagingService extends FirebaseMessagingService {
 private static final String CHANNEL_ID="team_portal_notifications";
 @Override public void onNewToken(String token){ if(MainActivity.webView!=null) MainActivity.webView.post(() -> MainActivity.sendTokenToPage()); }
 @Override public void onMessageReceived(RemoteMessage m){
  String title=m.getNotification()!=null&&m.getNotification().getTitle()!=null?m.getNotification().getTitle():"إشعار جديد";
  String body=m.getNotification()!=null&&m.getNotification().getBody()!=null?m.getNotification().getBody():"لديك إشعار جديد";
  Intent i=new Intent(this,MainActivity.class); i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
  PendingIntent pi=PendingIntent.getActivity(this,0,i,PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT);
  NotificationCompat.Builder b=new NotificationCompat.Builder(this,CHANNEL_ID).setSmallIcon(com.teamportal.app.R.drawable.icon_192).setContentTitle(title).setContentText(body).setPriority(NotificationCompat.PRIORITY_HIGH).setAutoCancel(true).setContentIntent(pi);
  ((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).notify((int)(System.currentTimeMillis()&0x7fffffff),b.build());
 }
}
