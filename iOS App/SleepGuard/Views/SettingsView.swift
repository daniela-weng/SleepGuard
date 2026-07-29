import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var viewModel: BreathingViewModel
    @EnvironmentObject var bleManager: BLEManager
    @State private var showResetConfirm = false

    var body: some View {
        NavigationStack {
            List {

                // ── Device status ─────────────────────────────────────
                Section("Device") {
                    DeviceStatusRow(bleManager: bleManager)

                    HStack(spacing: 12) {
                        ActionButton(label: "Re-pair", icon: "arrow.triangle.2.circlepath") {
                            bleManager.disconnect()
                            bleManager.startScanning()
                        }
                        ActionButton(label: "Sync Now", icon: "arrow.down.circle") {
                            // Sync is automatic via BLE notifications; this triggers a manual read
                        }
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }

                // ── Notifications & behavior ──────────────────────────
                Section("Alerts & Behavior") {
                    ToggleRow(label: "Apnea Alerts",
                              detail: "Notify when breathing is abnormal",
                              icon: "bell.fill",
                              color: .apneaRed,
                              isOn: $viewModel.alertsEnabled)
                    ToggleRow(label: "Vibration",
                              detail: "Vibrate on alert instead of sound",
                              icon: "waveform",
                              color: .apneaYellow,
                              isOn: $viewModel.vibrationEnabled)
                    ToggleRow(label: "Night Mode",
                              detail: "Dim screen during sleep hours",
                              icon: "moon.fill",
                              color: .indigo,
                              isOn: $viewModel.nightModeEnabled)
                    ToggleRow(label: "Auto-Sync",
                              detail: "Sync data when device is nearby",
                              icon: "arrow.clockwise.circle.fill",
                              color: .apneaGreen,
                              isOn: $viewModel.autoSyncEnabled)
                    ToggleRow(label: "Wrist Detection",
                              detail: "Pause tracking when not worn",
                              icon: "applewatch",
                              color: .blue,
                              isOn: $viewModel.wristDetectionEnabled)
                }

                // ── Profile (read-only) ───────────────────────────────
                Section("Profile") {
                    ProfileRow(label: "Name",      value: viewModel.profileName)
                    ProfileRow(label: "Age",       value: "\(viewModel.profileAge)")
                    ProfileRow(label: "Doctor",    value: viewModel.profileDoctor)
                    ProfileRow(label: "Diagnosis", value: viewModel.profileDiagnosis)
                }

                // ── Danger zone ───────────────────────────────────────
                Section {
                    Button(role: .destructive) {
                        showResetConfirm = true
                    } label: {
                        Label("Factory Reset", systemImage: "trash")
                            .font(.system(size: 16))
                    }
                }
            }
            .navigationTitle("Settings")
            .confirmationDialog("Reset all data and unpair device?",
                                isPresented: $showResetConfirm,
                                titleVisibility: .visible) {
                Button("Factory Reset", role: .destructive) {
                    UserDefaults.standard.removeObject(forKey: "sleepGuard.sessions")
                    bleManager.disconnect()
                }
                Button("Cancel", role: .cancel) {}
            }
        }
    }
}

// MARK: - Sub-views

struct DeviceStatusRow: View {
    @ObservedObject var bleManager: BLEManager

    private var statusColor: Color {
        bleManager.isConnected ? .apneaGreen : .secondary
    }

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "sensor.tag.radiowaves.forward.fill")
                .font(.system(size: 20))
                .foregroundStyle(statusColor)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text("Breathing Sensor")
                    .font(.system(size: 16, weight: .medium))
                Text(bleManager.connectionStatus.rawValue)
                    .font(.system(size: 13))
                    .foregroundStyle(statusColor)
            }

            Spacer()

            if bleManager.isConnected {
                // Battery indicator (placeholder — real value from BLE characteristic)
                HStack(spacing: 4) {
                    Image(systemName: "battery.75percent")
                        .foregroundColor(Color.apneaGreen)
                    Text("75%")
                        .font(.system(size: 13))
                        .foregroundColor(Color.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

struct ActionButton: View {
    let label: String
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(label, systemImage: icon)
                .font(.system(size: 15, weight: .semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color(.systemGray5))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }
}

struct ToggleRow: View {
    let label: String
    let detail: String
    let icon: String
    let color: Color
    @Binding var isOn: Bool

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(color)
                    .frame(width: 32, height: 32)
                Image(systemName: icon)
                    .font(.system(size: 15))
                    .foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 1) {
                Text(label)
                    .font(.system(size: 16))
                Text(detail)
                    .font(.system(size: 12))
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(Color.apneaGreen)
        }
    }
}

struct ProfileRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .multilineTextAlignment(.trailing)
        }
        .font(.system(size: 16))
    }
}
