# SleepGuard — iOS App Setup

## Xcode project creation

1. Open Xcode → **File → New → Project**
2. Choose **iOS → App**
3. Set:
   - Product Name: `SleepGuard`
   - Interface: `SwiftUI`
   - Language: `Swift`
4. Delete the auto-generated `ContentView.swift` and `<AppName>App.swift`.
5. Drag all folders from `SleepGuard/` into the Xcode project navigator (check **"Copy items if needed"**).
6. In **Build Settings → Signing**, set your Team and Bundle ID.

## Wiring up your hardware UUIDs

Open `BLE/BLEManager.swift` and replace the three placeholder UUIDs at the top with the actual UUIDs from your sensor's firmware or datasheet:

```swift
let BREATHING_SERVICE_UUID   = CBUUID(string: "YOUR-SERVICE-UUID-HERE")
let BREATHING_RATE_CHAR_UUID = CBUUID(string: "YOUR-RATE-CHAR-UUID-HERE")
let SPO2_CHAR_UUID           = CBUUID(string: "YOUR-SPO2-CHAR-UUID-HERE")
```

Also confirm the byte encoding in `didUpdateValueFor` matches your firmware's packet format.

## Running without hardware (Demo Mode)

On the **Monitor** tab, toggle **Demo Mode** before tapping "Start Monitoring".  
The app will simulate 60 seconds of normal breathing followed by a ~15-second apnea event,  
then return to normal — you'll see the alert fire and SpO₂ drop on screen.

## App structure

```
App/
  SleepGuardApp.swift       — entry point, wires BLEManager → BreathingViewModel
BLE/
  BLEManager.swift          — CoreBluetooth scan/connect/notify
Models/
  BreathingData.swift       — data point + apnea event structs
  SleepSession.swift        — session with quality score
ViewModels/
  BreathingViewModel.swift  — session lifecycle, apnea detection, notifications
Views/
  ContentView.swift         — tab bar root
  DashboardView.swift       — live monitoring screen
  HistoryView.swift         — past sessions list
  DeviceConnectionView.swift — BLE scan & connect screen
```

## Permissions required

| Key | Purpose |
|-----|---------|
| `NSBluetoothAlwaysUsageDescription` | Connect to BLE sensor |
| `UIBackgroundModes → bluetooth-central` | Receive sensor data while screen is off |

Both are already in `Info.plist`.
