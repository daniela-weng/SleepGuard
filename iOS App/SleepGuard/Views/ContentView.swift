import SwiftUI

struct ContentView: View {
    @State private var showChatbot = false

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            TabView {
                TrackingView()
                    .tabItem { Label("Tracking", systemImage: "waveform.path.ecg") }
                TreatmentView()
                    .tabItem { Label("Treatment", systemImage: "cross.case.fill") }
                SettingsView()
                    .tabItem { Label("Settings", systemImage: "gearshape.fill") }
            }
            .tint(Color.apneaGreen)

            // Chatbot popup card
            if showChatbot {
                ChatbotPopup(isPresented: $showChatbot)
                    .padding(.horizontal, 12)
                    .padding(.bottom, 90)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }

            // Floating bubble button
            Button {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                    showChatbot.toggle()
                }
            } label: {
                Image(systemName: showChatbot ? "xmark" : "bubble.left.and.bubble.right.fill")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 54, height: 54)
                    .background(Color.apneaGreen)
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.2), radius: 6, y: 3)
            }
            .padding(.trailing, 20)
            .padding(.bottom, 82)
        }
        .animation(.spring(response: 0.35, dampingFraction: 0.8), value: showChatbot)
    }
}
