import SwiftUI

struct TreatmentView: View {
    @EnvironmentObject var viewModel: BreathingViewModel

    private var session: SleepSession? { viewModel.lastSession }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {

                    // ── Severity alert (only when apnea detected) ─────────
                    if let session, session.severity != .none {
                        SeverityBanner(session: session)
                            .padding(.horizontal, 20)
                            .padding(.top, 8)
                    }

                    // ── Recommendations with icons + references ───────────
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Recommendations")
                            .font(.system(size: 20, weight: .semibold))
                            .padding(.horizontal, 20)

                        ForEach(recommendations(for: session), id: \.text) { rec in
                            EnrichedRecommendationRow(rec: rec)
                                .padding(.horizontal, 20)
                        }
                    }

                    // ── Emergency contact always visible ──────────────────
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Emergency")
                            .font(.system(size: 20, weight: .semibold))
                        ContactCard(
                            name: "Emergency Services",
                            role: "Call if breathing stops or you cannot wake them",
                            phone: "911",
                            availability: "24 / 7",
                            urgency: .emergency
                        )
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 24)
                }
            }
            .navigationTitle("Treatment")
        }
    }

    // MARK: - Recommendation model

    struct EnrichedRecommendation {
        let icon: String        // SF Symbol
        let iconColor: Color
        let text: String
        let detail: String
        let status: Status
        let reference: Reference

        enum Status { case good, warning, bad }

        enum Reference {
            case article(title: String, source: String)
            case contact(name: String, phone: String, role: String)
        }
    }

    private func recommendations(for session: SleepSession?) -> [EnrichedRecommendation] {
        switch session?.severity ?? .none {

        case .none:
            return [
                .init(icon: "drop.fill", iconColor: .blue,
                      text: "Stay hydrated",
                      detail: "Drink water regularly throughout the day",
                      status: .good,
                      reference: .article(title: "Hydration and Sleep Quality",
                                          source: "Sleep Foundation")),
                .init(icon: "figure.walk", iconColor: .apneaGreen,
                      text: "Keep up regular exercise",
                      detail: "30 minutes of light activity improves sleep",
                      status: .good,
                      reference: .article(title: "Exercise and Sleep Health",
                                          source: "American Academy of Sleep Medicine")),
                .init(icon: "moon.fill", iconColor: .indigo,
                      text: "Maintain a consistent sleep schedule",
                      detail: "Same bedtime and wake time every day",
                      status: .good,
                      reference: .article(title: "Sleep Hygiene Tips for Seniors",
                                          source: "National Sleep Foundation")),
            ]

        case .mild:
            return [
                .init(icon: "bed.double.fill", iconColor: .apneaGreen,
                      text: "Sleep on your side",
                      detail: "Reduces airway collapse during sleep",
                      status: .good,
                      reference: .article(title: "Positional Therapy for Sleep Apnea",
                                          source: "Mayo Clinic")),
                .init(icon: "drop.fill", iconColor: .blue,
                      text: "Stay hydrated",
                      detail: "Dry airways can worsen snoring and apnea",
                      status: .good,
                      reference: .article(title: "Hydration and Sleep Quality",
                                          source: "Sleep Foundation")),
                .init(icon: "wineglass", iconColor: .apneaYellow,
                      text: "Avoid alcohol before bed",
                      detail: "Alcohol relaxes the throat muscles",
                      status: .warning,
                      reference: .article(title: "Alcohol and Sleep Apnea",
                                          source: "Mayo Clinic Sleep Center")),
                .init(icon: "stethoscope", iconColor: .purple,
                      text: "Schedule a follow-up",
                      detail: "Discuss your AHI with your sleep specialist",
                      status: .warning,
                      reference: .contact(name: "Dr. Margaret Chen",
                                          phone: "617-555-0142",
                                          role: "Sleep Specialist")),
            ]

        case .moderate:
            return [
                .init(icon: "lungs.fill", iconColor: .apneaGreen,
                      text: "Use CPAP every night",
                      detail: "Most effective treatment for obstructive sleep apnea",
                      status: .good,
                      reference: .article(title: "CPAP Therapy: What to Expect",
                                          source: "American Academy of Sleep Medicine")),
                .init(icon: "bed.double.fill", iconColor: .apneaGreen,
                      text: "Sleep on your side",
                      detail: "Reduces airway blockage significantly",
                      status: .good,
                      reference: .article(title: "Positional Therapy for Sleep Apnea",
                                          source: "Mayo Clinic")),
                .init(icon: "wineglass", iconColor: .apneaYellow,
                      text: "Avoid alcohol before bed",
                      detail: "Relaxes throat muscles and worsens apnea",
                      status: .warning,
                      reference: .article(title: "Alcohol and Sleep Apnea",
                                          source: "Mayo Clinic Sleep Center")),
                .init(icon: "car.fill", iconColor: .apneaRed,
                      text: "Do not drive if very sleepy",
                      detail: "Untreated apnea severely impairs alertness",
                      status: .bad,
                      reference: .article(title: "Drowsy Driving and Sleep Apnea",
                                          source: "National Sleep Foundation")),
                .init(icon: "stethoscope", iconColor: .purple,
                      text: "See your sleep specialist",
                      detail: "Your AHI suggests you need medical guidance",
                      status: .warning,
                      reference: .contact(name: "Dr. Margaret Chen",
                                          phone: "617-555-0142",
                                          role: "Sleep Specialist")),
            ]

        case .severe:
            return [
                .init(icon: "lungs.fill", iconColor: .apneaGreen,
                      text: "Use CPAP every night",
                      detail: "Critical — do not skip nights",
                      status: .good,
                      reference: .article(title: "CPAP Therapy: What to Expect",
                                          source: "American Academy of Sleep Medicine")),
                .init(icon: "stethoscope", iconColor: .apneaRed,
                      text: "See your doctor soon",
                      detail: "Severe AHI requires prompt medical attention",
                      status: .bad,
                      reference: .contact(name: "Dr. Margaret Chen",
                                          phone: "617-555-0142",
                                          role: "Sleep Specialist")),
                .init(icon: "car.fill", iconColor: .apneaRed,
                      text: "Do not drive if very sleepy",
                      detail: "Untreated severe apnea impairs alertness",
                      status: .bad,
                      reference: .article(title: "Drowsy Driving and Sleep Apnea",
                                          source: "National Sleep Foundation")),
                .init(icon: "wineglass", iconColor: .apneaYellow,
                      text: "Avoid alcohol and sedatives",
                      detail: "These significantly worsen breathing during sleep",
                      status: .warning,
                      reference: .article(title: "Alcohol and Sleep Apnea",
                                          source: "Mayo Clinic Sleep Center")),
            ]
        }
    }
}

// MARK: - Enriched recommendation row

struct EnrichedRecommendationRow: View {
    let rec: TreatmentView.EnrichedRecommendation
    @State private var expanded = false

    private var statusIcon: String {
        switch rec.status {
        case .good:    return "checkmark.circle.fill"
        case .warning: return "exclamationmark.circle.fill"
        case .bad:     return "xmark.circle.fill"
        }
    }
    private var statusColor: Color {
        switch rec.status {
        case .good:    return .apneaGreen
        case .warning: return .apneaYellow
        case .bad:     return .apneaRed
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {

            // Main row
            HStack(alignment: .top, spacing: 12) {
                // Semantic icon
                ZStack {
                    Circle()
                        .fill(rec.iconColor.opacity(0.12))
                        .frame(width: 40, height: 40)
                    Image(systemName: rec.icon)
                        .font(.system(size: 17))
                        .foregroundStyle(rec.iconColor)
                }

                VStack(alignment: .leading, spacing: 3) {
                    Text(rec.text)
                        .font(.system(size: 16, weight: .semibold))
                    Text(rec.detail)
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Image(systemName: statusIcon)
                    .font(.system(size: 20))
                    .foregroundStyle(statusColor)
            }
            .padding(14)
            .contentShape(Rectangle())
            .onTapGesture { withAnimation(.easeInOut(duration: 0.2)) { expanded.toggle() } }

            // Expanded reference
            if expanded {
                Divider().padding(.horizontal, 14)

                switch rec.reference {
                case .article(let title, let source):
                    HStack(spacing: 12) {
                        Image(systemName: "doc.text.fill")
                            .foregroundStyle(.secondary)
                            .frame(width: 20)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(title)
                                .font(.system(size: 14, weight: .medium))
                                .lineLimit(2)
                            Text(source)
                                .font(.system(size: 12))
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                        Text("Read")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(.apneaGreen)
                    }
                    .padding(14)
                    .transition(.opacity.combined(with: .move(edge: .top)))

                case .contact(let name, let phone, let role):
                    HStack(spacing: 12) {
                        Image(systemName: "phone.fill")
                            .foregroundStyle(.apneaGreen)
                            .frame(width: 20)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(name)
                                .font(.system(size: 14, weight: .semibold))
                            Text(role)
                                .font(.system(size: 12))
                                .foregroundStyle(.secondary)
                            Text(phone)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(.apneaGreen)
                        }
                        Spacer()
                        Button("Call") {
                            let cleaned = phone.replacingOccurrences(of: "-", with: "")
                            if let url = URL(string: "tel://\(cleaned)") {
                                UIApplication.shared.open(url)
                            }
                        }
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(Color.apneaGreen)
                        .clipShape(Capsule())
                    }
                    .padding(14)
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
        }
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

// MARK: - Reused sub-views (severity banner + contact card)

struct SeverityBanner: View {
    let session: SleepSession

    private var color: Color {
        switch session.severity {
        case .none:              return .apneaGreen
        case .mild, .moderate:  return .apneaYellow
        case .severe:           return .apneaRed
        }
    }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 20))
                .foregroundStyle(color)
                .padding(.top, 2)
            VStack(alignment: .leading, spacing: 4) {
                Text(session.severity.label)
                    .font(.system(size: 16, weight: .bold))
                if let ahi = session.apneaIndex {
                    Text("Your AHI of \(String(format: "%.0f", ahi)) events/hr and low oxygen dips suggest you should speak with a sleep specialist soon.")
                        .font(.system(size: 14))
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(16)
        .background(color.opacity(0.1))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(color.opacity(0.3), lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

struct ContactCard: View {
    let name: String
    let role: String
    let phone: String
    let availability: String
    enum Urgency { case routine, emergency }
    let urgency: Urgency

    private var accentColor: Color { urgency == .emergency ? .apneaRed : .apneaGreen }

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle().fill(accentColor.opacity(0.12)).frame(width: 44, height: 44)
                Image(systemName: "phone.fill").foregroundStyle(accentColor)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(name).font(.system(size: 16, weight: .semibold))
                Text(role).font(.system(size: 13)).foregroundStyle(.secondary)
                Text(phone).font(.system(size: 15, weight: .medium)).foregroundStyle(accentColor)
            }
            Spacer()
            Text(availability).font(.system(size: 12)).foregroundStyle(.secondary).multilineTextAlignment(.trailing)
        }
        .padding(16)
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .onTapGesture {
            let cleaned = phone.replacingOccurrences(of: "-", with: "")
            if let url = URL(string: "tel://\(cleaned)") { UIApplication.shared.open(url) }
        }
    }
}
