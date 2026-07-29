import SwiftUI

struct SpO2ChartView: View {
    let dataPoints: [BreathingData]

    private let minY: Double = 80
    private let maxY: Double = 100
    private let threshold: Double = 90

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height

            ZStack(alignment: .topLeading) {
                // Y-axis labels + gridlines
                ForEach([100, 92, 87], id: \.self) { val in
                    let y = yPosition(Double(val), height: h)
                    HStack(spacing: 4) {
                        Text("\(val)")
                            .font(.system(size: 10))
                            .foregroundStyle(.secondary)
                            .frame(width: 26, alignment: .trailing)
                        Rectangle()
                            .fill(Color(.systemGray4))
                            .frame(height: 0.5)
                    }
                    .offset(y: y - 7)
                }

                let chartLeft: CGFloat = 32
                let chartWidth = w - chartLeft

                // 90% threshold line (red dashed)
                let threshY = yPosition(threshold, height: h)
                Path { p in
                    p.move(to: CGPoint(x: chartLeft, y: threshY))
                    p.addLine(to: CGPoint(x: w, y: threshY))
                }
                .stroke(Color.apneaRed.opacity(0.5), style: StrokeStyle(lineWidth: 1, dash: [4, 3]))

                if dataPoints.count >= 2 {
                    let pts = chartPoints(chartLeft: chartLeft, width: chartWidth, height: h)

                    // Line path — green above threshold, red below
                    Path { p in
                        p.move(to: pts[0])
                        pts.dropFirst().forEach { p.addLine(to: $0) }
                    }
                    .stroke(Color.apneaGreen, lineWidth: 2)

                    // Red segments below threshold
                    ForEach(0..<pts.count - 1, id: \.self) { i in
                        let a = pts[i], b = pts[i + 1]
                        let aBelow = dataPoints[i].spO2 < threshold
                        let bBelow = dataPoints[i + 1].spO2 < threshold
                        if aBelow || bBelow {
                            Path { p in p.move(to: a); p.addLine(to: b) }
                                .stroke(Color.apneaRed, lineWidth: 2)
                        }
                    }

                    // Dots
                    ForEach(0..<pts.count, id: \.self) { i in
                        let pt = pts[i]
                        let below = dataPoints[i].spO2 < threshold
                        Circle()
                            .fill(below ? Color.apneaRed : Color.apneaGreen)
                            .frame(width: 6, height: 6)
                            .offset(x: pt.x - 3, y: pt.y - 3)
                    }
                } else {
                    Text("No data yet")
                        .font(.system(size: 14))
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            }
        }
    }

    private func yPosition(_ value: Double, height: CGFloat) -> CGFloat {
        let ratio = (maxY - value) / (maxY - minY)
        return CGFloat(ratio) * height
    }

    private func chartPoints(chartLeft: CGFloat, width: CGFloat, height: CGFloat) -> [CGPoint] {
        guard dataPoints.count >= 2 else { return [] }
        let step = width / CGFloat(dataPoints.count - 1)
        return dataPoints.enumerated().map { i, dp in
            CGPoint(x: chartLeft + CGFloat(i) * step,
                    y: yPosition(dp.spO2, height: height))
        }
    }
}
