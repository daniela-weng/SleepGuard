import SwiftUI

@main
struct SleepGuardApp: App {
    @StateObject private var bleManager = BLEManager()
    @StateObject private var viewModel = BreathingViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(bleManager)
                .environmentObject(viewModel)
                .onAppear {
                    viewModel.connect(to: bleManager)
                }
        }
    }
}
