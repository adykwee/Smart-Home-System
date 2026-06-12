const dotenv = require("dotenv");
dotenv.config();

const ADAFRUIT_USERNAME = process.env.AIO_USERNAME ? process.env.AIO_USERNAME.trim() : "";
const ADAFRUIT_KEY = process.env.AIO_KEY ? process.env.AIO_KEY.trim() : "";

/**
 * Tạo một feed mới trên Adafruit IO bằng REST API
 * @param {string} feedKey - Khóa của feed (ví dụ: bbstation-fan)
 * @param {string} feedName - Tên hiển thị của feed
 */
const createFeed = async (feedKey, feedName) => {
  if (!ADAFRUIT_USERNAME || !ADAFRUIT_KEY) {
    console.warn("[Adafruit Service] Thiếu AIO_USERNAME hoặc AIO_KEY trong file .env");
    return { success: false, error: "Missing config" };
  }

  const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}/feeds`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-AIO-Key": ADAFRUIT_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        feed: {
          name: feedName,
          key: feedKey
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Adafruit Service] Đã tự động tạo feed mới trên Adafruit IO: ${feedKey}`);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.warn(`[Adafruit Service] Lỗi tạo feed [${feedKey}] trên Adafruit: ${response.status} - ${errorText}`);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.error(`[Adafruit Service] Lỗi kết nối khi tạo feed [${feedKey}]:`, error.message || error);
    return { success: false, error: error.message };
  }
};

/**
 * Xóa một feed trên Adafruit IO bằng REST API
 * @param {string} feedKey - Khóa của feed cần xóa
 */
const deleteFeed = async (feedKey) => {
  if (!ADAFRUIT_USERNAME || !ADAFRUIT_KEY) {
    console.warn("[Adafruit Service] Thiếu AIO_USERNAME hoặc AIO_KEY trong file .env");
    return { success: false, error: "Missing config" };
  }

  const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}/feeds/${feedKey}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-AIO-Key": ADAFRUIT_KEY,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log(`[Adafruit Service] Đã xóa feed thành công trên Adafruit IO: ${feedKey}`);
      return { success: true };
    } else {
      const errorText = await response.text();
      console.warn(`[Adafruit Service] Lỗi xóa feed [${feedKey}] trên Adafruit: ${response.status} - ${errorText}`);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.error(`[Adafruit Service] Lỗi kết nối khi xóa feed [${feedKey}]:`, error.message || error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createFeed,
  deleteFeed
};
