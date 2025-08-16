# TriChat Android SDK

A powerful and easy-to-integrate chat SDK for Android applications, providing real-time messaging, push notifications, and seamless customer support integration.

## Features

- ✅ **Real-time Messaging**: Instant message delivery with typing indicators
- ✅ **Push Notifications**: Firebase Cloud Messaging (FCM) integration
- ✅ **File Uploads**: Support for images, documents, and media files
- ✅ **Offline Support**: Message queuing and sync when back online
- ✅ **Custom Themes**: Fully customizable UI to match your app's design
- ✅ **Multi-language**: Built-in internationalization support
- ✅ **Analytics**: Comprehensive usage analytics and insights
- ✅ **Agent Status**: Real-time agent availability indicators
- ✅ **Conversation History**: Persistent chat history and search
- ✅ **Security**: End-to-end encryption and secure data handling

## Requirements

- Android API 21+ (Android 5.0+)
- Kotlin 1.5+ or Java 8+
- Android Studio 4.0+
- Google Play Services

## Installation

### Gradle (Recommended)

1. Add to your `app/build.gradle`:
```gradle
dependencies {
    implementation 'com.trichat:trichat-sdk:2.1.0'
}
```

2. Sync your project with Gradle files

### Maven

Add to your `pom.xml`:
```xml
<dependency>
    <groupId>com.trichat</groupId>
    <artifactId>trichat-sdk</artifactId>
    <version>2.1.0</version>
</dependency>
```

## Quick Start

### 1. Initialize the SDK

In your `Application` class:

```kotlin
import com.trichat.TriChat

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize TriChat SDK
        TriChat.initialize(this, "YOUR_API_KEY_HERE")
    }
}
```

### 2. Add Chat UI

In your activity:

```kotlin
import com.trichat.TriChat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Add chat button
        findViewById<Button>(R.id.chat_button).setOnClickListener {
            TriChat.openChat(this)
        }
    }
}
```

### 3. Configure Push Notifications

Create a Firebase Messaging Service:

```kotlin
import com.google.firebase.messaging.FirebaseMessagingService
import com.trichat.TriChat

class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        TriChat.setPushToken(token)
    }
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle TriChat messages
        if (TriChat.handlePushMessage(remoteMessage)) {
            // Message was handled by TriChat
            return
        }
        
        // Handle other push messages
    }
}
```

## Advanced Configuration

### Custom Styling

```kotlin
val config = TriChatConfig.Builder()
    .setPrimaryColor(Color.parseColor("#3B82F6"))
    .setTitle("Live Support")
    .setSubtitle("We're here to help 24/7")
    .setWelcomeMessage("Welcome! How can we help you today?")
    .setPlaceholder("Type your message here...")
    .setShowAvatar(true)
    .setAutoOpen(false)
    .setEnableFileUpload(true)
    .setMaxFileSize(10) // MB
    .setAllowedFileTypes(listOf("image/jpeg", "image/png", "application/pdf"))
    .setLanguage("en")
    .setTimezone("UTC")
    .build()

TriChat.configure(config)
```

### Event Handling

```kotlin
TriChat.setListener(object : TriChatListener {
    override fun onMessageReceived(message: TriChatMessage) {
        Log.d("TriChat", "New message: ${message.content}")
        
        // Send local notification
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notification = NotificationCompat.Builder(this@MainActivity, "trichat_channel")
            .setContentTitle("New Message")
            .setContentText(message.content)
            .setSmallIcon(R.drawable.ic_notification)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        
        notificationManager.notify(message.id.hashCode(), notification)
    }
    
    override fun onConversationStarted(conversation: TriChatConversation) {
        Log.d("TriChat", "Conversation started: ${conversation.id}")
        
        // Track analytics
        FirebaseAnalytics.getInstance(this).logEvent("chat_conversation_started", Bundle().apply {
            putString("conversation_id", conversation.id)
            putString("customer_id", conversation.customerId)
        })
    }
    
    override fun onConversationEnded(conversation: TriChatConversation) {
        Log.d("TriChat", "Conversation ended: ${conversation.id}")
        
        // Send satisfaction survey
        sendSatisfactionSurvey(conversation)
    }
    
    override fun onAgentStatusChanged(status: TriChatAgentStatus) {
        Log.d("TriChat", "Agent status: $status")
        
        // Update UI based on agent availability
        updateAgentStatusIndicator(status)
    }
    
    override fun onError(error: TriChatError) {
        Log.e("TriChat", "Error: ${error.message}")
        
        when (error.type) {
            TriChatError.Type.NETWORK_ERROR -> showOfflineMessage()
            TriChatError.Type.AUTHENTICATION_ERROR -> refreshAuthentication()
            TriChatError.Type.RATE_LIMIT_EXCEEDED -> showRateLimitMessage()
            else -> showGenericErrorMessage()
        }
    }
})
```

### Custom UI Components

```kotlin
// Custom chat button
val customButton = Button(this).apply {
    text = "Get Help"
    setBackgroundColor(Color.parseColor("#3B82F6"))
    setTextColor(Color.WHITE)
    setOnClickListener {
        TriChat.openChat(this@MainActivity)
    }
}

// Custom chat presentation
val chatIntent = TriChat.createChatIntent(this)
chatIntent.putExtra("theme", "dark")
startActivity(chatIntent)
```

## Push Notification Setup

### 1. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Add your Android app to the project
3. Download `google-services.json` and place it in your `app/` directory
4. Add Firebase dependencies to your `build.gradle` files

### 2. Add Firebase Dependencies

In your project-level `build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

In your app-level `build.gradle`:
```gradle
plugins {
    id 'com.google.gms.google-services'
}

dependencies {
    implementation platform('com.google.firebase:firebase-bom:32.2.0')
    implementation 'com.google.firebase:firebase-messaging'
}
```

### 3. Create Notification Channel

```kotlin
private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(
            "trichat_channel",
            "TriChat Messages",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Chat messages from TriChat"
            enableLights(true)
            lightColor = Color.BLUE
        }
        
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }
}
```

## Analytics Integration

```kotlin
// Track custom events
TriChat.trackEvent("support_requested", mapOf(
    "category" to "technical",
    "priority" to "high"
))

// Get conversation analytics
TriChat.getConversationAnalytics { analytics ->
    Log.d("TriChat", "Total conversations: ${analytics.totalConversations}")
    Log.d("TriChat", "Average response time: ${analytics.averageResponseTime}")
    Log.d("TriChat", "Customer satisfaction: ${analytics.satisfactionScore}")
}
```

## Testing

### Unit Tests

```kotlin
import org.junit.Test
import org.junit.Assert.*

class TriChatTests {
    @Test
    fun testInitialization() {
        TriChat.initialize(context, "test_key")
        assertTrue(TriChat.isInitialized)
    }
    
    @Test
    fun testMessageSending() {
        val latch = CountDownLatch(1)
        var result: Result<TriChatMessage>? = null
        
        TriChat.sendMessage("Test message") { messageResult ->
            result = messageResult
            latch.countDown()
        }
        
        latch.await(5, TimeUnit.SECONDS)
        assertNotNull(result)
        assertTrue(result!!.isSuccess)
    }
}
```

### UI Tests

```kotlin
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule

@RunWith(AndroidJUnit4::class)
class TriChatUITests {
    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java)
    
    @Test
    fun testChatInterface() {
        onView(withId(R.id.chat_button))
            .check(matches(isDisplayed()))
            .perform(click())
        
        onView(withId(R.id.trichat_view))
            .check(matches(isDisplayed()))
    }
}
```

## Troubleshooting

### Common Issues

1. **SDK not initializing**
   - Check your API key is correct
   - Ensure you're calling `TriChat.initialize()` in Application class
   - Verify internet permissions in AndroidManifest.xml

2. **Push notifications not working**
   - Verify Firebase setup is correct
   - Check `google-services.json` is in the right location
   - Ensure FCM token is being sent to TriChat

3. **Messages not sending**
   - Check network connectivity
   - Verify API key permissions
   - Check rate limiting

4. **UI not displaying**
   - Ensure you're on the main thread when opening chat
   - Check activity context is valid
   - Verify theme resources are available

### Debug Mode

Enable debug logging:

```kotlin
TriChat.setLogLevel(TriChatLogLevel.DEBUG)
```

### Support

- **Documentation**: https://docs.trichat.com/android-sdk
- **GitHub**: https://github.com/trichat/android-sdk
- **Support**: support@trichat.com
- **Discord**: https://discord.gg/trichat

## Changelog

### Version 2.1.0
- Added offline message queuing
- Improved FCM integration
- Enhanced UI customization options
- Added conversation analytics
- Fixed memory leaks in long conversations

### Version 2.0.0
- Complete UI redesign
- Added file upload support
- Improved performance and stability
- Added multi-language support
- Enhanced security features

### Version 1.0.0
- Initial release
- Basic chat functionality
- Push notifications
- Custom themes

## License

This SDK is licensed under the MIT License. See LICENSE file for details. 