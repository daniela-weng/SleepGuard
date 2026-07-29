import SwiftUI

// MARK: - Popup card (embedded in ContentView overlay)

struct ChatbotPopup: View {
    @Binding var isPresented: Bool
    @StateObject private var vm = ChatbotViewModel()
    @State private var inputText = ""
    @FocusState private var inputFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            popupHeader
            Divider()
            messageList
            Divider()
            inputBar
        }
        .frame(height: 420)
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .shadow(color: .black.opacity(0.15), radius: 16, y: 4)
    }

    // MARK: Header

    private var popupHeader: some View {
        HStack(spacing: 8) {
            Circle()
                .fill(Color.apneaGreen)
                .frame(width: 8, height: 8)
            Text("Sleep Assistant")
                .font(.system(size: 16, weight: .semibold))
            Spacer()
            Button {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                    isPresented = false
                }
            } label: {
                Image(systemName: "chevron.down")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(.systemGray2))
                    .padding(8)
                    .background(Color(.systemGray6))
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
    }

    // MARK: Message list

    private var messageList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 10) {
                    if vm.messages.count == 1 {
                        SuggestionChips { s in Task { await vm.send(s) } }
                    }
                    ForEach(vm.messages) { msg in
                        MessageBubble(message: msg).id(msg.id)
                    }
                    if vm.isLoading {
                        TypingIndicator().id("typing")
                    }
                }
                .padding(.vertical, 10)
                .onChange(of: vm.messages.count) {
                    let id: AnyHashable? = vm.isLoading
                        ? AnyHashable("typing")
                        : vm.messages.last.map { AnyHashable($0.id) }
                    withAnimation { proxy.scrollTo(id) }
                }
                .onChange(of: vm.isLoading) {
                    let id: AnyHashable? = vm.isLoading
                        ? AnyHashable("typing")
                        : vm.messages.last.map { AnyHashable($0.id) }
                    withAnimation { proxy.scrollTo(id) }
                }
            }
        }
    }

    // MARK: Input bar

    private var inputBar: some View {
        let isEmpty = inputText.trimmingCharacters(in: .whitespaces).isEmpty
        return HStack(spacing: 8) {
            TextField("Ask about sleep apnea…", text: $inputText, axis: .vertical)
                .font(.system(size: 15))
                .lineLimit(1...3)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color(.systemGray6))
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .focused($inputFocused)
                .onSubmit { sendMessage() }

            Button(action: sendMessage) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.system(size: 30))
                    .foregroundColor(isEmpty ? Color(.systemGray4) : Color.apneaGreen)
            }
            .disabled(isEmpty || vm.isLoading)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }

    private func sendMessage() {
        let text = inputText
        inputText = ""
        Task { await vm.send(text) }
    }
}

// MARK: - Suggestion chips

struct SuggestionChips: View {
    let onSelect: (String) -> Void

    private let suggestions = [
        "What is AHI?",
        "What does my oxygen level mean?",
        "How does CPAP help?",
        "When should I call my doctor?"
    ]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(suggestions, id: \.self) { s in
                    Button(s) { onSelect(s) }
                        .font(.system(size: 13))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Color(.systemGray6))
                        .clipShape(Capsule())
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

// MARK: - Message bubble

struct MessageBubble: View {
    let message: ChatMessage
    private var isUser: Bool { message.role == .user }

    var body: some View {
        HStack(alignment: .bottom, spacing: 6) {
            if isUser { Spacer(minLength: 40) }

            if !isUser {
                ZStack {
                    Circle().fill(Color.apneaGreen).frame(width: 24, height: 24)
                    Image(systemName: "brain.head.profile")
                        .font(.system(size: 11))
                        .foregroundColor(.white)
                }
            }

            Text(message.text)
                .font(.system(size: 15))
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(isUser ? Color.apneaGreen : Color(.systemGray6))
                .foregroundColor(isUser ? .white : .primary)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .frame(maxWidth: .infinity, alignment: isUser ? .trailing : .leading)

            if isUser { Spacer(minLength: 0) }
        }
        .padding(.horizontal, 12)
    }
}

// MARK: - Typing indicator

struct TypingIndicator: View {
    @State private var phase = 0

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<3, id: \.self) { i in
                Circle()
                    .fill(Color(.systemGray3))
                    .frame(width: 7, height: 7)
                    .scaleEffect(phase == i ? 1.3 : 0.9)
                    .animation(
                        .easeInOut(duration: 0.4).repeatForever().delay(Double(i) * 0.15),
                        value: phase
                    )
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(Color(.systemGray6))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .padding(.horizontal, 12)
        .onAppear { phase = 1 }
    }
}
