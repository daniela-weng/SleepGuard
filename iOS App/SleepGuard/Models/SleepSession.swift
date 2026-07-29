import Foundation

struct SleepSession: Identifiable, Codable {
    let id: UUID
    let startTime: Date
    var endTime: Date?
    var dataPoints: [BreathingData] = []
    var apneaEvents: [ApneaEvent] = []

    var duration: TimeInterval? {
        endTime.map { $0.timeIntervalSince(startTime) }
    }

    var durationHours: Double? {
        duration.map { $0 / 3600 }
    }

    var averageBreathingRate: Double? {
        guard !dataPoints.isEmpty else { return nil }
        return dataPoints.map(\.breathingRate).reduce(0, +) / Double(dataPoints.count)
    }

    var averageSpO2: Double? {
        guard !dataPoints.isEmpty else { return nil }
        return dataPoints.map(\.spO2).reduce(0, +) / Double(dataPoints.count)
    }

    var lowestSpO2: Double? {
        dataPoints.map(\.spO2).filter { $0 > 0 }.min()
    }

    // Apnea-Hypopnea Index: events per hour of sleep
    var apneaIndex: Double? {
        guard let hours = durationHours, hours > 0 else { return nil }
        return Double(apneaEvents.count) / hours
    }

    var severity: Severity {
        guard let ahi = apneaIndex else { return .none }
        switch ahi {
        case ..<5:  return .none
        case 5..<15: return .mild
        case 15..<30: return .moderate
        default:    return .severe
        }
    }

    enum Severity {
        case none, mild, moderate, severe

        var label: String {
            switch self {
            case .none:     return "Normal"
            case .mild:     return "Mild Sleep Apnea Detected"
            case .moderate: return "Moderate Sleep Apnea Detected"
            case .severe:   return "Severe Sleep Apnea Detected"
            }
        }

        var qualityLabel: String {
            switch self {
            case .none:     return "Good"
            case .mild:     return "Fair"
            case .moderate: return "Fair"
            case .severe:   return "Poor"
            }
        }
    }

    // 0–100 quality score
    var qualityScore: Int {
        let apneaPenalty = min(apneaEvents.count * 10, 60)
        let spO2Penalty  = averageSpO2.map { Int(max(0, (95 - $0) * 5)) } ?? 0
        return max(0, 100 - apneaPenalty - spO2Penalty)
    }

    var qualityLabel: String { severity.qualityLabel }
}
