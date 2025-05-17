#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266WebServerSecure.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <FS.h>
#include <queue>
#include <functional>
#include <map>

// Global variables for WiFi credentials
String ssid = "YOUR_WIFI_SSID";
String password = "YOUR_WIFI_PASSWORD";

// Create web server instances
ESP8266WebServer server(80);  // HTTP server on port 80
BearSSL::ESP8266WebServerSecure secureServer(443);  // HTTPS server on port 443

// Self-signed certificate
static const char serverCert[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIDSzCCAjMCFBMnIl6h2CuSqNKQeXaD9OU3/C+4MA0GCSqGSIb3DQEBCwUAMGIx
CzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNj
bzERMA8GA1UECgwITm9kZU1DVUExGzAZBgNVBAMMEnNlY3VyZS5ub2RlbWN1LmlP
MB4XDTIzMDEwMTAwMDAwMFoXDTMzMDEwMTAwMDAwMFowYjELMAkGA1UEBhMCVVMx
CzAJBgNVBAgMAkNBMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMREwDwYDVQQKDAhO
b2RlTUNVQTEbMBkGA1UEAwwSc2VjdXJlLm5vZGVtY3UuaU8wggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQDIpkMxbNJQy4KxjEKYB7YwXdJbYMxCjZMXXB2i
VxlUNQJZZnJbKjZSBXrP4APNm0HG1V7JiP9DGnTPYDGLMoRUKzDnD5JU6FSs7qb9
BK0RRofNKQuI5DsYm8eTl5ggGLGzTsW4E8SXJVKX4jLGwP/GCkS+F0+bPSgUKv4m
hEQAl+Q/EnFk1FALbWRPNjYcnJXaWnWnG0YZCMUjXZ0XG2KUHLSw+XWmTQSPNUCx
cKUYXBWq2p9UHVdUaAGcx9jkfBHaMFEVWHEQN3cX+lQ8a4JC6IFP9tc6xNWPMLD9
zZcEpMKPJfIEE3gJ76zGIjE+KrOQmQU+6oWKKDJ0vM03Vf+hAgMBAAEwDQYJKoZI
hvcNAQELBQADggEBALVdAULu2BuA/H6n3hOYx6iCjC2/+m9PoKDJVYC0jtQ0D3IG
n0FwJrRwCuVL4V1Qx8MwqrR2IFrMbXvV7YoU2PvJY03FBpVKBjXGPs9ynMmIX0XL
CD7/MnZCHhXUG2Jwj4n+Z4Kq9Jz6jYYaVbsUHMHE6+x9ZU1E6AfCuNGPQBs5TJ7V
3jUn1wLYHVwXgL2tIxYxNsCe3URUtIvzjVc+zUlJopxHYulIpRgXw1yWP6MlCPLt
SJBd5KjWFYyYtNCbqYIkmVKn4XHeI0UGZOWHHaP6u4mO/xJFPNHwHBKn3Y1TaqoA
a1IXlmLKhFJO01rJNz0TxrEDVjuqx7Y1/LqrODQ=
-----END CERTIFICATE-----
)EOF";

static const char serverKey[] PROGMEM = R"EOF(
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIpkMxbNJQy4Kx
jEKYB7YwXdJbYMxCjZMXXB2iVxlUNQJZZnJbKjZSBXrP4APNm0HG1V7JiP9DGnTP
YDGLMoRUKzDnD5JU6FSs7qb9BK0RRofNKQuI5DsYm8eTl5ggGLGzTsW4E8SXJVKX
4jLGwP/GCkS+F0+bPSgUKv4mhEQAl+Q/EnFk1FALbWRPNjYcnJXaWnWnG0YZCMUj
XZ0XG2KUHLSw+XWmTQSPNUCxcKUYXBWq2p9UHVdUaAGcx9jkfBHaMFEVWHEQN3cX
+lQ8a4JC6IFP9tc6xNWPMLD9zZcEpMKPJfIEE3gJ76zGIjE+KrOQmQU+6oWKKDJ0
vM03Vf+hAgMBAAECggEAKCx5bS44hXGwU1D9h/JZY7SJ0GhOvT0ucRFIFjqOr6Xr
1qRDzBj2MJ3UAg4PbuRU3Kd0X9vFTED+kzyFa/NHm3UlgxN9zVpF79kPJdBkYS2N
JiuYHrBTPUcz5vCH1ORtwJj+AJAJmJrBqcZp0tSMEBzB5cjv5vG6Cz420cS3qjW0
TMg/SPbqLLHQZlu1uQly3UIVrUO2CL8ByaEACzYVZ6+WdDLYwTUG/4QAzTkuSbZZ
vjK0HkJU68r5JXXmbG3PUEe9cHVeIyMUzrpp1Q0C6ahHW8YKeyCmJrM8QHCfQtu3
BbHhTh4YEwDPpjUJleKrJJAUJODCvZ0uRMGTNZxgAQKBgQDntd0qVqHKPJAIGBlv
zXRWXDpr2xW3uK6HHtJ5pA5k1rEfod/1zMDY0JOQUYrcIrKlvG9pxNJOYvwdBZrT
kHLMsLNYJSG7xfNcMbWMJBwBqGi2fXZ0o68irUwXGALwfxzrH3n7DTZlvHNqGhgp
o+qkGJcP8vx7XU7QrnEwKwSiwQKBgQDdsWwxiczz7CQCJ2bGZ8yADvPBERbZSbwk
M4jKWoZT2qLrYRGJQn95IPnMPCdCdq0yN4d+59HoqQgVPUgAj1QoHVZB4wpuWTyY
YY9b/xz9QnKYYUuEwgBZQhEFOJKqDZLm0CbNxmFGWLB/fo9UZxA4iU42yBPzm7jK
CbVJDXXI4QKBgDFu8uxGvnN1y5gfCDHjajXGrOngdQdZRJdwHQxNBPD3jKRYd8HQ
7QNDn0LzXPYQWcQH+wJUhpWnYvLnOBTDtlIcxKoYIzR4Q0f92kMlPlwgBkQGjuuY
RB4NUGjrZT+ORuxcKklrS0eP/xiDXrGZvwzDJ43YE3M7YEp/BAoL9UUBAoGASNNk
+4672jAqP4WXUFIaKJhOeN2ygJHII9ZIwntFfXyLUfzp3g9GGxPBmBEXXYNrWBSE
RdZSVlAAyx8zFEUgrZtK8GWAgGYCVEwq8R9+K6Vz3/NeIyuTpiEFa0BFdiqYwcT2
FQSEMXYgxQZ3Gr5xViYkIdcTwy4uz2X6FLwCQOECgYEAkRaMDrZB0c5/QV2VfhIN
wGpkBe2j3VAA03EJY5YD7lpH5sLnDUfZOQyMKCKdOmCRvXxNnoIj7ZYjBJV/eFxp
9J1bP3IRfvmVPFLfXjqDTg8c6XBfbCcZ8PqW9dB7sMrw28e7jm3BnBVVVeyKU7t6
hqrVbfI9Sga9/s5O4FeWZqk=
-----END PRIVATE KEY-----
)EOF";

// mDNS domain name (will be accessible as http://nakprc.local and https://nakprc.local)
const char* mdnsDomain = "nakprc";

// Queue size constant
const int MAX_QUEUE_SIZE = 10;

// Device configuration structure
struct DeviceConfig {
  String name;
  int pin;
  bool state;
  String type;
};

// Map to store device configurations
std::map<String, DeviceConfig> deviceConfigs;

// Queue for asynchronous request processing
std::queue<std::function<void()>> requestQueue;
bool processingQueue = false;

// Flag to indicate if HTTP mode is enabled
bool httpModeEnabled = false;

// Helper function to control device based on route
void controlDevice(String route, String command) {
  String baseRoute = route.substring(0, route.lastIndexOf('/'));
  if (baseRoute.startsWith("/")) {
    baseRoute = baseRoute.substring(1);
  }

  if (deviceConfigs.find(baseRoute) != deviceConfigs.end()) {
    DeviceConfig& device = deviceConfigs[baseRoute];

    if (command == "on") {
      digitalWrite(device.pin, HIGH);
      device.state = true;
      Serial.println("Turned ON device: " + device.name + " on pin " + String(device.pin));
      return "Device " + device.name + " turned ON";
    } else if (command == "off") {
      digitalWrite(device.pin, LOW);
      device.state = false;
      Serial.println("Turned OFF device: " + device.name + " on pin " + String(device.pin));
      return "Device " + device.name + " turned OFF";
    } else {
      return "Unknown command: " + command;
    }
  }

  return "Device not found for route: " + baseRoute;
}

// Function to process the request queue
void processQueue() {
  if (processingQueue || requestQueue.empty()) {
    return;
  }

  processingQueue = true;

  while (!requestQueue.empty()) {
    std::function<void()> requestHandler = requestQueue.front();
    requestQueue.pop();
    requestHandler();
    yield();
  }

  processingQueue = false;
}

// Function to load routes from SPIFFS
void loadStoredRoutes() {
  if (SPIFFS.exists("/routes.json")) {
    File routesFile = SPIFFS.open("/routes.json", "r");
    if (routesFile && routesFile.size() > 0) {
      DynamicJsonDocument doc(4096);
      DeserializationError error = deserializeJson(doc, routesFile);
      if (!error) {
        JsonObject routes = doc.as<JsonObject>();
        for (JsonPair kv : routes) {
          String route = kv.key().c_str();
          String action = kv.value().as<String>();

          server.on(("/" + route).c_str(), [route, action]() {
            server.send(200, "text/plain", "Executing action for route /" + route + "\nAction: " + action);
            Serial.println("Route accessed: /" + route);
            Serial.println("Action: " + action);
          });

          secureServer.on(("/" + route).c_str(), [route, action]() {
            secureServer.send(200, "text/plain", "Executing action for route /" + route + "\nAction: " + action);
            Serial.println("Route accessed (HTTPS): /" + route);
            Serial.println("Action: " + action);
          });

          Serial.println("Loaded route: /" + route);
        }
      } else {
        Serial.println("Failed to parse routes file");
      }
      routesFile.close();
    } else {
      Serial.println("No routes file or empty file");
    }
  }
}

// Function to save/update routes to SPIFFS
void saveRoute(String route, String action, JsonObject deviceConfig = JsonObject()) {
  DynamicJsonDocument doc(8192);

  if (SPIFFS.exists("/routes.json")) {
    File routesFile = SPIFFS.open("/routes.json", "r");
    if (routesFile && routesFile.size() > 0) {
      deserializeJson(doc, routesFile);
      routesFile.close();
    }
  }

  JsonObject routeData = doc[route].to<JsonObject>();
  routeData["action"] = action;

  if (!deviceConfig.isNull()) {
    routeData["deviceConfig"] = deviceConfig;

    String name = deviceConfig["name"].as<String>();
    int pin = deviceConfig["pin"].as<int>();
    bool state = deviceConfig["state"].as<bool>();
    String type = deviceConfig["type"].as<String>();

    DeviceConfig device;
    device.name = name;
    device.pin = pin;
    device.state = state;
    device.type = type;

    deviceConfigs[route] = device;

    pinMode(pin, OUTPUT);
    digitalWrite(pin, state ? HIGH : LOW);

    String onRoute = route + "/on";
    String offRoute = route + "/off";

    server.on(("/" + onRoute).c_str(), [route, onRoute]() {
      String result = controlDevice(onRoute, "on");
      server.send(200, "text/plain", result);
    });

    secureServer.on(("/" + onRoute).c_str(), [route, onRoute]() {
      String result = controlDevice(onRoute, "on");
      secureServer.send(200, "text/plain", result);
    });

    server.on(("/" + offRoute).c_str(), [route, offRoute]() {
      String result = controlDevice(offRoute, "off");
      server.send(200, "text/plain", result);
    });

    secureServer.on(("/" + offRoute).c_str(), [route, offRoute]() {
      String result = controlDevice(offRoute, "off");
      secureServer.send(200, "text/plain", result);
    });

    server.on(("/" + route).c_str(), [route]() {
      DeviceConfig& device = deviceConfigs[route];
      String status = "Device: " + device.name + "\n";
      status += "Type: " + device.type + "\n";
      status += "Pin: " + String(device.pin) + "\n";
      status += "State: " + String(device.state ? "ON" : "OFF") + "\n";
      status += "\nUse /" + route + "/on or /" + route + "/off to control this device.";
      server.send(200, "text/plain", status);
    });

    secureServer.on(("/" + route).c_str(), [route]() {
      DeviceConfig& device = deviceConfigs[route];
      String status = "Device: " + device.name + "\n";
      status += "Type: " + device.type + "\n";
      status += "Pin: " + String(device.pin) + "\n";
      status += "State: " + String(device.state ? "ON" : "OFF") + "\n";
      status += "\nUse /" + route + "/on or /" + route + "/off to control this device.";
      secureServer.send(200, "text/plain", status);
    });
  } else {
    server.on(("/" + route).c_str(), [route, action]() {
      server.send(200, "text/plain", "Executing action for route /" + route + "\nAction: " + action);
      Serial.println("Route accessed: /" + route);
      Serial.println("Action: " + action);
    });

    secureServer.on(("/" + route).c_str(), [route, action]() {
      secureServer.send(200, "text/plain", "Executing action for route /" + route + "\nAction: " + action);
      Serial.println("Route accessed (HTTPS): /" + route);
      Serial.println("Action: " + action);
    });
  }

  File routesFile = SPIFFS.open("/routes.json", "w");
  if (!routesFile) {
    Serial.println("Failed to open routes file for writing");
    return;
  }

  serializeJson(doc, routesFile);
  routesFile.close();

  Serial.println("Saved route: /" + route);
}

// Function to update WiFi credentials and reconnect
void updateWiFiCredentials(String newSsid, String newPassword) {
  ssid = newSsid;
  password = newPassword;

  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.print("Connecting to new WiFi network");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n\nStarting NodeMCU Dynamic Routes Server with HTTPS");

  if (!SPIFFS.begin()) {
    Serial.println("Failed to mount SPIFFS file system");
    return;
  }

  WiFi.begin(ssid.c_str(), password.c_str());
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to WiFi network with IP address: ");
  Serial.println(WiFi.localIP());

  BearSSL::X509List cert(serverCert);
  BearSSL::PrivateKey key(serverKey);
  secureServer.setRSACert(&cert, &key);

  if (MDNS.begin(mdnsDomain)) {
    Serial.println("mDNS responder started");
    Serial.println("Server accessible at:");
    Serial.println("- http://" + String(mdnsDomain) + ".local");
    Serial.println("- https://" + String(mdnsDomain) + ".local");

    MDNS.addService("http", "tcp", 80);
    MDNS.addService("https", "tcp", 443);
  } else {
    Serial.println("Error setting up mDNS responder!");
  }

  auto welcomeHandler = []() {
    String message = "Welcome to NodeMCU Dynamic Routes Server!\n\n";
    message += "Available routes:\n";

    if (SPIFFS.exists("/routes.json")) {
      File routesFile = SPIFFS.open("/routes.json", "r");
      if (routesFile && routesFile.size() > 0) {
        DynamicJsonDocument doc(8192);
        deserializeJson(doc, routesFile);
        JsonObject routes = doc.as<JsonObject>();

        for (JsonPair kv : routes) {
          String route = kv.key().c_str();
          message += "- /" + route + "\n";

          if (kv.value().as<JsonObject>().containsKey("deviceConfig")) {
            message += "  - /" + route + "/on (turn on)\n";
            message += "  - /" + route + "/off (turn off)\n";
          }
        }

        routesFile.close();
      } else {
        message += "No routes defined yet.\n";
      }
    } else {
      message += "No routes defined yet.\n";
    }

    message += "\nTo store a new route, send a POST request to:\n";
    message += "/api with JSON body: {\"route\":\"YOUR_ROUTE\", \"action\":\"YOUR_ACTION\"}\n\n";
    message += "To register a device, send a POST request to:\n";
    message += "/api with JSON body: {\"route\":\"YOUR_ROUTE\", \"name\":\"DEVICE_NAME\", \"pin\":GPIO_PIN, \"type\":\"DEVICE_TYPE\"}\n\n";
    message += "To update WiFi credentials, send a POST request to:\n";
    message += "/auth with JSON body: {\"ssid\":\"YOUR_SSID\", \"password\":\"YOUR_PASSWORD\"}\n\n";
    message += "To enable or disable HTTP mode, send a GET request to:\n";
    message += "/sethttp?mode=on or /sethttp?mode=off\n\n";

    return message;
  };

  server.on("/", HTTP_GET, [welcomeHandler]() {
    if (httpModeEnabled) {
      server.send(200, "text/plain", welcomeHandler());
    } else {
      server.send(403, "text/plain", "HTTP access is disabled. Use HTTPS.");
    }
  });

  secureServer.on("/", HTTP_GET, [welcomeHandler]() {
    secureServer.send(200, "text/plain", welcomeHandler());
  });

  server.on("/api", HTTP_POST, []() {
    if (!httpModeEnabled) {
      server.send(403, "text/plain", "HTTP access is disabled. Use HTTPS.");
      return;
    }

    if (server.hasArg("plain") == false) {
      server.send(400, "text/plain", "Bad Request");
      return;
    }

    String body = server.arg("plain");
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      server.send(400, "text/plain", "Invalid JSON");
      return;
    }

    String route = doc["route"];
    if (doc.containsKey("action")) {
      String action = doc["action"];
      saveRoute(route, action);
      server.send(200, "text/plain", "Route stored successfully!");
    } else if (doc.containsKey("name") && doc.containsKey("pin") && doc.containsKey("type")) {
      String name = doc["name"];
      int pin = doc["pin"];
      String type = doc["type"];
      bool state = doc.containsKey("state") ? doc["state"] : false;

      DynamicJsonDocument deviceDoc(1024);
      JsonObject deviceConfig = deviceDoc.to<JsonObject>();
      deviceConfig["name"] = name;
      deviceConfig["pin"] = pin;
      deviceConfig["state"] = state;
      deviceConfig["type"] = type;

      saveRoute(route, "Device: " + name, deviceConfig);
      server.send(200, "text/plain", "Device registered successfully!");
    } else {
      server.send(400, "text/plain", "Invalid request body");
    }
  });

  secureServer.on("/api", HTTP_POST, []() {
    if (secureServer.hasArg("plain") == false) {
      secureServer.send(400, "text/plain", "Bad Request");
      return;
    }

    String body = secureServer.arg("plain");
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      secureServer.send(400, "text/plain", "Invalid JSON");
      return;
    }

    String route = doc["route"];
    if (doc.containsKey("action")) {
      String action = doc["action"];
      saveRoute(route, action);
      secureServer.send(200, "text/plain", "Route stored successfully!");
    } else if (doc.containsKey("name") && doc.containsKey("pin") && doc.containsKey("type")) {
      String name = doc["name"];
      int pin = doc["pin"];
      String type = doc["type"];
      bool state = doc.containsKey("state") ? doc["state"] : false;

      DynamicJsonDocument deviceDoc(1024);
      JsonObject deviceConfig = deviceDoc.to<JsonObject>();
      deviceConfig["name"] = name;
      deviceConfig["pin"] = pin;
      deviceConfig["state"] = state;
      deviceConfig["type"] = type;

      saveRoute(route, "Device: " + name, deviceConfig);
      secureServer.send(200, "text/plain", "Device registered successfully!");
    } else {
      secureServer.send(400, "text/plain", "Invalid request body");
    }
  });

  server.on("/auth", HTTP_POST, []() {
    if (!httpModeEnabled) {
      server.send(403, "text/plain", "HTTP access is disabled. Use HTTPS.");
      return;
    }

    if (server.hasArg("plain") == false) {
      server.send(400, "text/plain", "Bad Request");
      return;
    }

    String body = server.arg("plain");
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      server.send(400, "text/plain", "Invalid JSON");
      return;
    }

    if (doc.containsKey("ssid") && doc.containsKey("password")) {
      String newSsid = doc["ssid"];
      String newPassword = doc["password"];
      updateWiFiCredentials(newSsid, newPassword);
      server.send(200, "text/plain", "WiFi credentials updated successfully!");
    } else {
      server.send(400, "text/plain", "Invalid request body");
    }
  });

  secureServer.on("/auth", HTTP_POST, []() {
    if (secureServer.hasArg("plain") == false) {
      secureServer.send(400, "text/plain", "Bad Request");
      return;
    }

    String body = secureServer.arg("plain");
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      secureServer.send(400, "text/plain", "Invalid JSON");
      return;
    }

    if (doc.containsKey("ssid") && doc.containsKey("password")) {
      String newSsid = doc["ssid"];
      String newPassword = doc["password"];
      updateWiFiCredentials(newSsid, newPassword);
      secureServer.send(200, "text/plain", "WiFi credentials updated successfully!");
    } else {
      secureServer.send(400, "text/plain", "Invalid request body");
    }
  });

  server.on("/sethttp", HTTP_GET, []() {
    if (server.hasArg("mode")) {
      String mode = server.arg("mode");
      if (mode == "on") {
        httpModeEnabled = true;
        server.send(200, "text/plain", "HTTP mode enabled.");
      } else if (mode == "off") {
        httpModeEnabled = false;
        server.send(200, "text/plain", "HTTP mode disabled.");
      } else {
        server.send(400, "text/plain", "Invalid mode. Use /sethttp?mode=on or /sethttp?mode=off");
      }
    } else {
      server.send(400, "text/plain", "Missing mode parameter. Use /sethttp?mode=on or /sethttp?mode=off");
    }
  });

  secureServer.on("/sethttp", HTTP_GET, []() {
    if (secureServer.hasArg("mode")) {
      String mode = secureServer.arg("mode");
      if (mode == "on") {
        httpModeEnabled = true;
        secureServer.send(200, "text/plain", "HTTP mode enabled.");
      } else if (mode == "off") {
        httpModeEnabled = false;
        secureServer.send(200, "text/plain", "HTTP mode disabled.");
      } else {
        secureServer.send(400, "text/plain", "Invalid mode. Use /sethttp?mode=on or /sethttp?mode=off");
      }
    } else {
      secureServer.send(400, "text/plain", "Missing mode parameter. Use /sethttp?mode=on or /sethttp?mode=off");
    }
  });

  loadStoredRoutes();

  server.begin();
  secureServer.begin();

  Serial.println("HTTP server started on port 80");
  Serial.println("HTTPS server started on port 443");
}

void loop() {
  if (httpModeEnabled) {
    server.handleClient();
  }
  secureServer.handleClient();
  MDNS.update();
  processQueue();
}
