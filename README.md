# Smart Health Mobile

## Environment

Create a `.env` in the project root with:

EXPO_PUBLIC_API_URL=http://localhost:8080/v1

Expo automatically exposes variables prefixed with `EXPO_PUBLIC_API_URL` to the app.

Notes:
- On Android emulator, `localhost` refers to the emulator. Use `http://10.0.2.2:8080/v1`.
- On iOS simulator, `http://localhost:8080/v1` works if the server runs on your Mac.
- On a physical device, use your machine's LAN IP, e.g. `http://192.168.1.100:8080/v1`.

## Diagnosis API

The app calls `POST /prediction/predict` with body:

{ "input_data": number[] }

The response should include `{ prediction: number[] }` where `prediction[0]` is the probability of no disease. The app computes risk as `1 - prediction[0]`.

## Run

- Install deps: npm i
- Start: npm run start
- Then press `a` for Android, `i` for iOS, or `w` for web.
