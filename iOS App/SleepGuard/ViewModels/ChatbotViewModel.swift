import Foundation

// ── Add your Anthropic API key here ──────────────────────────────────────────
// Get one at https://console.anthropic.com
private let ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE"
// ─────────────────────────────────────────────────────────────────────────────

struct ChatMessage: Identifiable {
    let id = UUID()
    let role: Role
    let text: String
    let timestamp = Date()

    enum Role { case user, assistant }
}

@MainActor
final class ChatbotViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = [
        ChatMessage(role: .assistant,
                    text: "Hi! I'm your SleepGuard assistant. Ask me anything about sleep apnea — symptoms, treatments, CPAP tips, or what your numbers mean.")
    ]
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let model   = "claude-haiku-4-5-20251001"
    private let baseURL = "https://api.anthropic.com/v1/messages"

    private let systemPrompt = """
    You are a compassionate sleep apnea assistant built into SleepGuard, an app for seniors. \
    Answer questions about sleep apnea simply and clearly — suitable for someone 65+. \
    Topics include: symptoms, AHI scores, CPAP therapy, oxygen levels, lifestyle changes, \
    and when to call a doctor. Keep responses concise (2-4 sentences max). \
    Never diagnose — always recommend consulting their doctor for medical decisions. \
    Be warm and reassuring.
    """

    func send(_ userText: String) async {
        let trimmed = userText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        messages.append(ChatMessage(role: .user, text: trimmed))
        isLoading = true
        errorMessage = nil

        do {
            let reply = try await callClaude(with: trimmed)
            messages.append(ChatMessage(role: .assistant, text: reply))
        } catch {
            errorMessage = "Couldn't reach the assistant. Please check your connection."
        }
        isLoading = false
    }

    private func callClaude(with userText: String) async throws -> String {
        guard let url = URL(string: baseURL) else { throw URLError(.badURL) }

        // Build message history (last 10 exchanges to keep context small)
        let history = messages.suffix(10).map {
            ["role": $0.role == .user ? "user" : "assistant", "content": $0.text]
        }

        let body: [String: Any] = [
            "model": model,
            "max_tokens": 300,
            "system": systemPrompt,
            "messages": history
        ]

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(ANTHROPIC_API_KEY, forHTTPHeaderField: "x-api-key")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, _) = try await URLSession.shared.data(for: request)

        guard
            let json    = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let content = (json["content"] as? [[String: Any]])?.first,
            let text    = content["text"] as? String
        else { throw URLError(.cannotParseResponse) }

        return text
    }
}
