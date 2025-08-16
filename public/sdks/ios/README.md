# TriChat iOS SDK

A powerful and easy-to-integrate chat SDK for iOS applications, providing real-time messaging, push notifications, and seamless customer support integration.

## Features

- ✅ **Real-time Messaging**: Instant message delivery with typing indicators
- ✅ **Push Notifications**: Apple Push Notification Service (APNs) integration
- ✅ **File Uploads**: Support for images, documents, and media files
- ✅ **Offline Support**: Message queuing and sync when back online
- ✅ **Custom Themes**: Fully customizable UI to match your app's design
- ✅ **Multi-language**: Built-in internationalization support
- ✅ **Analytics**: Comprehensive usage analytics and insights
- ✅ **Agent Status**: Real-time agent availability indicators
- ✅ **Conversation History**: Persistent chat history and search
- ✅ **Security**: End-to-end encryption and secure data handling

## Requirements

- iOS 13.0+
- Swift 5.0+ or Objective-C
- Xcode 12.0+
- CocoaPods or Swift Package Manager

## Installation

### CocoaPods (Recommended)

1. Add the following to your `Podfile`:
```ruby
pod 'TriChat', '~> 2.1.0'
```

2. Run the installation:
```bash
pod install
```

3. Open your `.xcworkspace` file (not `.xcodeproj`)

### Swift Package Manager

1. In Xcode, go to `File` → `Add Package Dependencies`
2. Enter the repository URL: `https://github.com/trichat/ios-sdk.git`
3. Select version `2.1.0` or later
4. Click `Add Package`

## Quick Start

### 1. Initialize the SDK

In your `AppDelegate.swift`:

```swift
import TriChat

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize TriChat SDK
        TriChat.initialize(apiKey: "YOUR_API_KEY_HERE")
        return true
    }
}
```

### 2. Add Chat UI

In your view controller:

```swift
import TriChat

class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Add chat button
        let chatButton = TriChatButton(frame: CGRect(x: 20, y: 100, width: 200, height: 50))
        chatButton.setTitle("Chat with us", for: .normal)
        chatButton.addTarget(self, action: #selector(openChat), for: .touchUpInside)
        view.addSubview(chatButton)
    }
    
    @objc func openChat() {
        TriChat.presentChat(from: self)
    }
}
```

### 3. Configure Push Notifications

In your `AppDelegate.swift`:

```swift
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    TriChat.setPushToken(deviceToken)
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    if TriChat.handlePushNotification(userInfo) {
        completionHandler(.newData)
    } else {
        completionHandler(.noData)
    }
}
```

## Advanced Configuration

### Custom Styling

```swift
let config = TriChatConfig()
config.primaryColor = UIColor(red: 0.23, green: 0.51, blue: 0.95, alpha: 1.0)
config.title = "Live Support"
config.subtitle = "We're here to help 24/7"
config.welcomeMessage = "Welcome! How can we help you today?"
config.placeholder = "Type your message here..."
config.showAvatar = true
config.autoOpen = false
config.enableFileUpload = true
config.maxFileSize = 10 // MB
config.allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"]

TriChat.configure(config)
```

### Event Handling

```swift
TriChat.delegate = self

extension ViewController: TriChatDelegate {
    func trichatDidReceiveMessage(_ message: TriChatMessage) {
        print("New message: \(message.content)")
        
        // Send local notification
        let notification = UNMutableNotificationContent()
        notification.title = "New Message"
        notification.body = message.content
        notification.sound = .default
        
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: notification, trigger: nil)
        UNUserNotificationCenter.current().add(request)
    }
    
    func trichatDidStartConversation(_ conversation: TriChatConversation) {
        print("Conversation started: \(conversation.id)")
        
        // Track analytics
        Analytics.track("chat_conversation_started", properties: [
            "conversation_id": conversation.id,
            "customer_id": conversation.customerId
        ])
    }
    
    func trichatDidEndConversation(_ conversation: TriChatConversation) {
        print("Conversation ended: \(conversation.id)")
        
        // Send satisfaction survey
        sendSatisfactionSurvey(for: conversation)
    }
    
    func trichatAgentStatusChanged(_ status: TriChatAgentStatus) {
        print("Agent status: \(status)")
        
        // Update UI based on agent availability
        updateAgentStatusIndicator(status)
    }
}
```

### Custom UI Components

```swift
// Custom chat button
let customButton = UIButton(type: .custom)
customButton.setTitle("Get Help", for: .normal)
customButton.backgroundColor = UIColor.systemBlue
customButton.layer.cornerRadius = 25
customButton.addTarget(self, action: #selector(openChat), for: .touchUpInside)

// Custom chat presentation
let chatViewController = TriChatViewController()
chatViewController.modalPresentationStyle = .fullScreen
present(chatViewController, animated: true)
```

## Push Notification Setup

### 1. Enable Push Notifications

1. In Xcode, select your target
2. Go to `Signing & Capabilities`
3. Click `+ Capability` and add `Push Notifications`

### 2. Configure APNs

1. Create an APNs certificate in Apple Developer Console
2. Upload the certificate to your TriChat dashboard
3. Configure your app's bundle identifier

### 3. Request Permission

```swift
import UserNotifications

func requestNotificationPermission() {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
        if granted {
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
        }
    }
}
```

## Analytics Integration

```swift
// Track custom events
TriChat.trackEvent("support_requested", properties: [
    "category": "technical",
    "priority": "high"
])

// Get conversation analytics
TriChat.getConversationAnalytics { analytics in
    print("Total conversations: \(analytics.totalConversations)")
    print("Average response time: \(analytics.averageResponseTime)")
    print("Customer satisfaction: \(analytics.satisfactionScore)")
}
```

## Error Handling

```swift
TriChat.setErrorHandler { error in
    switch error {
    case .networkError:
        // Handle network connectivity issues
        showOfflineMessage()
    case .authenticationError:
        // Handle invalid API key
        refreshAuthentication()
    case .rateLimitExceeded:
        // Handle rate limiting
        showRateLimitMessage()
    default:
        // Handle other errors
        showGenericErrorMessage()
    }
}
```

## Testing

### Unit Tests

```swift
import XCTest
@testable import TriChat

class TriChatTests: XCTestCase {
    func testInitialization() {
        TriChat.initialize(apiKey: "test_key")
        XCTAssertTrue(TriChat.isInitialized)
    }
    
    func testMessageSending() {
        let expectation = XCTestExpectation(description: "Message sent")
        
        TriChat.sendMessage("Test message") { result in
            switch result {
            case .success(let message):
                XCTAssertNotNil(message.id)
                expectation.fulfill()
            case .failure(let error):
                XCTFail("Failed to send message: \(error)")
            }
        }
        
        wait(for: [expectation], timeout: 5.0)
    }
}
```

### UI Tests

```swift
import XCTest

class TriChatUITests: XCTestCase {
    func testChatInterface() {
        let app = XCUIApplication()
        app.launch()
        
        let chatButton = app.buttons["Chat with us"]
        XCTAssertTrue(chatButton.exists)
        
        chatButton.tap()
        
        let chatView = app.otherElements["TriChatView"]
        XCTAssertTrue(chatView.exists)
    }
}
```

## Troubleshooting

### Common Issues

1. **SDK not initializing**
   - Check your API key is correct
   - Ensure you're calling `TriChat.initialize()` in `AppDelegate`

2. **Push notifications not working**
   - Verify APNs certificate is uploaded to TriChat dashboard
   - Check bundle identifier matches your app
   - Ensure push capability is enabled in Xcode

3. **Messages not sending**
   - Check network connectivity
   - Verify API key permissions
   - Check rate limiting

4. **UI not displaying**
   - Ensure you're on the main thread when presenting chat
   - Check view controller hierarchy
   - Verify delegate methods are implemented

### Debug Mode

Enable debug logging:

```swift
TriChat.setLogLevel(.debug)
```

### Support

- **Documentation**: https://docs.trichat.com/ios-sdk
- **GitHub**: https://github.com/trichat/ios-sdk
- **Support**: support@trichat.com
- **Discord**: https://discord.gg/trichat

## Changelog

### Version 2.1.0
- Added offline message queuing
- Improved push notification handling
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