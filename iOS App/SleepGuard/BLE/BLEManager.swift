import CoreBluetooth
import Combine

// ─── Configure these UUIDs to match your wearable's firmware ───────────────
// Replace with the actual service + characteristic UUIDs from your hardware spec.
let BREATHING_SERVICE_UUID    = CBUUID(string: "12345678-1234-1234-1234-123456789ABC")
let BREATHING_RATE_CHAR_UUID  = CBUUID(string: "12345678-1234-1234-1234-123456789ABD")
let SPO2_CHAR_UUID            = CBUUID(string: "12345678-1234-1234-1234-123456789ABE")
// ────────────────────────────────────────────────────────────────────────────

final class BLEManager: NSObject, ObservableObject {
    private var central: CBCentralManager!
    private var peripheral: CBPeripheral?

    @Published var connectionStatus: ConnectionStatus = .bluetoothOff
    @Published var discoveredDevices: [CBPeripheral] = []
    @Published var isScanning = false

    // Latest sensor readings — updated on every BLE notification
    @Published var breathingRate: Double = 0
    @Published var spO2: Double = 0

    var isConnected: Bool { connectionStatus == .connected }

    override init() {
        super.init()
        central = CBCentralManager(delegate: self, queue: .main)
    }

    func startScanning() {
        guard central.state == .poweredOn else { return }
        discoveredDevices = []
        isScanning = true
        central.scanForPeripherals(withServices: [BREATHING_SERVICE_UUID], options: nil)
    }

    func stopScanning() {
        central.stopScan()
        isScanning = false
    }

    func connect(to device: CBPeripheral) {
        peripheral = device
        connectionStatus = .connecting
        central.connect(device, options: nil)
    }

    func disconnect() {
        guard let p = peripheral else { return }
        central.cancelPeripheralConnection(p)
    }

    enum ConnectionStatus: String {
        case bluetoothOff  = "Bluetooth Off"
        case ready         = "Ready to Scan"
        case scanning      = "Scanning…"
        case connecting    = "Connecting…"
        case connected     = "Connected"
        case disconnected  = "Disconnected"
        case unauthorized  = "Bluetooth Unauthorized"
    }
}

// MARK: - CBCentralManagerDelegate
extension BLEManager: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:    connectionStatus = .ready
        case .poweredOff:   connectionStatus = .bluetoothOff
        case .unauthorized: connectionStatus = .unauthorized
        default:            connectionStatus = .bluetoothOff
        }
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any],
                        rssi RSSI: NSNumber) {
        guard !discoveredDevices.contains(where: { $0.identifier == peripheral.identifier }) else { return }
        discoveredDevices.append(peripheral)
    }

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        connectionStatus = .connected
        stopScanning()
        peripheral.delegate = self
        peripheral.discoverServices([BREATHING_SERVICE_UUID])
    }

    func centralManager(_ central: CBCentralManager,
                        didDisconnectPeripheral peripheral: CBPeripheral,
                        error: Error?) {
        connectionStatus = .disconnected
        self.peripheral = nil
    }

    func centralManager(_ central: CBCentralManager,
                        didFailToConnect peripheral: CBPeripheral,
                        error: Error?) {
        connectionStatus = .disconnected
        self.peripheral = nil
    }
}

// MARK: - CBPeripheralDelegate
extension BLEManager: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        peripheral.services?.forEach {
            peripheral.discoverCharacteristics([BREATHING_RATE_CHAR_UUID, SPO2_CHAR_UUID], for: $0)
        }
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didDiscoverCharacteristicsFor service: CBService,
                    error: Error?) {
        service.characteristics?.forEach {
            if $0.properties.contains(.notify) || $0.properties.contains(.indicate) {
                peripheral.setNotifyValue(true, for: $0)
            }
        }
    }

    func peripheral(_ peripheral: CBPeripheral,
                    didUpdateValueFor characteristic: CBCharacteristic,
                    error: Error?) {
        guard let data = characteristic.value else { return }

        switch characteristic.uuid {
        case BREATHING_RATE_CHAR_UUID:
            // 2-byte little-endian fixed-point, 1 decimal place (e.g. 0x0096 = 15.0 bpm)
            if data.count >= 2 {
                let raw = UInt16(data[0]) | (UInt16(data[1]) << 8)
                breathingRate = Double(raw) / 10.0
            }
        case SPO2_CHAR_UUID:
            // 1-byte integer percentage (e.g. 0x61 = 97%)
            if data.count >= 1 {
                spO2 = Double(data[0])
            }
        default:
            break
        }
    }
}
