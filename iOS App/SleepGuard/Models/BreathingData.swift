import Foundation

struct BreathingData: Identifiable, Codable {
    let id: UUID
    let timestamp: Date
    let breathingRate: Double  // breaths per minute
    let spO2: Double           // percentage

    var isApneaEvent: Bool {
        breathingRate < 5 || spO2 < 90
    }
}

struct ApneaEvent: Identifiable, Codable {
    let id: UUID
    let startTime: Date
    var endTime: Date?

    var duration: TimeInterval? {
        endTime.map { $0.timeIntervalSince(startTime) }
    }

    var severity: Severity {
        guard let dur = duration else { return .mild }
        if dur >= 30 { return .severe }
        if dur >= 20 { return .moderate }
        return .mild
    }

    enum Severity: String, Codable {
        case mild     = "Mild"
        case moderate = "Moderate"
        case severe   = "Severe"
    }
}
