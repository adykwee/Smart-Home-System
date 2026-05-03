class DeviceFactory {
  static createDevice(feed_key) {
    let type = 'Actuator';
    let name = feed_key;

    const key = feed_key.toLowerCase();

    // Phân loại Sensor
    if (key.includes('sensor') || key.includes('temp') || key.includes('humid') || key.includes('light') || key.includes('lux')) {
      type = 'Sensor';
    }

    // Đặt tên thân thiện hơn
    if (key.includes('led') || (key.includes('light') && !key.includes('sensor'))) {
      name = 'Đèn LED' + ' (' + key + ')';
      type = 'Actuator';
    } else if (key.includes('fan')) {
      name = 'Quạt' + ' (' + key + ')';
      type = 'Actuator';
    } else if (key.includes('temp')) {
      name = 'Cảm biến nhiệt độ' + ' (' + key + ')';
      type = 'Sensor';
    } else if (key.includes('humid')) {
      name = 'Cảm biến độ ẩm' + ' (' + key + ')';
      type = 'Sensor';
    } else if (key.includes('light') && key.includes('sensor')) {
      name = 'Cảm biến ánh sáng' + ' (' + key + ')';
      type = 'Sensor';
    }

    return {
      feed_key,
      name,
      type
    };
  }
}

module.exports = DeviceFactory;
