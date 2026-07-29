import SwiftUI

struct TrackingView: View {
    @EnvironmentObject var viewModel: BreathingViewModel
    @EnvironmentObject var bleManager: BLEManager

    private var lastSession: SleepSession? { viewModel.lastSession }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {

                    // ════════════════════════════════════════════════════
                    // SECTION 1 — Live Monitoring
                    // ════════════════════════════════════════════════════
                    VStack(alignment: .leading, spacing: 16) {

                        // Status pill
                        HStack(spacing: 8) {
                            Circle()
                                .fill(statusColor)
                                .frame(width: 10, height: 10)
                                .shadow(color: statusColor.opacity(0.6), radius: 4)
                            Text(statusLabel)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(statusColor)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(statusColor.opacity(0.1))
                        .clipShape(Capsule())

                        // Live metric cards
                        HStack(spacing: 12) {
                            LiveMetricCard(
                                icon: "lungs.fill",
                                label: "Breathing",
                                value: viewModel.isTracking && viewModel.currentBreathingRate > 0
                                    ? String(format: "%.1f", viewModel.currentBreathingRate)
                                    : "—",
                                unit: "bpm",
                                color: breathingColor
                            )
                            LiveMetricCard(
                                icon: "drop.fill",
                                label: "Blood Oxygen",
                                value: viewModel.isTracking && viewModel.currentSpO2 > 0
                                    ? String(format: "%.0f", viewModel.currentSpO2)
                                    : "—",
                                unit: "%",
                                color: spO2Color
                            )
                        }

                        // Apnea alert banner
                        if viewModel.apneaAlertActive {
                            HStack(spacing: 10) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(Color.apneaRed)
                                Text("Abnormal breathing detected")
                                    .font(.system(size: 15, weight: .semibold))
                                    .foregroundColor(Color.apneaRed)
                            }
                            .padding(14)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.apneaRed.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }

                        // Demo mode toggle
                        if !bleManager.isConnected {
                            Toggle(isOn: $viewModel.isDemoMode) {
                                Label("Demo Mode", systemImage: "play.circle")
                                    .font(.system(size: 15))
                            }
                            .disabled(viewModel.isTracking)
                            .tint(Color.apneaGreen)
                        }

                        // Start / Stop
                        Button(action: toggleTracking) {
                            Text(viewModel.isTracking ? "Stop Monitoring" : "Start Monitoring")
                                .font(.system(size: 20, weight: .bold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 18)
                                .background(viewModel.isTracking ? Color.apneaRed : Color.apneaGreen)
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }

                        // Session timer
                        if viewModel.isTracking, let session = viewModel.currentSession {
                            SessionTimerRow(session: session)
                        }
                    }
                    .padding(20)

                    // ════════════════════════════════════════════════════
                    // DIVIDER
                    // ════════════════════════════════════════════════════
                    HStack {
                        VStack { Divider() }
                        Text("Last Night's Sleep")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.secondary)
                            .fixedSize()
                        VStack { Divider() }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 8)

                    // ════════════════════════════════════════════════════
                    // SECTION 2 — Last Night Summary
                    // ════════════════════════════════════════════════════
                    if let session = lastSession {
                        VStack(alignment: .leading, spacing: 16) {

                            // Time range + duration
                            VStack(alignment: .leading, spacing: 2) {
                                Text(session.startTime, format: .dateTime.weekday(.wide).month().day())
                                    .font(.system(size: 13))
                                    .foregroundStyle(.secondary)
                                if let dur = session.duration {
                                    Text(sessionTimeRange(session) + " · " + durationText(dur))
                                        .font(.system(size: 15, weight: .medium))
                                        .foregroundStyle(.secondary)
                                }
                            }

                            // SpO2 night chart
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Oxygen Through the Night")
                                    .font(.system(size: 16, weight: .semibold))
                                Text("Drops below 90% are flagged in red")
                                    .font(.system(size: 12))
                                    .foregroundStyle(.secondary)
                                SpO2ChartView(dataPoints: session.dataPoints)
                                    .frame(height: 130)
                                    .padding(.top, 4)
                            }
                            .padding(16)
                            .background(Color(.systemGray6))
                            .clipShape(RoundedRectangle(cornerRadius: 16))

                            // 2×2 data grid
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                SleepMetricCard(
                                    label: "Oxygen (avg)",
                                    value: session.averageSpO2.map { String(format: "%.0f", $0) } ?? "—",
                                    unit: "%",
                                    sublabel: spO2AvgLabel(session.averageSpO2),
                                    color: spO2AvgColor(session.averageSpO2)
                                )
                                SleepMetricCard(
                                    label: "Apnea Score",
                                    value: session.apneaIndex.map { String(format: "%.0f", $0) } ?? "—",
                                    unit: "/hr",
                                    sublabel: ahiLabel(session.apneaIndex),
                                    color: ahiColor(session.apneaIndex)
                                )
                                SleepMetricCard(
                                    label: "Lowest Oxygen",
                                    value: session.lowestSpO2.map { String(format: "%.0f", $0) } ?? "—",
                                    unit: "%",
                                    sublabel: lowestSpO2Label(session),
                                    color: lowestSpO2Color(session.lowestSpO2)
                                )
                                SleepMetricCard(
                                    label: "Events",
                                    value: "\(session.apneaEvents.count)",
                                    unit: "total",
                                    sublabel: eventsSublabel(session),
                                    color: eventsColor(session)
                                )
                            }
                        }
                        .padding(20)
                        .padding(.bottom, 8)

                    } else {
                        VStack(spacing: 12) {
                            Image(systemName: "moon.zzz.fill")
                                .font(.system(size: 44))
                                .foregroundStyle(.secondary)
                            Text("No sleep data yet")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundStyle(.secondary)
                            Text("Start monitoring tonight to see your sleep summary here.")
                                .font(.system(size: 15))
                                .foregroundStyle(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 32)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 32)
                    }
                }
            }
            .navigationTitle("Tracking")
        }
    }

    // MARK: - Helpers

    private func toggleTracking() {
        viewModel.isTracking ? viewModel.stopSession() : viewModel.startSession()
    }

    private var statusColor: Color {
        if viewModel.apneaAlertActive { return .apneaRed }
        if viewModel.isTracking { return .apneaGreen }
        return .secondary
    }

    private var statusLabel: String {
        if viewModel.apneaAlertActive  { return "Alert — Abnormal Breathing" }
        if !viewModel.isTracking       { return "Not Monitoring" }
        if viewModel.currentBreathingRate == 0 { return "Waiting for data…" }
        return "Monitoring"
    }

    private var breathingColor: Color {
        let r = viewModel.currentBreathingRate
        guard viewModel.isTracking, r > 0 else { return .secondary }
        if r < 5 || r > 25  { return .apneaRed }
        if r < 10 || r > 22 { return .apneaYellow }
        return .apneaGreen
    }
    private var spO2Color: Color {
        let s = viewModel.currentSpO2
        guard viewModel.isTracking, s > 0 else { return .secondary }
        if s < 90 { return .apneaRed }
        if s < 95 { return .apneaYellow }
        return .apneaGreen
    }

    private func sessionTimeRange(_ s: SleepSession) -> String {
        let fmt = DateFormatter(); fmt.dateFormat = "h:mm a"
        return "\(fmt.string(from: s.startTime)) – \(s.endTime.map { fmt.string(from: $0) } ?? "—")"
    }
    private func durationText(_ d: TimeInterval) -> String {
        let h = Int(d) / 3600; let m = (Int(d) % 3600) / 60
        return h > 0 ? "\(h)h \(m)m" : "\(m)m"
    }
    private func spO2AvgLabel(_ v: Double?) -> String {
        guard let v else { return "—" }
        if v >= 95 { return "Good — Normal range" }
        if v >= 90 { return "Fair — Near safe range" }
        return "Poor — Below safe range"
    }
    private func spO2AvgColor(_ v: Double?) -> Color {
        guard let v else { return .secondary }
        return v >= 95 ? .apneaGreen : v >= 90 ? .apneaYellow : .apneaRed
    }
    private func ahiLabel(_ v: Double?) -> String {
        guard let v else { return "—" }
        if v < 5  { return "Good — Normal level" }
        if v < 15 { return "Fair — Mild level" }
        if v < 30 { return "Fair — Moderate level" }
        return "Poor — Severe level"
    }
    private func ahiColor(_ v: Double?) -> Color {
        guard let v else { return .secondary }
        return v < 5 ? .apneaGreen : v < 30 ? .apneaYellow : .apneaRed
    }
    private func lowestSpO2Label(_ s: SleepSession) -> String {
        guard let low = s.lowestSpO2 else { return "—" }
        if low >= 95 { return "Good — Stayed in range" }
        if low >= 90 { return "Fair — Near safe range" }
        if let event = s.apneaEvents.min(by: { $0.startTime < $1.startTime }) {
            let fmt = DateFormatter(); fmt.dateFormat = "h:mm a"
            return "Poor — Dropped at \(fmt.string(from: event.startTime))"
        }
        return "Poor — Dropped below safe"
    }
    private func lowestSpO2Color(_ v: Double?) -> Color {
        guard let v else { return .secondary }
        return v >= 95 ? .apneaGreen : v >= 90 ? .apneaYellow : .apneaRed
    }
    private func eventsSublabel(_ s: SleepSession) -> String {
        switch s.severity {
        case .none:     return "Good — No apnea events"
        case .mild:     return "Fair — Mild type"
        case .moderate: return "Fair — Obstructive type"
        case .severe:   return "Poor — Obstructive type"
        }
    }
    private func eventsColor(_ s: SleepSession) -> Color {
        switch s.severity {
        case .none:     return .apneaGreen
        case .mild, .moderate: return .apneaYellow
        case .severe:   return .apneaRed
        }
    }
}

// MARK: - Sub-views

struct LiveMetricCard: View {
    let icon: String
    let label: String
    let value: String
    let unit: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(label, systemImage: icon)
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(color)
            HStack(alignment: .lastTextBaseline, spacing: 3) {
                Text(value)
                    .font(.system(size: 44, weight: .bold, design: .rounded))
                    .foregroundStyle(color)
                    .minimumScaleFactor(0.6)
                Text(unit)
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(color.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct SleepMetricCard: View {
    let label: String
    let value: String
    let unit: String
    let sublabel: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Circle().fill(color).frame(width: 10, height: 10)
                Text(label)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(Color.secondary)
            }
            HStack(alignment: .lastTextBaseline, spacing: 3) {
                Text(value)
                    .font(.system(size: 38, weight: .bold, design: .rounded))
                    .foregroundColor(color)
                Text(unit)
                    .font(.system(size: 14))
                    .foregroundColor(Color.secondary)
            }
            Text(sublabel)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(color)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(color.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

struct SessionTimerRow: View {
    let session: SleepSession
    @State private var now = Date()
    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        HStack {
            Label(elapsed, systemImage: "clock")
                .font(.system(size: 14))
                .foregroundStyle(.secondary)
            Spacer()
            Label("\(session.apneaEvents.count) alerts", systemImage: "exclamationmark.triangle")
                .font(.system(size: 14))
                .foregroundColor(session.apneaEvents.isEmpty ? Color.secondary : Color.apneaRed)
        }
        .onReceive(ticker) { now = $0 }
    }

    private var elapsed: String {
        let s = Int(now.timeIntervalSince(session.startTime))
        return String(format: "%d:%02d", s / 60, s % 60)
    }
}
