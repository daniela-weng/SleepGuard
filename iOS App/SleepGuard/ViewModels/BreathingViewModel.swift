import Foundation
import Combine
import UserNotifications

final class BreathingViewModel: ObservableObject {

    // MARK: - Published state
    @Published var currentSession: SleepSession?
    @Published var pastSessions: [SleepSession] = []
    @Published var currentBreathingRate: Double = 0
    @Published var currentSpO2: Double = 0
    @Published var isTracking = false
    @Published var apneaAlertActive = false
    @Published var isDemoMode = true

    // Settings toggles
    @Published var alertsEnabled = true
    @Published var vibrationEnabled = true
    @Published var nightModeEnabled = false
    @Published var autoSyncEnabled = true
    @Published var wristDetectionEnabled = true

    // Profile (read-only — populated by caregiver / doctor)
    let profileName      = "Eleanor Mitchell"
    let profileAge       = 72
    let profileDoctor    = "Dr. Margaret Chen"
    let profileDiagnosis = "Obstructive Sleep Apnea"

    var lastSession: SleepSession? { pastSessions.first }

    // MARK: - Private
    private var cancellables = Set<AnyCancellable>()
    private var sampleTimer: Timer?
    private var demoTimer: Timer?
    private var apneaStartTime: Date?
    private let storageKey = "sleepGuard.sessions"

    init() {
        loadSessions()
        requestNotificationPermission()
    }

    // MARK: - BLE wiring

    func connect(to bleManager: BLEManager) {
        bleManager.$breathingRate
            .combineLatest(bleManager.$spO2)
            .receive(on: RunLoop.main)
            .sink { [weak self] rate, spo2 in
                guard let self, self.isTracking, !self.isDemoMode else { return }
                self.updateReadings(breathingRate: rate, spO2: spo2)
            }
            .store(in: &cancellables)
    }

    // MARK: - Session lifecycle

    func startSession() {
        currentSession = SleepSession(id: UUID(), startTime: Date())
        isTracking = true

        // Record a data point every 5 seconds
        sampleTimer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
            self?.recordDataPoint()
        }

        if isDemoMode { startDemoSimulation() }
    }

    func stopSession() {
        sampleTimer?.invalidate(); sampleTimer = nil
        demoTimer?.invalidate();   demoTimer = nil

        if var session = currentSession {
            session.endTime = Date()
            pastSessions.insert(session, at: 0)
            saveSessions()
        }

        currentSession = nil
        isTracking = false
        apneaAlertActive = false
        apneaStartTime = nil
    }

    // MARK: - Data processing

    private func updateReadings(breathingRate: Double, spO2: Double) {
        currentBreathingRate = breathingRate
        currentSpO2 = spO2
        evaluateApnea()
    }

    private func recordDataPoint() {
        let point = BreathingData(
            id: UUID(),
            timestamp: Date(),
            breathingRate: currentBreathingRate,
            spO2: currentSpO2
        )
        currentSession?.dataPoints.append(point)
    }

    private func evaluateApnea() {
        let suspectedApnea = currentBreathingRate < 5 || currentSpO2 < 90

        if suspectedApnea {
            let start = apneaStartTime ?? { let t = Date(); apneaStartTime = t; return t }()
            if Date().timeIntervalSince(start) >= 10 {
                fireApneaAlert(since: start)
            }
        } else {
            if let start = apneaStartTime {
                let event = ApneaEvent(id: UUID(), startTime: start, endTime: Date())
                currentSession?.apneaEvents.append(event)
            }
            apneaStartTime = nil
            apneaAlertActive = false
        }
    }

    private func fireApneaAlert(since start: Date) {
        guard !apneaAlertActive else { return }
        apneaAlertActive = true

        let content = UNMutableNotificationContent()
        content.title = "Breathing Alert"
        content.body  = "Abnormal breathing detected. Please check on the wearer."
        content.sound = .defaultCritical

        UNUserNotificationCenter.current().add(
            UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
        )
    }

    // MARK: - Demo simulation

    private func startDemoSimulation() {
        var tick = 0
        demoTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self else { return }
            tick += 1
            // Simulate a 15-second apnea event between ticks 60–75
            let inApnea = tick > 60 && tick < 75
            if inApnea {
                self.updateReadings(breathingRate: 2, spO2: 87)
            } else {
                self.updateReadings(
                    breathingRate: Double.random(in: 13...17),
                    spO2:          Double.random(in: 96...99)
                )
            }
        }
    }

    // MARK: - Persistence

    private func saveSessions() {
        guard let data = try? JSONEncoder().encode(pastSessions) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }

    private func loadSessions() {
        guard
            let data     = UserDefaults.standard.data(forKey: storageKey),
            let sessions = try? JSONDecoder().decode([SleepSession].self, from: data)
        else { return }
        pastSessions = sessions
    }

    private func requestNotificationPermission() {
        UNUserNotificationCenter.current()
            .requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
    }
}
